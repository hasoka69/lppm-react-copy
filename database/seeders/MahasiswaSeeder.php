<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $first_names = [
            'Ahmad', 'Budi', 'Citra', 'Dwi', 'Eka', 'Fatimah', 'Gatot', 'Hendra',
            'Indah', 'Joko', 'Krisna', 'Lina', 'Mardiman', 'Nugroho', 'Oka', 'Putri',
            'Qodri', 'Rini', 'Sardi', 'Tuti', 'Usman', 'Vina', 'Willy', 'Xena',
            'Yusuf', 'Zainab', 'Arif', 'Bella', 'Cahyo', 'Dani',
        ];

        $last_names = [
            'Wijaya', 'Santoso', 'Dewi', 'Prasetyo', 'Suwardi', 'Rahman', 'Subroto',
            'Kusuma', 'Murniece', 'Sutrisno', 'Kusuma', 'Seto', 'Wahyu', 'Satria',
            'Maharani', 'Sutrisni', 'Agus', 'Hayati', 'Syafiq', 'Hermansyah',
        ];

        $jurusans = ['Teknik Informatika', 'Sistem Informasi', 'Rekayasa Perangkat Lunak'];
        $statuses = ['aktif', 'aktif', 'aktif', 'aktif', 'lulus']; // 80% aktif, 20% lulus

        for ($i = 1; $i <= 50; $i++) {
            $first_name = $first_names[array_rand($first_names)];
            $last_name = $last_names[array_rand($last_names)];
            $nama = $first_name . ' ' . $last_name;
            $nim = '2021' . str_pad($i, 3, '0', STR_PAD_LEFT); // 2021001-2021050
            $angkatan = 2021 + ($i % 3); // Distribute across 2021, 2022, 2023
            $jurusan = $jurusans[$i % 3];
            $status = $statuses[$i % 5];

            Mahasiswa::create([
                'nim' => $nim,
                'nama' => $nama,
                'angkatan' => $angkatan,
                'jurusan' => $jurusan,
                'email' => $nim . '@student.univ.ac.id',
                'status' => $status,
            ]);
        }
    }
}
