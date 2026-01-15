<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsulanPengabdian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'usulan_pengabdian';

    protected $fillable = [
        'user_id',
        'judul',
        'tkt_saat_ini',
        'target_akhir_tkt',
        'kelompok_skema',
        'ruang_lingkup',
        'bidang_fokus',
        'tahun_pertama',
        'lama_kegiatan',
        'file_substansi',
        // RAB Summary (total stored here, detail in rab_item)
        'total_anggaran',
        'status',
    ];

    protected $casts = [
        'total_anggaran' => 'decimal:2',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    /**
     * Relasi ke User (Ketua Pengabdian)
     */
    public function ketua()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Alias conform to Penelitian controller patterns if reused
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke Anggota Dosen Pengabdian
     */
    public function anggotaDosen()
    {
        return $this->hasMany(AnggotaPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi ke Anggota Non-Dosen Pengabdian
     */
    public function anggotaNonDosen()
    {
        return $this->hasMany(AnggotaNonDosenPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi Polymorphic ke RAB Items
     */
    public function rabItems()
    {
        return $this->morphMany(RabItem::class, 'usulan');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public function getTotalAnggaran()
    {
        return $this->rabItems()->sum('total');
    }

    public function isDraft()
    {
        return $this->status === 'draft';
    }

    public function isSubmitted()
    {
        return $this->status === 'submitted';
    }
}
