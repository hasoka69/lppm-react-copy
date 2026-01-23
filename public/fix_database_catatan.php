<?php

use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Creating Catatan Harian tables...\n";

    DB::statement("
        CREATE TABLE IF NOT EXISTS `catatan_harian_penelitian` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `usulan_id` bigint(20) unsigned NOT NULL,
            `user_id` bigint(20) unsigned NOT NULL,
            `tanggal` date NOT NULL,
            `kegiatan` text NOT NULL,
            `persentase` int(11) NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `catatan_harian_penelitian_usulan_id_foreign` (`usulan_id`),
            KEY `catatan_harian_penelitian_user_id_foreign` (`user_id`),
            CONSTRAINT `catatan_harian_penelitian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
            CONSTRAINT `catatan_harian_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    DB::statement("
        CREATE TABLE IF NOT EXISTS `catatan_harian_penelitian_files` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `catatan_id` bigint(20) unsigned NOT NULL,
            `file_path` varchar(255) NOT NULL,
            `file_name` varchar(255) NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `catatan_harian_penelitian_files_catatan_id_foreign` (`catatan_id`),
            CONSTRAINT `catatan_harian_penelitian_files_catatan_id_foreign` FOREIGN KEY (`catatan_id`) REFERENCES `catatan_harian_penelitian` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    DB::statement("
        CREATE TABLE IF NOT EXISTS `catatan_harian_pengabdian` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `usulan_id` bigint(20) unsigned NOT NULL,
            `user_id` bigint(20) unsigned NOT NULL,
            `tanggal` date NOT NULL,
            `kegiatan` text NOT NULL,
            `persentase` int(11) NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `catatan_harian_pengabdian_usulan_id_foreign` (`usulan_id`),
            KEY `catatan_harian_pengabdian_user_id_foreign` (`user_id`),
            CONSTRAINT `catatan_harian_pengabdian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
            CONSTRAINT `catatan_harian_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    DB::statement("
        CREATE TABLE IF NOT EXISTS `catatan_harian_pengabdian_files` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `catatan_id` bigint(20) unsigned NOT NULL,
            `file_path` varchar(255) NOT NULL,
            `file_name` varchar(255) NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `catatan_harian_pengabdian_files_catatan_id_foreign` (`catatan_id`),
            CONSTRAINT `catatan_harian_pengabdian_files_catatan_id_foreign` FOREIGN KEY (`catatan_id`) REFERENCES `catatan_harian_pengabdian` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    echo "Tables created successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
