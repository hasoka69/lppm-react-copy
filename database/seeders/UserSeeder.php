<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users for each role
        $testUsers = [
            [
                'name' => 'Admin User',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'role' => 'Admin'
            ],
            [
                'name' => 'LPPM Admin',
                'email' => 'lppm@test.com',
                'password' => Hash::make('password'),
                'role' => 'Admin LPPM'
            ],
            [
                'name' => 'Dosen Peneliti',
                'email' => 'dosen@test.com',
                'password' => Hash::make('password'),
                'role' => 'Dosen'
            ],
            [
                'name' => 'Kaprodi',
                'email' => 'kaprodi@test.com',
                'password' => Hash::make('password'),
                'role' => 'Kaprodi'
            ],
            [
                'name' => 'Reviewer',
                'email' => 'reviewer@test.com',
                'password' => Hash::make('password'),
                'role' => 'Reviewer'
            ],
        ];

        foreach ($testUsers as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            
            $user = User::create([
                ...$userData,
                'email_verified_at' => now(),
            ]);

            // Assign role
            $user->assignRole($role);
        }
    }
}
