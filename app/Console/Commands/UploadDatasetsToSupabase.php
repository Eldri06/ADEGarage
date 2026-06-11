<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Services\SupabaseAuthService;
use Illuminate\Support\Facades\File;

class UploadDatasetsToSupabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'supabase:upload-datasets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Upload CSV and Excel datasets to Supabase Storage';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(SupabaseAuthService $supabase)
    {
        $files = [
            'ADEGarage_cleanedf.csv',
            'ADEGarage_raw_combinedf.csv',
            'ADEGarage_ML_Dataset_v2f.xlsx',
        ];

        $bucket = 'datasets';

        foreach ($files as $filename) {
            $filePath = base_path($filename);
            if (File::exists($filePath)) {
                $this->info("Uploading $filename...");
                try {
                    $url = $supabase->uploadFile($bucket, $filePath, $filename);
                    $this->info("Uploaded: $url");
                } catch (\Exception $e) {
                    $this->error("Failed to upload $filename: " . $e->getMessage());
                    $this->line("Note: Make sure the bucket '$bucket' exists in your Supabase project.");
                }
            } else {
                $this->warn("File not found: $filename");
            }
        }

        return 0;
    }
}
