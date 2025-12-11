<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MakroRiset extends Model
{
    protected $table = 'makro_riset';

    protected $fillable = [
        'nama',
        'deskripsi',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];
}
