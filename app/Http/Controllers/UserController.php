<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
            // 1. Create user in Supabase Auth
            $session = $supabase->signUp(
                $request->email,
                $request->password,
                ['username' => $request->username]
            );

            // 2. Store Supabase tokens in session
            $request->session()->put('supabase.access_token',  $session['access_token']  ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);

            // 3. Find or create local user record
            $localUser = User::firstOrNew(['email' => $request->email]);
            $localUser->username = $request->username;
            $localUser->name     = $request->username;
            $localUser->password = bcrypt($request->password);
            $localUser->save();

            // 4. Log into Laravel session
            Auth::login($localUser);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'redirect' => route('customer_home'),
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

    public function index()
    {
        try {
            return response()->json(User::all());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching users: ' . $e->getMessage()], 500);
        }
    }
}
