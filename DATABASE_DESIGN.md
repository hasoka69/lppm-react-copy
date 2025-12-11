# Database Design untuk Sistem Penelitian LPPM

Setelah menganalisis halaman-halaman steps, berikut adalah rekomendasi struktur database yang komprehensif untuk sistem penelitian.

---

## 📊 CURRENT TABLES (Sudah Ada)

### 1. **usulan_penelitian**
```
id | user_id | judul | tkt_saat_ini | target_akhir_tkt | kelompok_skema | 
ruang_lingkup | kategori_sbk | bidang_fokus | tema_penelitian | topik_penelitian | 
rumpun_ilmu_1 | rumpun_ilmu_2 | rumpun_ilmu_3 | prioritas_riset | tahun_pertama | 
lama_kegiatan | kelompok_makro_riset | file_substansi | rab_bahan (JSON) | 
rab_pengumpulan_data (JSON) | total_anggaran | status | created_at | updated_at
```

✅ Status: SUDAH ADA
- Menyimpan data identitas usulan
- RAB disimpan sebagai JSON (bahan & pengumpulan data)
- File substansi disimpan path-nya

---

## 🔄 TABLES YANG PERLU DITAMBAH/DIPERBAIKI

### 2. **makro_riset** (BARU)
```
id | nama | deskripsi | aktif | created_at | updated_at
```

**Tujuan**: Master data untuk dropdown "Kelompok Makro Riset" di page-substansi-2.tsx

**Sample Data**:
- Kesehatan Masyarakat
- Pertanian Berkelanjutan
- Teknologi Digital
- Sosial Ekonomi

---

### 3. **luaran_penelitian** (BARU - CRITICAL)
```
id | usulan_id | tahun | kategori | deskripsi | status | keterangan | created_at | updated_at
```

**Tujuan**: Menyimpan daftar luaran target capaian penelitian

**Relasi**: Foreign Key ke `usulan_penelitian(id)`

**Catatan Penting**:
- Saat ini di page-substansi-2.tsx hanya menampilkan tabel kosong
- Perlu CRUD endpoint untuk manage luaran
- Kategori bisa: Artikel Jurnal, Prosiding, HKI, Produk, dll

---

### 4. **rab_item** (BARU - CRITICAL)
```
id | usulan_id | tipe | kategori | item | satuan | volume | harga_satuan | total | keterangan | created_at | updated_at
```

**Tujuan**: Menyimpan detail item RAB (Rencana Anggaran Belanja)

**Relasi**: Foreign Key ke `usulan_penelitian(id)`

**Field Penjelasan**:
- `tipe`: 'bahan' atau 'pengumpulan_data'
- `kategori`: 'Bahan Habis Pakai', 'Peralatan', dll
- `volume * harga_satuan = total`

**Catatan**:
- Saat ini di page-rab-3.tsx RAB disimpan hanya di frontend
- Perlu dipindahkan ke database untuk persistensi
- Perlu trigger untuk update `total_anggaran` di `usulan_penelitian`

---

### 5. **anggota_penelitian** (SUDAH ADA - REVIEW STRUCTURE)
```
id | usulan_id | nuptik | nama | peran | institusi | tugas | status_persetujuan | created_at | updated_at
```

✅ Status: SUDAH ADA
- Sudah ada di IdentityAnggota.jsx
- Sudah ada controller methods
- Perlu: tambah field `prodi` & `status` untuk page-tinjauan-4.tsx

**Suggested Update**:
```
id | usulan_id | nuptik | nama | peran | institusi | prodi | tugas | status_persetujuan | created_at | updated_at
```

---

### 6. **anggota_non_dosen** (SUDAH ADA)
```
id | usulan_id | jenis_anggota | no_identitas | nama | instansi | tugas | created_at | updated_at
```

✅ Status: SUDAH ADA - NO CHANGES NEEDED

---

## 📝 MIGRATION CHECKLIST

### Phase 1: Create New Tables
```bash
php artisan make:migration create_makro_riset_table
php artisan make:migration create_luaran_penelitian_table
php artisan make:migration create_rab_item_table
```

### Phase 2: Update Existing Table
```bash
php artisan make:migration add_prodi_to_anggota_penelitian_table
```

### Phase 3: Seed Master Data
```bash
php artisan make:seeder MakroRisetSeeder
```

---

## 🗄️ MIGRATION CODE SAMPLES

### makro_riset Migration
```php
Schema::create('makro_riset', function (Blueprint $table) {
    $table->id();
    $table->string('nama', 255)->unique();
    $table->text('deskripsi')->nullable();
    $table->boolean('aktif')->default(true);
    $table->timestamps();
});
```

### luaran_penelitian Migration
```php
Schema::create('luaran_penelitian', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
    $table->integer('tahun'); // 1, 2, 3 (tahun ke berapa)
    $table->string('kategori', 100); // Artikel Jurnal, Prosiding, HKI, dll
    $table->text('deskripsi');
    $table->enum('status', ['Rencana', 'Dalam Proses', 'Selesai'])->default('Rencana');
    $table->text('keterangan')->nullable();
    $table->timestamps();
});
```

### rab_item Migration
```php
Schema::create('rab_item', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
    $table->enum('tipe', ['bahan', 'pengumpulan_data']);
    $table->string('kategori', 100); // Bahan Habis Pakai, Peralatan, Honorarium, dll
    $table->string('item', 255);
    $table->string('satuan', 50);
    $table->integer('volume');
    $table->bigInteger('harga_satuan');
    $table->bigInteger('total'); // Computed: volume * harga_satuan
    $table->text('keterangan')->nullable();
    $table->timestamps();
});
```

### add_prodi_to_anggota_penelitian Migration
```php
Schema::table('anggota_penelitian', function (Blueprint $table) {
    $table->string('prodi', 255)->nullable()->after('institusi');
});
```

---

## 🔗 MODELS & RELATIONSHIPS

### UsulanPenelitian Model
```php
public function luaranList()
{
    return $this->hasMany(LuaranPenelitian::class, 'usulan_id');
}

public function rabItems()
{
    return $this->hasMany(RabItem::class, 'usulan_id');
}

public function getTotalAnggaran()
{
    return $this->rabItems()->sum('total');
}
```

### LuaranPenelitian Model
```php
class LuaranPenelitian extends Model
{
    protected $table = 'luaran_penelitian';
    
    protected $fillable = ['usulan_id', 'tahun', 'kategori', 'deskripsi', 'status', 'keterangan'];
    
    public function usulan()
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }
}
```

### RabItem Model
```php
class RabItem extends Model
{
    protected $table = 'rab_item';
    
    protected $fillable = ['usulan_id', 'tipe', 'kategori', 'item', 'satuan', 'volume', 'harga_satuan', 'total', 'keterangan'];
    
    protected $casts = [
        'volume' => 'integer',
        'harga_satuan' => 'integer',
        'total' => 'integer',
    ];
    
    public function usulan()
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::saving(function ($model) {
            $model->total = $model->volume * $model->harga_satuan;
        });
    }
}
```

---

## 🎯 CONTROLLER METHODS NEEDED

### LuaranPenelitianController
- `showLuaran($usulanId)` - GET daftar luaran
- `storeLuaran(Request $request, UsulanPenelitian $usulan)` - POST buat luaran
- `updateLuaran(Request $request, LuaranPenelitian $luaran)` - PUT update
- `destroyLuaran(LuaranPenelitian $luaran)` - DELETE

### RabItemController
- `showRab($usulanId)` - GET daftar RAB items
- `storeRab(Request $request, UsulanPenelitian $usulan)` - POST buat RAB item
- `updateRab(Request $request, RabItem $rabItem)` - PUT update
- `destroyRab(RabItem $rabItem)` - DELETE

---

## 🛠️ ROUTES YANG PERLU DITAMBAH

```php
// Luaran Penelitian Routes
Route::get('/pengajuan/{usulan}/luaran', [LuaranPenelitianController::class, 'showLuaran']);
Route::post('/pengajuan/{usulan}/luaran', [LuaranPenelitianController::class, 'storeLuaran']);
Route::put('/pengajuan/luaran/{luaran}', [LuaranPenelitianController::class, 'updateLuaran']);
Route::delete('/pengajuan/luaran/{luaran}', [LuaranPenelitianController::class, 'destroyLuaran']);

// RAB Item Routes
Route::get('/pengajuan/{usulan}/rab', [RabItemController::class, 'showRab']);
Route::post('/pengajuan/{usulan}/rab', [RabItemController::class, 'storeRab']);
Route::put('/pengajuan/rab/{rabItem}', [RabItemController::class, 'updateRab']);
Route::delete('/pengajuan/rab/{rabItem}', [RabItemController::class, 'destroyRab']);
```

---

## 📋 SEEDING DATA SUGGESTIONS

### makro_riset Seeder
```
1. Kesehatan Masyarakat
2. Pertanian Berkelanjutan  
3. Teknologi Digital
4. Sosial Ekonomi
5. Energi Terbarukan
```

---

## 🔍 DATA PERSISTENCE FLOW

```
PAGE IDENTITAS-1 ✅ DONE
├─ usulan_penelitian ✅
├─ anggota_penelitian ✅
└─ anggota_non_dosen ✅

PAGE SUBSTANSI-2 🔄 NEEDS COMPLETION
├─ makro_riset [MASTER] ← CREATE TABLE
└─ luaran_penelitian [TRANSACTIONAL] ← CREATE TABLE

PAGE RAB-3 🔄 NEEDS COMPLETION
└─ rab_item [TRANSACTIONAL] ← CREATE TABLE
   └─ Auto-update usulan_penelitian.total_anggaran

PAGE TINJAUAN-4 📊 REVIEW ONLY
└─ Read dari semua tables di atas
```

---

## ⚡ IMPLEMENTATION PRIORITY

### URGENT (Do First)
1. Create `makro_riset` table + seeder
2. Create `luaran_penelitian` table
3. Create `rab_item` table
4. Add `prodi` column to `anggota_penelitian`

### HIGH (Next Phase)
5. Create Models + Relationships
6. Create Controllers with CRUD methods
7. Add Routes
8. Update Frontend Components

### MEDIUM (Polish)
9. Add validation rules
10. Add authorization checks
11. Add audit logging
12. Add soft deletes if needed

---

## 💡 NOTES

1. **RAB Total Auto-Calculate**: Gunakan mutator/event di RabItem model
2. **Cascade Delete**: Semua relasi harus `onDelete('cascade')` agar clean
3. **Authorization**: Pastikan user hanya bisa manage milik mereka sendiri
4. **Validation**: 
   - RAB total tidak boleh > Rp 50.000.000
   - Luaran minimal harus ada 1 per tahun
5. **JSON vs Tables**: Awalnya pakai JSON (simple), tapi better scalability pakai tables

---

## 📌 NEXT STEPS

Setelah database structure jelas:
1. Generate migration files
2. Create models
3. Create controllers  
4. Update routes
5. Update frontend components to use real API
6. Test end-to-end flow
