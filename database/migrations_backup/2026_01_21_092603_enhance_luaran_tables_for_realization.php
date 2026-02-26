<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->boolean('is_wajib')->default(true)->after('deskripsi');
            $table->text('judul_realisasi')->nullable()->after('is_wajib');
            $table->string('file_bukti')->nullable()->after('judul_realisasi');
            $table->string('url_bukti')->nullable()->after('file_bukti');
            // Change status from enum to string to support more statuses if needed
            $table->string('status', 50)->default('Rencana')->change();
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->boolean('is_wajib')->default(true)->after('deskripsi');
            $table->text('judul_realisasi')->nullable()->after('is_wajib');
            $table->string('file_bukti')->nullable()->after('judul_realisasi');
            $table->string('url_bukti')->nullable()->after('file_bukti');
            // Change status from enum to string
            $table->string('status', 50)->default('Rencana')->change();
        });
    }

    public function down(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->dropColumn(['is_wajib', 'judul_realisasi', 'file_bukti', 'url_bukti']);
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['is_wajib', 'judul_realisasi', 'file_bukti', 'url_bukti']);
        });
    }
};
