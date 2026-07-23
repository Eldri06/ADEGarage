<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Limit both the client and submitted identity to deter distributed guessing.
        RateLimiter::for('login', fn (Request $request) => $this->identityLimits($request, 5));
        RateLimiter::for('signup-send-code', fn (Request $request) => $this->identityLimits($request, 3));
        RateLimiter::for('signup-verify', fn (Request $request) => $this->identityLimits($request, 5));
        RateLimiter::for('signup-resend', fn (Request $request) => $this->identityLimits($request, 3));
        RateLimiter::for('password-reset', fn (Request $request) => $this->identityLimits($request, 3));
        RateLimiter::for('oauth-verify', fn (Request $request) => $this->identityLimits($request, 5));
        RateLimiter::for('oauth', fn (Request $request) => Limit::perMinute(10)->by('oauth-ip:' . $request->ip()));
    }

    /** @return array<int, Limit> */
    private function identityLimits(Request $request, int $perMinute): array
    {
        $email = strtolower(trim((string) $request->input('email', 'unknown')));

        return [
            Limit::perMinute($perMinute)->by('auth-ip:' . $request->ip()),
            Limit::perMinute($perMinute)->by('auth-email:' . $email),
        ];
    }
}
