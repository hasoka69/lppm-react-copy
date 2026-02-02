<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class Berita extends Model
{
    protected $table = 'beritas';
    protected $fillable = [
        'judul',
        'slug',
        'kategori',
        'ringkasan',
        'konten',
        'gambar',
        'status',
        'published_at',
        'featured',
        'user_id'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'featured' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = \Illuminate\Support\Str::slug($model->judul);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('judul') && empty($model->slug)) {
                $model->slug = \Illuminate\Support\Str::slug($model->judul);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

}