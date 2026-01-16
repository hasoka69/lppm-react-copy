<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MitraPengabdian extends Model
{
    use HasFactory;

    protected $table = 'mitra_pengabdian';

    protected $fillable = [
        'usulan_id',
        'nama_mitra',
        'email',
        'jenis_mitra',
        'alamat_mitra', // [NEW]
        'penanggung_jawab', // [NEW]
        'no_telepon', // [NEW]
        'pimpinan_mitra', // Keep for backward compat or drop later
        'provinsi_id',
        'kota_id',
        'nama_provinsi',
        'nama_kota',
        'kelompok_mitra',
        'pendanaan_tahun_1',
        'pendanaan_tahun_2',
        'pendanaan_tahun_3',
        'file_surat_kesediaan',
        'file_pendukung_lain'
    ];

    protected $casts = [
        'pendanaan_tahun_1' => 'decimal:2',
        'pendanaan_tahun_2' => 'decimal:2',
        'pendanaan_tahun_3' => 'decimal:2',
    ];

    public function usulan()
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }
}
