<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuaranPenelitian extends Model
{
    protected $table = 'luaran_penelitian';

    protected $fillable = [
        'usulan_id',
        'usulan_id',
        'kategori',
        'deskripsi',
        'is_wajib',
        'status',
        'judul_realisasi',
        'tahun_realisasi',
        'volume',
        'nomor',
        'halaman_awal',
        'halaman_akhir',
        'peran_penulis',
        'nama_jurnal',
        'issn',
        'pengindek',
        'file_bukti',
        'file_bukti_submit',
        'url_bukti',
        'url_artikel',
        'doi',
        'keterangan',
        'judul_realisasi_akhir',
        'file_bukti_akhir',
        'url_bukti_akhir',
        'status_akhir',
        'keterangan_akhir',
    ];

    /**
     * Relasi ke Usulan Penelitian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }
}
