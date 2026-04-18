<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class AdminController extends Controller
{
    // Check admin access in each method
    
    private function checkAdminAccess()
    {
        // For now, check if user ID is 1 (first user is admin)
        // You should implement proper role system later
        if (Auth::id() !== 1) {
            abort(403, 'Access denied. Admin privileges required.');
        }
    }

    public function dashboard()
    {
        $this->checkAdminAccess();
        
        // Get dashboard statistics (without messages)
        $stats = [
            'total_users' => User::count(),
            'new_users_today' => User::whereDate('created_at', Carbon::today())->count(),
            'new_users_week' => User::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
            'active_users_today' => User::whereDate('updated_at', Carbon::today())->count(),
        ];

        // Get recent users
        $recent_users = User::orderBy('created_at', 'desc')->take(10)->get();

        // Get user registration chart data (last 7 days)
        $registration_data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $registration_data[] = [
                'date' => $date->format('M j'),
                'count' => User::whereDate('created_at', $date)->count()
            ];
        }

        return view('admin.dashboard', compact('stats', 'recent_users', 'registration_data'));
    }

    public function users(Request $request)
    {
        $this->checkAdminAccess();
        
        $query = User::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('username', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'active') {
                $query->whereDate('updated_at', '>=', Carbon::now()->subDays(7));
            } elseif ($request->status === 'inactive') {
                $query->whereDate('updated_at', '<', Carbon::now()->subDays(7));
            }
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(20);

        return view('admin.users', compact('users'));
    }

    public function userShow($id)
    {
        $this->checkAdminAccess();
        
        $user = User::findOrFail($id);
        
        // Get user statistics (without messages)
        $user_stats = [
            'friends_count' => DB::table('friend_user')->where('user_id', $id)->orWhere('friend_id', $id)->count(),
            'last_login' => $user->updated_at,
            'account_age' => $user->created_at->diffForHumans(),
        ];

        return view('admin.user-detail', compact('user', 'user_stats'));
    }

    public function userUpdate(Request $request, $id)
    {
        $this->checkAdminAccess();
        
        $user = User::findOrFail($id);
        
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'email' => 'required|email|max:255|unique:users,email,' . $id,
        ]);

        $user->update([
            'username' => $request->username,
            'email' => $request->email,
        ]);

        return redirect()->route('admin.user.show', $id)->with('success', 'User updated successfully');
    }

    public function userDelete($id)
    {
        $this->checkAdminAccess();
        
        $user = User::findOrFail($id);
        
        // Don't allow deleting the current admin user
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users')->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User deleted successfully');
    }

    public function userToggleStatus($id)
    {
        $this->checkAdminAccess();
        
        $user = User::findOrFail($id);
        
        // Toggle user status (you can implement a 'status' field in users table)
        // For now, we'll just update the updated_at timestamp
        $user->touch();

        return redirect()->back()->with('success', 'User status updated');
    }
}