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
     * Display a list of proposals assigned to the current reviewer.
     */
    public function index()
    {
        $user = Auth::user();

        // Ambil usulan yang tugaskan ke reviewer ini (current_reviewer_id)
        // Atau history review jika ingin melihat yang sudah direview
        $usulanAssigned = UsulanPenelitian::with(['user.dosen'])
            ->where('current_reviewer_id', $user->id)
            ->whereIn('status', ['approved_prodi', 'reviewer_review', 'needs_revision']) // Status yang relevan
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->user->name,
                'prodi' => $item->user->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal_pengajuan' => $item->submitted_at ? $item->submitted_at->format('d M Y') : '-',
                'status' => $item->status,
            ]);

        return Inertia::render('reviewer/usulan/Index', [
            'proposals' => $usulanAssigned
        ]);
    }

    /**
     * Display reviewer's assessment history
     */
    public function history()
    {
        $user = Auth::user();

        // Fetch all review histories by this reviewer
        $reviewHistories = ReviewHistory::with(['usulan.user.dosen'])
            ->where('reviewer_id', $user->id)
            ->where('reviewer_type', 'reviewer')
            ->latest('reviewed_at')
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'usulan_id' => $review->usulan_id,
                'judul' => $review->usulan->judul,
                'ketua' => $review->usulan->user->name,
                'prodi' => $review->usulan->user->dosen->prodi ?? '-',
                'action' => $review->action,
                'comments' => $review->comments,
                'reviewed_at' => $review->reviewed_at->format('d M Y H:i'),
                'status_usulan' => $review->usulan->status,
            ]);

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
            'luaranList'
        ])
            ->where('id', $id)
            // Check if assigned OR if they have reviewed it previously (for history)
            ->where(function ($query) use ($user) {
                $query->where('current_reviewer_id', $user->id)
                    ->orWhereHas('reviewHistories', function ($q) use ($user) {
                        $q->where('reviewer_id', $user->id);
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

        $usulan = UsulanPenelitian::where('id', $id)
            ->where('current_reviewer_id', Auth::id())
            ->firstOrFail();

        DB::transaction(function () use ($request, $usulan) {
            // Map action to review history action
            $actionMap = [
                'approve' => 'reviewer_approved',
                'reject' => 'reviewer_rejected',
                'revise' => 'reviewer_revision_requested'
            ];

            $action = $actionMap[$request->action];

            // Map action to proposal status
            $statusMap = [
                'approve' => 'didanai',
                'reject' => 'ditolak',
                'revise' => 'needs_revision'
            ];

            $newStatus = $statusMap[$request->action];

            // 1. Create Review History
            ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'reviewer',
                'action' => $action,
                'comments' => $request->comments,
                'reviewed_at' => now(),
            ]);

            // 2. Update Proposal Status
            $updateData = [
                'status' => $newStatus,
            ];

            // If approved or rejected, clear reviewer assignment
            if ($request->action !== 'revise') {
                $updateData['current_reviewer_id'] = null;
            }

            // Increment revision count if requesting revision
            if ($request->action === 'revise') {
                $usulan->increment('revision_count');
            }

            $usulan->update($updateData);
        });

        return redirect()->route('reviewer.usulan.index')->with('success', 'Review berhasil dikirim.');
    }
}
