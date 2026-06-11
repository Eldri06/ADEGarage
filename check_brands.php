<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$brands = App\Models\Product::pluck('brand')->unique();
echo "BRANDS: \n";
foreach($brands as $b) echo $b . "\n";
echo "CATEGORIES: \n";
$cats = App\Models\Product::pluck('category')->unique();
foreach($cats as $c) echo $c . "\n";
