<?php
// app/Models/UsulanPenelitian.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsulanPenelitian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'usulan_penelitian';

    protected $fillable = [
        'user_id',
        'judul',
        'tkt_saat_ini',
        'target_akhir_tkt',
        'kelompok_skema',
        'ruang_lingkup',
        'kategori_sbk',
        'bidang_fokus',
        'tema_penelitian',
        'topik_penelitian',
        'rumpun_ilmu_1',
        'rumpun_ilmu_2',
        'rumpun_ilmu_3',
        'prioritas_riset',
        'tahun_pertama',
        'kelompok_makro_riset',
        'file_substansi',
        'rab_bahan',           // [NEW]
        'rab_pengumpulan_data', // [NEW]
        'dana_usulan_awal',
        'total_anggaran',
        'status',
        'submitted_at',         // [NEW]
        'current_reviewer_id',  // [NEW]
        'kaprodi_reviewer_id',  // [NEW]
        'dana_disetujui',
        'dana_disetujui',
        'reviewer_id',
        'tugas_ketua', // [NEW]
        'nomor_kontrak', // [NEW]
        'tanggal_kontrak', // [NEW]
        'tanggal_mulai_kontrak', // [NEW]
        'tanggal_selesai_kontrak' // [NEW]
    ];

    protected $casts = [
        'total_anggaran' => 'decimal:2',
        'rab_bahan' => 'array',            // [NEW] cast to array
        'rab_pengumpulan_data' => 'array', // [NEW] cast to array
        'submitted_at' => 'datetime',      // [NEW] cast to datetime
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    /**
     * Relasi ke User (Ketua Penelitian)
     */
    public function ketua()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Alias for ketua() - for consistency across controllers
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke Anggota Dosen
     */
    public function anggotaDosen()
    {
        return $this->hasMany(AnggotaPenelitian::class, 'usulan_id');
    }

    /**
     * Relasi ke Anggota Non-Dosen
     */
    public function anggotaNonDosen()
    {
        return $this->hasMany(AnggotaNonDosen::class, 'usulan_id');
    }

    /**
     * Relasi ke Luaran Penelitian (Step 2)
     * ← TAMBAHAN BARU
     */
    public function luaranList()
    {
        return $this->hasMany(LuaranPenelitian::class, 'usulan_id');
    }

    /**
     * Relasi ke RAB Items (Step 3)
     * ← TAMBAHAN BARU
     */
    public function rabItems()
    {
        return $this->morphMany(RabItem::class, 'usulan');
    }

    /**
     * Relasi ke Review Histories
     */
    /**
     * Relasi ke Review Histories (Polymorphic)
     */
    public function reviewHistories()
    {
        return $this->morphMany(ReviewHistory::class, 'usulan');
    }

    /**
     * Relasi ke Reviewer (User)
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Relasi ke Makro Riset
     */
    public function makroRiset()
    {
        return $this->belongsTo(MakroRiset::class, 'kelompok_makro_riset');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Hitung Total Anggaran dari semua RAB Items
     * ← TAMBAHAN BARU
     */
    public function getTotalAnggaran()
    {
        return $this->rabItems()->sum('total');
    }

    /**
     * Cek status draft
     */
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    /**
     * Cek status submitted
     */
    public function isSubmitted()
    {
        return $this->status === 'submitted';
    }

    /**
     * Relasi ke Laporan Kemajuan
     */
    public function laporanKemajuan()
    {
        return $this->hasOne(LaporanKemajuanPenelitian::class, 'usulan_id');
    }

    /**
     * Relasi ke Laporan Akhir
     */
    public function laporanAkhir()
    {
        return $this->hasOne(LaporanAkhirPenelitian::class, 'usulan_id');
    }

    /**
     * Relasi ke Catatan Harian
     */
    public function catatanHarian()
    {
        return $this->hasMany(CatatanHarianPenelitian::class, 'usulan_id');
    }
}