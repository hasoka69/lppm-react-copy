<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaPenelitian;
use App\Models\AnggotaNonDosen;
use App\Models\UsulanPenelitian;
use Illuminate\Support\Facades\Auth;

class AnggotaApprovalController extends Controller
{
    /**
     * Approve anggota dosen
     * POST /pengajuan/{usulan}/anggota-dosen/{anggota}/approve
     */
    public function approveDosen(Request $request, $usulanId, $anggotaId)
    {
        $usulan = UsulanPenelitian::findOrFail($usulanId);
        $anggota = AnggotaPenelitian::findOrFail($anggotaId);

        // Verify anggota belongs to usulan
        if ($anggota->usulan_penelitian_id != $usulanId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Verify user is the invited dosen
        if ($anggota->dosen_id && $anggota->dosen->user_id !== Auth::id()) {
            return response()->json(['message' => 'Only invited dosen can approve'], 403);
        }

        // Update status
        $anggota->update([
            'status_approval' => 'approved',
            'approved_at' => now(),
            'approval_comment' => null
        ]);

        return response()->json([
            'message' => 'Anggota approved successfully',
            'data' => $anggota
        ]);
    }

    /**
     * Reject anggota dosen
     * POST /pengajuan/{usulan}/anggota-dosen/{anggota}/reject
     */
    public function rejectDosen(Request $request, $usulanId, $anggotaId)
    {
        $request->validate([
            'comment' => 'required|string|max:500'
        ]);

        $usulan = UsulanPenelitian::findOrFail($usulanId);
        $anggota = AnggotaPenelitian::findOrFail($anggotaId);

        // Verify anggota belongs to usulan
        if ($anggota->usulan_penelitian_id != $usulanId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Verify user is the invited dosen
        if ($anggota->dosen_id && $anggota->dosen->user_id !== Auth::id()) {
            return response()->json(['message' => 'Only invited dosen can reject'], 403);
        }

        // Update status
        $anggota->update([
            'status_approval' => 'rejected',
            'approval_comment' => $request->input('comment')
        ]);

        return response()->json([
            'message' => 'Anggota rejected',
            'data' => $anggota
        ]);
    }

    /**
     * Approve anggota non-dosen
     * POST /pengajuan/{usulan}/anggota-non-dosen/{anggota}/approve
     */
    public function approveNonDosen(Request $request, $usulanId, $anggotaId)
    {
        $usulan = UsulanPenelitian::findOrFail($usulanId);
        $anggota = AnggotaNonDosen::findOrFail($anggotaId);

        // Verify anggota belongs to usulan
        if ($anggota->usulan_penelitian_id != $usulanId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update status
        $anggota->update([
            'status_approval' => 'approved',
            'approved_at' => now(),
            'approval_comment' => null
        ]);

        return response()->json([
            'message' => 'Anggota approved successfully',
            'data' => $anggota
        ]);
    }

    /**
     * Reject anggota non-dosen
     * POST /pengajuan/{usulan}/anggota-non-dosen/{anggota}/reject
     */
    public function rejectNonDosen(Request $request, $usulanId, $anggotaId)
    {
        $request->validate([
            'comment' => 'required|string|max:500'
        ]);

        $usulan = UsulanPenelitian::findOrFail($usulanId);
        $anggota = AnggotaNonDosen::findOrFail($anggotaId);

        // Verify anggota belongs to usulan
        if ($anggota->usulan_penelitian_id != $usulanId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update status
        $anggota->update([
            'status_approval' => 'rejected',
            'approval_comment' => $request->input('comment')
        ]);

        return response()->json([
            'message' => 'Anggota rejected',
            'data' => $anggota
        ]);
    }
}
