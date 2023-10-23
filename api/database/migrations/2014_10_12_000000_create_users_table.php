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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 150);
            $table->string('father_last_name', 150);
            $table->string('mother_last_name', 150);
            $table->unsignedBigInteger('area_id');
            $table->unsignedBigInteger('department_id');
            $table->string('password', 100);
            $table->string('job', 50)->nullable($value = true);
            $table->date('admission_date');
            $table->unsignedBigInteger('nss')->nullable($value = true);
            $table->date('birthday')->nullable($value = true);
            $table->integer('age')->nullable($value = true);
            $table->string('genre', 15)->nullable($value = true);
            $table->string('CURP', 30)->nullable($value = true);
            $table->string('street', 100)->nullable($value = true);
            $table->string('township', 100)->nullable($value = true);
            $table->integer('cp')->nullable($value = true);
            $table->string('marital_status', 50)->nullable($value = true);
            $table->string('study_level', 75)->nullable($value = true);
            $table->integer('sons')->nullable($value = true);
            $table->unsignedBigInteger('phone')->nullable($value = true);
            $table->unsignedBigInteger('cellphone')->nullable($value = true);
            $table->string('email', 75)->unique();
            $table->integer('status_id');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by');
            $table->unsignedBigInteger('deleted_by')->nullable($value = true);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->timestamp('deleted_at')->nullable($value = true);
            
            // $table->foreign('area_id')->references('id')->on('areas');
            // $table->foreign('department_id')->references('id')->on('departments');
            // $table->foreign('status_id')->references('status_id')->on('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
