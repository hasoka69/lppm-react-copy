/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint unsigned DEFAULT NULL,
  `causer_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_id` bigint unsigned DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `batch_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `anggota_non_dosen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggota_non_dosen` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `jenis_anggota` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_identitas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jurusan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tugas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `mahasiswa_id` bigint unsigned DEFAULT NULL,
  `approval_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `approved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anggota_non_dosen_usulan_id_foreign` (`usulan_id`),
  KEY `anggota_non_dosen_mahasiswa_id_foreign` (`mahasiswa_id`),
  CONSTRAINT `anggota_non_dosen_mahasiswa_id_foreign` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa` (`id`) ON DELETE SET NULL,
  CONSTRAINT `anggota_non_dosen_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `anggota_non_dosen_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggota_non_dosen_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `jenis_anggota` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_identitas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jurusan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tugas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anggota_non_dosen_pengabdian_usulan_id_foreign` (`usulan_id`),
  CONSTRAINT `anggota_non_dosen_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `anggota_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggota_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `nidn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `peran` enum('ketua','anggota') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prodi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tugas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status_approval` enum('pending','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status_persetujuan` enum('menunggu','menyetujui','menolak') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `dosen_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anggota_penelitian_usulan_id_foreign` (`usulan_id`),
  KEY `anggota_penelitian_dosen_id_foreign` (`dosen_id`),
  CONSTRAINT `anggota_penelitian_dosen_id_foreign` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`) ON DELETE SET NULL,
  CONSTRAINT `anggota_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `anggota_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggota_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `dosen_id` bigint unsigned DEFAULT NULL,
  `nidn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `peran` enum('ketua','anggota') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tugas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status_approval` enum('pending','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anggota_pengabdian_usulan_id_foreign` (`usulan_id`),
  KEY `anggota_pengabdian_dosen_id_index` (`dosen_id`),
  CONSTRAINT `anggota_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `beritas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beritas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ringkasan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `konten` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `gambar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `beritas_slug_unique` (`slug`),
  KEY `beritas_user_id_foreign` (`user_id`),
  CONSTRAINT `beritas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `bidang_fokus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bidang_fokus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `catatan_harian_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catatan_harian_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `kegiatan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `persentase` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_harian_penelitian_usulan_id_foreign` (`usulan_id`),
  KEY `catatan_harian_penelitian_user_id_foreign` (`user_id`),
  CONSTRAINT `catatan_harian_penelitian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catatan_harian_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `catatan_harian_penelitian_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catatan_harian_penelitian_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `catatan_id` bigint unsigned NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_harian_penelitian_files_catatan_id_foreign` (`catatan_id`),
  CONSTRAINT `catatan_harian_penelitian_files_catatan_id_foreign` FOREIGN KEY (`catatan_id`) REFERENCES `catatan_harian_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `catatan_harian_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catatan_harian_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `kegiatan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `persentase` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_harian_pengabdian_usulan_id_foreign` (`usulan_id`),
  KEY `catatan_harian_pengabdian_user_id_foreign` (`user_id`),
  CONSTRAINT `catatan_harian_pengabdian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catatan_harian_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `catatan_harian_pengabdian_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catatan_harian_pengabdian_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `catatan_id` bigint unsigned NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_harian_pengabdian_files_catatan_id_foreign` (`catatan_id`),
  CONSTRAINT `catatan_harian_pengabdian_files_catatan_id_foreign` FOREIGN KEY (`catatan_id`) REFERENCES `catatan_harian_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `dosen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dosen` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nidn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prodi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopus_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sinta_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_scholar_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_hp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dosen_nidn_unique` (`nidn`),
  UNIQUE KEY `dosen_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `form_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `step` int NOT NULL,
  `version` int NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `fields` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `kategori_sbk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori_sbk` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `kelompok_skema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kelompok_skema` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `kota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kota` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `provinsi_id` bigint unsigned NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kota_provinsi_id_foreign` (`provinsi_id`),
  CONSTRAINT `kota_provinsi_id_foreign` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `laporan_akhir_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_akhir_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_laporan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_poster` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_sptb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Draft','Submitted','Accepted','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_akhir_penelitian_usulan_id_foreign` (`usulan_id`),
  KEY `laporan_akhir_penelitian_user_id_foreign` (`user_id`),
  CONSTRAINT `laporan_akhir_penelitian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_akhir_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `laporan_akhir_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_akhir_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_laporan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_poster` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_video` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_sptb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Draft','Submitted','Accepted','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_akhir_pengabdian_usulan_id_foreign` (`usulan_id`),
  KEY `laporan_akhir_pengabdian_user_id_foreign` (`user_id`),
  CONSTRAINT `laporan_akhir_pengabdian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_akhir_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `laporan_kemajuan_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_kemajuan_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` enum('Draft','Submitted','Accepted','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_laporan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_sptb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_kemajuan_penelitian_usulan_id_foreign` (`usulan_id`),
  KEY `laporan_kemajuan_penelitian_user_id_foreign` (`user_id`),
  CONSTRAINT `laporan_kemajuan_penelitian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_kemajuan_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `laporan_kemajuan_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_kemajuan_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` enum('Draft','Submitted','Accepted','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `keyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_laporan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_sptb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_kemajuan_pengabdian_usulan_id_foreign` (`usulan_id`),
  KEY `laporan_kemajuan_pengabdian_user_id_foreign` (`user_id`),
  CONSTRAINT `laporan_kemajuan_pengabdian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_kemajuan_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `luaran_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `luaran_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `kategori` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_wajib` tinyint(1) NOT NULL DEFAULT '1',
  `peran_penulis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_jurnal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pengindek` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `judul_realisasi` text COLLATE utf8mb4_unicode_ci,
  `tahun_realisasi` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `volume` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `halaman_awal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `halaman_akhir` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti_submit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_artikel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Rencana',
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `judul_realisasi_akhir` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_bukti_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan_akhir` text COLLATE utf8mb4_unicode_ci,
  `kemajuan_data` json DEFAULT NULL,
  `akhir_data` json DEFAULT NULL,
  `pengkinian_data` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `luaran_penelitian_usulan_id_index` (`usulan_id`),
  CONSTRAINT `luaran_penelitian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `luaran_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `luaran_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `kategori` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_wajib` tinyint(1) NOT NULL DEFAULT '1',
  `peran_penulis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_jurnal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pengindek` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `judul_realisasi` text COLLATE utf8mb4_unicode_ci,
  `tahun_realisasi` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `volume` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `halaman_awal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `halaman_akhir` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti_submit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_artikel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Rencana',
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attribute` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `judul_realisasi_akhir` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_bukti_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_bukti_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_akhir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan_akhir` text COLLATE utf8mb4_unicode_ci,
  `kemajuan_data` json DEFAULT NULL,
  `akhir_data` json DEFAULT NULL,
  `pengkinian_data` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `luaran_pengabdian_usulan_id_index` (`usulan_id`),
  CONSTRAINT `luaran_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `mahasiswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mahasiswa` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `angkatan` int NOT NULL,
  `jurusan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('aktif','lulus','nonaktif') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mahasiswa_nim_unique` (`nim`),
  UNIQUE KEY `mahasiswa_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `makro_riset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `makro_riset` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `makro_riset_nama_unique` (`nama`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversions_disk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` bigint unsigned NOT NULL,
  `manipulations` json NOT NULL,
  `custom_properties` json NOT NULL,
  `generated_conversions` json NOT NULL,
  `responsive_images` json NOT NULL,
  `order_column` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_uuid_unique` (`uuid`),
  KEY `media_model_type_model_id_index` (`model_type`,`model_id`),
  KEY `media_order_column_index` (`order_column`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `media_folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_folders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_folders_user_id_foreign` (`user_id`),
  KEY `media_folders_parent_id_foreign` (`parent_id`),
  CONSTRAINT `media_folders_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `media_folders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `media_folders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menus_parent_id_foreign` (`parent_id`),
  CONSTRAINT `menus_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `mitra_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mitra_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `nama_mitra` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_mitra` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat_mitra` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penanggung_jawab` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_telepon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pimpinan_mitra` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi_id` bigint unsigned DEFAULT NULL,
  `kota_id` bigint unsigned DEFAULT NULL,
  `nama_provinsi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_kota` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelompok_mitra` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pendanaan_tahun_1` decimal(15,2) NOT NULL DEFAULT '0.00',
  `pendanaan_tahun_2` decimal(15,2) NOT NULL DEFAULT '0.00',
  `pendanaan_tahun_3` decimal(15,2) NOT NULL DEFAULT '0.00',
  `file_surat_kesediaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_pendukung_lain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mitra_pengabdian_usulan_id_foreign` (`usulan_id`),
  CONSTRAINT `mitra_pengabdian_usulan_id_foreign` FOREIGN KEY (`usulan_id`) REFERENCES `usulan_pengabdian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `panduans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `panduans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'video',
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pengumuman`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengumuman` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `prioritas_riset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prioritas_riset` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `provinsi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinsi` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rab_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rab_item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `usulan_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AppModelsUsulanPenelitian',
  `tipe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `satuan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `volume` int NOT NULL,
  `harga_satuan` bigint NOT NULL,
  `total` bigint NOT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rab_item_usulan_id_index` (`usulan_id`),
  KEY `rab_item_tipe_index` (`tipe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `review_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usulan_id` bigint unsigned NOT NULL,
  `usulan_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewer_id` bigint unsigned NOT NULL,
  `reviewer_type` enum('kaprodi','reviewer','dosen','admin_lppm') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` enum('submitted','kaprodi_approved','kaprodi_rejected','reviewer_approved','reviewer_rejected','reviewer_revision_requested','funding_approved','submit','resubmit_revision','assign_reviewer','set_budget_and_revision','final_didanai','final_ditolak_akhir','reviewer_approve','reviewer_reject','reviewer_revise','submit_waiting') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `review_histories_usulan_id_foreign` (`usulan_id`),
  KEY `review_histories_reviewer_id_foreign` (`reviewer_id`),
  CONSTRAINT `review_histories_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `review_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_scores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `review_history_id` bigint unsigned NOT NULL,
  `section` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `review_scores_review_history_id_foreign` (`review_history_id`),
  CONSTRAINT `review_scores_review_history_id_foreign` FOREIGN KEY (`review_history_id`) REFERENCES `review_histories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ruang_lingkup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruang_lingkup` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rumpun_ilmu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rumpun_ilmu` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level` int NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rumpun_ilmu_parent_id_foreign` (`parent_id`),
  CONSTRAINT `rumpun_ilmu_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `rumpun_ilmu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rumpun_ilmu_level1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rumpun_ilmu_level1` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rumpun_ilmu_level2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rumpun_ilmu_level2` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level1_id` bigint unsigned NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rumpun_ilmu_level2_level1_id_foreign` (`level1_id`),
  CONSTRAINT `rumpun_ilmu_level2_level1_id_foreign` FOREIGN KEY (`level1_id`) REFERENCES `rumpun_ilmu_level1` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rumpun_ilmu_level3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rumpun_ilmu_level3` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level2_id` bigint unsigned NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rumpun_ilmu_level3_level2_id_foreign` (`level2_id`),
  CONSTRAINT `rumpun_ilmu_level3_level2_id_foreign` FOREIGN KEY (`level2_id`) REFERENCES `rumpun_ilmu_level2` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `settingapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settingapp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favicon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warna` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tema_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tema_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `template_dokumens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_dokumens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('Penelitian','Pengabdian') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `topik_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topik_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tema_penelitian_id` bigint unsigned NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topik_penelitian_tema_penelitian_id_foreign` (`tema_penelitian_id`),
  CONSTRAINT `topik_penelitian_tema_penelitian_id_foreign` FOREIGN KEY (`tema_penelitian_id`) REFERENCES `tema_penelitian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `usulan_penelitian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usulan_penelitian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `reviewer_id` bigint unsigned DEFAULT NULL,
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tkt_saat_ini` int DEFAULT NULL,
  `target_akhir_tkt` int DEFAULT NULL,
  `kelompok_skema` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ruang_lingkup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategori_sbk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bidang_fokus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tema_penelitian` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topik_penelitian` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prioritas_riset` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_pertama` int DEFAULT NULL,
  `tugas_ketua` text COLLATE utf8mb4_unicode_ci,
  `kelompok_makro_riset` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_substansi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rab_bahan` json DEFAULT NULL,
  `rab_pengumpulan_data` json DEFAULT NULL,
  `total_anggaran` decimal(15,2) NOT NULL DEFAULT '0.00',
  `dana_usulan_awal` decimal(15,2) DEFAULT NULL,
  `dana_disetujui` decimal(15,2) DEFAULT NULL,
  `status` enum('draft','submitted','waiting_member_approval','reviewer_assigned','under_review','reviewer_review','reviewed','reviewed_approved','rejected_reviewer','under_revision_admin','revision_dosen','resubmitted_revision','approved_prodi','rejected_prodi','approved','rejected','didanai','funded','ditolak','ditolak_akhir','needs_revision','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `nomor_kontrak` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `tanggal_mulai_kontrak` date DEFAULT NULL,
  `tanggal_selesai_kontrak` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `kaprodi_reviewer_id` bigint unsigned DEFAULT NULL,
  `current_reviewer_id` bigint unsigned DEFAULT NULL,
  `revision_count` int NOT NULL DEFAULT '0',
  `submitted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usulan_penelitian_user_id_foreign` (`user_id`),
  KEY `usulan_penelitian_kaprodi_reviewer_id_foreign` (`kaprodi_reviewer_id`),
  KEY `usulan_penelitian_current_reviewer_id_foreign` (`current_reviewer_id`),
  KEY `usulan_penelitian_reviewer_id_foreign` (`reviewer_id`),
  CONSTRAINT `usulan_penelitian_current_reviewer_id_foreign` FOREIGN KEY (`current_reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usulan_penelitian_kaprodi_reviewer_id_foreign` FOREIGN KEY (`kaprodi_reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usulan_penelitian_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usulan_penelitian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `usulan_pengabdian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usulan_pengabdian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `reviewer_id` bigint unsigned DEFAULT NULL,
  `tugas_ketua` text COLLATE utf8mb4_unicode_ci,
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tkt_saat_ini` int DEFAULT NULL,
  `target_akhir_tkt` int DEFAULT NULL,
  `kelompok_skema` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ruang_lingkup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bidang_fokus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_pertama` int DEFAULT NULL,
  `lama_kegiatan` int DEFAULT NULL,
  `file_substansi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_anggaran` decimal(15,2) NOT NULL DEFAULT '0.00',
  `dana_usulan_awal` decimal(15,2) DEFAULT NULL,
  `dana_disetujui` decimal(15,2) DEFAULT NULL,
  `status` enum('draft','submitted','waiting_member_approval','reviewer_assigned','under_review','reviewer_review','reviewed','reviewed_approved','rejected_reviewer','under_revision_admin','revision_dosen','resubmitted_revision','approved_prodi','rejected_prodi','approved','rejected','didanai','funded','ditolak','ditolak_akhir','needs_revision','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `nomor_kontrak` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `tanggal_mulai_kontrak` date DEFAULT NULL,
  `tanggal_selesai_kontrak` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `jenis_bidang_fokus` enum('tematik','ririn') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_level1_id` bigint unsigned DEFAULT NULL,
  `rumpun_ilmu_level1_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_level2_id` bigint unsigned DEFAULT NULL,
  `rumpun_ilmu_level2_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rumpun_ilmu_level3_id` bigint unsigned DEFAULT NULL,
  `rumpun_ilmu_level3_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usulan_pengabdian_user_id_foreign` (`user_id`),
  KEY `usulan_pengabdian_reviewer_id_foreign` (`reviewer_id`),
  CONSTRAINT `usulan_pengabdian_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usulan_pengabdian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2025_07_07_033007_create_permission_tables',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2025_07_07_033402_add_group_to_permissions_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2025_07_07_040622_create_menus_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2025_07_08_010811_create_settingapp_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2025_07_08_055805_update_menus_add_permission_name',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2025_07_09_022722_create_activity_log_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'2025_07_09_022723_add_event_column_to_activity_log_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'2025_07_09_022724_add_batch_uuid_column_to_activity_log_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2025_07_09_073041_create_media_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2025_07_09_074410_create_media_folders_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2025_11_12_082644_create_beritas_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2025_12_03_072009_create_usulan_penelitian_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2025_12_05_032810_create_master_penelitian_tables',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17,'2025_12_05_041130_drop_user_foreign_key_from_usulan_penelitian',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2025_12_05_041201_add_user_foreign_key_to_usulan_penelitian',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2025_12_09_093912_create_makro_riset_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20,'2025_12_09_093920_create_luaran_penelitian_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21,'2025_12_09_093924_create_rab_item_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22,'2025_12_09_093928_add_prodi_to_anggota_penelitian_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2025_12_11_093906_make_judul_nullable_in_usulan_penelitian_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2025_12_12_032540_create_dosen_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25,'2025_12_12_032754_create_mahasiswa_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26,'2025_12_12_032816_modify_anggota_tables_add_approval_fields',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27,'2025_12_12_032945_modify_usulan_penelitian_add_review_fields',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28,'2025_12_12_033055_create_review_histories_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29,'2025_12_16_090117_make_jurusan_nullable_on_anggota_non_dosen_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30,'2026_01_12_000000_add_prodi_to_dosen_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31,'2026_01_12_000001_modify_status_column_in_usulan_penelitian_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32,'2026_01_13_000002_update_status_enum_for_workflow',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33,'2026_01_15_094000_create_usulan_pengabdian_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2026_01_15_094001_add_polymorphic_to_rab_items_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2026_01_15_100000_create_luaran_pengabdian_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (36,'2026_01_15_173439_create_rumpun_ilmu_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (37,'2026_01_15_173441_create_wilayah_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (38,'2026_01_15_173442_create_mitra_pengabdian_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (39,'2026_01_16_100000_add_missing_columns_to_usulan_pengabdian',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (40,'2026_01_16_095456_add_columns_to_mitra_pengabdian_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (41,'2026_01_16_110936_update_status_enum_in_usulan_pengabdian_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (42,'2026_01_16_111518_make_review_histories_polymorphic',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (43,'2026_01_20_024101_update_usulan_workflow_v2',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (44,'2026_01_20_031000_update_review_histories_enums_v3',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (45,'2026_01_20_040000_update_review_histories_enums_v4',10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (46,'2026_01_21_092601_create_laporan_kemajuan_penelitian_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (47,'2026_01_21_092602_create_laporan_kemajuan_pengabdian_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2026_01_21_092603_enhance_luaran_tables_for_realization',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (49,'2026_01_21_165100_add_fields_to_laporan_kemajuan',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2026_01_22_101500_add_detailed_fields_to_luaran_tables',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (51,'2026_01_22_102500_add_content_fields_to_laporan_kemajuan',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (52,'2026_01_22_104000_add_sptb_field_to_laporan_kemajuan',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (53,'2026_01_22_112500_force_add_sptb_field',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (54,'2026_01_22_151200_create_catatan_harian_tables',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (55,'2026_01_23_000001_create_laporan_akhir_tables',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (56,'2026_01_23_000002_add_akhir_fields_to_luaran_tables',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (57,'2026_01_26_140000_add_detailed_realization_fields_to_luaran_tables',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (58,'2026_01_26_143000_add_url_artikel_to_luaran_tables',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (59,'2026_01_30_155500_create_form_templates_table',17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (60,'2026_02_01_200000_modify_tahun_pertama_type',18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (61,'2026_02_01_220500_add_dosen_id_to_anggota_tables',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (62,'2026_02_01_221300_drop_approval_columns_from_anggota_tables',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (63,'2026_02_01_222000_force_add_dosen_id_to_anggota_pengabdian',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (64,'2026_02_02_095000_add_status_and_published_at_to_beritas_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (65,'2026_02_02_100100_add_user_id_to_beritas_table',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (66,'2026_02_06_103000_add_social_ids_to_dosen_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (67,'2026_02_06_103100_create_pengumuman_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (68,'2026_02_06_154500_add_contract_and_review_scores_tables',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (69,'2026_02_06_163500_modify_luaran_and_anggota_tables',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (70,'2026_02_09_132500_drop_lama_kegiatan_from_usulan_penelitian',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (71,'2026_02_09_140000_add_waiting_member_approval_status',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (72,'2026_02_09_143300_update_review_histories_enum_add_submit_waiting',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (73,'2026_02_09_143800_update_usulan_penelitian_status_enum',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (74,'2026_02_09_145200_add_reviewer_assigned_to_usulan_penelitian_status',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (75,'2026_02_09_152000_update_usulan_pengabdian_status_enum_v2',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (76,'2026_02_09_153000_add_reviewer_statuses_to_usulan_penelitian',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (77,'2026_02_10_000000_fix_legacy_budget_values',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (78,'2026_02_10_105200_add_dana_usulan_awal_to_usulan_tables',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (79,'2026_02_10_150000_drop_tahun_pengusulan_from_usulan_pengabdian',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (80,'2026_02_10_000000_add_waiting_member_approval_to_pengabdian_status',32);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (81,'2026_02_10_200000_add_tugas_ketua_to_usulan_pengabdian_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (82,'2026_02_10_163000_add_tugas_ketua_to_usulan_penelitian_table',34);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (83,'2026_02_10_210000_add_tugas_ketua_to_usulan_penelitian_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (84,'2026_02_11_133000_fix_usulan_pengabdian_status_enum_v3',36);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (85,'2026_02_11_143000_add_attribute_to_luaran_pengabdian',37);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (86,'2026_02_13_150000_add_nomor_kontrak_to_usulan_tables',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (87,'2026_02_13_150100_create_template_dokumens_table',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (88,'2026_02_13_151000_seed_template_dokumen_menu',39);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (89,'2026_02_13_164000_add_contract_duration_to_usulan_tables',40);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (90,'2026_02_16_155000_finalize_usulan_status_enums',41);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (91,'2026_02_20_000000_create_panduans_table',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (92,'2026_02_20_000001_add_panduan_menu',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (93,'2026_02_20_000002_add_type_to_panduans_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (94,'2026_02_24_075908_add_isolated_data_to_luaran_tables',44);
