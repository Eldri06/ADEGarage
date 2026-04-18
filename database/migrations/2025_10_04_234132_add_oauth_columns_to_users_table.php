<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('provider')->nullable();
            $table->string('provider_id')->nullable()->index();
            $table->string('provider_token')->nullable();
            //
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'provider_token')) {
                $table->dropColumn('provider_token');
            }
            if (Schema::hasColumn('users', 'provider_id')) {
                $table->dropColumn('provider_id');
            }
            if (Schema::hasColumn('users', 'provider')) {
                $table->dropColumn('provider');
            }
        });
    }
};
