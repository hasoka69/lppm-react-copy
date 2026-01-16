<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RumpunIlmu extends Model
{
    use HasFactory;

    protected $table = 'rumpun_ilmu';

    protected $fillable = ['level', 'parent_id', 'nama'];

    public function children()
    {
        return $this->hasMany(RumpunIlmu::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(RumpunIlmu::class, 'parent_id');
    }
}
