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
        Schema::table('order_items', function (Blueprint $table) {
            //
            if (!Schema::hasColumn('order_items', 'product_brand')) {
                $table->string('product_brand')->nullable()->after('product_name');
            }   
            if (!Schema::hasColumn('order_items', 'product_category')) {
                $table->string('product_category')->nullable()->after('product_brand');
            }
            if (!Schema::hasColumn('order_items', 'product_image')) {
                $table->string('product_image')->nullable()->after('product_category');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            //
            $table->dropColumn('product_brand', 'product_category', 'product_image');
        });
    }
};
