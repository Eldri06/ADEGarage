<?php
define('LARAVEL_START', microtime(true));
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$products = App\Models\Product::select('id','name','category','brand','image')->get();
foreach ($products as $p) {
    echo $p->id . '|' . $p->name . '|' . $p->category . '|' . $p->brand . '|' . $p->image . PHP_EOL;
}
