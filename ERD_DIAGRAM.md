# 🗂️ Entity Relationship Diagram (ERD)

## Relationship Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────┘

                            ┌──────────────┐
                            │    users     │
                            └────┬─────────┘
                                 │
                                 │ user_id
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
          ┌──────────────────────────────────────┐
          │   usulan_penelitian (MAIN TABLE)    │
          ├──────────────────────────────────────┤
          │ id                                   │
          │ user_id (FK) ──────► users           │
          │ judul                                │
          │ tkt_saat_ini                         │
          │ target_akhir_tkt                     │
          │ kelompok_skema                       │
          │ ruang_lingkup                        │
          │ kategori_sbk                         │
          │ bidang_fokus                         │
          │ tema_penelitian                      │
          │ topik_penelitian                     │
          │ rumpun_ilmu_1,2,3                    │
          │ prioritas_riset                      │
          │ tahun_pertama                        │
          │ lama_kegiatan                        │
          │ kelompok_makro_riset                 │
          │ file_substansi                       │
          │ rab_bahan (JSON)                     │
          │ rab_pengumpulan_data (JSON)          │
          │ total_anggaran                       │
          │ status                               │
          └──────────────┬──────────────┬────────┘
                         │              │
          ┌──────────────┘   ┌──────────┴──────────┐
          │                  │                     │
          ▼                  ▼                     ▼
    ┌──────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ anggota_     │  │ luaran_         │  │ rab_item        │
    │ penelitian   │  │ penelitian       │  │ (NEW)           │
    ├──────────────┤  ├─────────────────┤  ├─────────────────┤
    │ id           │  │ id              │  │ id              │
    │ usulan_id ◀──┤  │ usulan_id ◀─────┤  │ usulan_id ◀──────┤
    │ nuptik       │  │ tahun           │  │ tipe            │
    │ nama         │  │ kategori        │  │ kategori        │
    │ peran        │  │ deskripsi       │  │ item            │
    │ institusi    │  │ status          │  │ satuan          │
    │ prodi (+NEW) │  │ keterangan      │  │ volume          │
    │ tugas        │  │ created_at      │  │ harga_satuan    │
    │ status_      │  │ updated_at      │  │ total (AUTO)    │
    │ persetujuan  │  │                 │  │ keterangan      │
    │ created_at   │  │                 │  │ created_at      │
    │ updated_at   │  │                 │  │ updated_at      │
    └──────────────┘  └─────────────────┘  └─────────────────┘
          │                                        │
          │                                        │
          └─ 1-to-N relationship                   └─ 1-to-N relationship
             (Many anggota per usulan)                (Many items per usulan)

    
MASTER DATA TABLES:
┌──────────────────┐
│ makro_riset      │ ◀─ Referenced by usulan_penelitian
├──────────────────┤
│ id               │
│ nama             │
│ deskripsi        │
│ aktif            │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

---

## Flow Data Across Pages

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PENGAJUAN WORKFLOW FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

USER LOGIN
    │
    ▼
PAGE-USULAN.tsx ─────────► Tab list semua usulan
    │
    └──► [Tambah Usulan Baru]
         │
         ▼
    PAGE-IDENTITAS-1.tsx ✅ DONE
    ├─ Input: judul, TKT, master data
    │
    ├─► Simpan ke: usulan_penelitian table
    │
    ├─► Add Anggota Dosen/Non-Dosen:
    │   ├─ anggota_penelitian table
    │   └─ anggota_non_dosen table
    │
    ▼
    PAGE-SUBSTANSI-2.tsx 🔄 IN PROGRESS
    ├─ Input: makro_riset (dropdown), file upload
    │
    ├─► Fetch: makro_riset (master data)
    │
    ├─► Simpan ke:
    │   └─ luaran_penelitian table (NEW)
    │
    └─► Display: luaran_penelitian data
    │
    ▼
    PAGE-RAB-3.tsx 🔄 IN PROGRESS
    ├─ Input: item bahan & pengumpulan data
    │
    ├─► Simpan ke:
    │   └─ rab_item table (NEW)
    │
    ├─► Auto-Calculate:
    │   └─ total_anggaran = SUM(rab_item.total)
    │
    └─► Display: rab items list
    │
    ▼
    PAGE-TINJAUAN-4.tsx 📊 READ-ONLY
    ├─ Display: semua data dari tables di atas
    │
    ├─ Check: status persetujuan anggota
    │
    └─► [Konfirmasi Submit] ───► status = 'submitted'
```

---

## Data Mapping Per Step

```
STEP 1: IDENTITAS
┌────────────────────────────────────────────────────────┐
│ Input Form                    → Database              │
├────────────────────────────────────────────────────────┤
│ Judul                         → usulan.judul          │
│ TKT Saat Ini                  → usulan.tkt_saat_ini   │
│ Target TKT                    → usulan.target_akhir   │
│ Kelompok Skema                → usulan.kelompok_skema │
│ Ruang Lingkup                 → usulan.ruang_lingkup  │
│ Kategori SBK                  → usulan.kategori_sbk   │
│ Bidang Fokus                  → usulan.bidang_fokus   │
│ Tema Penelitian               → usulan.tema_penelitian│
│ Topik Penelitian              → usulan.topik_penelitian│
│ Rumpun Ilmu 1,2,3             → usulan.rumpun_ilmu_*  │
│ Prioritas Riset               → usulan.prioritas_riset│
│ Tahun Pertama                 → usulan.tahun_pertama  │
│ Lama Kegiatan                 → usulan.lama_kegiatan  │
│                                                       │
│ Anggota Dosen (CRUD)          → anggota_penelitian    │
│ Anggota Non-Dosen (CRUD)      → anggota_non_dosen     │
└────────────────────────────────────────────────────────┘

STEP 2: SUBSTANSI
┌────────────────────────────────────────────────────────┐
│ Input Form                    → Database              │
├────────────────────────────────────────────────────────┤
│ Kelompok Makro Riset (dropdown) → usulan.kelompok_makro_riset  │
│ File Substansi (upload)       → usulan.file_substansi│
│                                                       │
│ Luaran Penelitian (CRUD)      → luaran_penelitian     │
│  ├─ Tahun                                             │
│  ├─ Kategori (Jurnal, Prosiding, HKI, dll)          │
│  ├─ Deskripsi                                        │
│  └─ Status (Rencana, Proses, Selesai)               │
└────────────────────────────────────────────────────────┘

STEP 3: RAB
┌────────────────────────────────────────────────────────┐
│ Input Form                    → Database              │
├────────────────────────────────────────────────────────┤
│ RAB Items (CRUD)              → rab_item              │
│  ├─ Tipe (Bahan/Pengumpulan)                         │
│  ├─ Kategori (Habis Pakai, Peralatan, dll)          │
│  ├─ Item                                             │
│  ├─ Satuan                                           │
│  ├─ Volume                                           │
│  ├─ Harga Satuan                                     │
│  └─ Total (AUTO: volume × harga_satuan)             │
│                                                       │
│ Total RAB (display) ◀─ SUM(rab_item.total)          │
│ Total Anggaran ◀─ (updated in usulan_penelitian)    │
└────────────────────────────────────────────────────────┘

STEP 4: TINJAUAN
┌────────────────────────────────────────────────────────┐
│ Data Displayed (READ-ONLY)                            │
├────────────────────────────────────────────────────────┤
│ ◀─ Baca dari: usulan_penelitian                       │
│ ◀─ Baca dari: anggota_penelitian                      │
│ ◀─ Baca dari: anggota_non_dosen                       │
│ ◀─ Baca dari: luaran_penelitian                       │
│ ◀─ Baca dari: rab_item                                │
│                                                       │
│ Check: Semua anggota status = "Menyetujui"?          │
│        IF YES: Enable [Konfirmasi Submit] button      │
└────────────────────────────────────────────────────────┘
```

---

## Cardinality Overview

```
1 User ──────┐
             ├──► 0..* Usulan Penelitian
             └──► 0..* Audit Log
             
1 Usulan ────┐
             ├──► 0..* Anggota Penelitian (dosen)
             ├──► 0..* Anggota Non-Dosen  
             ├──► 0..* Luaran Penelitian  
             └──► 0..* RAB Item
```

---

## Table Relationships Summary

| Child Table | Parent Table | Relationship | Cascade Delete |
|-------------|--------------|-------------|-----------------|
| usulan_penelitian | users | N-to-1 | YES |
| anggota_penelitian | usulan_penelitian | N-to-1 | YES |
| anggota_non_dosen | usulan_penelitian | N-to-1 | YES |
| luaran_penelitian | usulan_penelitian | N-to-1 | YES |
| rab_item | usulan_penelitian | N-to-1 | YES |

---

## Key Points

1. **usulan_penelitian** = Hub utama, semua detail penelitian disimpan di sini
2. **anggota_penelitian & anggota_non_dosen** = Tabel terpisah agar mudah management
3. **luaran_penelitian** = Master list target luaran per tahun
4. **rab_item** = Detail cost breakdown, auto-total calculated
5. **makro_riset** = Master reference untuk dropdown

Semua child tables punya foreign key ke usulan_penelitian dengan CASCADE DELETE
untuk memastikan data consistency.
