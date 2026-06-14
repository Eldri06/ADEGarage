<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class PredictRevenue extends Command
{
    protected $signature = 'ml:predict-revenue
                            {avg_price : Average price of the product}
                            {avg_profit : Average profit of the product}
                            {brand : Brand name}
                            {part_type : Part type / category}
                            {month : Month number (1-12)}
                            {day_of_week : Day of week (0=Mon, 6=Sun)}
                            {product_name? : Exact product name / SKU}
                            {--json : Output raw JSON}';

    protected $description = 'Predict daily revenue via Flask ML server (RF for exact SKU, else LinReg)';

    public function handle()
    {
        $payload = [
            'avg_price'   => (float) $this->argument('avg_price'),
            'avg_profit'  => (float) $this->argument('avg_profit'),
            'brand'       => $this->argument('brand'),
            'part_type'   => $this->argument('part_type'),
            'month'       => (int) $this->argument('month'),
            'day_of_week' => (int) $this->argument('day_of_week'),
        ];

        $productName = $this->argument('product_name');
        if ($productName) {
            $payload['product_name'] = $productName;
        }

        try {
            $response = Http::timeout(30)->post('http://127.0.0.1:5001/predict/revenue', $payload);
        } catch (\Exception $e) {
            $this->error('Cannot connect to ML server at http://127.0.0.1:5001');
            $this->line('Start it with: python ml_server.py');
            $this->line('Error: ' . $e->getMessage());
            return 1;
        }

        if (!$response->successful()) {
            $this->error('ML server error: ' . ($response->json('error') ?? 'Unknown'));
            return 1;
        }

        $result = $response->json();

        if ($this->option('json')) {
            $this->line(json_encode($result));
        } else {
            $revenue = $result['predicted_revenue_php'] ?? 0;
            $model = $result['model_used'] ?? 'unknown';
            $this->info("Predicted Revenue: ₱" . number_format($revenue, 2) . " (model: {$model})");
        }

        return 0;
    }
}
