<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormTemplate;

class FormTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Penelitian Step 1: Identitas
        FormTemplate::create([
            'category' => 'penelitian',
            'step' => 1,
            'version' => 1,
            'fields' => [
                [
                    "id" => "judul",
                    "label" => "1. Judul Penelitian",
                    "type" => "textarea",
                    "required" => true,
                    "placeholder" => "Masukkan judul lengkap penelitian anda...",
                    "rows" => 3
                ],
                [
                    "id" => "tkt_saat_ini",
                    "label" => "2. TKT Saat Ini",
                    "type" => "number",
                    "required" => true,
                    "placeholder" => "Skala 1-9"
                ],
                [
                    "id" => "target_akhir_tkt",
                    "label" => "3. Target Akhir TKT",
                    "type" => "select",
                    "required" => true,
                    "options" => [1, 2, 3, 4, 5, 6, 7, 8, 9]
                ],
                [
                    "id" => "kelompok_skema",
                    "label" => "4. Kelompok Skema",
                    "type" => "select",
                    "required" => true,
                    "options" => ["Penelitian Dasar", "Penelitian Terapan", "Penelitian Pengembangan"]
                ],
                [
                    "id" => "ruang_lingkup",
                    "label" => "5. Ruang Lingkup",
                    "type" => "select",
                    "required" => true,
                    "options" => ["Nasional", "Internasional", "Regional"]
                ],
                [
                    "id" => "kategori_sbk",
                    "label" => "6. Kategori SBK",
                    "type" => "select",
                    "required" => true,
                    "options" => ["SBK A", "SBK B", "SBK C"]
                ],
                [
                    "id" => "bidang_fokus",
                    "label" => "7. Bidang Fokus",
                    "type" => "select",
                    "required" => true,
                    "options" => ["Kesehatan", "Pertanian", "Teknologi", "Sosial Humaniora"]
                ],
                [
                    "id" => "rumpun_ilmu_1",
                    "label" => "10. Rumpun Ilmu Lvl 1",
                    "type" => "select",
                    "required" => true,
                    "options" => ["Ilmu Alam", "Ilmu Sosial", "Ilmu Humaniora"]
                ],
                [
                    "id" => "lama_kegiatan",
                    "label" => "15. Lama Kegiatan (Tahun)",
                    "type" => "select",
                    "required" => true,
                    "options" => ["1", "2", "3"]
                ]
            ]
        ]);

        // Pengabdian Step 1: Identitas (Placeholder)
        FormTemplate::create([
            'category' => 'pengabdian',
            'step' => 1,
            'version' => 1,
            'fields' => [
                [
                    "id" => "judul",
                    "label" => "1. Judul Pengabdian",
                    "type" => "textarea",
                    "required" => true,
                    "placeholder" => "Masukkan judul pengabdian..."
                ],
                [
                    "id" => "tema",
                    "label" => "2. Tema Pengabdian",
                    "type" => "select",
                    "required" => true,
                    "options" => ["Pemberdayaan", "Pelatihan", "Teknologi Tepat Guna"]
                ]
            ]
        ]);
    }
}
