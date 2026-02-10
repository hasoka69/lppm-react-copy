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
use App\Http\Controllers\AnggotaPengabdianController;
use App\Http\Controllers\AnggotaNonDosenPengabdianController;

// Group untuk authenticated users
Route::middleware(['auth', 'verified'])->group(function () {

    // Generic Dashboard Redirect
    // Generic Dashboard Redirect
    Route::get('/dashboard', function () {
        $user = auth()->user();
        // If has multiple roles, redirect to selection
        if ($user->getRoleNames()->count() > 1) {
            return redirect()->route('role.selection');
        }

        if ($user->hasRole('Admin') || $user->hasRole('super-admin')) {
            return redirect('/admin/dashboard');
        } elseif ($user->hasRole('Admin LPPM')) {
            return redirect('/lppm/dashboard');
        } elseif ($user->hasRole('Reviewer')) {
            return redirect('/reviewer/dashboard');
        } elseif ($user->hasRole('Kaprodi')) {
            return redirect('/kaprodi/dashboard');
        } elseif ($user->hasRole('Dosen')) {
            return redirect('/dosen/dashboard');
        }
        return redirect('/');
    })->name('dashboard');

    // Role Selection Route
    Route::get('/select-role', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'promptRole'])->name('role.selection');

    // Profile Route
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update_data');
    Route::post('/profile/photo', [\App\Http\Controllers\ProfileController::class, 'updatePhoto'])->name('profile.photo.update');

    // Routes Dosen Penelitian (Ex-Pengajuan)
    Route::prefix('dosen/penelitian')
        ->name('dosen.penelitian.')
        ->middleware('can:dashboard-dosen-view')
        ->group(function () {

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
            Route::get('/perbaikan', [UsulanPenelitianController::class, 'perbaikan'])->name('perbaikan');

            // Anggota
            Route::get('/{usulan}/anggota-dosen', [UsulanPenelitianController::class, 'getAnggotaDosen'])->name('anggota-dosen.get');
            Route::post('/{usulan}/anggota-penelitian', [AnggotaPenelitianController::class, 'store'])->name('anggota-dosen.store');
            Route::put('/anggota-penelitian/{id}', [AnggotaPenelitianController::class, 'update'])->name('anggota-dosen.update');
            Route::delete('/anggota-penelitian/{id}', [AnggotaPenelitianController::class, 'destroy'])->name('anggota-dosen.destroy');

            Route::get('/{usulan}/anggota-non-dosen', [UsulanPenelitianController::class, 'getAnggotaNonDosen'])->name('anggota-non-dosen.get');
            Route::post('/{usulan}/anggota-non-dosen', [AnggotaNonDosenController::class, 'store'])->name('anggota-non-dosen.store');
            Route::put('/anggota-non-dosen/{id}', [AnggotaNonDosenController::class, 'update'])->name('anggota-non-dosen.update');
            Route::delete('/anggota-non-dosen/{id}', [AnggotaNonDosenController::class, 'destroy'])->name('anggota-non-dosen.destroy');

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

            // Laporan Kemajuan [NEW]
            Route::prefix('laporan-kemajuan')->name('laporan-kemajuan.')->group(function () {
                Route::get('/', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'show'])->name('show');
                Route::post('/{id}/update', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'update'])->name('update');
                Route::post('/{id}/sptb', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'updateSPTB'])->name('sptb.update');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'updateLuaran'])->name('luaran.update');
                Route::post('/{usulan}/submit', [\App\Http\Controllers\LaporanKemajuanPenelitianController::class, 'submit'])->name('submit');
            });

            // Laporan Akhir [NEW]
            Route::prefix('laporan-akhir')->name('laporan-akhir.')->group(function () {
                Route::get('/', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'show'])->name('show');
                Route::post('/{id}/update', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'update'])->name('update');
                Route::post('/{id}/sptb', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'updateSPTB'])->name('sptb.update');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'updateLuaran'])->name('luaran.update');
                Route::post('/{usulan}/submit', [\App\Http\Controllers\LaporanAkhirPenelitianController::class, 'submit'])->name('submit');
            });

            // Catatan Harian [NEW]
            Route::prefix('catatan-harian')->name('catatan-harian.')->group(function () {
                Route::get('/', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'show'])->name('show');
                Route::post('/', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'store'])->name('store');
                Route::post('/{id}/update', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'update'])->name('update');
                Route::delete('/{id}', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'destroy'])->name('destroy');
                Route::delete('/file/{fileId}', [\App\Http\Controllers\CatatanHarianPenelitianController::class, 'destroyFile'])->name('file.destroy');
            });

            // Pengkinian Capaian Luaran [NEW]
            Route::prefix('pengkinian-luaran')->name('pengkinian-luaran.')->group(function () {
                Route::get('/', [\App\Http\Controllers\PengkinianCapaianPenelitianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\PengkinianCapaianPenelitianController::class, 'show'])->name('show');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\PengkinianCapaianPenelitianController::class, 'updateLuaran'])->name('luaran.update');
            });
        });

    // Routes Dosen Pengabdian [NEW]
    Route::prefix('dosen/pengabdian')
        ->name('dosen.pengabdian.')
        ->middleware('can:dashboard-dosen-view')
        ->group(function () {

            // Index
            Route::get('/', [UsulanPengabdianController::class, 'index'])->name('index');
            Route::get('/Index', function () {
                return redirect()->route('dosen.pengabdian.index');
            });

            // Mitra Pengabdian (Page 4) - Moved up to avoid wildcard collision
            Route::post('/mitra', [\App\Http\Controllers\MitraPengabdianController::class, 'store'])->name('mitra.store');
            Route::delete('/mitra/{id}', [\App\Http\Controllers\MitraPengabdianController::class, 'destroy'])->name('mitra.destroy');

            Route::post('/draft', [UsulanPengabdianController::class, 'storeDraft'])->name('draft');
            Route::get('/{usulan}/edit', [UsulanPengabdianController::class, 'edit'])->name('edit'); // Need impl in Controller
            Route::put('/{usulan}', [UsulanPengabdianController::class, 'update'])->name('update');
            Route::post('/{usulan}/substansi', [UsulanPengabdianController::class, 'uploadSubstansi'])->name('substansi');
            Route::post('/{usulan}/submit', [UsulanPengabdianController::class, 'submit'])->name('submit');
            Route::delete('/{usulan}', [UsulanPengabdianController::class, 'destroy'])->name('destroy');
            Route::get('/perbaikan', [UsulanPengabdianController::class, 'perbaikan'])->name('perbaikan');

            // Anggota READ (Implemented in UsulanPengabdianController)
            Route::get('/{usulan}/anggota-dosen', [UsulanPengabdianController::class, 'getAnggotaDosen'])->name('anggota-dosen.get');
            Route::get('/{usulan}/anggota-non-dosen', [UsulanPengabdianController::class, 'getAnggotaNonDosen'])->name('anggota-non-dosen.get');

            // Anggota WRITE (Implemented via specialized controllers)
            Route::post('/{usulan}/anggota-pengabdian', [AnggotaPengabdianController::class, 'store'])->name('anggota-dosen.store');
            Route::put('/anggota-pengabdian/{id}', [AnggotaPengabdianController::class, 'update'])->name('anggota-dosen.update');
            Route::delete('/anggota-pengabdian/{id}', [AnggotaPengabdianController::class, 'destroy'])->name('anggota-dosen.destroy');

            Route::post('/{usulan}/anggota-non-dosen', [AnggotaNonDosenPengabdianController::class, 'store'])->name('anggota-non-dosen.store');
            Route::put('/anggota-non-dosen/{id}', [AnggotaNonDosenPengabdianController::class, 'update'])->name('anggota-non-dosen.update');
            Route::delete('/anggota-non-dosen/{id}', [AnggotaNonDosenPengabdianController::class, 'destroy'])->name('anggota-non-dosen.destroy');

            // Step Show
            Route::get('/{usulan}/step/{step}', [UsulanPengabdianController::class, 'showStep'])->name('step.show');

            // RAB (Step 3) - Using RabItemPengabdianController
            Route::get('/{usulan}/rab', [RabItemPengabdianController::class, 'showRab'])->name('rab.show');
            Route::post('/{usulan}/rab', [RabItemPengabdianController::class, 'storeRab'])->name('rab.store');
            Route::put('/rab/{rabItem}', [RabItemPengabdianController::class, 'updateRab'])->name('rab.update');
            Route::delete('/rab/{rabItem}', [RabItemPengabdianController::class, 'destroyRab'])->name('rab.destroy');



            // Luaran [NEW]
            Route::get('/{usulan}/luaran', [\App\Http\Controllers\LuaranPengabdianController::class, 'showLuaran'])->name('luaran.show');
            Route::post('/{usulan}/luaran', [\App\Http\Controllers\LuaranPengabdianController::class, 'storeLuaran'])->name('luaran.store');
            Route::put('/luaran/{luaran}', [\App\Http\Controllers\LuaranPengabdianController::class, 'updateLuaran'])->name('luaran.update');
            Route::delete('/luaran/{luaran}', [\App\Http\Controllers\LuaranPengabdianController::class, 'destroyLuaran'])->name('luaran.destroy');

            // Laporan Kemajuan [NEW]
            Route::prefix('laporan-kemajuan')->name('laporan-kemajuan.')->group(function () {
                Route::get('/', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'show'])->name('show');
                Route::post('/{id}/update', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'update'])->name('update');
                Route::post('/{id}/sptb', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'updateSPTB'])->name('sptb.update');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'updateLuaran'])->name('luaran.update');
                Route::post('/{usulan}/submit', [\App\Http\Controllers\LaporanKemajuanPengabdianController::class, 'submit'])->name('submit');
            });

            // Laporan Akhir [NEW]
            Route::prefix('laporan-akhir')->name('laporan-akhir.')->group(function () {
                Route::get('/', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'show'])->name('show');
                Route::post('/{id}/update', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'update'])->name('update');
                Route::post('/{id}/sptb', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'updateSPTB'])->name('sptb.update');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'updateLuaran'])->name('luaran.update');
                Route::post('/{usulan}/submit', [\App\Http\Controllers\LaporanAkhirPengabdianController::class, 'submit'])->name('submit');
            });

            // Catatan Harian [NEW]
            Route::prefix('catatan-harian')->name('catatan-harian.')->group(function () {
                Route::get('/', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'show'])->name('show');
                Route::post('/', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'store'])->name('store');
                Route::post('/{id}/update', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'update'])->name('update');
                Route::delete('/{id}', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'destroy'])->name('destroy');
                Route::delete('/file/{fileId}', [\App\Http\Controllers\CatatanHarianPengabdianController::class, 'destroyFile'])->name('file.destroy');
            });

            // Pengkinian Capaian Luaran [NEW]
            Route::prefix('pengkinian-luaran')->name('pengkinian-luaran.')->group(function () {
                Route::get('/', [\App\Http\Controllers\PengkinianCapaianPengabdianController::class, 'index'])->name('index');
                Route::get('/{usulan}', [\App\Http\Controllers\PengkinianCapaianPengabdianController::class, 'show'])->name('show');
                Route::post('/luaran/{luaran}', [\App\Http\Controllers\PengkinianCapaianPengabdianController::class, 'updateLuaran'])->name('luaran.update');
            });
        });
});




// ==========================================================
// RUTE UMUM (NON-AUTH)
// ==========================================================

Route::get('/', function () {
    $pengumuman = \App\Models\Pengumuman::where('is_active', true)->latest()->take(3)->get();
    $berita = \App\Models\Berita::where('status', 'published')->latest()->take(5)->get();

    return Inertia::render('welcome', [
        'pengumuman' => $pengumuman,
        'berita' => $berita
    ]);
})->name('home');

Route::get('/berita', [\App\Http\Controllers\BeritaController::class, 'indexPublic'])->name('berita.index');
Route::get('/berita/{slug}', [\App\Http\Controllers\BeritaController::class, 'showPublic'])->name('berita.show');
Route::get('/pengumuman', [\App\Http\Controllers\PengumumanController::class, 'indexPublic'])->name('pengumuman.public.index');

// Otentikasi dihandle di routes/auth.php (already included at bottom)

// ==========================================================
// RUTE DASHBOARD ROLE-SPECIFIC
// ==========================================================

Route::middleware('auth')->group(function () {

    // Dashboard Admin 
    Route::get('/admin/dashboard', [\App\Http\Controllers\DashboardController::class, 'admin'])
        ->middleware('can:dashboard-admin-view')->name('admin.dashboard');

    // Dashboard Admin LPPM & Routes
    Route::middleware('can:dashboard-lppm-view')->prefix('lppm')->name('lppm.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'lppm'])->name('dashboard');

        // Berita Management
        Route::resource('berita', \App\Http\Controllers\BeritaController::class);

        // Pengumuman Management
        Route::resource('pengumuman', \App\Http\Controllers\PengumumanController::class);

        // Setting Form
        Route::get('/setting-form', [\App\Http\Controllers\SettingFormController::class, 'index'])->name('setting-form');
        Route::put('/setting-form/{id}', [\App\Http\Controllers\SettingFormController::class, 'update'])->name('setting-form.update');

        // User Management under LPPM
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::put('/users/{user}/reset-password', [\App\Http\Controllers\UserController::class, 'resetPassword'])->name('users.reset-password');

        // Global Workflow Actions (Using type parameter)
        Route::post('/{type}/{id}/assign-reviewer', [\App\Http\Controllers\AdminLPPMController::class, 'assignReviewer'])->name('assign_reviewer');
        Route::post('/{type}/{id}/set-budget', [\App\Http\Controllers\AdminLPPMController::class, 'setBudget'])->name('set_budget');
        Route::post('/{type}/{id}/final-decision', [\App\Http\Controllers\AdminLPPMController::class, 'finalDecision'])->name('final_decision');

        // Penelitian
        Route::prefix('penelitian')->name('penelitian.')->group(function () {
            Route::get('/', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitian'])->name('index');
            Route::get('/perbaikan', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitianPerbaikan'])->name('perbaikan');
            Route::get('/laporan-kemajuan', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitianLaporanKemajuan'])->name('laporan-kemajuan');
            Route::get('/laporan-kemajuan/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPenelitianLaporanKemajuan'])->name('laporan-kemajuan.show');
            Route::get('/catatan-harian', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitianCatatanHarian'])->name('catatan-harian');
            Route::get('/catatan-harian/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPenelitianCatatanHarian'])->name('catatan-harian.show');
            Route::get('/laporan-akhir', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitianLaporanAkhir'])->name('laporan-akhir');
            Route::get('/laporan-akhir/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPenelitianLaporanAkhir'])->name('laporan-akhir.show');
            Route::get('/pengkinian-luaran', [\App\Http\Controllers\AdminLPPMController::class, 'indexPenelitianPengkinianLuaran'])->name('pengkinian-luaran');
            Route::get('/pengkinian-luaran/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPenelitianPengkinianLuaran'])->name('pengkinian-luaran.show');
            Route::get('/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPenelitian'])->name('show');
        });

        // Pengabdian
        Route::prefix('pengabdian')->name('pengabdian.')->group(function () {
            Route::get('/', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdian'])->name('index');
            Route::get('/perbaikan', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdianPerbaikan'])->name('perbaikan');
            Route::get('/laporan-kemajuan', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdianLaporanKemajuan'])->name('laporan-kemajuan');
            Route::get('/laporan-kemajuan/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPengabdianLaporanKemajuan'])->name('laporan-kemajuan.show');
            Route::get('/catatan-harian', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdianCatatanHarian'])->name('catatan-harian');
            Route::get('/catatan-harian/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPengabdianCatatanHarian'])->name('catatan-harian.show');
            Route::get('/laporan-akhir', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdianLaporanAkhir'])->name('laporan-akhir');
            Route::get('/laporan-akhir/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPengabdianLaporanAkhir'])->name('laporan-akhir.show');
            Route::get('/pengkinian-luaran', [\App\Http\Controllers\AdminLPPMController::class, 'indexPengabdianPengkinianLuaran'])->name('pengkinian-luaran');
            Route::get('/pengkinian-luaran/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPengabdianPengkinianLuaran'])->name('pengkinian-luaran.show');
            Route::get('/{id}', [\App\Http\Controllers\AdminLPPMController::class, 'showPengabdian'])->name('show');
            Route::post('/{id}/decision', [\App\Http\Controllers\AdminLPPMController::class, 'storeDecision'])->name('decision');
        });
    });

    // Dashboard Dosen
    Route::middleware('can:dashboard-reviewer-view')->prefix('reviewer')->name('reviewer.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\ReviewerController::class, 'dashboard'])->name('dashboard');

        // Penelitian
        Route::get('/usulan', [\App\Http\Controllers\ReviewerController::class, 'index'])->name('usulan.index');
        Route::get('/review/{id}', [\App\Http\Controllers\ReviewerController::class, 'show'])->name('usulan.show');
        Route::post('/review/{id}', [\App\Http\Controllers\ReviewerController::class, 'storeReview'])->name('usulan.post_review');

        // Pengabdian [NEW]
        Route::get('/usulan-pengabdian', [\App\Http\Controllers\ReviewerController::class, 'indexPengabdian'])->name('usulan_pengabdian.index');
        Route::get('/review-pengabdian/{id}', [\App\Http\Controllers\ReviewerController::class, 'showPengabdian'])->name('usulan_pengabdian.show');
        Route::post('/review-pengabdian/{id}', [\App\Http\Controllers\ReviewerController::class, 'storeReviewPengabdian'])->name('usulan_pengabdian.review');

        Route::get('/penilaian', [\App\Http\Controllers\ReviewerController::class, 'history'])->name('penilaian.index');
    });

    // Dashboard Kaprodi & Routes
    Route::middleware('can:dashboard-kaprodi-view')->prefix('kaprodi')->name('kaprodi.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\KaprodiController::class, 'dashboard'])->name('dashboard');

        // Penelitian
        Route::get('/usulan', [\App\Http\Controllers\KaprodiController::class, 'index'])->name('usulan.index');
        Route::get('/review/{id}', [\App\Http\Controllers\KaprodiController::class, 'show'])->name('usulan.show');
        Route::post('/review/{id}', [\App\Http\Controllers\KaprodiController::class, 'storeReview'])->name('usulan.review');

        // Pengabdian
        Route::get('/usulan-pengabdian', [\App\Http\Controllers\KaprodiController::class, 'indexPengabdian'])->name('usulan_pengabdian.index'); // Optional if merged in index
        Route::get('/review-pengabdian/{id}', [\App\Http\Controllers\KaprodiController::class, 'showPengabdian'])->name('usulan_pengabdian.show');
        Route::post('/review-pengabdian/{id}', [\App\Http\Controllers\KaprodiController::class, 'storeReviewPengabdian'])->name('usulan_pengabdian.review');

        Route::get('/riwayat-review', [\App\Http\Controllers\KaprodiController::class, 'history'])->name('riwayat');
    });

    // Dashboard Dosen
    Route::get('/dosen/dashboard', [\App\Http\Controllers\DashboardController::class, 'dosen'])->middleware('can:dashboard-dosen-view')->name('dosen.dashboard');
});




// Global API Routes (inside Auth but outside Menu Permission)
Route::middleware(['auth'])->group(function () {
    // API Routes for Master Data Search
    Route::get('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::get('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);
    Route::post('/api/dosen/search', [\App\Http\Controllers\Api\DosenController::class, 'search']);
    Route::post('/api/mahasiswa/search', [\App\Http\Controllers\Api\MahasiswaController::class, 'search']);

    // [NEW] Master Data APIs (Rumpun Ilmu & Wilayah)
    Route::get('/api/master/rumpun-ilmu', [\App\Http\Controllers\MasterDataController::class, 'getRumpunIlmu']);
    Route::get('/api/master/provinsi', [\App\Http\Controllers\MasterDataController::class, 'getProvinsi']);
    Route::get('/api/master/kota', [\App\Http\Controllers\MasterDataController::class, 'getKota']);

    // [NEW] Member Approval APIs
    Route::get('/api/member/invitations', [\App\Http\Controllers\MemberApprovalController::class, 'index']);
    Route::post('/api/member/{type}/{id}/accept', [\App\Http\Controllers\MemberApprovalController::class, 'accept']);
    Route::post('/api/member/{type}/{id}/reject', [\App\Http\Controllers\MemberApprovalController::class, 'reject']);
});

// Middleware 'menu.permission' digunakan untuk melindungi rute yang ada di menu
Route::middleware(['auth', 'menu.permission'])->group(function () {

    // === AKSES & PENGGUNA (Hanya Admin) ===
    Route::resource('roles', RoleController::class)->middleware('can:roles-view');
    Route::resource('permissions', PermissionController::class)->middleware('can:permission-view');

    // Users harus dilindungi oleh users-view, dan impersonate oleh users-impersonate
    // Route::resource('users', UserController::class)->middleware('can:users-view');
    // Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password')->middleware('can:users-edit');

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





});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';