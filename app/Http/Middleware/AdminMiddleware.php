<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure user is authenticated
        if (!Auth::check()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must be logged in to access the admin area.'
                ], 401);
            }
            return redirect('/')
                ->with('error', 'You must be logged in to access the admin area.');
        }

        // Ensure authenticated user is an admin
        if (!Auth::user()->is_admin) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Admins only.'
                ], 403);
            }
            abort(403, 'Unauthorized: Admins only.');
        }

        return $next($request);
    }
}

