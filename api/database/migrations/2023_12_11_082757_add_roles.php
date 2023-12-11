<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles_user', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->boolean('active');
            $table->string('roles_key', 150);
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
        Schema::create('accesses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->boolean('active');
            $table->string('key', 150);
            $table->string('description', 150);
            $table->string('url', 150);
            $table->string('id_icon', 150);
            $table->string('access_type_id', 150);
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
        Schema::create('access_types', function (Blueprint $table) {
            $table->id();
            $table->string('key', 150);
            $table->boolean('active');
            $table->string('name', 150);
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
        Schema::create('accesses_roles', function (Blueprint $table) {
            $table->id();
            $table->string('access_id', 150);
            $table->string('role_id', 150);
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
        Schema::dropIfExists('roles_user');
        Schema::dropIfExists('accesses');
        Schema::dropIfExists('access_types');
        Schema::dropIfExists('accesses_roles');

    }
};
