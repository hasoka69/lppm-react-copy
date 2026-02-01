<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\ReviewHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    /**
     * Display the Reviewer Dashboard with real statistics.
     */
    public function dashboard()
    {
        $user = Auth::user();

        // 1. Calculate Stats
        // Pending: Assigned but not yet reviewed (status 'reviewer_assigned' typically)
        // OR check if no review history exists for assigned proposals.
        // For simplicity, let's trust the 'status' column on Usulan if it reflects reviewer stage.
        // 'reviewer_assigned', 'resubmitted_revision' -> PENDING
        // 'reviewed_approved', 'rejected_reviewer', 'under_revision_admin' -> PROCESSED (by this reviewer or partially)

        // However, a more accurate way for "My Stats" is checking ReviewHistory vs Assignment.
        // Let's stick to simple Status counts for now as it's faster.

        $pendingPenelitian = UsulanPenelitian::where('reviewer_id', $user->id)
            ->whereIn('status', ['reviewer_assigned', 'resubmitted_revision'])
            ->count();

        $pendingPengabdian = \App\Models\UsulanPengabdian::where('reviewer_id', $user->id) // Assuming assignment column exists/used
            ->whereIn('status', ['reviewer_assigned', 'resubmitted_revision', 'approved_prodi']) // 'approved_prodi' might be 'pool' or 'assigned'
            ->count();

        $totalPending = $pendingPenelitian + $pendingPengabdian;

        // Reviewed Stats (Approved/Rejected) based on History
        $history = ReviewHistory::where('reviewer_id', $user->id)
            ->where('reviewer_type', 'reviewer')
            ->get();

        $totalReviewed = $history->count();
        $totalApproved = $history->whereIn('action', ['reviewer_approved', 'reviewed_approved'])->count(); // Check action strings stored in history
        $totalRejected = $history->whereIn('action', ['reviewer_rejected', 'rejected_reviewer'])->count();

        // Recent Activities
        $recentActivities = ReviewHistory::with('usulan')
            ->where('reviewer_id', $user->id)
            ->where('reviewer_type', 'reviewer')
            ->latest('reviewed_at')
            ->take(5)
            ->get()
            ->map(function ($rev) {
                // Determine title/desc based on action
                $statusMap = [
                    'reviewer_approved' => 'Menyetujui Proposal',
                    'reviewed_approved' => 'Menyetujui Proposal', // Legacy/Duplicate check
                    'reviewer_rejected' => 'Menolak Proposal',
                    'rejected_reviewer' => 'Menolak Proposal',
                    'reviewer_revision_requested' => 'Meminta Revisi',
                ];

                $title = $statusMap[$rev->action] ?? 'Melakukan Review';
                // Fallback for usulan if deleted
                $usulanTitle = $rev->usulan->judul ?? 'Judul tidak tersedia';

                return [
                    'id' => $rev->id,
                    'title' => $title,
                    'desc' => "Anda {$title} \"{$usulanTitle}\"",
                    'time' => \Carbon\Carbon::parse($rev->reviewed_at)->diffForHumans(),
                    'type' => str_contains($rev->action, 'reject') ? 'danger' : (str_contains($rev->action, 'approv') ? 'success' : 'info')
                ];
            });

        // Profile Data supplement
        $profile = [
            'name' => $user->name,
            'role' => 'Reviewer Internal',
            'expertise' => $user->dosen->kepakaran ?? '-', // Assuming relation exists
            'avatar' => $user->avatar,
        ];

        return Inertia::render('reviewer/Dashboard', [
            'stats' => [
                'pending' => $totalPending,
                'reviewed' => $totalReviewed,
                'approved' => $totalApproved,
                'rejected' => $totalRejected,
            ],
            'recentActivities' => $recentActivities,
            'profile' => $profile
        ]);
    }

    /**
     * Display a list of proposals assigned to the current reviewer.
     */
    public function index()
    {
        $user = Auth::user();

        // 1. Penelitian
        $usulanPenelitian = UsulanPenelitian::with(['user.dosen'])
            ->where('reviewer_id', '=', $user->id, 'and')
            ->whereIn('status', ['reviewer_assigned', 'resubmitted_revision'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->user->name,
                'prodi' => $item->user->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal_pengajuan' => ($item->submitted_at ?? $item->created_at)->format('d M Y'),
                'tahun_pelaksanaan' => $item->tahun_pertama,
                'status' => $item->status,
                'type' => 'penelitian'
            ]);

        // 2. Pengabdian
        $usulanPengabdian = \App\Models\UsulanPengabdian::with(['ketua.dosen'])
            ->where('reviewer_id', '=', $user->id, 'and')
            ->whereIn('status', ['reviewer_assigned', 'resubmitted_revision'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->ketua->name,
                'prodi' => $item->ketua->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal_pengajuan' => ($item->submitted_at ?? $item->created_at)->format('d M Y'),
                'tahun_pelaksanaan' => $item->tahun_pertama,
                'status' => $item->status,
                'type' => 'pengabdian'
            ]);

        return Inertia::render('reviewer/usulan/Index', [
            'proposals' => $usulanPenelitian,
            'pengabdianProposals' => $usulanPengabdian
        ]);
    }

    /**
     * Display reviewer's assessment history
     */
    public function history()
    {
        $user = Auth::user();

        // Fetch all review histories by this reviewer
        // Note: Eager loading nested polymorphic can be tricky.
        // We use lazy loading or specific constraints if needed.
        // Both Usulan models have 'user' (or alias) and 'dosen' relationships available via user.
        $reviewHistories = ReviewHistory::with('usulan') // Load the polymorphic relation
            ->where('reviewer_id', '=', $user->id, 'and')
            ->where('reviewer_type', '=', 'reviewer', 'and')
            ->latest('reviewed_at')
            ->get()
            ->map(function ($review) {
                // Handle deletion or null
                if (!$review->usulan)
                    return null;

                // Distinguish attributes
                // UsulanPengabdian uses 'ketua' relation typically, but we added 'user' alias.
                // UsulanPenelitian uses 'user'.
                // We need to fetch the User Model to get Dosen.
                $userOwner = $review->usulan->user ?? $review->usulan->ketua;
                $dosen = $userOwner ? $userOwner->dosen : null;

                return [
                    'id' => $review->id,
                    'usulan_id' => $review->usulan_id,
                    'judul' => $review->usulan->judul,
                    'ketua' => $userOwner->name ?? 'Unknown',
                    'prodi' => $dosen->prodi ?? '-',
                    'action' => $review->action,
                    'comments' => $review->comments,
                    'reviewed_at' => $review->reviewed_at ? \Carbon\Carbon::parse($review->reviewed_at)->format('d M Y H:i') : '-',
                    'status_usulan' => $review->usulan->status,
                    'type' => str_contains($review->usulan_type, 'Pengabdian') ? 'Pengabdian' : 'Penelitian'
                ];
            })
            ->filter(); // Remove nulls

        return Inertia::render('reviewer/penilaian/Index', [
            'reviewHistories' => $reviewHistories
        ]);
    }

    /**
     * Display the proposal details for review (Steps 1-4).
     */
    public function show($id)
    {
        $user = Auth::user();

        // Ensure reviewer is assigned to this proposal
        $usulan = UsulanPenelitian::with([
            'user.dosen',
            'anggotaDosen',
            'anggotaNonDosen',
            'luaranList',
            'rabItems'
        ])
            ->where('id', '=', $id, 'and')
            ->where(function ($query) use ($user) {
                $query->where('reviewer_id', '=', $user->id, 'and')
                    ->orWhereHas('reviewHistories', function ($q) use ($user) {
                        $q->where('reviewer_id', '=', $user->id, 'and');
                    });
            })
            ->firstOrFail();

        return Inertia::render('reviewer/usulan/Review', [
            'proposal' => $usulan,
            'dosen' => $usulan->user->dosen, // Ketua info
        ]);
    }

    /**
     * Store the review decision.
     */
    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,revise',
            'comments' => 'required|string|min:10',
        ]);

        $usulan = UsulanPenelitian::where('id', '=', $id, 'and')
            ->where('reviewer_id', '=', Auth::id(), 'and')
            ->firstOrFail();

        DB::transaction(function () use ($request, $usulan) {
            $statusMap = [
                'approve' => 'reviewed_approved',
                'reject' => 'rejected_reviewer',
                'revise' => 'under_revision_admin'
            ];

            $newStatus = $statusMap[$request->action];

            $actionMap = [
                'approve' => 'reviewer_approved',
                'reject' => 'reviewer_rejected',
                'revise' => 'reviewer_revision_requested'
            ];

            // 1. Create Review History
            ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => get_class($usulan),
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'reviewer',
                'action' => $actionMap[$request->action],
                'comments' => $request->comments,
                'reviewed_at' => now(),
            ]);

            // 2. Update Proposal Status
            $usulan->update(['status' => $newStatus]);
        });

        return redirect()->route('reviewer.usulan.index')->with('success', 'Review berhasil dikirim.');
    }

    // ==========================================
    // SEKSI PENGABDIAN (Baru)
    // ==========================================

    public function indexPengabdian()
    {
        $user = Auth::user();

        // Fetch user's assigned Pengabdian proposals
        // Since we didn't add assignment logic yet, we might fallback to fetching 'approved_prodi' 
        // OR assuming auto-assignment logic exists. 
        // For simplicity now: fetch ALL 'approved_prodi' OR 'reviewer_review' (open pool or specific)
        // If specific assignment is needed, we need a helper.
        // Assuming OPEN POOL for now as Kaprodi didn't assign specific reviewer yet in previous step code.

        $usulanAssigned = \App\Models\UsulanPengabdian::with(['ketua.dosen'])
            // ->where('current_reviewer_id', $user->id) // Re-enable if stricter assignment needed
            ->whereIn('status', ['approved_prodi', 'reviewer_review', 'needs_revision'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->ketua->name,
                'prodi' => $item->ketua->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal_pengajuan' => ($item->submitted_at ?? $item->created_at)->format('d M Y'),
                'tahun_pelaksanaan' => $item->tahun_pertama,
                'status' => $item->status,
                'type' => 'pengabdian'
            ]);

        // If merged index view is preferred, return JSON.
        return response()->json($usulanAssigned);
    }

    public function showPengabdian($id)
    {
        $user = Auth::user();

        $usulan = \App\Models\UsulanPengabdian::with([
            'ketua.dosen',
            'anggotaDosen.dosen',
            'anggotaNonDosen', // Added
            'mitra',
            'luaranItems',
            'rabItems'
        ])
            ->findOrFail($id);

        // Authorization check if needed

        // Prepare dosen data with name from User if Dosen doesn't have it (or consistent naming)
        $dosenData = $usulan->ketua->dosen ? $usulan->ketua->dosen->toArray() : [];
        $dosenData['name'] = $usulan->ketua->name; // User name
        $dosenData['fakultas'] = $usulan->ketua->dosen->fakultas ?? '-'; // Handle optional fakultas

        return Inertia::render('reviewer/usulan/ReviewPengabdian', [
            'proposal' => $usulan,
            'dosen' => $dosenData, // Pass modified data
            'mitra' => $usulan->mitra, // Pass all mitras (collection)
            'anggotaNonDosen' => $usulan->anggotaNonDosen,
            'rabItem' => $usulan->rabItems,
            'luaran' => $usulan->luaranItems, // [NEW] Pass explicitly
            'totalAnggaran' => $usulan->getTotalAnggaran()
        ]);
    }

    public function storeReviewPengabdian(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,revise',
            'comments' => 'required|string|min:10',
        ]);

        $usulan = \App\Models\UsulanPengabdian::where('id', '=', $id, 'and')
            ->where('reviewer_id', '=', Auth::id(), 'and')
            ->firstOrFail();

        DB::transaction(function () use ($request, $usulan) {
            $statusMap = [
                'approve' => 'reviewed_approved',
                'reject' => 'rejected_reviewer',
                'revise' => 'under_revision_admin'
            ];
            $newStatus = $statusMap[$request->action];

            $actionMap = [
                'approve' => 'reviewer_approved',
                'reject' => 'reviewer_rejected',
                'revise' => 'reviewer_revision_requested'
            ];

            // 1. Create Review History (Polymorphic)
            ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => get_class($usulan),
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'reviewer',
                'action' => $actionMap[$request->action],
                'comments' => $request->comments,
                'reviewed_at' => now(),
            ]);

            // 2. Update Proposal Status
            $usulan->update(['status' => $newStatus]);
        });

        return redirect()->route('reviewer.usulan.index')->with('success', 'Review Pengabdian berhasil dikirim.');
    }
}
