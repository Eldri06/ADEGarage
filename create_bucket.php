<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$url = rtrim(config('services.supabase.url'), '/');
$key = config('services.supabase.service_role_key');
$response = Illuminate\Support\Facades\Http::withHeaders([
    'apikey' => $key,
    'Authorization' => 'Bearer ' . $key
])->post($url . '/storage/v1/bucket', [
    'id' => 'profile-images',
    'name' => 'profile-images',
    'public' => true
]);
echo $response->body();
