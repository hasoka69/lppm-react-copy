<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnggotaPengabdian extends Model
{
    use HasFactory;

    protected $table = 'anggota_pengabdian';

    protected $fillable = [
        'dosen_id', // Added
        'nidn',
        'nama',
        'peran',
        'tugas',
        'status_approval', // Added
    ];

    public function usulan()
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'nidn', 'nidn');
    }
}
