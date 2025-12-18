<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingAppController;
use App\Http\Controllers\MediaFolderController;
use App\Http\Controllers\UsulanPenelitianController;
use App\Http\Controllers\AnggotaApprovalController;
use App\Http\Controllers\AnggotaNonDosenController;
use App\Http\Controllers\AnggotaPenelitianController;
use App\Http\Controllers\LuaranPenelitianController;
use App\Http\Controllers\RabItemController;
use App\Models\Berita;

// Group untuk authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Routes Pengajuan Usulan
    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        
        // Index - Tampilkan daftar usulan
        Route::get('/', [UsulanPenelitianController::class, 'index'])
            ->name('index');
        
        // Store Draft - Simpan usulan baru sebagai draft
        // ✅ FIXED
        Route::post('/draft', [UsulanPenelitianController::class, 'storeDraft'])
        ->name('draft');

            // Edit Usulan
        Route::get('/{usulan}/edit', [UsulanPenelitianController::class, 'edit'])
        ->name('edit');
        
        // Update - Update usulan per step
        Route::put('/{usulan}', [UsulanPenelitianController::class, 'update'])
            ->name('update');
        
        // Upload Substansi
        Route::post('/{usulan}/substansi', [UsulanPenelitianController::class, 'uploadSubstansi'])
            ->name('substansi');
        
        // Submit - Submit usulan final
        Route::post('/{usulan}/submit', [UsulanPenelitianController::class, 'submit'])
            ->name('submit');
        
        // Delete - Hapus usulan
        Route::delete('/{usulan}', [UsulanPenelitianController::class, 'destroy'])
            ->name('destroy');

        // Anggota Fetch Routes (GET) POST
        Route::get('/{usulan}/anggota-dosen', [UsulanPenelitianController::class, 'getAnggotaDosen'])
            ->name('anggota-dosen.get');
            Route::post(
            '/{usulan}/anggota-penelitian',
            [AnggotaPenelitianController::class, 'store']
        )->name('anggota-dosen.store'); 
        Route::get('/{usulan}/anggota-non-dosen', [UsulanPenelitianController::class, 'getAnggotaNonDosen'])
            ->name('anggota-non-dosen.get');
        Route::post(
            '/{usulan}/anggota-non-dosen',
            [AnggotaNonDosenController::class, 'store']
        )->name('anggota-non-dosen.store'); 

        // Anggota Approval Routes
        Route::post('/{usulan}/anggota-dosen/{anggota}/approve', [AnggotaApprovalController::class, 'approveDosen'])
            ->name('anggota-dosen.approve');
        Route::post('/{usulan}/anggota-dosen/{anggota}/reject', [AnggotaApprovalController::class, 'rejectDosen'])
            ->name('anggota-dosen.reject');
        Route::post('/{usulan}/anggota-non-dosen/{anggota}/approve', [AnggotaApprovalController::class, 'approveNonDosen'])
            ->name('anggota-non-dosen.approve');
        Route::post('/{usulan}/anggota-non-dosen/{anggota}/reject', [AnggotaApprovalController::class, 'rejectNonDosen'])
            ->name('anggota-non-dosen.reject');

            // ✅ TAMBAHKAN: Get master data for steps
        Route::get('/{usulan}/step/{step}', [UsulanPenelitianController::class, 'showStep'])
            ->name('step.show');
    
    // ============================================
        // LUARAN PENELITIAN ROUTES (Step 2)
        // ============================================
        
        // GET: Fetch semua luaran untuk usulan tertentu
        Route::get('/{usulan}/luaran', [LuaranPenelitianController::class, 'showLuaran'])
            ->name('luaran.show');
        
        // POST: Tambah luaran baru
        Route::post('/{usulan}/luaran', [LuaranPenelitianController::class, 'storeLuaran'])
            ->name('luaran.store');
        
        // PUT: Update luaran existing
        Route::put('/luaran/{luaran}', [LuaranPenelitianController::class, 'updateLuaran'])
            ->name('luaran.update');
        
        // DELETE: Hapus luaran
        Route::delete('/luaran/{luaran}', [LuaranPenelitianController::class, 'destroyLuaran'])
            ->name('luaran.destroy');

        // ============================================
        // RAB ITEM ROUTES (Step 3)
        // ============================================
        
        // GET: Fetch semua RAB items untuk usulan tertentu
        Route::get('/{usulan}/rab', [RabItemController::class, 'showRab'])
            ->name('rab.show');
        
        // POST: Tambah RAB item baru
        Route::post('/{usulan}/rab', [RabItemController::class, 'storeRab'])
            ->name('rab.store');
        
        // PUT: Update RAB item existing
        Route::put('/rab/{rabItem}', [RabItemController::class, 'updateRab'])
            ->name('rab.update');
        
        // DELETE: Hapus RAB item
        Route::delete('/rab/{rabItem}', [RabItemController::class, 'destroyRab'])
            ->name('rab.destroy');
    });
});




// ==========================================================
// RUTE UMUM (NON-AUTH)
// ==========================================================

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/berita', function () {
    $berita = Berita::all();
    return Inertia::render('berita/Index', [
        'berita' => $berita
    ]);
});

// Otentikasi dihandle di routes/auth.php (already included at bottom)

// ==========================================================
// RUTE DASHBOARD ROLE-SPECIFIC
// ==========================================================

Route::middleware('auth')->group(function () {
    
    // Dashboard Admin 
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/Dashboard');
    })->middleware('can:dashboard-admin-view')->name('admin.dashboard');

    // Dashboard Admin LPPM
    Route::get('/lppm/dashboard', function () {
        return Inertia::render('lppm/Dashboard');
    })->middleware('can:dashboard-lppm-view')->name('lppm.dashboard');

    // Dashboard Reviewer
    Route::get('/reviewer/dashboard', function () {
        return Inertia::render('reviewer/Dashboard');
    })->middleware('can:dashboard-reviewer-view')->name('reviewer.dashboard');

    // Dashboard Kaprodi
    Route::get('/kaprodi/dashboard', function () {
        return Inertia::render('kaprodi/Dashboard');
    })->middleware('can:dashboard-kaprodi-view')->name('kaprodi.dashboard');

    // Dashboard Dosen
    Route::get('/dosen/dashboard', function () {
        return Inertia::render('dosen/Dashboard');
    })->middleware('can:dashboard-dosen-view')->name('dosen.dashboard');
});


// ==========================================================
// RUTE BERAT DENGAN OTENTIKASI DAN IZIN SPESIFIK
// ==========================================================

// Middleware 'menu.permission' digunakan untuk melindungi rute yang ada di menu
Route::middleware(['auth', 'menu.permission'])->group(function () {
    
    // === AKSES & PENGGUNA (Hanya Admin) ===
    Route::resource('roles', RoleController::class)->middleware('can:roles-view');
    Route::resource('permissions', PermissionController::class)->middleware('can:permission-view');
    
    // Users harus dilindungi oleh users-view, dan impersonate oleh users-impersonate
    Route::resource('users', UserController::class)->middleware('can:users-view');
    Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password')->middleware('can:users-edit');
    
    // RUTE IMpersonate (Ganti User) - Penting agar Admin bisa mengakses semua peran
    Route::post('/users/{user}/impersonate', [UserController::class, 'impersonate'])->name('users.impersonate')->middleware('can:users-impersonate');
    Route::post('/users/stop-impersonate', [UserController::class, 'stopImpersonate'])->name('users.stop-impersonate');


    // === MENU & PENGATURAN ===
    Route::resource('menus', MenuController::class)->middleware('can:menu-view');
    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder')->middleware('can:menu-reorder'); // Menggunakan 'menu-reorder' atau 'menu-edit'

    Route::get('/settingsapp', [SettingAppController::class, 'edit'])->name('setting.edit')->middleware('can:app-settings-view');
    Route::post('/settingsapp', [SettingAppController::class, 'update'])->name('setting.update')->middleware('can:app-settings-edit');

    
    // === UTILITIES & LOGS ===
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index')->middleware('can:log-view');
    
    // Backup
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index')->middleware('can:backup-view');
    Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run')->middleware('can:backup-run');
    Route::get('/backup/download/{file}', [BackupController::class, 'download'])->name('backup.download')->middleware('can:backup-download');
    Route::delete('/backup/delete/{file}', [BackupController::class, 'delete'])->name('backup.delete')->middleware('can:backup-delete');
    
    // File Manager
    Route::get('/files', [UserFileController::class, 'index'])->name('files.index')->middleware('can:filemanager-view');
    Route::post('/files', [UserFileController::class, 'store'])->name('files.store')->middleware('can:filemanager-create');
    Route::delete('/files/{id}', [UserFileController::class, 'destroy'])->name('files.destroy')->middleware('can:filemanager-delete');
    Route::resource('media', MediaFolderController::class)->middleware('can:media-view'); // Asumsi media-view/media-create/etc.

    
    // === PENGAJUAN ===
    // Pengajuan Usulan (Misalnya: dilihat oleh Dosen, Kaprodi, LPPM)
    Route::get('/pengajuan/page-usulan', function () {
        return Inertia::render('pengajuan/steps/page-usulan');
    })->name('pengajuan.usulan')->middleware('can:pengajuan-usulan-view');

    // Pengajuan Form (Misalnya: Hanya Dosen yang boleh mengakses form)
    Route::get('/pengajuan/Index', function () {
        return Inertia::render('pengajuan/Index');
    })->name('pengajuan.index')->middleware('can:pengajuan-form-view');

    // API Routes for Master Data Search
    Route::get('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::get('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);
    Route::post('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::post('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';