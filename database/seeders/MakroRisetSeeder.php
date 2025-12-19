<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MakroRisetSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama' => 'Pangan', 'aktif' => true],
            ['nama' => 'Energi', 'aktif' => true],
            ['nama' => 'Kesehatan', 'aktif' => true],
            ['nama' => 'Transportasi', 'aktif' => true],
            ['nama' => 'Rekayasa Keteknikan', 'aktif' => true],
            ['nama' => 'Pertahanan dan Keamanan', 'aktif' => true],
            ['nama' => 'Kemaritiman', 'aktif' => true],
            ['nama' => 'Sosial Humaniora', 'aktif' => true],
            ['nama' => 'Seni dan Budaya', 'aktif' => true],
            ['nama' => 'Pendidikan', 'aktif' => true],
        ];

        // Insert only if table is empty to avoid duplicates on multiple runs
        if (DB::table('makro_riset')->count() == 0) {
            DB::table('makro_riset')->insert($data);
            $this->command->info('Makro Riset data seeded successfully.');
        } else {
            $this->command->info('Makro Riset table already has data. Skipping.');
        }
    }
}
