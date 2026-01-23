<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanKemajuanPenelitian extends Model
{
    use HasFactory;

    protected $table = 'laporan_kemajuan_penelitian';

    protected $fillable = [
        'usulan_id',
        'user_id',
        'status',
        'catatan',
        'submitted_at',
        'ringkasan',
        'keyword',
        'file_laporan',
        'file_sptb',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function usulan()
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
