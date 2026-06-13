<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('admin_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->json('settings')->nullable()->after('profilepicture');
        });
    }

    public function down()
    {
        Schema::dropIfExists('admin_settings');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('settings');
        });
    }
};
