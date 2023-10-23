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
        Schema::create('action_plan_agreements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_action_plan_id');
            $table->unsignedBigInteger('action_plan_parameter_id');
            $table->string('description', 200)->nullable($value = true);
            $table->integer('line');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->timestamp('deleted_at')->nullable($value = true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_plan_agreements');
    }
};
