<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\SupabaseAuthService;
use Illuminate\Support\Str;

class CreateAdminAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Securely provision a master admin account directly from the server';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(SupabaseAuthService $supabase)
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        if (strlen($password) < 8) {
            $this->error('Password must be at least 8 characters long.');
            return 1;
        }

        $this->info("Provisioning master admin account for {$email}...");

        try {
            // 1. Create the user directly in Supabase using backend APIs
            $supabase->signUp($email, $password, ['username' => 'MasterAdmin']);

            // 2. Synchronize the local database
            $user = User::firstOrNew(['email' => $email]);
            $user->username = 'MasterAdmin';
            $user->name = 'Master Admin';
            // Scramble the local password since Supabase handles true authentication
            $user->password = bcrypt(Str::random(32)); 
            $user->is_admin = true;
            $user->save();

            $this->newLine();
            $this->info("✅ Success! Master Admin account uniquely provisioned!");
            $this->info("You can now safely login through the web interface with these credentials.");
            
        } catch (\Exception $e) {
            // Supabase returns an error if the user already exists. We can still enforce admin status.
            if (str_contains(strtolower($e->getMessage()), 'already registered') || str_contains(strtolower($e->getMessage()), 'user already exists')) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->is_admin = true;
                    $user->save();
                    $this->info("✅ User already existed in Supabase. We secured their local profile and promoted them to Master Admin.");
                } else {
                    $this->error("It looks like this email is in Supabase but missing from your local DB. Please try logging in first, then run this command.");
                }
            } else {
                $this->error('Failed to create secure admin: ' . $e->getMessage());
                return 1;
            }
        }

        return 0;
    }
}
