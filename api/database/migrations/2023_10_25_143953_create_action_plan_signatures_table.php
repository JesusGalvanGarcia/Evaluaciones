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
        Schema::create('action_plan_signatures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_action_plan_id');
            $table->unsignedBigInteger('responsable_id');
            $table->string('file_name', '100')->nullable($value = true);
            $table->longText('url')->nullable($value = true);
            $table->date('signature_date')->nullable($value = true);
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
        Schema::dropIfExists('action_plan_signs');
    }
};
