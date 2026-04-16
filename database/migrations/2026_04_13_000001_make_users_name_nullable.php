<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Using raw SQL to avoid requiring doctrine/dbal for column alterations.
        DB::statement('ALTER TABLE users ALTER COLUMN name DROP NOT NULL');
    }

    public function down(): void
    {
        // Reverting to NOT NULL could fail if null rows exist, so we restore a safe default first.
        DB::statement("UPDATE users SET name = COALESCE(name, username, email, 'User') WHERE name IS NULL");
        DB::statement('ALTER TABLE users ALTER COLUMN name SET NOT NULL');
    }
};
