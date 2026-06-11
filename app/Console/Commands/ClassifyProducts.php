<?php

namespace App\Console\Commands;

use App\Models\SalesHistory;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ClassifyProducts extends Command
{
    protected $signature = 'ml:classify-products {--dry-run : Show results without saving}';
    protected $description = 'Classify sales history products into ML tiers using the Flask microservice';

    /**
     * Tier map (matches ml_server.py and Colab output)
     */
    private const TIER_MAP = [
        0 => 'Standard',
        1 => 'Fast-Moving',
        2 => 'Premium',
    ];

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        // First, check if the Flask ML server is running
        $this->info('Checking ML server connection...');
        try {
            $health = Http::timeout(3)->get('http://127.0.0.1:5001/health');
            if (!$health->successful()) {
                $this->error('ML server is not responding properly.');
                $this->line('Start it with: python ml_server.py');
                return 1;
            }
            $this->info('ML server is online.');
        } catch (\Exception $e) {
            $this->error('Cannot connect to ML server at http://127.0.0.1:5001');
            $this->line('Start it with: python ml_server.py');
            return 1;
        }

        // Aggregate sales data per product
        $this->info('Aggregating sales data from sales_histories...');

        $products = SalesHistory::select(
                'product',
                'brand',
                'part_type',
                DB::raw('AVG(price) as avg_price'),
                DB::raw('AVG(profit) as avg_profit'),
                DB::raw('SUM(quantity) as total_qty'),
                DB::raw('COUNT(*) as sale_count'),
                DB::raw('COUNT(DISTINCT date) as unique_days')
            )
            ->groupBy('product', 'brand', 'part_type')
            ->get();

        $this->info("Found {$products->count()} unique products.");

        if ($products->isEmpty()) {
            $this->warn('No products found in sales_histories.');
            return 0;
        }

        // Build batch request
        $batchPayload = $products->map(function ($p, $idx) {
            return [
                'id'          => $idx,
                'name'        => $p->product,
                'avg_price'   => round((float)$p->avg_price, 2),
                'avg_profit'  => round((float)$p->avg_profit, 2),
                'total_qty'   => (int)$p->total_qty,
                'sale_count'  => (int)$p->sale_count,
                'unique_days' => (int)$p->unique_days,
            ];
        })->values()->toArray();

        $this->info('Sending batch prediction to ML server...');

        try {
            $response = Http::timeout(30)->post('http://127.0.0.1:5001/predict/tier/batch', [
                'products' => $batchPayload,
            ]);

            if (!$response->successful()) {
                $this->error('ML server returned an error: ' . $response->body());
                return 1;
            }

            $results = $response->json('results', []);
        } catch (\Exception $e) {
            $this->error('Error communicating with ML server: ' . $e->getMessage());
            return 1;
        }

        // Display and optionally save results
        $tierCounts = ['Standard' => 0, 'Fast-Moving' => 0, 'Premium' => 0];
        $classifiedData = [];

        $bar = $this->output->createProgressBar(count($results));

        foreach ($results as $result) {
            $idx  = $result['id'] ?? null;
            $tier = $result['tier'] ?? 'Unknown';

            if ($idx !== null && isset($products[$idx])) {
                $product = $products[$idx];
                $tierCounts[$tier] = ($tierCounts[$tier] ?? 0) + 1;

                $classifiedData[] = [
                    'product'   => $product->product,
                    'brand'     => $product->brand,
                    'part_type' => $product->part_type,
                    'avg_price' => $product->avg_price,
                    'tier'      => $tier,
                    'label'     => $result['label'] ?? $tier,
                    'cluster'   => $result['cluster'] ?? null,
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        // Show tier distribution
        $this->info('Tier Distribution:');
        $this->table(
            ['Tier', 'Count', 'Percentage'],
            collect($tierCounts)->map(function ($count, $tier) use ($products) {
                $pct = $products->count() > 0 ? round(($count / $products->count()) * 100, 1) : 0;
                return [$tier, $count, "{$pct}%"];
            })->values()->toArray()
        );

        // Show sample of each tier
        foreach (['Premium', 'Fast-Moving', 'Standard'] as $tier) {
            $samples = collect($classifiedData)->where('tier', $tier)->take(3);
            if ($samples->isNotEmpty()) {
                $this->info("  Sample {$tier} products:");
                foreach ($samples as $s) {
                    $this->line("    - {$s['product']} ({$s['brand']})");
                }
            }
        }

        if ($dryRun) {
            $this->newLine();
            $this->warn('DRY RUN — no changes saved. Remove --dry-run to write to database.');
            return 0;
        }

        $this->info('Updating database...');
        $updateBar = $this->output->createProgressBar(count($classifiedData));
        $updatedCount = 0;

        foreach ($classifiedData as $data) {
            // Find and update or create products based on sales_histories aggregation
            // Look up product by name from our dataset. Insert with generic info and set ML Tier.
            $productModel = Product::updateOrCreate(
                ['name' => $data['product']],
                [
                    'brand' => $data['brand'] ?: 'Generic',
                    'category' => $data['part_type'] ?: 'other',
                    'price' => $data['avg_price'] ?? 0,
                    'stock' => 50, // Default stock for newly synced products
                    'ml_tier' => $data['tier'],
                ]
            );

            if ($productModel->wasRecentlyCreated || $productModel->wasChanged()) {
                $updatedCount++;
            }
            $updateBar->advance();
        }
        $updateBar->finish();

        $this->newLine(2);
        $this->info("Updated {$updatedCount} products in the database.");

        // Save classifications to a JSON file for reference
        $outputPath = storage_path('app/ml_classifications.json');
        file_put_contents($outputPath, json_encode($classifiedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $this->info("Classifications saved to: {$outputPath}");

        $this->newLine();
        $this->info('Classification complete!');

        return 0;
    }
}
