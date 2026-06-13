<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'supabase_user_id')) {
                $table->uuid('supabase_user_id')->nullable()->unique()->after('id');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'supabase_user_id')) {
                $table->dropUnique(['supabase_user_id']);
                $table->dropColumn('supabase_user_id');
            }
        });
    }
};
