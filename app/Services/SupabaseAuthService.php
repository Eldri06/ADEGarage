<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class SupabaseAuthService
{
    private string $url;
    private string $anonKey;
    private string $serviceRoleKey;

    public function __construct()
    {
        $this->url            = rtrim((string) config('services.supabase.url'), '/');
        $this->anonKey        = (string) config('services.supabase.anon_key');
        $this->serviceRoleKey = (string) config('services.supabase.service_role_key');
    }

    public function isConfigured(): bool
    {
        return $this->url !== '' && $this->anonKey !== '';
    }

    // -------------------------------------------------------------------------
    // AUTH
    // -------------------------------------------------------------------------

    public function signUp(string $email, string $password, array $data = []): array
    {
        return $this->requestJson('POST', '/auth/v1/signup', [
            'email'    => $email,
            'password' => $password,
            'data'     => $data,
        ]);
    }

    public function signInWithPassword(string $email, string $password): array
    {
        return $this->requestJson('POST', '/auth/v1/token?grant_type=password', [
            'email'    => $email,
            'password' => $password,
        ]);
    }

    public function getUser(string $accessToken): array
    {
        return $this->requestJson('GET', '/auth/v1/user', null, $accessToken);
    }

    public function verifySignupOtp(string $email, string $token): array
    {
        return $this->requestJson('POST', '/auth/v1/verify', [
            'email' => $email,
            'token' => $token,
            'type'  => 'signup',
        ]);
    }

    public function resendSignupOtp(string $email): array
    {
        return $this->requestJson('POST', '/auth/v1/resend', [
            'email' => $email,
            'type'  => 'signup',
        ]);
    }

    public function sendPasswordResetEmail(string $email): array
    {
        return $this->requestJson('POST', '/auth/v1/recover', [
            'email' => $email,
        ]);
    }

    public function getOAuthRedirectUrl(
        string $provider,
        string $redirectTo,
        string $codeChallenge
    ): string {
        abort_unless(in_array($provider, ['google', 'facebook'], true), 404);

        $query = http_build_query([
            'provider' => $provider,
            'redirect_to' => $redirectTo,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 's256',
        ]);

        return $this->url . '/auth/v1/authorize?' . $query;
    }

    public function assertOAuthProviderEnabled(string $authorizeUrl, string $provider): void
    {
        $response = $this->http()
            ->withOptions(['allow_redirects' => false])
            ->acceptJson()
            ->get($authorizeUrl);

        if ($response->status() !== 400) {
            return;
        }

        $payload = $response->json();
        $message = is_array($payload)
            ? (string) ($payload['msg'] ?? $payload['message'] ?? $payload['error_description'] ?? $payload['error'] ?? '')
            : '';

        if (str_contains(strtolower($message), 'provider is not enabled')) {
            throw new \RuntimeException(
                ucfirst($provider) . ' login is not enabled in Supabase. Enable the ' . ucfirst($provider) .
                ' provider in Supabase Auth settings for this project.'
            );
        }
    }

    public function exchangeOAuthCode(string $code, string $codeVerifier): array
    {
        return $this->requestJson('POST', '/auth/v1/token?grant_type=pkce', [
            'auth_code' => $code,
            'code_verifier' => $codeVerifier,
        ]);
    }

    public function adminCreateUser(string $email, string $password, array $data = []): array
    {
        // Must use service role key for Admin API endpoints
        return $this->requestJson('POST', '/auth/v1/admin/users', [
            'email'         => $email,
            'password'      => $password,
            'user_metadata' => $data,
            'email_confirm' => true, // Auto-confirm email
        ], $this->serviceRoleKey);
    }

    // -------------------------------------------------------------------------
    // STORAGE — product-images bucket
    // -------------------------------------------------------------------------

    /**
     * Upload a file to Supabase Storage.
     * Returns the public URL of the uploaded file.
     */
    public function uploadProductImage(\Illuminate\Http\UploadedFile $file): string
    {
        $filename  = uniqid('product_', true) . '.' . $file->getClientOriginalExtension();
        $bucket    = $this->getProductImagesBucket();
        $endpoint  = $this->url . '/storage/v1/object/' . $bucket . '/' . $filename;

        $response = $this->http()
            ->withHeaders([
                'apikey'        => $this->serviceRoleKey,
                'Authorization' => 'Bearer ' . $this->serviceRoleKey,
                'Content-Type'  => $file->getMimeType(),
            ])
            ->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
            ->put($endpoint);

        if ($response->failed()) {
            $payload = $response->json();
            $message = is_array($payload)
                ? (string) ($payload['message'] ?? $payload['error'] ?? 'Upload failed')
                : 'Upload failed';
            throw new \RuntimeException('Supabase Storage upload failed: ' . $message);
        }

        return $this->getPublicUrlFromBucket($bucket, $filename);
    }

    /**
     * Delete a file from Supabase Storage by its public URL or just filename.
     */
    public function deleteProductImage(string $urlOrFilename): void
    {
        $bucket = $this->getProductImagesBucket();
        $filename = $this->extractBucketObjectPath($urlOrFilename, $bucket);

        $endpoint = $this->url . '/storage/v1/object/' . $bucket . '/' . $filename;

        $this->http()
            ->withHeaders([
                'apikey'        => $this->serviceRoleKey,
                'Authorization' => 'Bearer ' . $this->serviceRoleKey,
            ])
            ->delete($endpoint);
    }

    /**
     * Upload a file to Supabase Storage in a specific bucket.
     */
    public function uploadFile(string $bucket, string $filePath, string $filename): string
    {
        $endpoint = $this->url . '/storage/v1/object/' . $bucket . '/' . $filename;
        $mimeType = File::mimeType($filePath);

        $response = $this->http()
            ->withHeaders([
                'apikey'        => $this->serviceRoleKey,
                'Authorization' => 'Bearer ' . $this->serviceRoleKey,
                'Content-Type'  => $mimeType,
            ])
            ->withBody(file_get_contents($filePath), $mimeType)
            ->put($endpoint);

        if ($response->failed()) {
            $payload = $response->json();
            $message = is_array($payload)
                ? (string) ($payload['message'] ?? $payload['error'] ?? 'Upload failed')
                : 'Upload failed';
            throw new \RuntimeException("Supabase Storage upload to bucket '$bucket' failed: " . $message);
        }

        return $this->getPublicUrlFromBucket($bucket, $filename);
    }

    public function uploadProfileImage(\Illuminate\Http\UploadedFile $file): string
    {
        $filename  = uniqid('profile_', true) . '.' . $file->getClientOriginalExtension();
        $bucket    = 'profile-images';
        return $this->uploadFile($bucket, $file->getRealPath(), $filename);
    }

    public function deleteProfileImage(string $urlOrFilename): void
    {
        $bucket = 'profile-images';
        $filename = $this->extractBucketObjectPath($urlOrFilename, $bucket);

        $endpoint = $this->url . '/storage/v1/object/' . $bucket . '/' . $filename;

        $this->http()
            ->withHeaders([
                'apikey'        => $this->serviceRoleKey,
                'Authorization' => 'Bearer ' . $this->serviceRoleKey,
            ])
            ->delete($endpoint);
    }

    private function getPublicUrlFromBucket(string $bucket, string $filename): string
    {
        return $this->url . '/storage/v1/object/public/' . $bucket . '/' . $filename;
    }

    private function getPublicUrl(string $filename): string
    {
        return $this->getPublicUrlFromBucket($this->getProductImagesBucket(), $filename);
    }

    private function getProductImagesBucket(): string
    {
        return (string) config('services.supabase.storage_bucket', 'product-images');
    }

    private function extractBucketObjectPath(string $urlOrFilename, string $bucket): string
    {
        $path = trim((string) (parse_url($urlOrFilename, PHP_URL_PATH) ?? $urlOrFilename), '/');
        if ($path === '') {
            return trim($urlOrFilename, '/');
        }

        $prefixes = [
            'storage/v1/object/public/' . $bucket . '/',
            'storage/v1/object/' . $bucket . '/',
            $bucket . '/',
        ];

        foreach ($prefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return substr($path, strlen($prefix));
            }
        }

        return basename($path);
    }

    // -------------------------------------------------------------------------
    // INTERNAL
    // -------------------------------------------------------------------------

    private function requestJson(string $method, string $path, ?array $json = null, ?string $bearer = null): array
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        }

        $apiKey = $bearer === $this->serviceRoleKey ? $this->serviceRoleKey : $this->anonKey;

        $request = $this->http()
            ->withHeaders([
                'apikey'        => $apiKey,
                'Authorization' => 'Bearer ' . ($bearer ?: $this->anonKey),
            ])
            ->acceptJson();

        $response = match (strtoupper($method)) {
            'GET'  => $request->get($this->url . $path),
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

    private function http(): \Illuminate\Http\Client\PendingRequest
    {
        $verify = config('services.supabase.ca_bundle') ?: true;

        return Http::withOptions(['verify' => $verify])
            ->timeout(15)
            ->connectTimeout(5);
    }
}
