<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\SalesHistory;
use Illuminate\Support\Facades\File;

class SalesHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $csvFile = base_path('ADEGarage_cleanedf.csv');
        
        if (!File::exists($csvFile)) {
            $this->command->error("CSV file not found at: $csvFile");
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file);

        $count = 0;
        while (($data = fgetcsv($file)) !== false) {
            $row = array_combine($header, $data);
            
            SalesHistory::create([
                'month_name' => $row['month_name'],
                'month'      => (int) $row['month'],
                'date'       => $row['date'],
                'product'    => $row['product'],
                'quantity'   => (int) $row['quantity'],
                'price'      => (float) $row['price'],
                'profit'     => (float) $row['profit'],
                'brand'      => $row['brand'] ?? null,
                'part_type'  => $row['part_type'] ?? null,
            ]);
            $count++;
        }

        fclose($file);
        $this->command->info("Imported $count records from CSV.");
    }
}
