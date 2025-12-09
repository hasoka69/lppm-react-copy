<?php
// database/seeders/MasterPenelitianSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterPenelitianSeeder extends Seeder
{
    public function run()
    {
        // Kelompok Skema
        DB::table('kelompok_skema')->insert([
            ['nama' => 'Penelitian Dasar'],
            ['nama' => 'Penelitian Terapan'],
            ['nama' => 'Penelitian Pengembangan'],
        ]);

        // Ruang Lingkup
        DB::table('ruang_lingkup')->insert([
            ['nama' => 'Nasional'],
            ['nama' => 'Internasional'],
            ['nama' => 'Regional'],
        ]);

        // Kategori SBK
        DB::table('kategori_sbk')->insert([
            ['nama' => 'SBK A'],
            ['nama' => 'SBK B'],
            ['nama' => 'SBK C'],
        ]);

        // Bidang Fokus
        DB::table('bidang_fokus')->insert([
            ['nama' => 'Kesehatan'],
            ['nama' => 'Pertanian'],
            ['nama' => 'Teknologi'],
            ['nama' => 'Sosial Humaniora'],
        ]);

        // Tema Penelitian
        $temaIds = DB::table('tema_penelitian')->insertGetId(['nama' => 'Teknologi Informasi']);
        DB::table('tema_penelitian')->insert([
            ['nama' => 'Kesehatan Masyarakat'],
            ['nama' => 'Pertanian Berkelanjutan'],
        ]);

        // Topik Penelitian (terkait Tema)
        DB::table('topik_penelitian')->insert([
            ['tema_penelitian_id' => $temaIds, 'nama' => 'Artificial Intelligence'],
            ['tema_penelitian_id' => $temaIds, 'nama' => 'Internet of Things'],
            ['tema_penelitian_id' => $temaIds, 'nama' => 'Blockchain'],
        ]);

        // Rumpun Ilmu Level 1
        $level1Id = DB::table('rumpun_ilmu_level1')->insertGetId(['nama' => 'Ilmu Alam']);
        DB::table('rumpun_ilmu_level1')->insert([
            ['nama' => 'Ilmu Sosial'],
            ['nama' => 'Ilmu Humaniora'],
        ]);

        // Rumpun Ilmu Level 2
        $level2Id = DB::table('rumpun_ilmu_level2')->insertGetId([
            'level1_id' => $level1Id,
            'nama' => 'Matematika'
        ]);
        DB::table('rumpun_ilmu_level2')->insert([
            ['level1_id' => $level1Id, 'nama' => 'Fisika'],
            ['level1_id' => $level1Id, 'nama' => 'Kimia'],
        ]);

        // Rumpun Ilmu Level 3
        DB::table('rumpun_ilmu_level3')->insert([
            ['level2_id' => $level2Id, 'nama' => 'Aljabar'],
            ['level2_id' => $level2Id, 'nama' => 'Geometri'],
            ['level2_id' => $level2Id, 'nama' => 'Statistika'],
        ]);

        // Prioritas Riset
        DB::table('prioritas_riset')->insert([
            ['nama' => 'Prioritas 1'],
            ['nama' => 'Prioritas 2'],
            ['nama' => 'Prioritas 3'],
        ]);
    }
}