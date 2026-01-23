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
        $proposals = UsulanPenelitian::with(['ketua.dosen'])
            ->whereIn('status', ['submitted', 'approved_prodi', 'reviewer_assigned', 'under_revision_admin', 'revision_dosen', 'resubmitted_revision', 'reviewed_approved', 'didanai', 'ditolak_akhir', 'rejected_reviewer'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->ketua->name ?? '-',
                'prodi' => $item->ketua->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal' => $item->created_at->format('d M Y'),
                'status' => $item->status,
                'type' => 'penelitian'
            ]);

        return Inertia::render('lppm/penelitian/Index', [
            'proposals' => $proposals
        ]);
    }

    /**
     * Display a list of all Community Service proposals for Admin LPPM.
     */
    public function indexPengabdian()
    {
        $proposals = UsulanPengabdian::with(['ketua.dosen'])
            ->whereIn('status', ['submitted', 'approved_prodi', 'reviewer_assigned', 'under_revision_admin', 'revision_dosen', 'resubmitted_revision', 'reviewed_approved', 'didanai', 'ditolak_akhir', 'rejected_reviewer'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'ketua' => $item->ketua->name ?? '-',
                'prodi' => $item->ketua->dosen->prodi ?? '-',
                'skema' => $item->kelompok_skema,
                'tanggal' => $item->created_at->format('d M Y'),
                'status' => $item->status,
                'type' => 'pengabdian'
            ]);

        return Inertia::render('lppm/pengabdian/Index', [
            'proposals' => $proposals
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
            'reviewHistories.reviewer'
        ])->findOrFail($id);

        return Inertia::render('lppm/penelitian/Detail', [
            'usulan' => $usulan,
            'reviewers' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'Reviewer'))->get(['id', 'name'])
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
            'reviewHistories.reviewer'
        ])->findOrFail($id);

        return Inertia::render('lppm/pengabdian/Detail', [
            'usulan' => $usulan,
            'reviewers' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'Reviewer'))->get(['id', 'name'])
        ]);
    }

    /**
     * Store final decision for Pengabdian.
     */
    public function storeDecision(Request $request, $id)
    {
        $request->validate([
            'decision' => 'required|in:didanai,ditolak,needs_revision',
            'notes' => 'nullable|string'
        ]);

        $usulan = UsulanPengabdian::findOrFail($id);

        DB::transaction(function () use ($request, $usulan) {
            $usulan->update(['status' => $request->decision]);

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
        $request->validate(['decision' => 'required|in:didanai,ditolak_akhir']);

        $model = $type === 'penelitian' ? UsulanPenelitian::class : UsulanPengabdian::class;
        $usulan = $model::findOrFail($id);

        $usulan->update(['status' => $request->decision]);

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
}
