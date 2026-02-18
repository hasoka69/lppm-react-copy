<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\UsulanPengabdian;
use App\Models\ReviewHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminLPPMController extends Controller
{
    /**
     * Display a list of all Research proposals for Admin LPPM.
     */
    public function indexPenelitian()
    {
        return $this->renderPenelitianIndex('daftar');
    }

    public function indexPenelitianPerbaikan()
    {
        return $this->renderPenelitianIndex('perbaikan');
    }

    public function indexPenelitianLaporanKemajuan()
    {
        return $this->renderPenelitianIndex('laporan-kemajuan');
    }

    public function indexPenelitianCatatanHarian()
    {
        return $this->renderPenelitianIndex('catatan-harian');
    }

    public function indexPenelitianLaporanAkhir()
    {
        return $this->renderPenelitianIndex('laporan-akhir');
    }

    public function indexPenelitianPengkinianLuaran()
    {
        return $this->renderPenelitianIndex('pengkinian-capaian');
    }

    private function renderPenelitianIndex($activeTab)
    {
        $statusFilter = ['submitted', 'approved_prodi', 'reviewer_assigned', 'under_revision_admin', 'revision_dosen', 'resubmitted_revision', 'reviewed_approved', 'didanai', 'ditolak_akhir', 'rejected_reviewer'];

        if ($activeTab === 'perbaikan') {
            $statusFilter = ['under_revision_admin', 'revision_dosen'];
        } elseif (in_array($activeTab, ['laporan-kemajuan', 'catatan-harian', 'laporan-akhir', 'pengkinian-capaian'])) {
            $statusFilter = ['didanai'];
        }

        $query = UsulanPenelitian::with(['ketua.dosen']);

        // Eager load dynamically based on need
        if ($activeTab === 'laporan-kemajuan') {
            $query->with('laporanKemajuan');
        } elseif ($activeTab === 'laporan-akhir') {
            $query->with('laporanAkhir');
        } elseif ($activeTab === 'catatan-harian') {
            $query->with('catatanHarian');
        } elseif ($activeTab === 'pengkinian-capaian') {
            $query->with('luaranList');
        }

        if ($year = request('tahun_akademik')) {
            $query->where('tahun_pertama', $year);
        }

        $proposals = $query->whereIn('status', $statusFilter)
            ->latest()
            ->get()
            ->map(function ($item) use ($activeTab) {
                $data = [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'ketua' => $item->ketua->name ?? '-',
                    'prodi' => $item->ketua->dosen->prodi ?? '-',
                    'skema' => $item->kelompok_skema,
                    'tanggal' => $item->created_at->format('d M Y'),
                    'status' => $item->status,
                    'type' => 'penelitian',
                    'dana_disetujui' => $item->dana_disetujui,
                    'tahun_pertama' => $item->tahun_pertama,
                    'nomor_kontrak' => $item->nomor_kontrak,
                    'tanggal_kontrak' => $item->tanggal_kontrak,
                    'tanggal_mulai_kontrak' => $item->tanggal_mulai_kontrak,
                    'tanggal_selesai_kontrak' => $item->tanggal_selesai_kontrak,
                ];

                // Add specialized data based on tab
                if ($activeTab === 'laporan-kemajuan') {
                    $report = $item->laporanKemajuan;
                    $data['report'] = $report ? [
                        'id' => $report->id,
                        'status' => $report->status,
                        'file_laporan' => $report->file_laporan
                    ] : null;
                } elseif ($activeTab === 'laporan-akhir') {
                    $report = $item->laporanAkhir;
                    $data['report'] = $report ? [
                        'id' => $report->id,
                        'status' => $report->status,
                        'file_laporan' => $report->file_laporan
                    ] : null;
                } elseif ($activeTab === 'catatan-harian') {
                    $logs = $item->catatanHarian;
                    $data['total_logs'] = $logs ? $logs->count() : 0;
                    $data['last_percentage'] = $logs ? $logs->max('persentase') ?? 0 : 0;
                } elseif ($activeTab === 'pengkinian-capaian') {
                    // Calculate progress based on logic: Draft 20, Submitted 40, Review 60, Accepted 80, Published 100
                    $outputs = $item->luaranList;
                    if ($outputs && $outputs->count() > 0) {
                        $totalScore = $outputs->map(function ($out) {
                            switch (strtolower($out->status)) {
                                case 'published':
                                    return 100;
                                case 'accepted':
                                    return 80;
                                case 'in_review':
                                    return 60;
                                case 'submitted':
                                    return 40;
                                default:
                                    return 20; // Draft
                            }
                        })->sum();
                        $data['progress'] = round($totalScore / $outputs->count());
                    } else {
                        $data['progress'] = 0;
                    }
                }

                return $data;
            });

        return Inertia::render('lppm/penelitian/Index', [
            'proposals' => $proposals,
            'activeTab' => $activeTab,
            'filters' => request()->all(['tahun_akademik', 'search'])
        ]);
    }

    /**
     * Display a list of all Community Service proposals for Admin LPPM.
     */
    public function indexPengabdian()
    {
        return $this->renderPengabdianIndex('daftar');
    }

    public function indexPengabdianPerbaikan()
    {
        return $this->renderPengabdianIndex('perbaikan');
    }

    public function indexPengabdianLaporanKemajuan()
    {
        return $this->renderPengabdianIndex('laporan-kemajuan');
    }

    public function indexPengabdianCatatanHarian()
    {
        return $this->renderPengabdianIndex('catatan-harian');
    }

    public function indexPengabdianLaporanAkhir()
    {
        return $this->renderPengabdianIndex('laporan-akhir');
    }

    public function indexPengabdianPengkinianLuaran()
    {
        return $this->renderPengabdianIndex('pengkinian-capaian');
    }

    private function renderPengabdianIndex($activeTab)
    {
        $statusFilter = ['submitted', 'approved_prodi', 'reviewer_assigned', 'under_revision_admin', 'revision_dosen', 'resubmitted_revision', 'reviewed_approved', 'didanai', 'ditolak_akhir', 'rejected_reviewer'];

        if ($activeTab === 'perbaikan') {
            $statusFilter = ['under_revision_admin', 'revision_dosen'];
        } elseif (in_array($activeTab, ['laporan-kemajuan', 'catatan-harian', 'laporan-akhir', 'pengkinian-capaian'])) {
            $statusFilter = ['didanai'];
        }

        $query = UsulanPengabdian::with(['ketua.dosen']);

        // Eager load dynamically based on need
        if ($activeTab === 'laporan-kemajuan') {
            $query->with('laporanKemajuan');
        } elseif ($activeTab === 'laporan-akhir') {
            $query->with('laporanAkhir');
        } elseif ($activeTab === 'catatan-harian') {
            $query->with('catatanHarian');
        } elseif ($activeTab === 'pengkinian-capaian') {
            $query->with('luaranList');
        }

        if ($year = request('tahun_akademik')) {
            $query->where('tahun_pertama', $year);
        }

        $proposals = $query->whereIn('status', $statusFilter)
            ->latest()
            ->get()
            ->map(function ($item) use ($activeTab) {
                $data = [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'ketua' => $item->ketua->name ?? '-',
                    'prodi' => $item->ketua->dosen->prodi ?? '-',
                    'skema' => $item->kelompok_skema,
                    'tanggal' => $item->created_at->format('d M Y'),
                    'status' => $item->status,
                    'type' => 'pengabdian',
                    'dana_disetujui' => $item->dana_disetujui,
                    'tahun_pertama' => $item->tahun_pertama,
                    'nomor_kontrak' => $item->nomor_kontrak,
                    'tanggal_kontrak' => $item->tanggal_kontrak,
                    'tanggal_mulai_kontrak' => $item->tanggal_mulai_kontrak,
                    'tanggal_selesai_kontrak' => $item->tanggal_selesai_kontrak,
                ];

                // Add specialized data based on tab
                if ($activeTab === 'laporan-kemajuan') {
                    $report = $item->laporanKemajuan;
                    $data['report'] = $report ? [
                        'id' => $report->id,
                        'status' => $report->status,
                        'file_laporan' => $report->file_laporan
                    ] : null;
                } elseif ($activeTab === 'laporan-akhir') {
                    $report = $item->laporanAkhir;
                    $data['report'] = $report ? [
                        'id' => $report->id,
                        'status' => $report->status,
                        'file_laporan' => $report->file_laporan
                    ] : null;
                } elseif ($activeTab === 'catatan-harian') {
                    $logs = $item->catatanHarian;
                    $data['total_logs'] = $logs ? $logs->count() : 0;
                    $data['last_percentage'] = $logs ? $logs->max('persentase') ?? 0 : 0;
                } elseif ($activeTab === 'pengkinian-capaian') {
                    $outputs = $item->luaranList;
                    if ($outputs && $outputs->count() > 0) {
                        $totalScore = $outputs->map(function ($out) {
                            switch (strtolower($out->status)) {
                                case 'published':
                                    return 100;
                                case 'accepted':
                                    return 80;
                                case 'in_review':
                                    return 60;
                                case 'submitted':
                                    return 40;
                                default:
                                    return 20; // Draft
                            }
                        })->sum();
                        $data['progress'] = round($totalScore / $outputs->count());
                    } else {
                        $data['progress'] = 0;
                    }
                }

                return $data;
            });

        return Inertia::render('lppm/pengabdian/Index', [
            'proposals' => $proposals,
            'activeTab' => $activeTab,
            'filters' => request()->all(['tahun_akademik', 'search'])
        ]);
    }

    public function showPenelitian($id)
    {
        $usulan = UsulanPenelitian::with([
            'ketua.dosen',
            'anggotaDosen.dosen',
            'anggotaNonDosen',
            'luaranList',
            'rabItems',
            'reviewHistories.reviewer',
            'reviewer'
        ])->findOrFail($id);

        $initialScores = [];
        $latestReview = \App\Models\ReviewHistory::where('usulan_id', $id)
            ->where('usulan_type', get_class($usulan))
            ->where('reviewer_type', 'reviewer')
            ->latest('reviewed_at')
            ->first();

        if ($latestReview) {
            $initialScores = \App\Models\ReviewScore::where('review_history_id', $latestReview->id)->get();
        }

        return Inertia::render('lppm/penelitian/Detail', [
            'usulan' => $usulan,
            'reviewers' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'Reviewer'))->get(['id', 'name']),
            'initialScores' => $initialScores,
            'isReadOnly' => true
        ]);
    }

    public function showPengabdian($id)
    {
        $usulan = UsulanPengabdian::with([
            'ketua.dosen',
            'anggotaDosen.dosen',
            'anggotaNonDosen',
            'luaranItems',
            'rabItems',
            'mitra',
            'reviewHistories.reviewer',
            'reviewer'
        ])->findOrFail($id);

        // [FIX] Ensure total_anggaran is synced with RAB items
        $actualTotal = $usulan->getTotalAnggaran();
        if ($usulan->total_anggaran != $actualTotal) {
            $usulan->update(['total_anggaran' => $actualTotal]);
        }

        $initialScores = [];
        $latestReview = \App\Models\ReviewHistory::where('usulan_id', $id)
            ->where('usulan_type', get_class($usulan))
            ->where('reviewer_type', 'reviewer')
            ->latest('reviewed_at')
            ->first();

        if ($latestReview) {
            $initialScores = \App\Models\ReviewScore::where('review_history_id', $latestReview->id)->get();
        }

        return Inertia::render('lppm/pengabdian/Detail', [
            'usulan' => $usulan,
            'reviewers' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'Reviewer'))->get(['id', 'name']),
            'initialScores' => $initialScores,
            'isReadOnly' => true
        ]);
    }

    /**
     * Store final decision for Pengabdian.
     */
    public function storeDecision(Request $request, $id)
    {
        $rules = [
            'decision' => 'required|in:didanai,ditolak,needs_revision',
            'notes' => 'nullable|string'
        ];

        if ($request->decision === 'didanai') {
            $rules['nomor_kontrak'] = 'required|string';
            $rules['tanggal_kontrak'] = 'required|date';
        }

        $request->validate($rules);

        $usulan = UsulanPengabdian::findOrFail($id);

        DB::transaction(function () use ($request, $usulan) {
            $updateData = ['status' => $request->decision];
            if ($request->decision === 'didanai') {
                $updateData['nomor_kontrak'] = $request->nomor_kontrak;
                $updateData['tanggal_kontrak'] = $request->tanggal_kontrak;
            }
            $usulan->update($updateData);

            ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => get_class($usulan),
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'admin_lppm',
                'action' => 'final_decision_' . $request->decision,
                'comments' => $request->notes,
                'reviewed_at' => now(),
            ]);
        });

        return back()->with('success', 'Keputusan berhasil disimpan.');
    }
    /**
     * Assign reviewer by Admin LPPM
     */
    public function assignReviewer(Request $request, $type, $id)
    {
        $request->validate(['reviewer_id' => 'required|exists:users,id']);

        $model = $type === 'penelitian' ? UsulanPenelitian::class : UsulanPengabdian::class;
        $usulan = $model::findOrFail($id);

        $usulan->update([
            'reviewer_id' => $request->reviewer_id,
            'status' => 'reviewer_assigned'
        ]);

        ReviewHistory::create([
            'usulan_id' => $id,
            'usulan_type' => $model,
            'reviewer_id' => Auth::id(),
            'reviewer_type' => 'admin_lppm',
            'action' => 'assign_reviewer',
            'comments' => 'Reviewer ditunjuk oleh Admin LPPM.',
            'reviewed_at' => now(),
        ]);

        $route = $type === 'penelitian' ? 'lppm.penelitian.index' : 'lppm.pengabdian.index';
        return redirect()->route($route)->with('success', 'Reviewer berhasil ditunjuk.');
    }

    /**
     * Set Budget & Note by Admin LPPM (Moving to Revision stage)
     */
    public function setBudget(Request $request, $type, $id)
    {
        $request->validate([
            'dana_disetujui' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        $model = $type === 'penelitian' ? UsulanPenelitian::class : UsulanPengabdian::class;
        $usulan = $model::findOrFail($id);

        $usulan->update([
            'dana_disetujui' => $request->dana_disetujui,
            'status' => 'revision_dosen'
        ]);

        ReviewHistory::create([
            'usulan_id' => $id,
            'usulan_type' => $model,
            'reviewer_id' => Auth::id(),
            'reviewer_type' => 'admin_lppm',
            'action' => 'set_budget_and_revision',
            'comments' => 'Admin menetapkan pagu dana Rp ' . number_format($request->dana_disetujui) . '. ' . $request->notes,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Dana ditetapkan dan usulan dikembalikan ke dosen untuk revisi.');
    }

    /**
     * Handle Final decision after Reviewer Approve
     */
    public function finalDecision(Request $request, $type, $id)
    {
        $rules = ['decision' => 'required|in:didanai,ditolak_akhir'];
        if ($request->decision === 'didanai') {
            $rules['nomor_kontrak'] = 'required|string';
            $rules['tanggal_kontrak'] = 'nullable|date';
            $rules['tanggal_mulai_kontrak'] = 'required|date';
            $rules['tanggal_selesai_kontrak'] = 'required|date|after_or_equal:tanggal_mulai_kontrak';
        }

        $request->validate($rules);

        $model = $type === 'penelitian' ? UsulanPenelitian::class : UsulanPengabdian::class;
        $usulan = $model::findOrFail($id);

        $updateData = ['status' => $request->decision];
        if ($request->decision === 'didanai') {
            $updateData['nomor_kontrak'] = $request->nomor_kontrak;
            $updateData['tanggal_kontrak'] = $request->tanggal_kontrak ?? now();
            $updateData['tanggal_mulai_kontrak'] = $request->tanggal_mulai_kontrak;
            $updateData['tanggal_selesai_kontrak'] = $request->tanggal_selesai_kontrak;

            // Ensure dana_disetujui is set. If not already set by setBudget, default to total_anggaran
            if (!$usulan->dana_disetujui || $usulan->dana_disetujui <= 0) {
                $updateData['dana_disetujui'] = $usulan->getTotalAnggaran() > 0 ? $usulan->getTotalAnggaran() : $usulan->total_anggaran;
            }
        }

        $usulan->update($updateData);

        ReviewHistory::create([
            'usulan_id' => $id,
            'usulan_type' => $model,
            'reviewer_id' => Auth::id(),
            'reviewer_type' => 'admin_lppm',
            'action' => 'final_' . $request->decision,
            'comments' => 'Keputusan final oleh Admin LPPM.',
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Keputusan final berhasil disimpan.');
    }

    // ========================================
    // MONITORING SUB-PAGES PENELITIAN
    // ========================================

    public function showPenelitianLaporanKemajuan($id)
    {
        $usulan = UsulanPenelitian::with(['luaranList', 'laporanKemajuan'])->findOrFail($id);
        $report = $usulan->laporanKemajuan ?? \App\Models\LaporanKemajuanPenelitian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => $usulan->user_id, 'status' => 'Draft']
        );
        return Inertia::render('dosen/penelitian/LaporanKemajuan/Detail', [
            'usulan' => $usulan,
            'laporan_kemajuan' => $report,
            'outputs' => $usulan->luaranList,
            'isAdminView' => true
        ]);
    }

    public function showPenelitianCatatanHarian($id)
    {
        $usulan = UsulanPenelitian::findOrFail($id);
        $months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];
        $selectedMonth = $months[date('n') - 1];

        $logs = \App\Models\CatatanHarianPenelitian::with('files')
            ->where('usulan_id', $id)
            ->latest()
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'tanggal' => $log->tanggal,
                    'uraian_kegiatan' => $log->kegiatan,
                    'persentase_capaian' => $log->persentase,
                    'supporting_docs' => $log->files->map(function ($f) {
                        return [
                            'id' => $f->id,
                            'path' => $f->file_path,
                            'name' => $f->file_name
                        ];
                    })
                ];
            });

        return Inertia::render('dosen/penelitian/CatatanHarian/Show', [
            'usulan' => $usulan,
            'logs' => $logs,
            'months' => $months,
            'selectedMonth' => $selectedMonth,
            'isAdminView' => true
        ]);
    }

    public function showPenelitianLaporanAkhir($id)
    {
        $usulan = UsulanPenelitian::with(['luaranList', 'laporanAkhir'])->findOrFail($id);
        $report = $usulan->laporanAkhir ?? \App\Models\LaporanAkhirPenelitian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => $usulan->user_id, 'status' => 'Draft']
        );
        return Inertia::render('dosen/penelitian/LaporanAkhir/Detail', [
            'usulan' => $usulan,
            'laporan_akhir' => $report,
            'outputs' => $usulan->luaranList,
            'isAdminView' => true
        ]);
    }

    public function showPenelitianPengkinianLuaran($id)
    {
        $usulan = UsulanPenelitian::with(['luaranList'])->findOrFail($id);
        return Inertia::render('dosen/penelitian/PengkinianLuaran/Detail', [
            'usulan' => $usulan,
            'mandatory_outputs' => $usulan->luaranList->where('is_wajib', 1)->values(),
            'additional_outputs' => $usulan->luaranList->where('is_wajib', 0)->values(),
            'isAdminView' => true
        ]);
    }

    // ========================================
    // MONITORING SUB-PAGES PENGABDIAN
    // ========================================

    public function showPengabdianLaporanKemajuan($id)
    {
        $usulan = UsulanPengabdian::with(['luaranList', 'laporanKemajuan'])->findOrFail($id);
        $report = $usulan->laporanKemajuan ?? \App\Models\LaporanKemajuanPengabdian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => $usulan->user_id, 'status' => 'Draft']
        );
        return Inertia::render('dosen/pengabdian/LaporanKemajuan/Detail', [
            'usulan' => $usulan,
            'laporan_kemajuan' => $report,
            'outputs' => $usulan->luaranList,
            'isAdminView' => true
        ]);
    }

    public function showPengabdianCatatanHarian($id)
    {
        $usulan = UsulanPengabdian::findOrFail($id);
        $months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];
        $selectedMonth = $months[date('n') - 1];

        $logs = \App\Models\CatatanHarianPengabdian::with('files')
            ->where('usulan_id', $id)
            ->latest()
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'tanggal' => $log->tanggal,
                    'uraian_kegiatan' => $log->kegiatan,
                    'persentase_capaian' => $log->persentase,
                    'supporting_docs' => $log->files->map(function ($f) {
                        return [
                            'id' => $f->id,
                            'path' => $f->file_path,
                            'name' => $f->file_name
                        ];
                    })
                ];
            });

        return Inertia::render('dosen/pengabdian/CatatanHarian/Show', [
            'usulan' => $usulan,
            'logs' => $logs,
            'months' => $months,
            'selectedMonth' => $selectedMonth,
            'isAdminView' => true
        ]);
    }

    public function showPengabdianLaporanAkhir($id)
    {
        $usulan = UsulanPengabdian::with(['luaranList', 'laporanAkhir'])->findOrFail($id);
        $report = $usulan->laporanAkhir ?? \App\Models\LaporanAkhirPengabdian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => $usulan->user_id, 'status' => 'Draft']
        );
        return Inertia::render('dosen/pengabdian/LaporanAkhir/Detail', [
            'usulan' => $usulan,
            'laporan_akhir' => $report,
            'outputs' => $usulan->luaranList,
            'isAdminView' => true
        ]);
    }

    public function showPengabdianPengkinianLuaran($id)
    {
        $usulan = UsulanPengabdian::with(['luaranList'])->findOrFail($id);
        return Inertia::render('dosen/pengabdian/PengkinianLuaran/Detail', [
            'usulan' => $usulan,
            'mandatory_outputs' => $usulan->luaranList->where('is_wajib', 1)->values(),
            'additional_outputs' => $usulan->luaranList->where('is_wajib', 0)->values(),
            'isAdminView' => true
        ]);
    }
}
