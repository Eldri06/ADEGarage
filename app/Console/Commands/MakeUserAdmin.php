<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeUserAdmin extends Command
{
    protected $signature = 'user:make-admin {email? : The email of the user to make admin}';
    protected $description = 'Set a user as admin';

    public function handle()
    {
        $email = $this->argument('email');

        if (!$email) {
            $email = $this->ask('Enter the email of the user to make admin');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        $user->is_admin = true;
        $user->role = 'admin';
        $user->save();

        $this->info("User '{$user->email}' (ID: {$user->id}) is now an admin.");
        return 0;
    }
}
