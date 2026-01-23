<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatatanHarianPenelitianFile extends Model
{
    protected $table = 'catatan_harian_penelitian_files';

    protected $fillable = [
        'catatan_id',
        'file_path',
        'file_name',
    ];

    /**
     * Relasi ke catatan_harian_penelitian
     */
    public function catatan(): BelongsTo
    {
        return $this->belongsTo(CatatanHarianPenelitian::class, 'catatan_id');
    }
}
