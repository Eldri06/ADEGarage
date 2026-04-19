<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseAuthService
{
    private string $url;
    private string $anonKey;

    public function __construct()
    {
        $this->url = rtrim((string) config('services.supabase.url'), '/');
        $this->anonKey = (string) config('services.supabase.anon_key');
    }

    public function isConfigured(): bool
    {
        return $this->url !== '' && $this->anonKey !== '';
    }

    /**
     * @return array{access_token:string, refresh_token:string, token_type:string, expires_in:int, user:array}
     */
    public function signUp(string $email, string $password, array $data = []): array
    {
        return $this->requestJson('POST', '/auth/v1/signup', [
            'email' => $email,
            'password' => $password,
            'data' => $data,
        ]);
    }

    /**
     * @return array{access_token:string, refresh_token:string, token_type:string, expires_in:int, user:array}
     */
    public function signInWithPassword(string $email, string $password): array
    {
        return $this->requestJson('POST', '/auth/v1/token?grant_type=password', [
            'email' => $email,
            'password' => $password,
        ]);
    }

    public function getUser(string $accessToken): array
    {
        return $this->requestJson('GET', '/auth/v1/user', null, $accessToken);
    }

    private function requestJson(string $method, string $path, ?array $json = null, ?string $bearer = null): array
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        }

        $request = Http::withoutVerifying()->withHeaders([
            'apikey' => $this->anonKey,
            'Authorization' => 'Bearer ' . ($bearer ?: $this->anonKey),
        ])->acceptJson();

        $response = match (strtoupper($method)) {
            'GET' => $request->get($this->url . $path),
            'POST' => $request->post($this->url . $path, $json ?? []),
            default => throw new \InvalidArgumentException('Unsupported method: ' . $method),
        };

        if ($response->failed()) {
            $payload = $response->json();
            $message = is_array($payload)
                ? (string) ($payload['msg'] ?? $payload['message'] ?? $payload['error_description'] ?? $payload['error'] ?? 'Supabase request failed')
                : 'Supabase request failed';

            throw new \RuntimeException($message);
        }

        return (array) $response->json();
    }
}
