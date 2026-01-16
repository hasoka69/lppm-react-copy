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
        'status',
        'keterangan',
    ];

    /**
     * Relasi ke Usulan Pengabdian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }
}
