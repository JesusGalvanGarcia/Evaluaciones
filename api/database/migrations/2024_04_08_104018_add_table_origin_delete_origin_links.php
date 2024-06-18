<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('origins', function (Blueprint $table) {
            $table->id();
            $table->string('Icon');
            $table->string('link');
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('accesses', function (Blueprint $table) {
            $table->dropColumn('origen_link');
        });
        Schema::table('accesses', function (Blueprint $table) {
            $table->dropColumn('origen');
        });
        Schema::table('accesses', function (Blueprint $table) {
            $table->string('origen_id')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('origins');
        Schema::table('accesses', function (Blueprint $table) {
            $table->dropColumn('origen_id');
        });
    }
};
