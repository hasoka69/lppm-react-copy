<?php

namespace Database\Seeders;

use App\Models\Provinsi;
use App\Models\Kota;
use Illuminate\Database\Seeder;

class ProvinceCitySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Banten' => ['Serang', 'Tangerang', 'Tangerang Selatan', 'Cilegon', 'Lebak', 'Pandeglang'],
            'DKI Jakarta' => ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
            'Jawa Barat' => ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cimahi', 'Sukabumi', 'Tasikmalaya', 'Banjar', 'Cirebon'],
            'Jawa Tengah' => ['Semarang', 'Surakarta', 'Magelang', 'Pekalongan', 'Salatiga', 'Tegal', 'Cilacap', 'Banyumas'],
            'DI Yogyakarta' => ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'],
            'Jawa Timur' => ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Banyuwangi', 'Jember', 'Kediri', 'Madiun', 'Pasuruan', 'Probolinggo', 'Blitar', 'Batu', 'Mojokerto'],
        ];

        foreach ($data as $provName => $cities) {
            $provinsi = Provinsi::firstOrCreate(['nama' => $provName]);
            foreach ($cities as $cityName) {
                Kota::firstOrCreate([
                    'provinsi_id' => $provinsi->id,
                    'nama' => $cityName
                ]);
            }
        }
    }
}
