<?php

namespace Database\Seeders;

use App\Models\MakroRiset;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MakroRisetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $makroRisets = [
            [
                'nama' => 'Kesehatan',
                'deskripsi' => 'Penelitian di bidang kesehatan, penyakit, dan kesejahteraan masyarakat',
                'aktif' => true,
            ],
            [
                'nama' => 'Pertanian',
                'deskripsi' => 'Penelitian di bidang pertanian, perkebunan, dan agribisnis',
                'aktif' => true,
            ],
            [
                'nama' => 'Teknologi',
                'deskripsi' => 'Penelitian di bidang teknologi informasi, engineering, dan inovasi',
                'aktif' => true,
            ],
            [
                'nama' => 'Sosial dan Budaya',
                'deskripsi' => 'Penelitian di bidang sosial, budaya, dan humaniora',
                'aktif' => true,
            ],
            [
                'nama' => 'Lingkungan dan Energi',
                'deskripsi' => 'Penelitian di bidang lingkungan, keberlanjutan, dan energi terbarukan',
                'aktif' => true,
            ],
        ];

        foreach ($makroRisets as $makroRiset) {
            MakroRiset::create($makroRiset);
        }
    }
}
