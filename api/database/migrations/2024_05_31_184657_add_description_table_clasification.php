<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clasification', function (Blueprint $table) {
            $table->longText('description')->nullable(); // Agrega la columna
        });

        Schema::table('user_tests', function (Blueprint $table) {
            $table->decimal('calification', 8, 2)->nullable(); // Agrega la columna
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('clasification', function (Blueprint $table) {
            $table->longText('description');
        });
        Schema::table('user_tests', function (Blueprint $table) {
            $table->decimal('calification');
        });
    }
};
