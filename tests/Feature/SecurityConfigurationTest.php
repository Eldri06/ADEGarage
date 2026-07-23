<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityConfigurationTest extends TestCase
{
    public function test_password_reset_tokens_expire_within_thirty_minutes(): void
    {
        $this->assertLessThanOrEqual(30, config('auth.passwords.users.expire'));
    }

    public function test_api_routes_are_rate_limited(): void
    {
        $route = collect(app('router')->getRoutes()->getRoutes())
            ->first(fn ($route) => $route->uri() === 'api/cart' && in_array('GET', $route->methods()));

        $this->assertNotNull($route);
        $this->assertContains('throttle:api', $route->gatherMiddleware());
    }

    public function test_admin_access_is_not_granted_by_user_id(): void
    {
        $user = new \App\Models\User(['is_admin' => false]);
        $user->id = 1;
        $this->assertFalse($user->isAdmin());
    }

    public function test_admin_role_is_explicit(): void
    {
        $user = new \App\Models\User(['role' => 'admin']);
        $this->assertTrue($user->isAdmin());
    }

    public function test_csrf_protection_has_no_route_exclusions(): void
    {
        $middleware = app(\App\Http\Middleware\VerifyCsrfToken::class);
        $property = new \ReflectionProperty($middleware, 'except');
        $property->setAccessible(true);
        $this->assertSame([], $property->getValue($middleware));
    }
}
