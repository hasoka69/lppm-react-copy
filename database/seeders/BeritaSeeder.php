<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        Berita::insert([
            [
                'judul' => 'Penelitian Inovasi Teknologi Pendidikan',
                'slug' => 'penelitian-inovasi-teknologi-pendidikan',
                'kategori' => 'Penelitian Terbaru',
                'ringkasan' => 'Tim peneliti LPPM Asindo berhasil mengembangkan platform pembelajaran digital yang meningkatkan efektivitas belajar hingga 40%.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card1.png',
                'tanggal' => '2025-01-15',
                'featured' => true,
            ],
            [
                'judul' => 'Program Pemberdayaan UMKM Digital',
                'slug' => 'program-pemberdayaan-umkm-digital',
                'kategori' => 'Pengabdian Masyarakat',
                'ringkasan' => 'Kegiatan pengabdian masyarakat yang membantu 200+ UMKM lokal untuk go digital dan meningkatkan penjualan online mereka.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card2.png',
                'tanggal' => '2025-01-12',
                'featured' => true,
            ],
            [
                'judul' => 'Kolaborasi Riset Internasional',
                'slug' => 'kolaborasi-riset-internasional',
                'kategori' => 'Kolaborasi Riset',
                'ringkasan' => 'LPPM Asindo menjalin kerjasama penelitian dengan universitas terkemuka di Asia Tenggara.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card3.png',
                'tanggal' => '2025-01-10',
                'featured' => false,
            ],
        ]);
    }
}
