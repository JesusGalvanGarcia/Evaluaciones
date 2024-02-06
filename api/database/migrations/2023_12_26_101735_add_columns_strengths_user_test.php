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
        //
        Schema::table('user_tests', function (Blueprint $table) {
            $table->string('strengths', 3000)->nullable();
        });
        Schema::table('user_tests', function (Blueprint $table) {
            $table->string('chance', 3000)->nullable();
        });   
          Schema::table('user_tests', function (Blueprint $table) {
            $table->string('suggestions', 3000)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
