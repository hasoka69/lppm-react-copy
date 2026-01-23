<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KaprodiController extends Controller
{
    /**
     * Helper to get current Kaprodi's detailed info including Prodi
     */
    private function getKaprodiProfile()
    {
        $user = Auth::user();
        // Ensure user has 'Kaprodi' role or similar check if needed
        // For now, we rely on middleware and the User -> Dosen relationship
        return $user->dosen;
    }

    /**
     * Dashboard Kaprodi
     */
    public function dashboard()
    {
        $dosenProfile = $this->getKaprodiProfile();

        if (!$dosenProfile || !$dosenProfile->prodi) {
            // Handle case where Kaprodi profile is incomplete
            return Inertia::render('kaprodi/Dashboard', [
                'error' => 'Profil Program Studi belum diatur.'
            ]);
        }

        $prodi = $dosenProfile->prodi;

        $stats = [
            'waiting_review' => \App\Models\UsulanPengabdian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', '=', $prodi);
            })->where('status', '=', 'submitted')->count(),

            'forwarded' => \App\Models\UsulanPengabdian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', '=', $prodi);
            })->whereIn('status', ['reviewer_review', 'reviewed', 'didanai'])->count(),

            'rejected' => \App\Models\UsulanPengabdian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', '=', $prodi);
            })->where('status', '=', 'rejected_prodi')->count(),
        ];

        // Fetch recent proposals (limit 5)
        $recentProposals = UsulanPenelitian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', 'submitted')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($usulan) {
                return [
                    'id' => $usulan->id,
                    'title' => $usulan->judul,
                    'type' => $usulan->kelompok_skema,
                    'proposer' => [
                        'name' => $usulan->ketua->name,
                        'prodi' => $usulan->ketua->dosen->prodi ?? '-',
                    ],
                    'date' => $usulan->created_at ? \Carbon\Carbon::parse($usulan->created_at)->format('d M Y') : '-',
                    'status' => $usulan->status,
                ];
            });

        return Inertia::render('kaprodi/Dashboard', [
            'program' => [
                'name' => $prodi,
                'faculty' => 'Fakultas Teknik', // Placeholder or fetch from relation
                'lecturers_count' => \App\Models\Dosen::where('prodi', '=', $prodi, 'and')->count(),
                'proposals_2024' => UsulanPenelitian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                    $q->where('prodi', '=', $prodi, 'and');
                })->whereYear('created_at', '=', date('Y'), 'and')->count(),
            ],
            'summary' => $stats,
            'proposals' => $recentProposals,
            'activities' => [] // Implement activity log later if needed
        ]);
    }

    /**
     * List all proposals for this Prodi
     */
    public function index()
    {
        $dosenProfile = $this->getKaprodiProfile();
        $prodi = $dosenProfile ? $dosenProfile->prodi : null;

        if (!$prodi) {
            return redirect()->route('kaprodi.dashboard')->with('error', 'Profil anda tidak memiliki Prodi.');
        }

        // List Penelitian
        $penelitianList = UsulanPenelitian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', 'submitted')
            ->latest()
            ->get()
            ->map(function ($usulan, $index) {
                return [
                    'no' => $index + 1,
                    'id' => $usulan->id,
                    'judul' => $usulan->judul,
                    'pengusul' => $usulan->ketua->name,
                    'skema' => $usulan->kelompok_skema,
                    'tahun' => $usulan->tahun_pertama,
                    'status' => $usulan->status,
                    'tanggal' => $usulan->created_at->format('d/m/Y'),
                    'type' => 'penelitian'
                ];
            });

        // List Pengabdian [NEW]
        $pengabdianList = \App\Models\UsulanPengabdian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', 'submitted')
            ->latest()
            ->get()
            ->map(function ($usulan, $index) {
                return [
                    'no' => $index + 1,
                    'id' => $usulan->id,
                    'judul' => $usulan->judul,
                    'pengusul' => $usulan->ketua->name,
                    'skema' => $usulan->kelompok_skema,
                    'tahun' => $usulan->tahun_pengusulan, // Note: field might differ
                    'status' => $usulan->status,
                    'tanggal' => $usulan->created_at->format('d/m/Y'),
                    'type' => 'pengabdian'
                ];
            });

        return Inertia::render('kaprodi/usulan/Index', [
            'usulanList' => $penelitianList, // Backward compat checks
            'penelitianList' => $penelitianList,
            'pengabdianList' => $pengabdianList,
            'prodiName' => $prodi
        ]);
    }

    /**
     * List reviewed proposals (History)
     */
    public function history()
    {
        $dosenProfile = $this->getKaprodiProfile();
        $prodi = $dosenProfile ? $dosenProfile->prodi : null;

        if (!$prodi) {
            return redirect()->route('kaprodi.dashboard')->with('error', 'Profil anda tidak memiliki Prodi.');
        }

        // Fetch history from ReviewHistory table (Polymorphic) where reviewer is this user (Kaprodi)
        // Note: Kaprodi acts as a reviewer here.
        $reviews = \App\Models\ReviewHistory::with(['usulan'])
            ->where('reviewer_id', Auth::id())
            ->where('reviewer_type', 'kaprodi') // OR 'reviewer' if that's how we saved it? I saved as 'kaprodi' in store method.
            ->latest('reviewed_at')
            ->get()
            ->map(function ($review, $index) {
                // Determine header/details from the polymorphic usulan
                if (!$review->usulan)
                    return null;

                $usulan = $review->usulan;
                // Safely access relationships (polymorphic 'ketua'/'user' might differ in alias, but I aligned them somewhat)
                // UsulanPenelitian: ketua -> User
                // UsulanPengabdian: ketua -> User (via alias or standard)
                // Let's use flexible access
                $pengusulName = $usulan->ketua->name ?? $usulan->user->name ?? 'Unknown';

                return [
                    'id' => $usulan->id,
                    'judul' => $usulan->judul,
                    'pengusul' => $pengusulName,
                    'skema' => $usulan->kelompok_skema,
                    // 'tahun' => ... (varies, maybe omit or try field check)
                    'status' => $usulan->status,
                    'tanggal' => $review->reviewed_at ? \Carbon\Carbon::parse($review->reviewed_at)->format('d/m/Y H:i') : '-',
                    'comments' => $review->comments, // [NEW] The notes!
                    'type' => str_contains($review->usulan_type, 'Pengabdian') ? 'Pengabdian' : 'Penelitian'
                ];
            })
            ->filter() // remove nulls
            ->values()
            ->map(function ($item, $idx) {
                $item['no'] = $idx + 1;
                return $item;
            });

        return Inertia::render('kaprodi/usulan/History', [
            'usulanList' => $reviews,
            'prodiName' => $prodi
        ]);
    }

    /**
     * Show Review Page
     */
    public function show($id)
    {
        $usulan = UsulanPenelitian::with(['ketua.dosen', 'anggotaDosen', 'anggotaNonDosen', 'luaranList', 'rabItems'])
            ->findOrFail($id);

        // Security check: ensure same prodi
        $kaprodi = $this->getKaprodiProfile();
        $pengusulProdi = $usulan->ketua->dosen->prodi ?? null;

        if (!$kaprodi || $kaprodi->prodi !== $pengusulProdi) {
            abort(403, 'Anda tidak memiliki akses ke usulan dari Prodi lain.');
        }

        return Inertia::render('kaprodi/usulan/Review', [
            'usulan' => $usulan,
            'pengusul' => $usulan->ketua->dosen,
            'anggota' => $usulan->anggotaDosen,
            'anggotaNonDosen' => $usulan->anggotaNonDosen,
            'rabTotal' => $usulan->getTotalAnggaran()
        ]);
    }

    /**
     * Submit Review (Approve/Reject)
     */
    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'decision' => 'required|in:approve,reject',
            'notes' => 'nullable|string'
        ]);

        $usulan = UsulanPenelitian::findOrFail($id);

        // Security check
        $kaprodi = $this->getKaprodiProfile();
        $pengusulProdi = $usulan->ketua->dosen->prodi ?? null;

        if (!$kaprodi || $kaprodi->prodi !== $pengusulProdi) {
            abort(403);
        }

        if ($request->decision === 'approve') {
            $usulan->status = 'approved_prodi';
            $action = 'kaprodi_approved';
        } else {
            $usulan->status = 'ditolak_akhir';
            $action = 'kaprodi_rejected';
        }

        // Create History
        \App\Models\ReviewHistory::create([
            'usulan_id' => $usulan->id,
            'usulan_type' => get_class($usulan),
            'reviewer_id' => Auth::id(),
            'reviewer_type' => 'kaprodi',
            'action' => $action,
            'comments' => $request->notes,
            'reviewed_at' => now(),
        ]);

        $usulan->save();

        return redirect()->route('kaprodi.usulan.index')
            ->with('success', 'Usulan berhasil direview.');
    }

    // ==========================================
    // SEKSI PENGABDIAN (Baru)
    // ==========================================

    public function indexPengabdian() // Bisa digabung ke index() kalau mau satu list
    {
        // Untuk sementara kita pisah route fetch-nya, tapi di frontend bisa satu halaman
        $dosenProfile = $this->getKaprodiProfile();
        $prodi = $dosenProfile ? $dosenProfile->prodi : null;

        if (!$prodi) {
            return []; // Or error
        }

        $pengabdianList = \App\Models\UsulanPengabdian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', 'submitted')
            ->latest()
            ->get()
            ->map(function ($usulan, $index) {
                return [
                    'no' => $index + 1,
                    'id' => $usulan->id,
                    'judul' => $usulan->judul,
                    'pengusul' => $usulan->ketua->name,
                    'skema' => $usulan->kelompok_skema,
                    'tahun' => $usulan->tahun_pengusulan,
                    'status' => $usulan->status,
                    'tanggal' => $usulan->created_at->format('d/m/Y'),
                    'type' => 'pengabdian'
                ];
            });

        return response()->json($pengabdianList);
    }

    public function showPengabdian($id)
    {
        $usulan = \App\Models\UsulanPengabdian::with(['ketua.dosen', 'anggotaDosen', 'anggotaNonDosen', 'luaranItems', 'rabItems', 'mitra'])
            ->findOrFail($id);

        // Security check
        $kaprodi = $this->getKaprodiProfile();
        $pengusulProdi = $usulan->ketua->dosen->prodi ?? null;

        if (!$kaprodi || $kaprodi->prodi !== $pengusulProdi) {
            abort(403, 'Anda tidak memiliki akses ke usulan dari Prodi lain.');
        }

        return Inertia::render('kaprodi/usulan/ReviewPengabdian', [
            'usulan' => $usulan,
            'pengusul' => $usulan->ketua->dosen,
            'anggota' => $usulan->anggotaDosen->map(function ($ang) {
                return [
                    'id' => $ang->id,
                    'nama_dosen' => $ang->nama, // Nama is stored directly in table, or via Dosen relation
                    'peran' => $ang->peran,
                    'fakultas' => $ang->dosen->fakultas ?? '-',
                    // Add other needed fields
                ];
            }),
            'anggotaNonDosen' => $usulan->anggotaNonDosen,
            'luaran' => $usulan->luaranItems, // [NEW]
            'rabTotal' => $usulan->getTotalAnggaran()
        ]);
    }

    public function storeReviewPengabdian(Request $request, $id)
    {
        $request->validate([
            'decision' => 'required|in:approve,reject',
            'notes' => 'nullable|string'
        ]);

        $usulan = \App\Models\UsulanPengabdian::findOrFail($id);

        // Security check
        $kaprodi = $this->getKaprodiProfile();
        $pengusulProdi = $usulan->ketua->dosen->prodi ?? null;

        if (!$kaprodi || $kaprodi->prodi !== $pengusulProdi) {
            abort(403);
        }

        if ($request->decision === 'approve') {
            // Status menjadi DISETUJUI KAPRODI (approved_prodi)
            $usulan->status = 'approved_prodi';
            $action = 'kaprodi_approved';
        } else {
            $usulan->status = 'ditolak_akhir';
            $action = 'kaprodi_rejected';
        }

        // Create History
        \App\Models\ReviewHistory::create([
            'usulan_id' => $usulan->id,
            'usulan_type' => get_class($usulan),
            'reviewer_id' => Auth::id(), // Kaprodi User ID
            'reviewer_type' => 'kaprodi',
            'action' => $action,
            'comments' => $request->notes,
            'reviewed_at' => now(),
        ]);

        $usulan->save();

        return redirect()->route('kaprodi.usulan.index')
            ->with('success', 'Usulan Pengabdian berhasil direview.');
    }
}
