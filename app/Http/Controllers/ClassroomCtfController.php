<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClassroomCtfController extends Controller
{
    private const SESSION_KEY = 'classroom_ctf.legacy_authenticated';

    public function show(Request $request)
    {
        $this->ensureEnabled();

        return view('ctf.legacy-login', [
            'solved' => (bool) $request->session()->get(self::SESSION_KEY, false),
            'flag' => config('ctf.flag'),
        ]);
    }

    public function login(Request $request)
    {
        $this->ensureEnabled();

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $emailMatches = hash_equals(
            strtolower((string) config('ctf.legacy_email')),
            strtolower($credentials['email'])
        );
        $passwordMatches = Hash::check(
            $credentials['password'],
            Hash::make((string) config('ctf.legacy_password'))
        );

        if (! $emailMatches || ! $passwordMatches) {
            return back()->withInput($request->only('email'))
                ->withErrors(['ctf_login' => 'Legacy authentication failed. Look for the migration note.']);
        }

        // Deliberately separate from Laravel's real Auth session.
        $request->session()->regenerate();
        $request->session()->put(self::SESSION_KEY, true);

        return redirect()->route('ctf.legacy.show');
    }

    public function logout(Request $request)
    {
        $this->ensureEnabled();

        $request->session()->forget(self::SESSION_KEY);

        return redirect()->route('ctf.legacy.show');
    }

    private function ensureEnabled(): void
    {
        abort_unless(config('ctf.enabled'), 404);
    }
}
