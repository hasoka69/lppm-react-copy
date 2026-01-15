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
        // 1. Create Usulan Pengabdian Table
        Schema::create('usulan_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ketua pengabdian

            // Data Identitas Usulan
            $table->string('judul');
            // Field lain yang mungkin relevan atau sama dengan penelitian
            $table->integer('tkt_saat_ini')->nullable();
            $table->integer('target_akhir_tkt')->nullable();

            // Pemilihan Program
            $table->string('kelompok_skema')->nullable();
            $table->string('ruang_lingkup')->nullable();

            // Tambahan field spesifik pengabdian jika ada (untuk sementara disamakan strukturnya)
            $table->string('bidang_fokus')->nullable();

            // Waktu
            $table->year('tahun_pertama')->nullable();
            $table->integer('lama_kegiatan')->nullable(); // dalam tahun

            // Substansi
            $table->string('file_substansi')->nullable(); // path file

            // RAB (disimpan sebagai JSON untuk fleksibilitas - Summary/Cache)
            // Note: Detail RAB tetap di tabel rab_item yang akan dipolymorphic-kan
            $table->decimal('total_anggaran', 15, 2)->default(0);

            // Status
            $table->enum('status', ['draft', 'submitted', 'under_review', 'approved_prodi', 'rejected_prodi', 'reviewer_review', 'approved', 'rejected'])
                ->default('draft');

            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Anggota Pengabdian (Dosen)
        Schema::create('anggota_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
            $table->string('nidn');
            $table->string('nama');
            $table->enum('peran', ['ketua', 'anggota']);
            $table->text('tugas')->nullable();
            $table->enum('status_persetujuan', ['menunggu', 'menyetujui', 'menolak'])->default('menunggu');
            $table->timestamps();
        });

        // 3. Anggota Non Dosen Pengabdian
        Schema::create('anggota_non_dosen_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
            $table->string('jenis_anggota'); // mahasiswa, tenaga lapangan, dll
            $table->string('no_identitas');
            $table->string('nama');
            $table->string('jurusan')->nullable();
            $table->text('tugas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_non_dosen_pengabdian');
        Schema::dropIfExists('anggota_pengabdian');
        Schema::dropIfExists('usulan_pengabdian');
    }
};
