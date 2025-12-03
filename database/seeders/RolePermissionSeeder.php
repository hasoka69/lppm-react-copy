<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat atau ambil role yang ada
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $adminLppm = Role::firstOrCreate(['name' => 'Admin LPPM']);
        $reviewer = Role::firstOrCreate(['name' => 'Reviewer']);
        $kaprodi = Role::firstOrCreate(['name' => 'Kaprodi']);
        $dosen = Role::firstOrCreate(['name' => 'Dosen']);

        // =================================================================
        // 2. DEFINISI DAFTAR IZIN BERDASARKAN PERAN
        // =================================================================

        // Izin untuk Admin (semua izin di sistem)
        $permissionsAdmin = $this->getAllPermissionsForAdmin();

        // Izin untuk Admin LPPM (terbatas)
        $permissionsAdminLppm = [
            'dashboard-lppm-view',
            'pengajuan-view',
            'pengajuan-usulan-view',
            'settings-view', 
            'utilities-view',
            'log-view',
            'backup-view',
            'filemanager-view', 
            'filemanager-create',
        ];

        // Izin untuk Reviewer
        $permissionsReviewer = [
            'dashboard-reviewer-view',
            'pengajuan-view', // Asumsi Reviewer perlu melihat list pengajuan yang ditugaskan
            'filemanager-view',
            'filemanager-create', 
        ];

        // Izin untuk Kaprodi
        $permissionsKaprodi = [
            'dashboard-kaprodi-view',
            'pengajuan-view',
            'pengajuan-usulan-view',
            // Tambahkan: pengajuan-approve
        ];

        // Izin untuk Dosen
        $permissionsDosen = [
            'dashboard-dosen-view',
            'pengajuan-view',
            'pengajuan-usulan-view',
            'pengajuan-form-view',
            'filemanager-view',
            'filemanager-create', 
        ];

        // =================================================================
        // PROSES 3: MEMBUAT SEMUA PERMISSION YANG DIBUTUHKAN
        // =================================================================
        
        $allUniquePermissions = array_merge(
            $permissionsAdmin,
            $permissionsAdminLppm, 
            $permissionsReviewer,
            $permissionsKaprodi,
            $permissionsDosen
        );

        $this->createPermissions($allUniquePermissions);


        // =================================================================
        // PROSES 4: MENETAPKAN IZIN KE MASING-MASING ROLE (MENGGUNAKAN SYNC)
        // =================================================================
        
        // 4.1. ADMIN Role: Mendapatkan SEMUA izin Admin
        $admin->syncPermissions($permissionsAdmin);

        // 4.2. ADMIN LPPM Role: Mendapatkan izin spesifik LPPM
        $adminLppm->syncPermissions($permissionsAdminLppm);

        // 4.3. REVIEWER Role: Mendapatkan izin spesifik Reviewer
        $reviewer->syncPermissions($permissionsReviewer);

        // 4.4. KAPRODI Role: Mendapatkan izin spesifik Kaprodi
        $kaprodi->syncPermissions($permissionsKaprodi);

        // 4.5. DOSEN Role: Mendapatkan izin spesifik Dosen
        $dosen->syncPermissions($permissionsDosen);

        $this->command->info("Permissions synced for roles: Admin, Admin LPPM, Reviewer, Kaprodi, Dosen.");
    }

    /**
     * Helper untuk mendapatkan semua izin yang ada di sistem (untuk Admin).
     */
    protected function getAllPermissionsForAdmin(): array
    {
        // Mendefinisikan semua izin dengan struktur group agar lebih rapi di database
        $permissions = [
            'Dashboard_Admin' => [ 'dashboard-admin-view' ],
            'Dashboard_LPPM' => [ 'dashboard-lppm-view' ],
            'Dashboard_Reviewer' => [ 'dashboard-reviewer-view' ],
            'Dashboard_Kaprodi' => [ 'dashboard-kaprodi-view' ],
            'Dashboard_Dosen' => [ 'dashboard-dosen-view' ],

            'Access' => [
                'access-view', 
                'permission-view', 'permission-create', 'permission-edit', 'permission-delete',
                // Perbaikan: Menambahkan users-impersonate untuk fitur "Ganti User"
                'users-view', 'users-create', 'users-edit', 'users-delete', 'users-reset-password', 'users-impersonate',
                'roles-view', 'roles-create', 'roles-edit', 'roles-delete',
            ],
            
            'Settings' => [
                'settings-view', 'menu-view', 'menu-create', 'menu-edit', 'menu-delete', 'menu-reorder',
                'app-settings-view', 'app-settings-edit',
                'backup-view', 'backup-run', 'backup-download', 'backup-delete',
            ],
            
            'Utilities' => [
                'utilities-view', 'log-view',
                'filemanager-view', 'filemanager-create', 'filemanager-delete',
            ],
            
            'Pengajuan' => [
                'pengajuan-view', 'pengajuan-usulan-view', 'pengajuan-form-view',
                'pengajuan-review', // Izin untuk Reviewer melakukan review
                'pengajuan-approve' // Izin untuk Kaprodi/LPPM menyetujui
            ]
        ];

        // Menggabungkan semua izin menjadi satu array flat
        $flatPermissions = [];
        foreach ($permissions as $group => $perms) {
            $flatPermissions = array_merge($flatPermissions, $perms);
        }

        return $flatPermissions;
    }

    /**
     * Helper untuk membuat izin di database dan menetapkan group.
     */
    protected function createPermissions(array $permissionNames): void
    {
        foreach (array_unique($permissionNames) as $name) {
            // Tentukan grup untuk izin baru berdasarkan prefix
            $group = 'General';
            if (str_contains($name, 'dashboard')) {
                $group = 'Dashboard';
            } elseif (str_contains($name, 'pengajuan')) {
                 $group = 'Pengajuan';
            } elseif (str_contains($name, 'users') || str_contains($name, 'roles') || str_contains($name, 'permission')) {
                 $group = 'Access';
            } elseif (str_contains($name, 'settings') || str_contains($name, 'menu') || str_contains($name, 'backup')) {
                 $group = 'Settings';
            } elseif (str_contains($name, 'utilities') || str_contains($name, 'log') || str_contains($name, 'filemanager')) {
                 $group = 'Utilities';
            }

            Permission::firstOrCreate([
                'name' => $name,
                'group' => $group
            ]);
        }
    }
}