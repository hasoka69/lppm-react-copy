<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanAkhirPengabdian extends Model
{
    protected $table = 'laporan_akhir_pengabdian';

    protected $fillable = [
        'usulan_id',
        'user_id',
        'ringkasan',
        'keyword',
        'file_laporan',
        'file_poster',
        'url_video',
        'file_sptb',
        'status',
        'submitted_at',
    ];

    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
