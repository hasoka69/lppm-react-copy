<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->string('tahun_realisasi', 4)->nullable()->after('judul_realisasi');
            $table->string('volume', 50)->nullable()->after('tahun_realisasi');
            $table->string('nomor', 50)->nullable()->after('volume');
            $table->string('halaman_awal', 20)->nullable()->after('nomor');
            $table->string('halaman_akhir', 20)->nullable()->after('halaman_awal');
            $table->string('doi', 255)->nullable()->after('url_bukti');
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->string('tahun_realisasi', 4)->nullable()->after('judul_realisasi');
            $table->string('volume', 50)->nullable()->after('tahun_realisasi');
            $table->string('nomor', 50)->nullable()->after('volume');
            $table->string('halaman_awal', 20)->nullable()->after('nomor');
            $table->string('halaman_akhir', 20)->nullable()->after('halaman_awal');
            $table->string('doi', 255)->nullable()->after('url_bukti');
        });
    }

    public function down(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->dropColumn(['tahun_realisasi', 'volume', 'nomor', 'halaman_awal', 'halaman_akhir', 'doi']);
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['tahun_realisasi', 'volume', 'nomor', 'halaman_awal', 'halaman_akhir', 'doi']);
        });
    }
};
