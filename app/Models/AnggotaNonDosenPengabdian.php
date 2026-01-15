<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnggotaNonDosenPengabdian extends Model
{
    use HasFactory;

    protected $table = 'anggota_non_dosen_pengabdian';

    protected $fillable = [
        'usulan_id',
        'jenis_anggota',
        'no_identitas',
        'nama',
        'jurusan',
        'tugas'
    ];

    public function usulan()
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }
}
