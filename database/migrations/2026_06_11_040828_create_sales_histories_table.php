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
        Schema::create('sales_histories', function (Blueprint $table) {
            $table->id();
            $table->string('month_name');
            $table->integer('month');
            $table->date('date');
            $table->string('product');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('profit', 10, 2);
            $table->string('brand')->nullable();
            $table->string('part_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales_histories');
    }
};
