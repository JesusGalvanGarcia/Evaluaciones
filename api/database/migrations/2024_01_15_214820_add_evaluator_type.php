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
    Schema::create('evaluator_type', function (Blueprint $table) {
        $table->id();
        $table->string('description', 150);
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
    Schema::table('user_evaluations', function (Blueprint $table) {
        $table->integer('type_evaluator_id')->nullable();
    });

}

/**
 * Reverse the migrations.
 */
public function down(): void
{
    Schema::dropIfExists('evaluator_type');
  
}
};
