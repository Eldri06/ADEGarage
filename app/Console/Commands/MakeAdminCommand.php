<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {email : The email of the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote an existing user to an admin';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found. Please log in or sign up on the website first.");
            return 1;
        }

        $user->is_admin = true;
        $user->role = 'admin';
        $user->save();

        $this->info("Success! User '{$email}' is now an admin.");
        return 0;
    }
}
