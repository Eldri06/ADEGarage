<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialAuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home_landing');
});

// Temporary route to make yourself admin - REMOVE AFTER USE
Route::get('/make-me-admin', function () {
    $user = Auth::user();
    if ($user) {
        $user->is_admin = true;
        $user->save();
        return "User {$user->username} is now an admin! Please remove this route from web.php";
    }
    return "Please login first";
})->middleware('auth');

Route::post('/signup',[UserController::class, 'signup']);
Route::post('/login',[UserController::class,'login']);
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

Route::get('/home_landing', function () {
    return view('home_landing');
})->name('home_landing');

Route::get('/customer_home', function () {
    return view('customer_home');
})->name('customer_home');

Route::get('/user', function () {
    return view('user');
});

Route::get('/admin', function () {
    return view('admin.admin');
})->middleware(['auth', 'admin'])->name('admin');

Route::get('/auth/google', [SocialAuthController::class, 'redirect'])->name('oauth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'callback'])->name('oauth.google.callback');
// providers: google, facebook

// Profile routes (protected by auth middleware)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

// Product routes (public)
Route::get('/api/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/api/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Cart routes (works for both guest and authenticated users)
Route::get('/api/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/api/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/api/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/api/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/api/cart', [CartController::class, 'clear'])->name('cart.clear');

// Order routes (authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/api/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/api/my-orders', [OrderController::class, 'myOrders'])->name('orders.myOrders');
    Route::put('/api/orders/{id}/cancel', [OrderController::class, 'cancelOrder'])->name('orders.cancel');
});

// Admin routes (admin only)
Route::middleware(['auth', 'admin'])->group(function () {
    // Admin product management
    Route::get('/api/admin/products', [ProductController::class, 'adminIndex'])->name('admin.products.index');
    Route::post('/api/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/api/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/api/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    // Admin order management
    Route::get('/api/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::put('/api/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    
    // Admin user management
    Route::get('/api/admin/users', [AdminController::class, 'index'])->name('admin.users');
});
