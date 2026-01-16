<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Provinsi
        $jabar = \Illuminate\Support\Facades\DB::table('provinsi')->insertGetId([
            'nama' => 'JAWA BARAT',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        $dki = \Illuminate\Support\Facades\DB::table('provinsi')->insertGetId([
            'nama' => 'DKI JAKARTA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Kota Jabar
        \Illuminate\Support\Facades\DB::table('kota')->insert([
            ['provinsi_id' => $jabar, 'nama' => 'KOTA BANDUNG', 'created_at' => now(), 'updated_at' => now()],
            ['provinsi_id' => $jabar, 'nama' => 'KAB. BANDUNG', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Kota DKI
        \Illuminate\Support\Facades\DB::table('kota')->insert([
            ['provinsi_id' => $dki, 'nama' => 'JAKARTA SELATAN', 'created_at' => now(), 'updated_at' => now()],
            ['provinsi_id' => $dki, 'nama' => 'JAKARTA PUSAT', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
