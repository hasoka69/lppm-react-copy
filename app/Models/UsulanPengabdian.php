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
        'jenis_bidang_fokus', // [NEW]
        'bidang_fokus',
        'rumpun_ilmu_level1_id', // [NEW]
        'rumpun_ilmu_level1_label',
        'rumpun_ilmu_level2_id',
        'rumpun_ilmu_level2_label',
        'rumpun_ilmu_level3_id',
        'rumpun_ilmu_level3_label',
        'kelompok_skema',
        'ruang_lingkup',
        'tahun_pengusulan', // [NEW]
        'tahun_pertama',
        'lama_kegiatan',
        'tkt_saat_ini',
        'target_akhir_tkt',
        'file_substansi',
        'total_anggaran',
        'status',
        'revision_count',
        'dana_disetujui',
        'reviewer_id'
    ];

    protected $casts = [
        'total_anggaran' => 'decimal:2',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    /**
     * Relasi ke Mitra Pengabdian
     */
    public function mitra()
    {
        return $this->hasMany(MitraPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi ke User (Ketua Pengabdian)
     */
    public function ketua()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function anggotaDosen()
    {
        return $this->hasMany(AnggotaPengabdian::class, 'usulan_id');
    }

    public function anggotaNonDosen()
    {
        return $this->hasMany(AnggotaNonDosenPengabdian::class, 'usulan_id');
    }

    // Alias conform to Penelitian controller patterns if reused
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
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
    /**
     * Relationship to Luaran items
     */
    public function luaranList()
    {
        return $this->hasMany(LuaranPengabdian::class, 'usulan_id');
    }

    /**
     * Relationship to Luaran items (Alias for backward compatibility)
     */
    public function luaranItems()
    {
        return $this->hasMany(LuaranPengabdian::class, 'usulan_id');
    }

    /**
     * Relationship to Review History
     */
    public function reviewHistories()
    {
        return $this->morphMany(ReviewHistory::class, 'usulan');
    }

    /**
     * Relationship to Reviewer (User)
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Relasi ke Laporan Kemajuan
     */
    public function laporanKemajuan()
    {
        return $this->hasOne(LaporanKemajuanPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi ke Laporan Akhir
     */
    public function laporanAkhir()
    {
        return $this->hasOne(LaporanAkhirPengabdian::class, 'usulan_id');
    }

    /**
     * Relasi ke Catatan Harian
     */
    public function catatanHarian()
    {
        return $this->hasMany(CatatanHarianPengabdian::class, 'usulan_id');
    }
}
