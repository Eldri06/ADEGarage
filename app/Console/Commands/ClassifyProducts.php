<?php

namespace App\Console\Commands;

use App\Models\SalesHistory;
use App\Models\Product;
use App\Models\OrderItem;
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

        // Aggregate sales data per product, including imported history and live site orders.
        $this->info('Aggregating sales data from sales_histories and recent orders...');

        $historicalProducts = SalesHistory::select(
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
            ->get()
            ->map(fn ($p) => [
                'product' => $p->product,
                'brand' => $p->brand,
                'part_type' => $p->part_type,
                'avg_price' => (float) $p->avg_price,
                'avg_profit' => (float) $p->avg_profit,
                'total_qty' => (int) $p->total_qty,
                'sale_count' => (int) $p->sale_count,
                'unique_days' => (int) $p->unique_days,
            ]);

        $liveProducts = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->select(
                'order_items.product_name as product',
                'order_items.product_brand as brand',
                'order_items.product_category as part_type',
                DB::raw('AVG(order_items.price) as avg_price'),
                DB::raw('AVG(order_items.subtotal * 0.30) as avg_profit'),
                DB::raw('SUM(order_items.quantity) as total_qty'),
                DB::raw('COUNT(*) as sale_count'),
                DB::raw('COUNT(DISTINCT DATE(orders.created_at)) as unique_days')
            )
            ->groupBy('order_items.product_name', 'order_items.product_brand', 'order_items.product_category')
            ->get()
            ->map(fn ($p) => [
                'product' => $p->product,
                'brand' => $p->brand,
                'part_type' => $p->part_type,
                'avg_price' => (float) $p->avg_price,
                'avg_profit' => (float) $p->avg_profit,
                'total_qty' => (int) $p->total_qty,
                'sale_count' => (int) $p->sale_count,
                'unique_days' => (int) $p->unique_days,
            ]);

        $products = $historicalProducts
            ->concat($liveProducts)
            ->groupBy(fn ($p) => strtolower(trim(($p['product'] ?? '') . '|' . ($p['brand'] ?? '') . '|' . ($p['part_type'] ?? ''))))
            ->map(function ($items) {
                $first = $items->first();
                $totalQty = max(1, (int) $items->sum('total_qty'));

                return (object) [
                    'product' => $first['product'],
                    'brand' => $first['brand'],
                    'part_type' => $first['part_type'],
                    'avg_price' => $items->sum(fn ($p) => $p['avg_price'] * max(1, $p['total_qty'])) / $totalQty,
                    'avg_profit' => $items->sum(fn ($p) => $p['avg_profit'] * max(1, $p['total_qty'])) / $totalQty,
                    'total_qty' => (int) $items->sum('total_qty'),
                    'sale_count' => (int) $items->sum('sale_count'),
                    'unique_days' => (int) $items->sum('unique_days'),
                ];
            })
            ->values();

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
                'brand'       => $p->brand,
                'part_type'   => $p->part_type,
                'avg_price'   => round((float)$p->avg_price, 2),
                'avg_profit'  => round((float)$p->avg_profit, 2),
                'total_qty'   => (int)$p->total_qty,
                'sale_count'  => (int)$p->sale_count,
                'unique_days' => (int)$p->unique_days,
            ];
        })->values()->toArray();

        $this->info('Sending batch prediction requests to ML server for Tier Classification...');

        try {
            // Predict Tiers (K-Means)
            $tierResponse = Http::timeout(30)->post('http://127.0.0.1:5001/predict/tier/batch', [
                'products' => $batchPayload,
            ]);

            if (!$tierResponse->successful()) {
                $this->error('ML server returned an error.');
                return 1;
            }

            $tierResults = $tierResponse->json('results', []);
        } catch (\Exception $e) {
            $this->error('Error communicating with ML server: ' . $e->getMessage());
            return 1;
        }

        // Display and optionally save results
        $tierCounts = ['Standard' => 0, 'Fast-Moving' => 0, 'Premium' => 0];
        $classifiedData = [];

        $bar = $this->output->createProgressBar(count($tierResults));

        foreach ($tierResults as $result) {
            $idx  = $result['id'] ?? null;
            $tier = $result['tier'] ?? 'Unknown';

            if ($idx !== null && isset($products[$idx])) {
                $product = $products[$idx];
                $tierCounts[$tier] = ($tierCounts[$tier] ?? 0) + 1;

                $classifiedData[] = [
                    'product'      => $product->product,
                    'brand'        => $product->brand,
                    'part_type'    => $product->part_type,
                    'avg_price'    => $product->avg_price,
                    'tier'         => $tier,
                    'label'        => $result['label'] ?? $tier,
                    'cluster'      => $result['cluster'] ?? null,
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

        $this->info('Updating database with ML Tiers...');
        $updateBar = $this->output->createProgressBar(count($classifiedData));
        $updatedCount = 0;

        foreach ($classifiedData as $data) {
            // Find and update or create products based on sales_histories aggregation
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

        $this->info('Predicting revenue per product with Linear Regression...');
        $demandBar = $this->output->createProgressBar(count($batchPayload));

        try {
            $batchDemandResponse = Http::timeout(30)->post('http://127.0.0.1:5001/predict/revenue/batch', [
                'products' => $batchPayload
            ]);
            if ($batchDemandResponse->successful()) {
                foreach ($batchDemandResponse->json('results', []) as $result) {
                    $idx = $result['id'] ?? null;
                    if ($idx !== null && isset($products[$idx])) {
                        Product::updateOrCreate(
                            ['name' => $products[$idx]->product],
                            ['demand_score' => $result['predicted_revenue_php'] ?? 0]
                        );
                    }
                    $demandBar->advance();
                }
            }
        } catch (\Exception $e) {
            $this->warn('Revenue prediction batch failed: ' . $e->getMessage());
        }
        $demandBar->finish();

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
