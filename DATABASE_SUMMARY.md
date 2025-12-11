# 📊 RINGKASAN DATABASE STRUCTURE

## Current State vs Needed State

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USULAN PENELITIAN WORKFLOW                       │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: IDENTITAS (page-identitas-1.tsx)
├─ usulan_penelitian ✅ READY
├─ anggota_penelitian ✅ READY  
└─ anggota_non_dosen ✅ READY

STEP 2: SUBSTANSI (page-substansi-2.tsx)
├─ makro_riset [TABLE] ❌ MISSING
└─ luaran_penelitian [TABLE] ❌ MISSING

STEP 3: RAB (page-rab-3.tsx)
└─ rab_item [TABLE] ❌ MISSING

STEP 4: TINJAUAN (page-tinjauan-4.tsx)
└─ READ-ONLY (semua data dari tables di atas)
```

---

## 🚨 TABLES YANG HARUS DIBUAT (3 New Tables)

### 1️⃣ makro_riset (Master Data)
```
Gunakan untuk: Dropdown "Kelompok Makro Riset"
Tabel struktur:
  - id (PK)
  - nama (string, unique)
  - deskripsi (text, nullable)
  - aktif (boolean)
  
Sample data:
  - Kesehatan Masyarakat
  - Pertanian Berkelanjutan
  - Teknologi Digital
```

### 2️⃣ luaran_penelitian (Transactional)
```
Gunakan untuk: Menyimpan target luaran penelitian
Relasi: N-to-1 dengan usulan_penelitian

Tabel struktur:
  - id (PK)
  - usulan_id (FK) ← usulan_penelitian.id
  - tahun (integer) → 1, 2, 3 (tahun keberapa)
  - kategori (string) → Artikel Jurnal, Prosiding, HKI, dll
  - deskripsi (text)
  - status (enum) → Rencana, Dalam Proses, Selesai
  - keterangan (text, nullable)
```

### 3️⃣ rab_item (Transactional)
```
Gunakan untuk: Menyimpan detail item RAB
Relasi: N-to-1 dengan usulan_penelitian

Tabel struktur:
  - id (PK)
  - usulan_id (FK) ← usulan_penelitian.id
  - tipe (enum) → 'bahan' OR 'pengumpulan_data'
  - kategori (string) → Bahan Habis Pakai, Peralatan, Honorarium, dll
  - item (string) → nama barang/jasa
  - satuan (string) → pcs, kg, jam, dll
  - volume (integer)
  - harga_satuan (bigInteger) → dalam Rupiah
  - total (bigInteger) → AUTO-COMPUTE: volume × harga_satuan
  - keterangan (text, nullable)

PENTING: total auto-calculated saat create/update!
```

---

## 🔄 CHANGES TO EXISTING TABLE

### Tambah ke anggota_penelitian:
```
OLD:
  - id, usulan_id, nuptik, nama, peran, institusi, tugas, status_persetujuan

NEW (tambah 1 kolom):
  + prodi (string, 255, nullable)
  
Alasan: page-tinjauan-4.tsx butuh kolom "Prodi"
```

---

## 🛠️ IMPLEMENTATION STEPS

### Step 1: Generate Migration Files
```bash
php artisan make:migration create_makro_riset_table
php artisan make:migration create_luaran_penelitian_table
php artisan make:migration create_rab_item_table
php artisan make:migration add_prodi_to_anggota_penelitian_table
```

### Step 2: Write Migration Code
```php
# migrations/2025_12_09_XXXXXX_create_makro_riset_table.php
Schema::create('makro_riset', function (Blueprint $table) {
    $table->id();
    $table->string('nama', 255)->unique();
    $table->text('deskripsi')->nullable();
    $table->boolean('aktif')->default(true);
    $table->timestamps();
});

# migrations/2025_12_09_XXXXXX_create_luaran_penelitian_table.php
Schema::create('luaran_penelitian', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
    $table->integer('tahun');
    $table->string('kategori', 100);
    $table->text('deskripsi');
    $table->enum('status', ['Rencana', 'Dalam Proses', 'Selesai'])->default('Rencana');
    $table->text('keterangan')->nullable();
    $table->timestamps();
});

# migrations/2025_12_09_XXXXXX_create_rab_item_table.php
Schema::create('rab_item', function (Blueprint $table) {
    $table->id();
    $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
    $table->enum('tipe', ['bahan', 'pengumpulan_data']);
    $table->string('kategori', 100);
    $table->string('item', 255);
    $table->string('satuan', 50);
    $table->integer('volume');
    $table->bigInteger('harga_satuan');
    $table->bigInteger('total');
    $table->text('keterangan')->nullable();
    $table->timestamps();
});

# migrations/2025_12_09_XXXXXX_add_prodi_to_anggota_penelitian_table.php
Schema::table('anggota_penelitian', function (Blueprint $table) {
    $table->string('prodi', 255)->nullable()->after('institusi');
});
```

### Step 3: Create Models
```php
# app/Models/MakroRiset.php
class MakroRiset extends Model
{
    protected $table = 'makro_riset';
    protected $fillable = ['nama', 'deskripsi', 'aktif'];
}

# app/Models/LuaranPenelitian.php
class LuaranPenelitian extends Model
{
    protected $fillable = ['usulan_id', 'tahun', 'kategori', 'deskripsi', 'status', 'keterangan'];
    public function usulan() { return $this->belongsTo(UsulanPenelitian::class); }
}

# app/Models/RabItem.php
class RabItem extends Model
{
    protected $table = 'rab_item';
    protected $fillable = ['usulan_id', 'tipe', 'kategori', 'item', 'satuan', 'volume', 'harga_satuan', 'total', 'keterangan'];
    protected $casts = ['volume' => 'integer', 'harga_satuan' => 'integer', 'total' => 'integer'];
    public function usulan() { return $this->belongsTo(UsulanPenelitian::class); }
}
```

### Step 4: Add Relationships to UsulanPenelitian
```php
public function luaranList() { return $this->hasMany(LuaranPenelitian::class); }
public function rabItems() { return $this->hasMany(RabItem::class); }
```

### Step 5: Create Controllers
```php
# LuaranPenelitianController
- showLuaran($usulanId)
- storeLuaran(Request $request, UsulanPenelitian $usulan)
- updateLuaran(Request $request, LuaranPenelitian $luaran)
- destroyLuaran(LuaranPenelitian $luaran)

# RabItemController  
- showRab($usulanId)
- storeRab(Request $request, UsulanPenelitian $usulan)
- updateRab(Request $request, RabItem $rabItem)
- destroyRab(RabItem $rabItem)
```

### Step 6: Add Routes
```php
# routes/web.php (dalam pengajuan group)
Route::get('/pengajuan/{usulan}/luaran', [LuaranPenelitianController::class, 'showLuaran']);
Route::post('/pengajuan/{usulan}/luaran', [LuaranPenelitianController::class, 'storeLuaran']);
Route::put('/pengajuan/luaran/{luaran}', [LuaranPenelitianController::class, 'updateLuaran']);
Route::delete('/pengajuan/luaran/{luaran}', [LuaranPenelitianController::class, 'destroyLuaran']);

Route::get('/pengajuan/{usulan}/rab', [RabItemController::class, 'showRab']);
Route::post('/pengajuan/{usulan}/rab', [RabItemController::class, 'storeRab']);
Route::put('/pengajuan/rab/{rabItem}', [RabItemController::class, 'updateRab']);
Route::delete('/pengajuan/rab/{rabItem}', [RabItemController::class, 'destroyRab']);
```

### Step 7: Update Frontend Components
```jsx
// page-substansi-2.tsx
- Fetch makroRisetList dari /pengajuan/master/makro-riset
- Fetch luaranList dari /pengajuan/{usulanId}/luaran
- Implement CRUD untuk luaran

// page-rab-3.tsx
- Fetch rabItems dari /pengajuan/{usulanId}/rab
- Implement CRUD untuk rab items
- Remove local state, gunakan backend

// page-tinjauan-4.tsx
- Display semua data dari tables (read-only)
```

### Step 8: Run Migration & Seed
```bash
php artisan migrate
php artisan make:seeder MakroRisetSeeder
php artisan db:seed --class=MakroRisetSeeder
```

---

## 📋 MASTER DATA (makro_riset)

Buat seeder dengan sample data:
```php
DB::table('makro_riset')->insert([
    ['nama' => 'Kesehatan Masyarakat', 'deskripsi' => '...', 'aktif' => true],
    ['nama' => 'Pertanian Berkelanjutan', 'deskripsi' => '...', 'aktif' => true],
    ['nama' => 'Teknologi Digital', 'deskripsi' => '...', 'aktif' => true],
    ['nama' => 'Sosial Ekonomi', 'deskripsi' => '...', 'aktif' => true],
    ['nama' => 'Energi Terbarukan', 'deskripsi' => '...', 'aktif' => true],
]);
```

---

## ✅ VALIDATION RULES

### LuaranPenelitian
```php
'tahun' => 'required|integer|min:1|max:5',
'kategori' => 'required|string|max:100',
'deskripsi' => 'required|string|min:10',
'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
```

### RabItem
```php
'tipe' => 'required|in:bahan,pengumpulan_data',
'kategori' => 'required|string|max:100',
'item' => 'required|string|max:255',
'satuan' => 'required|string|max:50',
'volume' => 'required|integer|min:1',
'harga_satuan' => 'required|integer|min:0',
```

---

## 🔐 AUTHORIZATION

Semua endpoints harus check:
```php
if ($usulan->user_id !== Auth::id()) {
    abort(403);
}
```

---

## 📌 SUMMARY

**Total NEW Tables**: 3
- makro_riset
- luaran_penelitian  
- rab_item

**Total UPDATED Tables**: 1
- anggota_penelitian (add `prodi`)

**Total NEW Models**: 3
**Total NEW Controllers**: 2
**Total NEW Routes**: 8
**Total NEW Seeders**: 1

**Estimated Implementation Time**: 2-3 jam
