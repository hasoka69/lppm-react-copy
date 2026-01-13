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

        // Fetch stats based on Prodi
        $stats = [
            'waiting_review' => UsulanPenelitian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })->where('status', 'submitted')->count(),

            'forwarded' => UsulanPenelitian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })->whereIn('status', ['approved_prodi', 'reviewer_review'])->count(),

            'rejected' => UsulanPenelitian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })->where('status', 'rejected_prodi')->count(),
        ];

        // Fetch recent proposals (limit 5)
        $recentProposals = UsulanPenelitian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', '!=', 'draft')
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
                    'date' => $usulan->created_at->format('d M Y'),
                    'status' => $usulan->status,
                ];
            });

        return Inertia::render('kaprodi/Dashboard', [
            'program' => [
                'name' => $prodi,
                'faculty' => 'Fakultas Teknik', // Placeholder or fetch from relation
                'lecturers_count' => \App\Models\Dosen::where('prodi', $prodi)->count(),
                'proposals_2024' => UsulanPenelitian::whereHas('ketua.dosen', function ($q) use ($prodi) {
                    $q->where('prodi', $prodi);
                })->whereYear('created_at', date('Y'))->count(),
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

        $usulanList = UsulanPenelitian::with(['ketua.dosen'])
            ->whereHas('ketua.dosen', function ($q) use ($prodi) {
                $q->where('prodi', $prodi);
            })
            ->where('status', '!=', 'draft') // Only show submitted
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
                ];
            });

        return Inertia::render('kaprodi/usulan/Index', [
            'usulanList' => $usulanList,
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
            // Find a reviewer to assign (simple: get first user with 'Reviewer' role)
            $reviewer = User::role('Reviewer')->first();

            if (!$reviewer) {
                return back()->with('error', 'Tidak ada reviewer yang tersedia. Hubungi admin.');
            }

            $usulan->status = 'approved_prodi';
            $usulan->current_reviewer_id = $reviewer->id;
            $usulan->kaprodi_reviewer_id = Auth::id();
        } else {
            $usulan->status = 'rejected_prodi';
        }

        // Save review notes if needed (e.g. in a separate Review model)
        // For now, simplistically updating status

        $usulan->save();

        return redirect()->route('kaprodi.usulan.index')
            ->with('success', 'Usulan berhasil direview.');
    }
}
