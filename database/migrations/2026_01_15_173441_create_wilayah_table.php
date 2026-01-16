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
        // Table Provinsi
        Schema::create('provinsi', function (Blueprint $table) {
            $table->id(); // code-based id usually, or auto inc
            $table->string('nama');
            $table->timestamps();
        });

        // Table Kota/Kabupaten
        Schema::create('kota', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provinsi_id')->constrained('provinsi')->onDelete('cascade');
            $table->string('nama');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kota');
        Schema::dropIfExists('provinsi');
    }
};
