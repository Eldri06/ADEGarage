<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function signup(Request $request) {
        $incomingFields = $request->validate([
            'username' => ['required', Rule::unique('users', 'username')],
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'password' => ['required', 'min:8'],
        ]);
        $incomingFields['password'] = bcrypt($incomingFields['password']);
        $incomingFields['name'] = $incomingFields['username'];
        $user=User::create($incomingFields);
        Auth::login($user);
        return redirect()->route('customer_home');
    }

public function login(Request $request) {
        $incomingFields = $request->validate([
            'username'=> 'required',
            'password'=> 'required'
        ]);

        if (Auth::attempt(['username'=>$incomingFields['username'], 'password' =>$incomingFields['password']])){
            $request->session()->regenerate();
            
            // Redirect based on user role
            if (Auth::user()->is_admin) {
                return redirect()->route('admin');
            }
            
            return redirect()->route('customer_home');
        }

        return back()
            ->withErrors(['login' => 'Invalid username or password.'])
            ->withInput($request->only('username'));
    }
    public function logout(Request $request) {
    Auth::logout();
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

    