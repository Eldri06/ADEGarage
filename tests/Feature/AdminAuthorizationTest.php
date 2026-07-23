<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    public function test_a_normal_user_is_forbidden_from_every_admin_api_route(): void
    {
        $user = new User();
        $user->forceFill(['id' => 2, 'email' => 'student@example.test', 'is_admin' => false]);

        foreach (Route::getRoutes() as $route) {
            if (!str_starts_with($route->uri(), 'api/admin/')) {
                continue;
            }

            $method = collect($route->methods())->first(fn (string $method) => $method !== 'HEAD');
            $uri = preg_replace('/\{[^}]+\}/', '1', $route->uri());

            $this->actingAs($user)
                ->json($method, '/' . $uri)
                ->assertForbidden();
        }
    }
}
