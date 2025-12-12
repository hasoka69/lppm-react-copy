<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnggotaNonDosen extends Model
{

    protected $table = 'anggota_non_dosen';

    protected $fillable = [
        'usulan_id',
        'mahasiswa_id',
        'jenis_anggota',
        'no_identitas',
        'nama',
        'institusi',
        'tugas',
        'status_approval',
        'approval_comment',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function usulanPenelitian()
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
}
