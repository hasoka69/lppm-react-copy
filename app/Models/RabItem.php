<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RabItem extends Model
{
    protected $table = 'rab_item';

    protected $fillable = [
        'usulan_id',
        'usulan_type', // [NEW]
        'tipe',
        'kategori',
        'item',
        'satuan',
        'volume',
        'harga_satuan',
        'total',
        'keterangan',
    ];

    protected $casts = [
        'volume' => 'integer',
        'harga_satuan' => 'integer',
        'total' => 'integer',
    ];

    /**
     * Relasi ke Usulan (Polymorphic: Penelitian atau Pengabdian)
     */
    public function usulan()
    {
        return $this->morphTo();
    }

    /**
     * Auto-calculate total before save
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->total = $model->volume * $model->harga_satuan;
        });
    }
}
