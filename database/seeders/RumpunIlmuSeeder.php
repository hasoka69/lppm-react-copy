<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RumpunIlmuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Level 1
        $l1_alam = \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insertGetId([
            'level' => 1,
            'nama' => 'ILMU ALAM',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        $l1_sosial = \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insertGetId([
            'level' => 1,
            'nama' => 'ILMU SOSIAL',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Level 2 (Alam)
        $l2_fisika = \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insertGetId([
            'level' => 2,
            'parent_id' => $l1_alam,
            'nama' => 'FISIKA',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        $l2_kimia = \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insertGetId([
            'level' => 2,
            'parent_id' => $l1_alam,
            'nama' => 'KIMIA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Level 3 (Fisika)
        \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insert([
            ['level' => 3, 'parent_id' => $l2_fisika, 'nama' => 'ASTROFISIKA', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 3, 'parent_id' => $l2_fisika, 'nama' => 'FISIKA NUKLIR', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Level 2 (Sosial)
        $l2_ekonomi = \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insertGetId([
            'level' => 2,
            'parent_id' => $l1_sosial,
            'nama' => 'EKONOMI',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Level 3 (Ekonomi)
        \Illuminate\Support\Facades\DB::table('rumpun_ilmu')->insert([
            ['level' => 3, 'parent_id' => $l2_ekonomi, 'nama' => 'AKUNTANSI', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 3, 'parent_id' => $l2_ekonomi, 'nama' => 'MANAJEMEN', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
