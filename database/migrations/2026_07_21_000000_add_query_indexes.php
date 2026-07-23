<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'orders_user_created_index');
            $table->index(['status', 'created_at'], 'orders_status_created_index');
        });
        Schema::table('order_items', function (Blueprint $table) {
            $table->index('order_id', 'order_items_order_index');
            $table->index('product_id', 'order_items_product_index');
        });
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['parent_id', 'created_at'], 'messages_thread_created_index');
            $table->index(['read_at', 'created_at'], 'messages_read_created_index');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->index(['status', 'category', 'brand'], 'products_catalog_filter_index');
        });
    }

    public function down()
    {
        Schema::table('orders', fn (Blueprint $table) => [$table->dropIndex('orders_user_created_index'), $table->dropIndex('orders_status_created_index')]);
        Schema::table('order_items', fn (Blueprint $table) => [$table->dropIndex('order_items_order_index'), $table->dropIndex('order_items_product_index')]);
        Schema::table('messages', fn (Blueprint $table) => [$table->dropIndex('messages_thread_created_index'), $table->dropIndex('messages_read_created_index')]);
        Schema::table('products', fn (Blueprint $table) => $table->dropIndex('products_catalog_filter_index'));
    }
};
