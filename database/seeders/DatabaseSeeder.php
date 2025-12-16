<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil seeder untuk data dasar (misalnya, Berita)
        $this->call([
            BeritaSeeder::class,
        ]);
        
        // Panggil seeder peran dan izin (RolePermissionSeeder harus dijalankan sebelum User dibuat dan diberi peran)
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Panggil seeder untuk master data (Dosen, Mahasiswa, MakroRiset, MasterPenelitian)
        $this->call([
            DosenSeeder::class,
            MahasiswaSeeder::class,
            MakroRisetSeeder::class,
            MasterPenelitianSeeder::class,
        ]);

        // ==========================================================
        // BUAT DAN TUGASKAN PERAN UNTUK PENGGUNA ADMIN
        // ==========================================================
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin'),
            ]
        );
        // Pastikan user mendapatkan role 'Admin'
        $adminUser->syncRoles(['Admin']); 

        // Buat user Reviewer dan tetapkan peran 'Reviewer'
        $adminLppmUser = User::firstOrCreate(
            ['email' => 'lppm@admin.com'],
            [
                'name' => 'Admin LPPM',
                'password' => Hash::make('lppm'),
            ]
        );
        $adminLppmUser->syncRoles(['Admin Lppm']); 
       
        // Buat user Reviewer dan tetapkan peran 'Reviewer'
        $reviewerUser = User::firstOrCreate(
            ['email' => 'reviewer@admin.com'],
            [
                'name' => 'Reviewer',
                'password' => Hash::make('reviewer'),
            ]
        );
        $reviewerUser->syncRoles(['Reviewer']); 

        // Buat user Kaprodi dan tetapkan peran 'Kaprodi'
        $kaprodiUser = User::firstOrCreate(
            ['email' => 'kaprodi@admin.com'],
            [
                'name' => 'Kaprodi',
                'password' => Hash::make('kaprodi'),
            ]
        );
        $kaprodiUser->syncRoles(['Kaprodi']); 

        // Buat user Dosen dan tetapkan peran 'Dosen'
        $dosenUser = User::firstOrCreate(
            ['email' => 'dosen@admin.com'],
            [
                'name' => 'Dosen',
                'password' => Hash::make('dosen'),
            ]
        );
        $dosenUser->syncRoles(['Dosen']); 

        // Panggil seeder menu
        $this->call([
            MenuSeeder::class,
        ]);
    }
}