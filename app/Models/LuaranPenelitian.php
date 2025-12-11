<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuaranPenelitian extends Model
{
    protected $table = 'luaran_penelitian';

    protected $fillable = [
        'usulan_id',
        'tahun',
        'kategori',
        'deskripsi',
        'status',
        'keterangan',
    ];

    /**
     * Relasi ke Usulan Penelitian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }
}
