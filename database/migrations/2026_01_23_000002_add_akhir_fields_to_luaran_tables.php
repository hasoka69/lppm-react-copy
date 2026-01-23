<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->string('judul_realisasi_akhir', 500)->nullable();
            $table->string('file_bukti_akhir')->nullable();
            $table->string('url_bukti_akhir')->nullable();
            $table->string('status_akhir')->nullable();
            $table->text('keterangan_akhir')->nullable();
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->string('judul_realisasi_akhir', 500)->nullable();
            $table->string('file_bukti_akhir')->nullable();
            $table->string('url_bukti_akhir')->nullable();
            $table->string('status_akhir')->nullable();
            $table->text('keterangan_akhir')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->dropColumn(['judul_realisasi_akhir', 'file_bukti_akhir', 'url_bukti_akhir', 'status_akhir', 'keterangan_akhir']);
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['judul_realisasi_akhir', 'file_bukti_akhir', 'url_bukti_akhir', 'status_akhir', 'keterangan_akhir']);
        });
    }
};
