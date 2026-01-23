<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatatanHarianPenelitian extends Model
{
    protected $table = 'catatan_harian_penelitian';

    protected $fillable = [
        'usulan_id',
        'user_id',
        'tanggal',
        'kegiatan',
        'persentase',
    ];

    /**
     * Relasi ke usulan_penelitian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
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
        return $this->hasMany(CatatanHarianPenelitianFile::class, 'catatan_id');
    }
}
