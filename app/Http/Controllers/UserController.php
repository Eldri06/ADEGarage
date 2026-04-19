<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function signup(Request $request, SupabaseAuthService $supabase)
    {
        $incomingFields = $request->validate([
            'username' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);

        try {
            $session = $supabase->signUp(
                $incomingFields['email'],
                $incomingFields['password'],
                ['username' => $incomingFields['username']]
            );

            $request->session()->put('supabase.access_token', $session['access_token'] ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);

            $localUser = User::firstOrNew(['email' => $incomingFields['email']]);
            $localUser->username = $incomingFields['username'];
            $localUser->name = $incomingFields['username'];
            $localUser->password = bcrypt($incomingFields['password']);
            $localUser->save();

            Auth::login($localUser);
            return redirect()->route('customer_home');
        } catch (\Throwable $e) {
            return back()->withErrors(['signup' => $e->getMessage()])->withInput($request->only('username', 'email'));
        }
    }

    public function login(Request $request, SupabaseAuthService $supabase)
    {
        $incomingFields = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        try {
            $session = $supabase->signInWithPassword($incomingFields['email'], $incomingFields['password']);

            $request->session()->put('supabase.access_token', $session['access_token'] ?? null);
            $request->session()->put('supabase.refresh_token', $session['refresh_token'] ?? null);
            $request->session()->regenerate();

            $username = $incomingFields['email'];
            if (!empty($session['user']) && is_array($session['user'])) {
                $userMeta = (array) ($session['user']['user_metadata'] ?? []);
                if (!empty($userMeta['username'])) {
                    $username = (string) $userMeta['username'];
                }
            }

            $localUser = User::firstOrNew(['email' => $incomingFields['email']]);
            $localUser->username = $localUser->username ?: $username;
            $localUser->name = $localUser->name ?: $localUser->username;
            $localUser->password = $localUser->password ?: bcrypt(str()->random(32));
            $localUser->save();

            Auth::login($localUser);

            if (Auth::user()->is_admin) {
                return redirect()->route('admin');
            }

            return redirect()->route('customer_home');
        } catch (\Throwable $e) {
            return back()->withErrors(['login' => $e->getMessage()])->withInput($request->only('email'));
        }
    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->forget('supabase.access_token');
        $request->session()->forget('supabase.refresh_token');
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home_landing');
    }

    /**
     * Get all users count for admin
     */
    public function index()
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error fetching users: ' . $e->getMessage()
            ], 500);
        }
    }
}

    