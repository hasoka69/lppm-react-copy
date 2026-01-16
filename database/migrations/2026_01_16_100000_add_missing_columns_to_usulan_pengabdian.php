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
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_pengabdian', 'tahun_pengusulan')) {
                $table->year('tahun_pengusulan')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'jenis_bidang_fokus')) {
                $table->enum('jenis_bidang_fokus', ['tematik', 'ririn'])->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'bidang_fokus')) {
                $table->string('bidang_fokus')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'kelompok_skema')) {
                $table->string('kelompok_skema')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'ruang_lingkup')) {
                $table->text('ruang_lingkup')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'tahun_pertama')) {
                $table->year('tahun_pertama')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'lama_kegiatan')) {
                $table->integer('lama_kegiatan')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'rumpun_ilmu_level1_id')) {
                $table->foreignId('rumpun_ilmu_level1_id')->nullable();
                $table->string('rumpun_ilmu_level1_label')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'rumpun_ilmu_level2_id')) {
                $table->foreignId('rumpun_ilmu_level2_id')->nullable();
                $table->string('rumpun_ilmu_level2_label')->nullable();
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'rumpun_ilmu_level3_id')) {
                $table->foreignId('rumpun_ilmu_level3_id')->nullable();
                $table->string('rumpun_ilmu_level3_label')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropColumn([
                'tahun_pengusulan',
                'jenis_bidang_fokus',
                'bidang_fokus',
                'kelompok_skema',
                'ruang_lingkup',
                'tahun_pertama',
                'lama_kegiatan',
                'rumpun_ilmu_level1_id',
                'rumpun_ilmu_level1_label',
                'rumpun_ilmu_level2_id',
                'rumpun_ilmu_level2_label',
                'rumpun_ilmu_level3_id',
                'rumpun_ilmu_level3_label',
            ]);
        });
    }
};
