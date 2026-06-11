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
        $endpoint  = $this->url . '/storage/v1/object/product-images/' . $filename;

        $response = Http::withoutVerifying()
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

        return $this->getPublicUrl($filename);
    }

    /**
     * Delete a file from Supabase Storage by its public URL or just filename.
     */
    public function deleteProductImage(string $urlOrFilename): void
    {
        // Extract filename from full URL if needed
        $filename = basename(parse_url($urlOrFilename, PHP_URL_PATH));

        $endpoint = $this->url . '/storage/v1/object/product-images/' . $filename;

        Http::withoutVerifying()
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

        $response = Http::withoutVerifying()
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

    private function getPublicUrlFromBucket(string $bucket, string $filename): string
    {
        return $this->url . '/storage/v1/object/public/' . $bucket . '/' . $filename;
    }

    private function getPublicUrl(string $filename): string
    {
        return $this->getPublicUrlFromBucket('product-images', $filename);
    }

    // -------------------------------------------------------------------------
    // INTERNAL
    // -------------------------------------------------------------------------

    private function requestJson(string $method, string $path, ?array $json = null, ?string $bearer = null): array
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        }

        $request = Http::withoutVerifying() // Safe for local dev; remove on production if desired
            ->withHeaders([
                'apikey'        => $this->anonKey,
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
}