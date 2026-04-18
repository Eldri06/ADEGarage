<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('variations')->nullable()->after('models'); // Size, Material, Color options
            $table->json('specifications')->nullable()->after('variations'); // Technical specs
            $table->text('full_description')->nullable()->after('description'); // Detailed description
            $table->json('in_the_box')->nullable()->after('specifications'); // What's included
            $table->json('warranty_info')->nullable()->after('in_the_box'); // Warranty details
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['variations', 'specifications', 'full_description', 'in_the_box', 'warranty_info']);
        });
    }
};
