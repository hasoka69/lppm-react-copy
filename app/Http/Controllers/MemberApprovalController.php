<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaPenelitian;
use App\Models\AnggotaPengabdian;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MemberApprovalController extends Controller
{
    /**
     * Get pending invitations for the authenticated user (Dosen).
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Find Dosen ID
        $dosen = $user->dosen;
        if (!$dosen) {
            return response()->json(['data' => []]);
        }

        // Fetch pending from Penelitian
        $penelitian = AnggotaPenelitian::with(['usulanPenelitian.ketua'])
            ->where('dosen_id', $dosen->id)
            ->where('status_approval', 'pending')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'penelitian',
                    'judul' => $item->usulanPenelitian?->judul ?? 'Judul Tidak Tersedia',
                    'ketua' => $item->usulanPenelitian?->ketua?->name ?? 'Nama Ketua Tidak Tersedia', // Fixed: nama -> name
                    'created_at' => $item->created_at,
                ];
            });

        // Fetch pending from Pengabdian
        $pengabdian = AnggotaPengabdian::with(['usulan.ketua'])
            ->where('dosen_id', $dosen->id)
            ->where('status_approval', 'pending')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'pengabdian',
                    'judul' => $item->usulan?->judul ?? 'Judul Tidak Tersedia',
                    'ketua' => $item->usulan?->ketua?->name ?? 'Nama Ketua Tidak Tersedia', // Fixed: nama -> name
                    'created_at' => $item->created_at,
                ];
            });

        $merged = $penelitian->merge($pengabdian)->sortByDesc('created_at')->values();

        return response()->json([
            'data' => $merged
        ]);
    }

    public function accept($type, $id)
    {
        return $this->processApproval($type, $id, 'accepted');
    }

    public function reject($type, $id)
    {
        return $this->processApproval($type, $id, 'rejected');
    }

    private function processApproval($type, $id, $status)
    {
        $user = Auth::user();
        $dosen = $user->dosen;

        if (!$dosen) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Determine Model
        $modelClass = $type === 'penelitian' ? AnggotaPenelitian::class : AnggotaPengabdian::class;

        $anggota = $modelClass::find($id);

        if (!$anggota) {
            return response()->json(['message' => 'Invitation not found'], 404);
        }

        if ($anggota->dosen_id !== $dosen->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $anggota->update(['status_approval' => $status]);

        // If rejected, maybe revert proposal to draft if it was already submitted? 
        // User logic: "Rejection should revert the proposal to draft status."
        if ($status === 'rejected') {
            $usulan = $type === 'penelitian' ? $anggota->usulanPenelitian : $anggota->usulan;
            if ($usulan && $usulan->status !== 'draft') {
                $usulan->update(['status' => 'draft']);
            }
        } elseif ($status === 'accepted') {
            // Check if all *LECTURER* members have approved
            $usulan = $type === 'penelitian' ? $anggota->usulanPenelitian : $anggota->usulan;

            if ($usulan && $usulan->status === 'waiting_member_approval') {
                // Count pending lecturers only
                $pendingLecturers = $modelClass::where('usulan_id', $usulan->id)
                    ->where('status_approval', 'pending')
                    ->count();

                if ($pendingLecturers === 0) {
                    // All lecturers approved -> Advance status
                    // 'submitted' or 'auto_submitted'? Using 'submitted' for now as per standard flow.
                    $usulan->update(['status' => 'submitted']);
                }
            }
        }

        return response()->json([
            'message' => 'Invitation ' . $status,
            'status' => $status
        ]);
    }
}
