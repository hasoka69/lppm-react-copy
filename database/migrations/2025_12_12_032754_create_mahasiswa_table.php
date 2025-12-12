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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique(); // NIM is unique identifier
            $table->string('nama');
            $table->integer('angkatan'); // e.g., 2021, 2022, 2023
            $table->string('jurusan'); // e.g., Teknik Informatika, Sistem Informasi
            $table->string('email')->unique();
            $table->enum('status', ['aktif', 'lulus', 'nonaktif'])->default('aktif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
