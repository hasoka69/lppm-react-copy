<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen_names = [
            'Prof. Ahmad Wijaya',
            'Dr. Budi Santoso',
            'Dr. Citra Dewi',
            'Dr. Dwi Prasetyo',
            'Prof. Eka Suwardi',
            'Dr. Fatimah Rahman',
            'Dr. Gatot Subroto',
            'Dr. Hendra Kusuma',
            'Prof. Indah Murniece',
            'Dr. Joko Sutrisno',
            'Dr. Krisna Wijaya',
            'Dr. Lina Kusuma',
            'Prof. Mardiman Seto',
            'Dr. Nugroho Wahyu',
            'Dr. Oka Satria',
            'Prof. Putri Maharani',
            'Dr. Qodri Rahman',
            'Dr. Rini Sutrisni',
            'Prof. Sardi Agus',
            'Dr. Tuti Hayati',
        ];

        $departments = ['Teknik Informatika', 'Sistem Informasi', 'RPL', 'Jaringan'];

        foreach ($dosen_names as $index => $name) {
            Dosen::create([
                'nidn' => '110' . str_pad($index + 1, 3, '0', STR_PAD_LEFT), // 110001-110020
                'nama' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@univ.ac.id',
                'no_hp' => '08' . rand(1, 9) . rand(10000000, 99999999),
            ]);
        }
    }
}
