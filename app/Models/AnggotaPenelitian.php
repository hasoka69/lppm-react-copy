<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnggotaPenelitian extends Model
{

    protected $table = 'anggota_penelitian';

    protected $fillable = [
        'usulan_id',
        'dosen_id',
        'nidn',
        'nama',
        'peran',
        'prodi',
        'tugas',
        'status_approval', // Added
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

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }
}
