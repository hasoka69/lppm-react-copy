<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mahasiswa extends Model
{
    use SoftDeletes;

    protected $table = 'mahasiswa';

    protected $fillable = [
        'nim',
        'nama',
        'angkatan',
        'jurusan',
        'email',
        'status',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Get all anggota non-dosen records for this mahasiswa
     */
    public function anggotaNonDosen()
    {
        return $this->hasMany(AnggotaNonDosen::class, 'mahasiswa_id');
    }
}
