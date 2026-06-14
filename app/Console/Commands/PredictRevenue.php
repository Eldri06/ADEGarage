<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class PredictRevenue extends Command
{
    protected $signature = 'ml:predict-revenue
                            {avg_price : Average price of the product}
                            {avg_profit : Average profit of the product}
                            {brand : Brand name}
                            {part_type : Part type / category}
                            {month : Month number (1-12)}
                            {day_of_week : Day of week (0=Sun, 1=Mon, ...)}
                            {--json : Output raw JSON}';

    protected $description = 'Predict daily revenue for a product using the trained ML model';

    public function handle()
    {
        $avgPrice = $this->argument('avg_price');
        $avgProfit = $this->argument('avg_profit');
        $brand = $this->argument('brand');
        $partType = $this->argument('part_type');
        $month = $this->argument('month');
        $dayOfWeek = $this->argument('day_of_week');

        $scriptPath = base_path('ml_predict_revenue.py');
        if (!file_exists($scriptPath)) {
            $this->error('Python prediction script not found at: ' . $scriptPath);
            return 1;
        }

        $command = sprintf(
            'python "%s" %s %s "%s" "%s" %d %d 2>NUL',
            $scriptPath,
            escapeshellarg($avgPrice),
            escapeshellarg($avgProfit),
            $brand,
            $partType,
            (int) $month,
            (int) $dayOfWeek
        );

        $output = shell_exec($command);

        if ($output === null) {
            $this->error('Failed to execute Python script. Make sure Python is installed.');
            return 1;
        }

        $result = json_decode($output, true);

        if (!$result || isset($result['error'])) {
            $this->error($result['error'] ?? 'Invalid response from prediction script');
            $this->line($output);
            return 1;
        }

        if ($this->option('json')) {
            $this->line($output);
        } else {
            $revenue = $result['predicted_revenue_php'] ?? 0;
            $this->info('Predicted Revenue: ₱' . number_format($revenue, 2));
        }

        return 0;
    }
}
