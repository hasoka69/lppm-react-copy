<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->json('kemajuan_data')->nullable();
            $table->json('akhir_data')->nullable();
            $table->json('pengkinian_data')->nullable();
        });
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->json('kemajuan_data')->nullable();
            $table->json('akhir_data')->nullable();
            $table->json('pengkinian_data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('luaran_tables', function (Blueprint $table) {
            //
        });
    }
};
