<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesAnalyticsController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\UserSettingsController;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('home_landing');
})->name('login');

Route::post('/signup/send-code', [UserController::class, 'sendSignupCode'])->name('signup.code.send');
Route::post('/signup', [UserController::class, 'signup']);
Route::post('/signup/verify', [UserController::class, 'verifySignupCode'])->name('signup.verify');
Route::post('/signup/resend', [UserController::class, 'resendSignupCode'])->name('signup.resend');
Route::post('/password/email', [UserController::class, 'forgotPassword'])->name('password.email');
Route::post('/login',  [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
Route::get('/auth/{provider}', [UserController::class, 'redirectToProvider'])->whereIn('provider', ['google', 'facebook']);
Route::get('/auth/{provider}/callback', [UserController::class, 'handleProviderCallback'])->whereIn('provider', ['google', 'facebook'])->name('oauth.callback');

Route::get('/home_landing', function () {
    return view('home_landing');
})->name('home_landing');

Route::get('/customer_home', function () {
    return view('customer_home');
})->name('customer_home');

Route::get('/user', function () {
    return view('user');
})->middleware('auth');

Route::get('/admin', function () {
    return view('admin.admin');
})->middleware(['auth', 'admin'])->name('admin');

// Profile routes (protected by auth middleware)
Route::middleware('auth')->group(function () {
    Route::get('/profile',           [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile',           [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password',  [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

// Product routes (public)
Route::get('/api/products',      [ProductController::class, 'index'])->name('products.index');
Route::get('/api/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::post('/api/messages',     [MessageController::class, 'store'])->name('messages.store');

// Cart routes (works for both guest and authenticated users)
Route::get('/api/cart',          [CartController::class, 'index'])->name('cart.index');
Route::post('/api/cart',         [CartController::class, 'store'])->name('cart.store');
Route::put('/api/cart/{id}',     [CartController::class, 'update'])->name('cart.update');
Route::delete('/api/cart/{id}',  [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/api/cart',       [CartController::class, 'clear'])->name('cart.clear');

// Order routes (authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/api/orders',              [OrderController::class, 'store'])->name('orders.store');
    Route::get('/api/my-orders',            [OrderController::class, 'myOrders'])->name('orders.myOrders');
    Route::put('/api/orders/{id}/cancel',   [OrderController::class, 'cancelOrder'])->name('orders.cancel');
});

// Settings routes (authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/api/user/settings',      [UserSettingsController::class, 'index']);
    Route::put('/api/user/settings',      [UserSettingsController::class, 'update']);
});

// Admin routes (admin only)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/api/admin/settings',       [AdminSettingsController::class, 'index'])->name('admin.settings.index');
    Route::put('/api/admin/settings',       [AdminSettingsController::class, 'update'])->name('admin.settings.update');
    Route::get('/api/admin/products',       [ProductController::class, 'adminIndex'])->name('admin.products.index');
    Route::post('/api/products',            [ProductController::class, 'store'])->name('products.store');
    Route::post('/api/products/{id}',       [ProductController::class, 'update'])->name('products.update');
    Route::delete('/api/products/{id}',     [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/api/orders',               [OrderController::class, 'index'])->name('orders.index');
    Route::put('/api/orders/{id}/status',   [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    Route::get('/api/admin/users',          [App\Http\Controllers\UserController::class, 'index'])->name('admin.users');
    Route::get('/api/admin/messages',       [MessageController::class, 'index'])->name('admin.messages.index');
    Route::get('/api/admin/messages/{message}/thread', [MessageController::class, 'thread'])->name('admin.messages.thread');
    Route::put('/api/admin/messages/{message}/read', [MessageController::class, 'markRead'])->name('admin.messages.read');
    Route::post('/api/admin/messages/{message}/reply', [MessageController::class, 'reply'])->name('admin.messages.reply');
    Route::get('/api/admin/analytics',      [SalesAnalyticsController::class, 'summary'])->name('admin.analytics');
    Route::get('/api/admin/sales-history',  [SalesAnalyticsController::class, 'index'])->name('admin.sales-history');

    // ML Analytics endpoints
    Route::get('/api/admin/analytics/top-products-monthly', [SalesAnalyticsController::class, 'topProductsMonthly'])->name('admin.analytics.top-products');
    Route::get('/api/admin/analytics/brand-margins',        [SalesAnalyticsController::class, 'brandMargins'])->name('admin.analytics.brand-margins');
    Route::get('/api/admin/analytics/dead-stock',           [SalesAnalyticsController::class, 'deadStock'])->name('admin.analytics.dead-stock');
    Route::get('/api/admin/analytics/revenue-trend',        [SalesAnalyticsController::class, 'revenueTrend'])->name('admin.analytics.revenue-trend');
    Route::get('/api/admin/analytics/tier-distribution',    [SalesAnalyticsController::class, 'tierDistribution'])->name('admin.analytics.tier-distribution');
    Route::get('/api/admin/analytics/part-type-breakdown',  [SalesAnalyticsController::class, 'partTypeBreakdown'])->name('admin.analytics.part-type');
    Route::get('/api/admin/analytics/demand',               [SalesAnalyticsController::class, 'demandForecast'])->name('admin.analytics.demand');
    Route::post('/api/admin/ml/predict-tier',               [SalesAnalyticsController::class, 'predictTier'])->name('admin.ml.predict-tier');
    Route::post('/api/admin/ml/predict-demand',             [SalesAnalyticsController::class, 'predictDemand'])->name('admin.ml.predict-demand');
    Route::post('/api/admin/ml/sync',                       [SalesAnalyticsController::class, 'runClassification'])->name('admin.ml.sync');
});
