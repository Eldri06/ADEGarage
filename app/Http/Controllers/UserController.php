<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\WelcomeUserMail;
use App\Mail\SignupVerificationCodeMail;
use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    private const SIGNUP_CODE_TTL_MINUTES = 10;
    private const SIGNUP_RESEND_COOLDOWN_SECONDS = 60;

    public function sendSignupCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower($request->email);

        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An account with this email already exists. Please log in instead.',
            ], 422);
        }

        $current = $request->session()->get('pending_signup_email');
        if (
            $current &&
            strcasecmp($current['email'] ?? '', $email) === 0 &&
            !empty($current['resend_available_at']) &&
            now()->lt($current['resend_available_at'])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Please wait before requesting another verification code.',
            ], 429);
        }

        try {
            $this->sendManualSignupCode($request, $email);

            return response()->json([
                'success' => true,
                'needs_verification' => true,
                'email' => $email,
                'message' => 'Verification code sent to ' . $email,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Signup verification code failed to send.', [
                'email' => $email,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'We could not send the verification code. Please try again.',
            ], 422);
        }
    }

    public function signup(Request $request, SupabaseAuthService $supabase)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);

        $email = strtolower($request->email);
        $pendingEmail = $request->session()->get('pending_signup_email');

        if (
            !$pendingEmail ||
            strcasecmp($pendingEmail['email'] ?? '', $email) !== 0 ||
            empty($pendingEmail['verified_at'])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your email before completing signup.',
            ], 422);
        }

        try {
            $supabase->adminCreateUser(
                $email,
                $request->password,
                ['username' => $request->username]
            );

            $session = $supabase->signInWithPassword($email, $request->password);

            $request->session()->put('supabase.access_token', $session['access_token'] ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);
            $request->session()->forget('pending_signup_email');
            $request->session()->regenerate();

            $localUser = $this->resolveLocalUser($email, $session['user']['id'] ?? null);
            $wasRecentlyCreated = !$localUser->exists;
            $localUser->username = $localUser->username ?: $request->username;
            $localUser->name = $localUser->name ?: $request->username;
            $localUser->password = $localUser->password ?: Hash::make($request->password);
            $localUser->email_verified_at = $localUser->email_verified_at ?: now();
            $localUser->save();

            Auth::login($localUser);

            if ($wasRecentlyCreated) {
                $this->sendWelcomeEmail($localUser, 'manual_signup');
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'redirect' => route('customer_home'),
                    'message' => 'Account created successfully.',
                ]);
            }

            return redirect()->route('customer_home');

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

        $pendingSignup = $request->session()->get('pending_signup_email');

        if (!$pendingSignup || strcasecmp($pendingSignup['email'], $request->email) !== 0) {
            return response()->json([
                'success' => false,
                'message' => 'Please request a verification code before verifying your email.',
            ], 422);
        }

        try {
            if (now()->gt($pendingSignup['expires_at'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Verification code expired. Please request a new code.',
                ], 422);
            }

            if (!Hash::check($request->code, $pendingSignup['code_hash'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code.',
                ], 422);
            }

            $pendingSignup['verified_at'] = now();
            $request->session()->put('pending_signup_email', $pendingSignup);

            return response()->json([
                'success' => true,
                'email_verified' => true,
                'email' => strtolower($request->email),
                'message' => 'Verification successful. Complete your account details.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function resendSignupCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $pendingSignup = $request->session()->get('pending_signup_email');

        if (!$pendingSignup || strcasecmp($pendingSignup['email'], $request->email) !== 0) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter your email before requesting a new code.',
            ], 422);
        }

        if (!empty($pendingSignup['resend_available_at']) && now()->lt($pendingSignup['resend_available_at'])) {
            return response()->json([
                'success' => false,
                'message' => 'Please wait before requesting another verification code.',
            ], 429);
        }

        try {
            $this->sendManualSignupCode($request, strtolower($request->email));

            return response()->json([
                'success' => true,
                'message' => 'Resend successful. We sent a new verification code.',
            ]);
        } catch (\Throwable $e) {
            Log::warning('Signup verification code resend failed.', [
                'email' => strtolower($request->email),
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'We could not resend the verification code. Please try again.',
            ], 422);
        }
    }

    public function forgotPassword(Request $request, SupabaseAuthService $supabase)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            $supabase->sendPasswordResetEmail(strtolower($request->email));

            return response()->json([
                'success' => true,
                'message' => 'Password reset email sent. Check your inbox for the reset link.',
            ]);
        } catch (\Throwable $e) {
            Log::warning('Password reset email failed.', [
                'email' => strtolower($request->email),
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'We could not send the reset email. Please check the email and try again.',
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
            $localUser = $this->resolveLocalUser($request->email, $session['user']['id'] ?? null);
            $localUser->username = $localUser->username ?: $username;
            $localUser->name     = $localUser->name     ?: $localUser->username;
            $localUser->password = $localUser->password ?: bcrypt(str()->random(32));
            $localUser->email_verified_at = $localUser->email_verified_at
                ?: (!empty($session['user']['email_confirmed_at']) ? now() : null);
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

    public function redirectToProvider(string $provider, Request $request, SupabaseAuthService $supabase)
    {
        abort_unless(in_array($provider, ['google', 'facebook'], true), 404);

        $codeVerifier = rtrim(strtr(base64_encode(random_bytes(64)), '+/', '-_'), '=');
        $codeChallenge = rtrim(strtr(base64_encode(hash('sha256', $codeVerifier, true)), '+/', '-_'), '=');
        $state = Str::random(40);

        $request->session()->put('oauth_pkce', [
            'provider' => $provider,
            'code_verifier' => $codeVerifier,
            'state' => $state,
        ]);

        $authorizeUrl = $supabase->getOAuthRedirectUrl(
            $provider,
            route('oauth.callback', [
                'provider' => $provider,
                'oauth_state' => $state,
            ]),
            $codeChallenge
        );

        try {
            $supabase->assertOAuthProviderEnabled($authorizeUrl, $provider);
        } catch (\Throwable $e) {
            $request->session()->forget('oauth_pkce');

            return redirect()->route('home_landing')
                ->withErrors(['login' => $e->getMessage()]);
        }

        return redirect()->away($authorizeUrl);
    }

    public function handleProviderCallback(string $provider, Request $request, SupabaseAuthService $supabase)
    {
        abort_unless(in_array($provider, ['google', 'facebook'], true), 404);

        try {
            if ($request->filled('error')) {
                throw new \RuntimeException((string) $request->query('error_description', $request->query('error')));
            }

            $oauth = $request->session()->pull('oauth_pkce');
            if (
                !$oauth ||
                ($oauth['provider'] ?? null) !== $provider ||
                !hash_equals((string) ($oauth['state'] ?? ''), (string) $request->query('oauth_state', ''))
            ) {
                throw new \RuntimeException('Invalid OAuth session. Please try again.');
            }

            $code = (string) $request->query('code', '');
            if ($code === '') {
                throw new \RuntimeException('OAuth provider did not return an authorization code.');
            }

            $session = $supabase->exchangeOAuthCode($code, (string) $oauth['code_verifier']);
            $supabaseUser = $session['user'] ?? [];
            $email = $supabaseUser['email'] ?? null;

            if (!$email) {
                throw new \RuntimeException(ucfirst($provider) . ' did not return an email address.');
            }

            $request->session()->put('supabase.access_token', $session['access_token'] ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);

            $metadata = $supabaseUser['user_metadata'] ?? [];
            $displayName = $metadata['full_name'] ?? $metadata['name'] ?? null;
            $baseUsername = $displayName ?: Str::before($email, '@');
            $username = $this->uniqueUsername(Str::slug($baseUsername, '_') ?: Str::before($email, '@'));

            $localUser = $this->resolveLocalUser($email, $supabaseUser['id'] ?? null);
            $wasRecentlyCreated = !$localUser->exists;
            $localUser->username = $localUser->username ?: $username;
            $localUser->name = $localUser->name ?: ($displayName ?: $localUser->username);
            $localUser->password = $localUser->password ?: Hash::make(Str::random(32));
            $localUser->email_verified_at = $localUser->email_verified_at ?: now();
            $localUser->save();

            $request->session()->regenerate();
            Auth::login($localUser);

            if ($wasRecentlyCreated) {
                $this->sendWelcomeEmail($localUser, $provider . '_oauth_signup');
            }

            return redirect()->route($localUser->is_admin ? 'admin' : 'customer_home');
        } catch (\Throwable $e) {
            return redirect()->route('home_landing')
                ->withErrors(['login' => 'Unable to sign in with ' . ucfirst($provider) . ': ' . $e->getMessage()]);
        }
    }

    private function resolveLocalUser(string $email, ?string $supabaseUserId): User
    {
        $email = strtolower($email);
        $user = null;

        if ($supabaseUserId) {
            $user = User::where('supabase_user_id', $supabaseUserId)->first();
        }

        $emailUser = User::where('email', $email)->first();

        if ($user && $emailUser && $user->id !== $emailUser->id) {
            throw new \RuntimeException('This Supabase identity is already linked to another local account.');
        }

        $user = $user ?: $emailUser ?: new User(['email' => $email]);

        if ($supabaseUserId) {
            if ($user->supabase_user_id && $user->supabase_user_id !== $supabaseUserId) {
                throw new \RuntimeException('This email is already linked to a different Supabase account.');
            }

            $user->supabase_user_id = $supabaseUserId;
        }

        $user->email = $email;

        return $user;
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

    private function sendManualSignupCode(Request $request, string $email): void
    {
        $code = (string) random_int(100000, 999999);

        Mail::to($email)->send(new SignupVerificationCodeMail($code));

        $request->session()->put('pending_signup_email', [
            'email' => $email,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(self::SIGNUP_CODE_TTL_MINUTES),
            'resend_available_at' => now()->addSeconds(self::SIGNUP_RESEND_COOLDOWN_SECONDS),
            'verified_at' => null,
        ]);

        Log::info('Signup verification code sent.', ['email' => $email]);
    }

    private function sendWelcomeEmail(User $user, string $source): void
    {
        try {
            Log::info('Sending welcome email.', [
                'user_id' => $user->id,
                'email' => $user->email,
                'source' => $source,
            ]);

            Mail::to($user->email)->send(new WelcomeUserMail($user));

            Log::info('Welcome email sent.', [
                'user_id' => $user->id,
                'email' => $user->email,
                'source' => $source,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Welcome email failed to send.', [
                'user_id' => $user->id,
                'email' => $user->email,
                'source' => $source,
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
