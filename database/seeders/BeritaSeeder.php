<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Daftar data berita yang ingin dimasukkan
        $beritas = [
            [
                'judul' => 'Penelitian Inovasi Teknologi Pendidikan',
                'kategori' => 'Penelitian Terbaru',
                'ringkasan' => 'Tim peneliti LPPM Asindo berhasil mengembangkan platform pembelajaran digital yang meningkatkan efektivitas belajar hingga 40%.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card1.png',
                'tanggal' => '2025-01-15',
                'featured' => true,
            ],
            [
                'judul' => 'Program Pemberdayaan UMKM Digital',
                'kategori' => 'Pengabdian Masyarakat',
                'ringkasan' => 'Kegiatan pengabdian masyarakat yang membantu 200+ UMKM lokal untuk go digital dan meningkatkan penjualan online mereka.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card2.png',
                'tanggal' => '2025-01-12',
                'featured' => true,
            ],
            [
                'judul' => 'Kolaborasi Riset Internasional',
                'kategori' => 'Kolaborasi Riset',
                'ringkasan' => 'LPPM Asindo menjalin kerjasama penelitian dengan universitas terkemuka di Asia Tenggara.',
                'konten' => '(isi lengkap...)',
                'gambar' => '/image/card3.png',
                'tanggal' => '2025-01-10',
                'featured' => false,
            ],
        ];

        // Insert data dengan pengecekan slug unik
        foreach ($beritas as $berita) {
            // Generate slug dari judul yang pasti unik
            $slug = Str::slug($berita['judul']);

            // Jika slug sudah ada, tambahkan angka di akhir slug untuk menghindari duplikasi
            if (Berita::where('slug', $slug)->exists()) {
                $slug = $slug . '-' . time(); // tambahkan timestamp untuk menjamin keunikan
            }

            // Create berita dengan slug yang sudah terjamin unik
            Berita::create([
                'judul' => $berita['judul'],
                'slug' => $slug,
                'kategori' => $berita['kategori'],
                'ringkasan' => $berita['ringkasan'],
                'konten' => $berita['konten'],
                'gambar' => $berita['gambar'],
                'tanggal' => $berita['tanggal'],
                'featured' => $berita['featured'],
            ]);
        }
    }
}
