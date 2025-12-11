<?php
// app/Models/UsulanPenelitian.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id
 * @property string $judul
 * @property string|null $kelompok_skema
 * @property string|null $file_substansi
 * @property string $status
 * @property array|null $rab_bahan
 * @property array|null $rab_pengumpulan_data
 * @property float|null $total_anggaran
 * @property int|null $tkt_saat_ini
 * @property int|null $target_akhir_tkt
 * @property string|null $ruang_lingkup
 * @property string|null $kategori_sbk
 * @property string|null $bidang_fokus
 * @property string|null $tema_penelitian
 * @property string|null $topik_penelitian
 * @property string|null $rumpun_ilmu_1
 * @property string|null $rumpun_ilmu_2
 * @property string|null $rumpun_ilmu_3
 * @property string|null $prioritas_riset
 * @property int|null $tahun_pertama
 * @property int|null $lama_kegiatan
 * @property string|null $kelompok_makro_riset
 */
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
        'lama_kegiatan',
        'kelompok_makro_riset',
        'file_substansi',
        'rab_bahan',
        'rab_pengumpulan_data',
        'total_anggaran',
        'status',
    ];

    // Cast untuk tipe data khusus
    protected $casts = [
        'rab_bahan' => 'array', // JSON jadi array otomatis
        'rab_pengumpulan_data' => 'array',
        'total_anggaran' => 'decimal:2',
    ];

    // Relasi ke User (Ketua)
    public function ketua()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Anggota Dosen
    public function anggotaDosen()
    {
        return $this->hasMany(AnggotaPenelitian::class, 'usulan_id');
    }

    // Relasi ke Anggota Non-Dosen
    public function anggotaNonDosen()
    {
        return $this->hasMany(AnggotaNonDosen::class, 'usulan_id');
    }

    // Helper method untuk cek status
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    public function isSubmitted()
    {
        return $this->status === 'submitted';
    }
}