<?php
// database/migrations/xxxx_create_usulan_penelitian_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usulan_penelitian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ketua penelitian
            
            // Data Identitas Usulan
            $table->string('judul');
            $table->integer('tkt_saat_ini')->nullable();
            $table->integer('target_akhir_tkt')->nullable();
            
            // Pemilihan Program
            $table->string('kelompok_skema')->nullable();
            $table->string('ruang_lingkup')->nullable();
            $table->string('kategori_sbk')->nullable();
            $table->string('bidang_fokus')->nullable();
            $table->string('tema_penelitian')->nullable();
            $table->string('topik_penelitian')->nullable();
            $table->string('rumpun_ilmu_1')->nullable();
            $table->string('rumpun_ilmu_2')->nullable();
            $table->string('rumpun_ilmu_3')->nullable();
            $table->string('prioritas_riset')->nullable();
            $table->year('tahun_pertama')->nullable();
            $table->integer('lama_kegiatan')->nullable(); // dalam tahun
            
            // Substansi
            $table->string('kelompok_makro_riset')->nullable();
            $table->string('file_substansi')->nullable(); // path file
            
            // RAB (disimpan sebagai JSON untuk fleksibilitas)
            $table->json('rab_bahan')->nullable();
            $table->json('rab_pengumpulan_data')->nullable();
            $table->decimal('total_anggaran', 15, 2)->default(0);
            
            // Status
            $table->enum('status', ['draft', 'submitted', 'under_review', 'approved', 'rejected'])
                  ->default('draft');
            
            $table->timestamps();
            $table->softDeletes(); // untuk hapus soft
        });
        
        // Tabel untuk anggota penelitian (dosen)
        Schema::create('anggota_penelitian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
            $table->string('nidn');
            $table->string('nama');
            $table->enum('peran', ['ketua', 'anggota']);
            $table->text('tugas')->nullable();
            $table->enum('status_persetujuan', ['menunggu', 'menyetujui', 'menolak'])->default('menunggu');
            $table->timestamps();
        });
        
        // Tabel untuk anggota non-dosen
        Schema::create('anggota_non_dosen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
            $table->string('jenis_anggota'); // mahasiswa, tenaga lapangan, dll
            $table->string('no_identitas');
            $table->string('nama');
            $table->string('jurusan');
            $table->text('tugas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_non_dosen');
        Schema::dropIfExists('anggota_penelitian');
        Schema::dropIfExists('usulan_penelitian');
    }
};