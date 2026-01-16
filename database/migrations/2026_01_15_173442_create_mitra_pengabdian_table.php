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
        Schema::create('mitra_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
            $table->string('nama_mitra');
            $table->string('email')->nullable();
            $table->string('jenis_mitra'); // UMKM, Desa, dll
            $table->string('pimpinan_mitra')->nullable();

            // Lokasi Mitra
            $table->foreignId('provinsi_id')->nullable(); // referensi ke tabel provinsi (optional FK constraint)
            $table->foreignId('kota_id')->nullable();     // referensi ke tabel kota (optional FK constraint)
            $table->string('nama_provinsi')->nullable();  // snapshotted name if needed
            $table->string('nama_kota')->nullable();      // snapshotted name if needed

            $table->string('kelompok_mitra')->nullable();

            // Pendanaan
            $table->decimal('pendanaan_tahun_1', 15, 2)->default(0);
            $table->decimal('pendanaan_tahun_2', 15, 2)->default(0); // in case
            $table->decimal('pendanaan_tahun_3', 15, 2)->default(0); // in case

            // File Dukung
            $table->string('file_surat_kesediaan')->nullable();
            $table->string('file_pendukung_lain')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mitra_pengabdian');
    }
};
