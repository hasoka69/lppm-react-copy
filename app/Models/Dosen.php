<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dosen extends Model
{
    use SoftDeletes;

    protected $table = 'dosen';

    protected $fillable = [
        'nidn',
        'nama',
        'prodi', // Added prodi
        'email',
        'no_hp',
        'scopus_id',
        'sinta_id',
        'google_scholar_id',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Get all anggota penelitian records for this dosen
     */
    public function anggotaPenelitian()
    {
        return $this->hasMany(AnggotaPenelitian::class, 'dosen_id');
    }
}
