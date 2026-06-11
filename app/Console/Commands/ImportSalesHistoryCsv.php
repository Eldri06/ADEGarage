<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SalesHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ImportSalesHistoryCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:import-sales-csv {--file=ADEGarage_cleanedf.csv : The CSV file to import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import sales history CSV data into the sales_histories database table';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $filename = $this->option('file');
        $filePath = base_path($filename);

        if (!File::exists($filePath)) {
            $this->error("File not found: " . $filePath);
            return 1;
        }

        $this->info("Parsing CSV file: $filename ...");

        $file = fopen($filePath, 'r');
        // Handle potential BOM (Byte Order Mark)
        $firstBytes = fread($file, 3);
        if ($firstBytes !== "\xEF\xBB\xBF") {
            rewind($file);
        }
        
        $header = fgetcsv($file);

        if (!$header) {
            $this->error("Empty or invalid CSV.");
            return 1;
        }

        // Clean up headers (trim whitespace)
        $header = array_map('trim', $header);

        $records = [];
        $count = 0;

        DB::beginTransaction();
        
        try {
            // Optional: Truncate existing data if we want to replace
            if ($this->confirm('Do you want to truncate (empty) the sales_histories table before importing? [yes/no]', true)) {
                SalesHistory::truncate();
                $this->info("Table truncated.");
            }

            $this->info("Importing data...");
            $bar = $this->output->createProgressBar();

            while (($row = fgetcsv($file)) !== false) {
                // Ignore empty lines
                if (empty(array_filter($row))) {
                    continue;
                }

                // Ensure row has the same number of columns as header
                if (count($header) !== count($row)) {
                    // Try to pad or slice the row if needed, but safer to skip/warn
                    $this->warn("Skipped a malformed row at line " . ($count + 2));
                    continue; 
                }

                $data = array_combine($header, $row);

                // Assuming the structure matches your CSV headers exactly
                $records[] = [
                    'month_name' => $data['month_name'],
                    'month'      => (int)$data['month'],
                    'date'       => date('Y-m-d', strtotime($data['date'])),
                    'product'    => $data['product'],
                    'quantity'   => (int)$data['quantity'],
                    'price'      => (float)$data['price'],
                    'profit'     => (float)($data['profit'] ?? $data['acquisition_cost'] ?? 0), // fallback if profit column name differs in raw
                    'brand'      => $data['brand'] ?? null,
                    'part_type'  => $data['part_type'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $count++;
                $bar->advance();

                // Chunk inserts to avoid memory issues
                if (count($records) >= 500) {
                    SalesHistory::insert($records);
                    $records = []; // flush
                }
            }

            // Insert remaining records
            if (count($records) > 0) {
                SalesHistory::insert($records);
            }

            DB::commit();
            $bar->finish();
            $this->newLine();
            $this->info("Successfully imported $count records.");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error importing data: " . $e->getMessage());
            return 1;
        } finally {
            fclose($file);
        }

        return 0;
    }
}
