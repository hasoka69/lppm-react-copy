<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatatanHarianPengabdian extends Model
{
    protected $table = 'catatan_harian_pengabdian';

    protected $fillable = [
        'usulan_id',
        'user_id',
        'tanggal',
        'kegiatan',
        'persentase',
    ];

    /**
     * Relasi ke usulan_pengabdian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi ke user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke file pendukung
     */
    public function files(): HasMany
    {
        return $this->hasMany(CatatanHarianPengabdianFile::class, 'catatan_id');
    }
}
