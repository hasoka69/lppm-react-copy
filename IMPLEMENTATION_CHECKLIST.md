# 🚀 IMPLEMENTATION CHECKLIST

Panduan step-by-step untuk implement database design.

---

## Phase 1: Database Setup (⏱️ 30 menit)

### 1.1 Create Migrations
```bash
# Terminal
php artisan make:migration create_makro_riset_table
php artisan make:migration create_luaran_penelitian_table
php artisan make:migration create_rab_item_table
php artisan make:migration add_prodi_to_anggota_penelitian_table
```

**Check**: 4 file migration baru di `database/migrations/`

---

### 1.2 Write Migration: makro_riset

**File**: `database/migrations/2025_12_09_XXXXXX_create_makro_riset_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('makro_riset', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 255)->unique();
            $table->text('deskripsi')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('makro_riset');
    }
};
```

---

### 1.3 Write Migration: luaran_penelitian

**File**: `database/migrations/2025_12_09_XXXXXX_create_luaran_penelitian_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('luaran_penelitian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')
                ->constrained('usulan_penelitian')
                ->onDelete('cascade');
            $table->integer('tahun'); // Tahun ke-1, 2, 3
            $table->string('kategori', 100); // Jurnal, Prosiding, HKI, dll
            $table->text('deskripsi');
            $table->enum('status', ['Rencana', 'Dalam Proses', 'Selesai'])->default('Rencana');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->index('usulan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('luaran_penelitian');
    }
};
```

---

### 1.4 Write Migration: rab_item

**File**: `database/migrations/2025_12_09_XXXXXX_create_rab_item_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rab_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')
                ->constrained('usulan_penelitian')
                ->onDelete('cascade');
            $table->enum('tipe', ['bahan', 'pengumpulan_data']);
            $table->string('kategori', 100); // Bahan Habis Pakai, Peralatan, Honorarium, dll
            $table->string('item', 255); // Nama barang/jasa
            $table->string('satuan', 50); // pcs, kg, jam, hari, dll
            $table->integer('volume');
            $table->bigInteger('harga_satuan'); // Dalam Rupiah
            $table->bigInteger('total'); // AUTO: volume * harga_satuan
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->index('usulan_id');
            $table->index('tipe');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rab_item');
    }
};
```

---

### 1.5 Write Migration: Add prodi to anggota_penelitian

**File**: `database/migrations/2025_12_09_XXXXXX_add_prodi_to_anggota_penelitian_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->string('prodi', 255)->nullable()->after('institusi');
        });
    }

    public function down(): void
    {
        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->dropColumn('prodi');
        });
    }
};
```

---

### 1.6 Run Migrations

```bash
php artisan migrate
```

**Expected Output**:
```
Migrating: 2025_12_09_XXXXXX_create_makro_riset_table
  Created table makro_riset
Migrating: 2025_12_09_XXXXXX_create_luaran_penelitian_table
  Created table luaran_penelitian
Migrating: 2025_12_09_XXXXXX_create_rab_item_table
  Created table rab_item
Migrating: 2025_12_09_XXXXXX_add_prodi_to_anggota_penelitian_table
  Added column prodi to anggota_penelitian
```

---

## Phase 2: Models (⏱️ 20 menit)

### 2.1 Create Model: MakroRiset

**File**: `app/Models/MakroRiset.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MakroRiset extends Model
{
    protected $table = 'makro_riset';

    protected $fillable = [
        'nama',
        'deskripsi',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];
}
```

---

### 2.2 Create Model: LuaranPenelitian

**File**: `app/Models/LuaranPenelitian.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuaranPenelitian extends Model
{
    protected $table = 'luaran_penelitian';

    protected $fillable = [
        'usulan_id',
        'tahun',
        'kategori',
        'deskripsi',
        'status',
        'keterangan',
    ];

    /**
     * Relasi ke Usulan Penelitian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
    }
}
```

---

### 2.3 Create Model: RabItem

**File**: `app/Models/RabItem.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RabItem extends Model
{
    protected $table = 'rab_item';

    protected $fillable = [
        'usulan_id',
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
     * Relasi ke Usulan Penelitian
     */
    public function usulan(): BelongsTo
    {
        return $this->belongsTo(UsulanPenelitian::class, 'usulan_id');
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
```

---

### 2.4 Update Model: UsulanPenelitian

**File**: `app/Models/UsulanPenelitian.php` (ADD these relationships)

```php
// Tambah method ini setelah method anggotaNonDosen():

/**
 * Relasi ke Luaran Penelitian
 */
public function luaranList()
{
    return $this->hasMany(LuaranPenelitian::class, 'usulan_id');
}

/**
 * Relasi ke RAB Item
 */
public function rabItems()
{
    return $this->hasMany(RabItem::class, 'usulan_id');
}

/**
 * Helper: Hitung total anggaran dari RAB items
 */
public function getTotalAnggaran()
{
    return $this->rabItems()->sum('total');
}
```

---

## Phase 3: Controllers (⏱️ 45 menit)

### 3.1 Create Controller: LuaranPenelitianController

**File**: `app/Http/Controllers/LuaranPenelitianController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\LuaranPenelitian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LuaranPenelitianController extends Controller
{
    /**
     * Tampilkan daftar luaran penelitian
     */
    public function showLuaran($usulanId)
    {
        $usulan = UsulanPenelitian::where('user_id', Auth::id())->findOrFail($usulanId);

        $luaranList = $usulan->luaranList()->get();

        return response()->json([
            'success' => true,
            'data' => $luaranList,
        ]);
    }

    /**
     * Tambah luaran penelitian
     */
    public function storeLuaran(Request $request, UsulanPenelitian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tahun' => 'required|integer|min:1|max:5',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'required|string|min:10',
            'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $luaran = LuaranPenelitian::create([
                'usulan_id' => $usulan->id,
                ...$validated,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Luaran berhasil ditambahkan!',
                'data' => $luaran,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan luaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update luaran penelitian
     */
    public function updateLuaran(Request $request, LuaranPenelitian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tahun' => 'sometimes|required|integer|min:1|max:5',
            'kategori' => 'sometimes|required|string|max:100',
            'deskripsi' => 'sometimes|required|string|min:10',
            'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $luaran->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Luaran berhasil diperbarui!',
                'data' => $luaran,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui luaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus luaran penelitian
     */
    public function destroyLuaran(LuaranPenelitian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            $luaran->delete();

            return response()->json([
                'success' => true,
                'message' => 'Luaran berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus luaran: ' . $e->getMessage(),
            ], 500);
        }
    }
}
```

---

### 3.2 Create Controller: RabItemController

**File**: `app/Http/Controllers/RabItemController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\RabItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RabItemController extends Controller
{
    /**
     * Tampilkan daftar RAB item
     */
    public function showRab($usulanId)
    {
        $usulan = UsulanPenelitian::where('user_id', Auth::id())->findOrFail($usulanId);

        $rabItems = $usulan->rabItems()->get();

        return response()->json([
            'success' => true,
            'data' => $rabItems,
            'total_anggaran' => $usulan->getTotalAnggaran(),
        ]);
    }

    /**
     * Tambah RAB item
     */
    public function storeRab(Request $request, UsulanPenelitian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tipe' => 'required|in:bahan,pengumpulan_data',
            'kategori' => 'required|string|max:100',
            'item' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
            'volume' => 'required|integer|min:1',
            'harga_satuan' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem = RabItem::create([
                'usulan_id' => $usulan->id,
                ...$validated,
            ]);

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil ditambahkan!',
                'data' => $rabItem,
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update RAB item
     */
    public function updateRab(Request $request, RabItem $rabItem)
    {
        $usulan = $rabItem->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tipe' => 'sometimes|required|in:bahan,pengumpulan_data',
            'kategori' => 'sometimes|required|string|max:100',
            'item' => 'sometimes|required|string|max:255',
            'satuan' => 'sometimes|required|string|max:50',
            'volume' => 'sometimes|required|integer|min:1',
            'harga_satuan' => 'sometimes|required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem->update($validated);

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil diperbarui!',
                'data' => $rabItem,
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus RAB item
     */
    public function destroyRab(RabItem $rabItem)
    {
        $usulan = $rabItem->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            DB::beginTransaction();

            $rabItem->delete();

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil dihapus!',
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }
}
```

---

## Phase 4: Routes (⏱️ 10 menit)

### 4.1 Update Routes

**File**: `routes/web.php` (Add inside the pengajuan route group)

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

// Master Data Routes (optional, for dropdowns)
Route::get('/pengajuan/master/makro-riset', [UsulanPenelitianController::class, 'getMakroRiset']);
```

---

## Phase 5: Seeders (⏱️ 15 menit)

### 5.1 Create Seeder: MakroRisetSeeder

```bash
php artisan make:seeder MakroRisetSeeder
```

**File**: `database/seeders/MakroRisetSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MakroRisetSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('makro_riset')->insert([
            [
                'nama' => 'Kesehatan Masyarakat',
                'deskripsi' => 'Penelitian fokus pada kesehatan dan kesejahteraan masyarakat',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Pertanian Berkelanjutan',
                'deskripsi' => 'Penelitian tentang pertanian yang ramah lingkungan dan berkelanjutan',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Teknologi Digital',
                'deskripsi' => 'Penelitian terkait teknologi informasi dan digital transformation',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Sosial Ekonomi',
                'deskripsi' => 'Penelitian tentang aspek sosial dan ekonomi masyarakat',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Energi Terbarukan',
                'deskripsi' => 'Penelitian tentang sumber energi terbarukan dan clean energy',
                'aktif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
```

---

### 5.2 Update DatabaseSeeder

**File**: `database/seeders/DatabaseSeeder.php`

```php
// Add this line in the run() method:
$this->call([
    MakroRisetSeeder::class,  // ← Add this line
    MasterPenelitianSeeder::class,
    BeritaSeeder::class,
    RolePermissionSeeder::class,
    MenuSeeder::class,
]);
```

---

### 5.3 Run Seeder

```bash
php artisan db:seed --class=MakroRisetSeeder
```

---

## Phase 6: Update Frontend (⏱️ Variable)

### 6.1 Update page-substansi-2.tsx

```jsx
// Import at top:
import { useEffect } from 'react';
import axios from 'axios';

// Add this inside component:
useEffect(() => {
    const fetchData = async () => {
        try {
            const makroRes = await axios.get('/pengajuan/master/makro-riset');
            const luaranRes = await axios.get(`/pengajuan/${usulanId}/luaran`);
            
            // Update state with fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    fetchData();
}, [usulanId]);
```

---

### 6.2 Update page-rab-3.tsx

Similar approach - fetch from `/pengajuan/{usulanId}/rab` endpoint instead of local state

---

### 6.3 Update page-tinjauan-4.tsx

Fetch all data from endpoints and display in read-only mode

---

## Testing Checklist

- [ ] All 4 migrations run successfully
- [ ] Database tables created with correct columns
- [ ] Models created and relationships work
- [ ] Controllers can handle CRUD operations
- [ ] Routes are accessible
- [ ] Master data (makro_riset) seeded successfully
- [ ] Frontend can fetch and display data
- [ ] Authorization checks working (users can only access own data)
- [ ] RAB total auto-calculates correctly
- [ ] Total anggaran updates when RAB items change

---

## Command Quick Reference

```bash
# Phase 1
php artisan make:migration create_makro_riset_table
php artisan make:migration create_luaran_penelitian_table
php artisan make:migration create_rab_item_table
php artisan make:migration add_prodi_to_anggota_penelitian_table
php artisan migrate

# Phase 3
php artisan make:controller LuaranPenelitianController
php artisan make:controller RabItemController

# Phase 5
php artisan make:seeder MakroRisetSeeder
php artisan db:seed --class=MakroRisetSeeder

# Full reset & seed
php artisan migrate:fresh --seed
```

---

**Total Implementation Time**: ~2-3 hours
