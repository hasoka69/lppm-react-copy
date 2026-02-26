<?php
// database/migrations/xxxx_create_master_penelitian_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Kelompok Skema
        Schema::create('kelompok_skema', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Ruang Lingkup
        Schema::create('ruang_lingkup', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Kategori SBK
        Schema::create('kategori_sbk', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Bidang Fokus
        Schema::create('bidang_fokus', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

            // Create Tema Penelitian table
            Schema::create('tema_penelitian', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->boolean('aktif')->default(true);
                $table->timestamps();
            });

            // Create Topik Penelitian table with foreign key referencing tema_penelitian
            Schema::create('topik_penelitian', function (Blueprint $table) {
                $table->id();
                $table->foreignId('tema_penelitian_id')->constrained('tema_penelitian')->onDelete('cascade');
                $table->string('nama');
                $table->boolean('aktif')->default(true);
                $table->timestamps();
            });


        // Rumpun Ilmu Level 1
        Schema::create('rumpun_ilmu_level1', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Rumpun Ilmu Level 2
        Schema::create('rumpun_ilmu_level2', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level1_id')->constrained('rumpun_ilmu_level1')->onDelete('cascade');
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Rumpun Ilmu Level 3
        Schema::create('rumpun_ilmu_level3', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level2_id')->constrained('rumpun_ilmu_level2')->onDelete('cascade');
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        // Prioritas Riset
        Schema::create('prioritas_riset', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prioritas_riset');
        Schema::dropIfExists('rumpun_ilmu_level3');
        Schema::dropIfExists('rumpun_ilmu_level2');
        Schema::dropIfExists('rumpun_ilmu_level1');
        Schema::dropIfExists('topik_penelitian');
        Schema::dropIfExists('tema_penelitian');
        Schema::dropIfExists('bidang_fokus');
        Schema::dropIfExists('kategori_sbk');
        Schema::dropIfExists('ruang_lingkup');
        Schema::dropIfExists('kelompok_skema');
    }
};