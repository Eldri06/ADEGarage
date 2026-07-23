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
    if (auth()->check()) { return redirect()->route(auth()->user()->is_admin ? 'admin' : 'customer_home'); }
    return view('home_landing');
})->name('login');

Route::post('/signup/send-code', [UserController::class, 'sendSignupCode'])->middleware('throttle:signup-send-code')->name('signup.code.send');
Route::post('/signup', [UserController::class, 'signup'])->middleware('throttle:signup-verify');
Route::post('/signup/verify', [UserController::class, 'verifySignupCode'])->middleware('throttle:signup-verify')->name('signup.verify');
Route::post('/signup/resend', [UserController::class, 'resendSignupCode'])->middleware('throttle:signup-resend')->name('signup.resend');
Route::post('/password/email', [UserController::class, 'forgotPassword'])->middleware('throttle:password-reset')->name('password.email');
Route::post('/login',  [UserController::class, 'login'])->middleware('throttle:login');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
Route::get('/auth/{provider}', [UserController::class, 'redirectToProvider'])->middleware('throttle:oauth')->whereIn('provider', ['google', 'facebook']);
Route::get('/auth/{provider}/callback', [UserController::class, 'handleProviderCallback'])->middleware('throttle:oauth')->whereIn('provider', ['google', 'facebook'])->name('oauth.callback');
Route::get('/auth/verify-email', [UserController::class, 'showOAuthVerification'])->name('oauth.verify.show');
Route::post('/auth/verify-email', [UserController::class, 'verifyOAuthCode'])->middleware('throttle:oauth-verify')->name('oauth.verify');

Route::get('/home_landing', function () {
    return view('home_landing');
})->name('home_landing');

Route::get('/customer_home', function () {
    return view('customer_home');
})->middleware('auth')->name('customer_home');

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

// Session-backed API endpoints: apply the same limiter as routes/api.php.
Route::prefix('api')->middleware('throttle:api')->group(function () {
// Product routes (public)
Route::get('/products',      [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::post('/messages',     [MessageController::class, 'store'])->name('messages.store');

// Cart routes (works for both guest and authenticated users)
Route::get('/cart',          [CartController::class, 'index'])->name('cart.index');
Route::post('/cart',         [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{id}',     [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}',  [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/cart',       [CartController::class, 'clear'])->name('cart.clear');

// Order routes (authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/orders',              [OrderController::class, 'store'])->name('orders.store');
    Route::get('/my-orders',            [OrderController::class, 'myOrders'])->name('orders.myOrders');
    Route::put('/orders/{id}/cancel',   [OrderController::class, 'cancelOrder'])->name('orders.cancel');
});

// Settings routes (authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/user/settings',      [UserSettingsController::class, 'index']);
    Route::put('/user/settings',      [UserSettingsController::class, 'update']);
});

// Admin routes (admin only)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/settings',       [AdminSettingsController::class, 'index'])->name('admin.settings.index');
    Route::put('/admin/settings',       [AdminSettingsController::class, 'update'])->name('admin.settings.update');
    Route::get('/admin/products',       [ProductController::class, 'adminIndex'])->name('admin.products.index');
    Route::post('/products',            [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{id}',       [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}',     [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/orders',               [OrderController::class, 'index'])->name('orders.index');
    Route::put('/orders/{id}/status',   [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    Route::get('/admin/users',          [App\Http\Controllers\UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/messages',       [MessageController::class, 'index'])->name('admin.messages.index');
    Route::get('/admin/messages/{message}/thread', [MessageController::class, 'thread'])->name('admin.messages.thread');
    Route::put('/admin/messages/{message}/read', [MessageController::class, 'markRead'])->name('admin.messages.read');
    Route::post('/admin/messages/{message}/reply', [MessageController::class, 'reply'])->name('admin.messages.reply');
    Route::get('/admin/analytics',      [SalesAnalyticsController::class, 'summary'])->name('admin.analytics');
    Route::get('/admin/sales-history',  [SalesAnalyticsController::class, 'index'])->name('admin.sales-history');

    // ML Analytics endpoints
    Route::get('/admin/analytics/top-products-monthly', [SalesAnalyticsController::class, 'topProductsMonthly'])->name('admin.analytics.top-products');
    Route::get('/admin/analytics/brand-margins',        [SalesAnalyticsController::class, 'brandMargins'])->name('admin.analytics.brand-margins');
    Route::get('/admin/analytics/dead-stock',           [SalesAnalyticsController::class, 'deadStock'])->name('admin.analytics.dead-stock');
    Route::get('/admin/analytics/revenue-trend',        [SalesAnalyticsController::class, 'revenueTrend'])->name('admin.analytics.revenue-trend');
    Route::get('/admin/analytics/tier-distribution',    [SalesAnalyticsController::class, 'tierDistribution'])->name('admin.analytics.tier-distribution');
    Route::get('/admin/analytics/part-type-breakdown',  [SalesAnalyticsController::class, 'partTypeBreakdown'])->name('admin.analytics.part-type');
    Route::get('/admin/analytics/revenue',              [SalesAnalyticsController::class, 'revenueForecast'])->name('admin.analytics.revenue');
    Route::get('/admin/analytics/brand-revenue-daily',  [SalesAnalyticsController::class, 'brandRevenueDaily'])->name('admin.analytics.brand-revenue-daily');
    Route::get('/admin/analytics/part-type-revenue-daily', [SalesAnalyticsController::class, 'partTypeRevenueDaily'])->name('admin.analytics.part-type-revenue-daily');
    Route::get('/admin/products/sales-avg',             [SalesAnalyticsController::class, 'productsWithSalesAvg'])->name('admin.products.sales-avg');
    Route::get('/admin/ml/revenue-model',               [SalesAnalyticsController::class, 'revenueModelMetadata'])->name('admin.ml.revenue-model');
    Route::post('/admin/ml/predict-tier',               [SalesAnalyticsController::class, 'predictTier'])->name('admin.ml.predict-tier');
    Route::post('/admin/ml/predict-revenue',            [SalesAnalyticsController::class, 'predictRevenue'])->name('admin.ml.predict-revenue');
    Route::post('/admin/ml/sync',                       [SalesAnalyticsController::class, 'runClassification'])->name('admin.ml.sync');
});
});
