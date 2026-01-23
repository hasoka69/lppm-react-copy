<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuaranPengabdian extends Model
{
    protected $table = 'luaran_pengabdian';

    protected $fillable = [
        'usulan_id',
        'tahun',
        'kategori',
        'deskripsi',
        'is_wajib',
        'status',
        'judul_realisasi',
        'peran_penulis',
        'nama_jurnal',
        'issn',
        'pengindek',
        'file_bukti',
        'file_bukti_submit',
        'url_bukti',
        'keterangan',
        'judul_realisasi_akhir',
        'file_bukti_akhir',
        'url_bukti_akhir',
        'status_akhir',
        'keterangan_akhir',
    ];

    /**
     * Relasi ke Usulan Pengabdian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }
}
