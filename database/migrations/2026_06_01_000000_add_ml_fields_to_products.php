<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up() {
        Schema::table('products', function (Blueprint $table) {
            $table->string('ml_tier')->nullable()->after('status');
            // 'star', 'premium', 'consumable', 'review'
            $table->float('demand_score')->nullable()->after('ml_tier');
            // XGBoost predicted weekly units
        });
    }

    public function down() {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['ml_tier', 'demand_score']);
        });
    }
};
