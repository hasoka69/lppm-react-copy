<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Penelitian
        if (!Schema::hasTable('catatan_harian_penelitian')) {
            Schema::create('catatan_harian_penelitian', function (Blueprint $table) {
                $table->id();
                $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->date('tanggal');
                $table->text('kegiatan');
                $table->integer('persentase');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('catatan_harian_penelitian_files')) {
            Schema::create('catatan_harian_penelitian_files', function (Blueprint $table) {
                $table->id();
                $table->foreignId('catatan_id')->constrained('catatan_harian_penelitian')->onDelete('cascade');
                $table->string('file_path');
                $table->string('file_name');
                $table->timestamps();
            });
        }

        // Pengabdian
        if (!Schema::hasTable('catatan_harian_pengabdian')) {
            Schema::create('catatan_harian_pengabdian', function (Blueprint $table) {
                $table->id();
                $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->date('tanggal');
                $table->text('kegiatan');
                $table->integer('persentase');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('catatan_harian_pengabdian_files')) {
            Schema::create('catatan_harian_pengabdian_files', function (Blueprint $table) {
                $table->id();
                $table->foreignId('catatan_id')->constrained('catatan_harian_pengabdian')->onDelete('cascade');
                $table->string('file_path');
                $table->string('file_name');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('catatan_harian_penelitian_files');
        Schema::dropIfExists('catatan_harian_penelitian');
        Schema::dropIfExists('catatan_harian_pengabdian_files');
        Schema::dropIfExists('catatan_harian_pengabdian');
    }
};
