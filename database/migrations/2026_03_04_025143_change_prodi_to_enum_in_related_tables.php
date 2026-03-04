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
        $enumValues = [
            'S2 Manajemen',
            'S1 Manajemen',
            'S1 Akuntansi',
            'S1 Sistem Informasi',
            'S1 Teknologi Informasi',
            'S1 Teknologi Pangan',
            'D3 Perhotelan',
            'D3 Usaha Perjalanan Wisata',
            'D1 Perhotelan'
        ];

        $placeholders = implode(',', array_fill(0, count($enumValues), '?'));

        DB::statement("UPDATE dosen SET prodi = NULL WHERE prodi NOT IN ($placeholders) OR prodi = ''", $enumValues);
        DB::statement("UPDATE anggota_penelitian SET prodi = NULL WHERE prodi NOT IN ($placeholders) OR prodi = ''", $enumValues);

        // Custom DB statement needed for ENUM change to prevent Doctrine errors depending on DB version
        // Tapi kita coba pakai Laravel 11/12 native builder
        Schema::table('dosen', function (Blueprint $table) use ($enumValues) {
            $table->enum('prodi', $enumValues)->nullable()->change();
        });

        Schema::table('anggota_penelitian', function (Blueprint $table) use ($enumValues) {
            $table->enum('prodi', $enumValues)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->string('prodi')->nullable()->change();
        });

        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->string('prodi')->nullable()->change();
        });
    }
};
