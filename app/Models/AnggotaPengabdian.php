<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnggotaPengabdian extends Model
{
    use HasFactory;

    protected $table = 'anggota_pengabdian';

    protected $fillable = [
        'usulan_id',
        'nidn',
        'nama',
        'peran',
        'tugas',
        'status_persetujuan'
    ];

    public function usulan()
    {
        return $this->belongsTo(UsulanPengabdian::class, 'usulan_id');
    }
}
