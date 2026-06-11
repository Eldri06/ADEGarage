<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\WelcomeUserMail;
use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class UserController extends Controller
{
    public function signup(Request $request, SupabaseAuthService $supabase)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);

        try {
            $supabase->signUp(
                $request->email,
                $request->password,
                ['username' => $request->username]
            );

            $request->session()->put('pending_signup', [
                'username' => $request->username,
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'needs_verification' => true,
                    'message' => 'We sent a verification code to your email.',
                ]);
            }

            return back()->with('status', 'We sent a verification code to your email.');

        } catch (\Throwable $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 422);
            }

            return back()
                ->withErrors(['signup' => $e->getMessage()])
                ->withInput($request->only('username', 'email'));
        }
    }

    public function verifySignupCode(Request $request, SupabaseAuthService $supabase)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits_between:4,8'],
        ]);

        $pendingSignup = $request->session()->get('pending_signup');

        if (!$pendingSignup || strcasecmp($pendingSignup['email'], $request->email) !== 0) {
            return response()->json([
                'success' => false,
                'message' => 'Please sign up again before verifying your code.',
            ], 422);
        }

        try {
            $session = $supabase->verifySignupOtp($request->email, $request->code);

            $request->session()->put('supabase.access_token', $session['access_token'] ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);
            $request->session()->forget('pending_signup');
            $request->session()->regenerate();

            $localUser = User::firstOrNew(['email' => $request->email]);
            $localUser->username = $localUser->username ?: $pendingSignup['username'];
            $localUser->name = $localUser->name ?: $pendingSignup['username'];
            $localUser->password = $localUser->password ?: $pendingSignup['password_hash'];
            $localUser->email_verified_at = $localUser->email_verified_at ?: now();
            $localUser->save();

            Auth::login($localUser);
            $this->sendWelcomeEmail($localUser);

            return response()->json([
                'success' => true,
                'redirect' => route('customer_home'),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function login(Request $request, SupabaseAuthService $supabase)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        try {
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser && Hash::check($request->password, $existingUser->password)) {
                $request->session()->regenerate();
                Auth::login($existingUser);

                $redirectRoute = $existingUser->is_admin
                    ? route('admin')
                    : route('customer_home');

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'redirect' => $redirectRoute,
                    ]);
                }

                return redirect()->to($redirectRoute);
            }

            // 1. Authenticate with Supabase
            $session = $supabase->signInWithPassword($request->email, $request->password);

            // 2. Store tokens
            $request->session()->put('supabase.access_token',  $session['access_token']  ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);
            $request->session()->regenerate();

            // 3. Resolve username from Supabase metadata
            $username = $request->email;
            if (!empty($session['user']['user_metadata']['username'])) {
                $username = (string) $session['user']['user_metadata']['username'];
            }

            // 4. Sync local user record
            $localUser = User::firstOrNew(['email' => $request->email]);
            $localUser->username = $localUser->username ?: $username;
            $localUser->name     = $localUser->name     ?: $localUser->username;
            $localUser->password = $localUser->password ?: bcrypt(str()->random(32));
            $localUser->save();

            // 5. Log into Laravel session
            Auth::login($localUser);

            // 6. Redirect based on role
            $redirectRoute = Auth::user()->is_admin
                ? route('admin')
                : route('customer_home');

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'redirect' => $redirectRoute,
                ]);
            }

            return redirect()->to($redirectRoute);

        } catch (\Throwable $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 422);
            }

            return back()
                ->withErrors(['login' => $e->getMessage()])
                ->withInput($request->only('email'));
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->forget(['supabase.access_token', 'supabase.refresh_token']);
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home_landing');
    }

    public function redirectToProvider(string $provider)
    {
        abort_unless(in_array($provider, ['google', 'facebook'], true), 404);

        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback(string $provider, Request $request)
    {
        abort_unless(in_array($provider, ['google', 'facebook'], true), 404);

        try {
            $socialUser = Socialite::driver($provider)->user();
            $email = $socialUser->getEmail();

            if (!$email) {
                return redirect()->route('home_landing')
                    ->withErrors(['login' => ucfirst($provider) . ' did not return an email address.']);
            }

            $baseUsername = $socialUser->getName() ?: Str::before($email, '@');
            $username = $this->uniqueUsername(Str::slug($baseUsername, '_') ?: Str::before($email, '@'));

            $localUser = User::firstOrNew(['email' => $email]);
            $wasRecentlyCreated = !$localUser->exists;
            $localUser->username = $localUser->username ?: $username;
            $localUser->name = $localUser->name ?: ($socialUser->getName() ?: $localUser->username);
            $localUser->password = $localUser->password ?: Hash::make(Str::random(32));
            $localUser->email_verified_at = $localUser->email_verified_at ?: now();
            $localUser->save();

            $request->session()->regenerate();
            Auth::login($localUser);

            if ($wasRecentlyCreated) {
                $this->sendWelcomeEmail($localUser);
            }

            return redirect()->route($localUser->is_admin ? 'admin' : 'customer_home');
        } catch (\Throwable $e) {
            return redirect()->route('home_landing')
                ->withErrors(['login' => 'Unable to sign in with ' . ucfirst($provider) . ': ' . $e->getMessage()]);
        }
    }

    private function uniqueUsername(string $baseUsername): string
    {
        $baseUsername = trim($baseUsername, '_') ?: 'user';
        $username = $baseUsername;
        $suffix = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . '_' . $suffix;
            $suffix++;
        }

        return $username;
    }

    private function sendWelcomeEmail(User $user): void
    {
        try {
            Mail::to($user->email)->send(new WelcomeUserMail($user));
        } catch (\Throwable $e) {
            Log::warning('Welcome email failed to send.', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function index()
    {
        try {
            return response()->json(User::all());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching users: ' . $e->getMessage()], 500);
        }
    }
}
