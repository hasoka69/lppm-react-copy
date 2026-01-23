<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatatanHarianPengabdianFile extends Model
{
    protected $table = 'catatan_harian_pengabdian_files';

    protected $fillable = [
        'catatan_id',
        'file_path',
        'file_name',
    ];

    /**
     * Relasi ke catatan_harian_pengabdian
     */
    public function catatan(): BelongsTo
    {
        return $this->belongsTo(CatatanHarianPengabdian::class, 'catatan_id');
    }
}
