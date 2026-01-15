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
use App\Http\Controllers\UsulanPengabdianController;
use App\Http\Controllers\RabItemPengabdianController;

// Group untuk authenticated users
Route::middleware(['auth', 'verified'])->group(function () {

    // Routes Dosen Penelitian (Ex-Pengajuan)
    Route::prefix('dosen/penelitian')->name('dosen.penelitian.')->group(function () {

        // Index
        Route::get('/', [UsulanPenelitianController::class, 'index'])->name('index');

        // Fix for manual entry
        Route::get('/Index', function () {
            return redirect()->route('dosen.penelitian.index');
        });

        Route::post('/draft', [UsulanPenelitianController::class, 'storeDraft'])->name('draft');
        Route::get('/{usulan}/edit', [UsulanPenelitianController::class, 'edit'])->name('edit');
        Route::put('/{usulan}', [UsulanPenelitianController::class, 'update'])->name('update');
        Route::post('/{usulan}/substansi', [UsulanPenelitianController::class, 'uploadSubstansi'])->name('substansi');
        Route::post('/{usulan}/submit', [UsulanPenelitianController::class, 'submit'])->name('submit');
        Route::delete('/{usulan}', [UsulanPenelitianController::class, 'destroy'])->name('destroy');

        // Anggota
        Route::get('/{usulan}/anggota-dosen', [UsulanPenelitianController::class, 'getAnggotaDosen'])->name('anggota-dosen.get');
        Route::post('/{usulan}/anggota-penelitian', [AnggotaPenelitianController::class, 'store'])->name('anggota-dosen.store');
        Route::get('/{usulan}/anggota-non-dosen', [UsulanPenelitianController::class, 'getAnggotaNonDosen'])->name('anggota-non-dosen.get');
        Route::post('/{usulan}/anggota-non-dosen', [AnggotaNonDosenController::class, 'store'])->name('anggota-non-dosen.store');

        // Approval Anggota (Existing)
        Route::post('/{usulan}/anggota-dosen/{anggota}/approve', [AnggotaApprovalController::class, 'approveDosen'])->name('anggota-dosen.approve');
        Route::post('/{usulan}/anggota-dosen/{anggota}/reject', [AnggotaApprovalController::class, 'rejectDosen'])->name('anggota-dosen.reject');
        Route::post('/{usulan}/anggota-non-dosen/{anggota}/approve', [AnggotaApprovalController::class, 'approveNonDosen'])->name('anggota-non-dosen.approve');
        Route::post('/{usulan}/anggota-non-dosen/{anggota}/reject', [AnggotaApprovalController::class, 'rejectNonDosen'])->name('anggota-non-dosen.reject');

        // Step Show
        Route::get('/{usulan}/step/{step}', [UsulanPenelitianController::class, 'showStep'])->name('step.show');

        // Luaran (Step 2)
        Route::get('/{usulan}/luaran', [LuaranPenelitianController::class, 'showLuaran'])->name('luaran.show');
        Route::post('/{usulan}/luaran', [LuaranPenelitianController::class, 'storeLuaran'])->name('luaran.store');
        Route::put('/luaran/{luaran}', [LuaranPenelitianController::class, 'updateLuaran'])->name('luaran.update');
        Route::delete('/luaran/{luaran}', [LuaranPenelitianController::class, 'destroyLuaran'])->name('luaran.destroy');

        // RAB (Step 3) - Using RabItemController (Original)
        Route::get('/{usulan}/rab', [RabItemController::class, 'showRab'])->name('rab.show');
        Route::post('/{usulan}/rab', [RabItemController::class, 'storeRab'])->name('rab.store');
        Route::put('/rab/{rabItem}', [RabItemController::class, 'updateRab'])->name('rab.update');
        Route::delete('/rab/{rabItem}', [RabItemController::class, 'destroyRab'])->name('rab.destroy');
    });

    // Routes Dosen Pengabdian [NEW]
    Route::prefix('dosen/pengabdian')->name('dosen.pengabdian.')->group(function () {

        // Index
        Route::get('/', [UsulanPengabdianController::class, 'index'])->name('index');
        Route::get('/Index', function () {
            return redirect()->route('dosen.pengabdian.index');
        });

        Route::post('/draft', [UsulanPengabdianController::class, 'storeDraft'])->name('draft');
        Route::get('/{usulan}/edit', [UsulanPengabdianController::class, 'edit'])->name('edit'); // Need impl in Controller
        Route::put('/{usulan}', [UsulanPengabdianController::class, 'update'])->name('update');
        Route::post('/{usulan}/substansi', [UsulanPengabdianController::class, 'uploadSubstansi'])->name('substansi');
        Route::post('/{usulan}/submit', [UsulanPengabdianController::class, 'submit'])->name('submit');
        Route::delete('/{usulan}', [UsulanPengabdianController::class, 'destroy'])->name('destroy');

        // Anggota READ (Implemented in UsulanPengabdianController)
        Route::get('/{usulan}/anggota-dosen', [UsulanPengabdianController::class, 'getAnggotaDosen'])->name('anggota-dosen.get');
        Route::get('/{usulan}/anggota-non-dosen', [UsulanPengabdianController::class, 'getAnggotaNonDosen'])->name('anggota-non-dosen.get');

        // Anggota WRITE (TODO: Need specific controller or reuse if polymorphic)
        // For now commented out or reuse if adapted
        // Route::post('/{usulan}/anggota-penelitian', [AnggotaPengabdianController::class, 'store'])->name('anggota-dosen.store'); 

        // Step Show
        Route::get('/{usulan}/step/{step}', [UsulanPengabdianController::class, 'showStep'])->name('step.show');

        // RAB (Step 3) - Using RabItemPengabdianController
        Route::get('/{usulan}/rab', [RabItemPengabdianController::class, 'showRab'])->name('rab.show');
        Route::post('/{usulan}/rab', [RabItemPengabdianController::class, 'storeRab'])->name('rab.store');
        Route::put('/rab/{rabItem}', [RabItemPengabdianController::class, 'updateRab'])->name('rab.update');
        Route::delete('/rab/{rabItem}', [RabItemPengabdianController::class, 'destroyRab'])->name('rab.destroy');
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
    Route::get('/admin/dashboard', [\App\Http\Controllers\DashboardController::class, 'admin'])
        ->middleware('can:dashboard-admin-view')->name('admin.dashboard');

    // Dashboard Admin LPPM
    Route::get('/lppm/dashboard', function () {
        return Inertia::render('lppm/Dashboard');
    })->middleware('can:dashboard-lppm-view')->name('lppm.dashboard');

    // Dashboard Reviewer & Routes
    Route::middleware('can:dashboard-reviewer-view')->prefix('reviewer')->name('reviewer.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('reviewer/Dashboard');
        })->name('dashboard');

        Route::get('/usulan', [\App\Http\Controllers\ReviewerController::class, 'index'])->name('usulan.index');
        Route::get('/penilaian', [\App\Http\Controllers\ReviewerController::class, 'history'])->name('penilaian.index');
        Route::get('/review/{id}', [\App\Http\Controllers\ReviewerController::class, 'show'])->name('usulan.show');
        Route::post('/review/{id}', [\App\Http\Controllers\ReviewerController::class, 'storeReview'])->name('usulan.post_review');
    });

    // Dashboard Kaprodi & Routes
    Route::middleware('can:dashboard-kaprodi-view')->prefix('kaprodi')->name('kaprodi.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\KaprodiController::class, 'dashboard'])->name('dashboard');
        Route::get('/usulan', [\App\Http\Controllers\KaprodiController::class, 'index'])->name('usulan.index');
        Route::get('/riwayat-review', [\App\Http\Controllers\KaprodiController::class, 'history'])->name('riwayat');
        Route::get('/review/{id}', [\App\Http\Controllers\KaprodiController::class, 'show'])->name('usulan.show');
        Route::post('/review/{id}', [\App\Http\Controllers\KaprodiController::class, 'storeReview'])->name('usulan.review');
    });

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
    // (Routes ini sudah ditangani di grup 'pengajuan' diatas dengan Controller)

    // API Routes for Master Data Search
    Route::get('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::get('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);
    Route::post('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::post('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';