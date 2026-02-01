<?php
// app/Http/Controllers/RabItemController.php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\RabItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RabItemController extends Controller
{
    /**
     * Tampilkan daftar RAB item
     * GET /pengajuan/{usulanId}/rab
     */
    public function showRab($usulanId)
    {
        $usulan = UsulanPenelitian::query()->where('user_id', '=', Auth::id())->findOrFail($usulanId);

        $rabItems = $usulan->rabItems()->get();

        return response()->json([
            'success' => true,
            'data' => $rabItems,
            'total_anggaran' => $usulan->getTotalAnggaran(),
        ]);
    }

    /**
     * Tambah RAB item
     * POST /pengajuan/{usulan}/rab
     */
    public function storeRab(Request $request, UsulanPenelitian $usulan)
    {
        /** @var \App\Models\UsulanPenelitian $usulan */
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Usulan tidak dalam tahap pengeditan'], 403);
        }

        $validated = $request->validate([
            'tipe' => 'required|string|in:bahan,perjalanan,publikasi,pengumpulan_data',
            'kategori' => 'nullable|string|max:100',
            'item' => 'required|string|max:255',
            'satuan' => 'nullable|string|max:50',
            'volume' => 'required|integer|min:1',
            'harga_satuan' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem = RabItem::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => UsulanPenelitian::class,
                ...$validated,
            ]);

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil ditambahkan!',
                'data' => $rabItem,
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update RAB item
     * PUT /pengajuan/rab/{rabItem}
     */
    public function updateRab(Request $request, RabItem $rabItem)
    {
        $usulan = $rabItem->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Usulan tidak dalam tahap pengeditan'], 403);
        }

        $validated = $request->validate([
            'tipe' => 'sometimes|required|string|in:bahan,perjalanan,publikasi,pengumpulan_data',
            'kategori' => 'nullable|string|max:100',
            'item' => 'sometimes|required|string|max:255',
            'satuan' => 'nullable|string|max:50',
            'volume' => 'sometimes|required|integer|min:1',
            'harga_satuan' => 'sometimes|required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem->update($validated);

            // Update total_anggaran di usulan_penelitian
            $newTotal = $usulan->getTotalAnggaran();

            // Validation: Budget Limit
            if ($usulan->status === 'revision_dosen' && $usulan->dana_disetujui > 0 && $newTotal > $usulan->dana_disetujui) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Total anggaran melebihi dana yang ditetapkan Admin (' . number_format($usulan->dana_disetujui, 0, ',', '.') . ')',
                ], 422);
            }

            $usulan->update([
                'total_anggaran' => $newTotal,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil diperbarui!',
                'data' => $rabItem,
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus RAB item
     * DELETE /pengajuan/rab/{rabItem}
     */
    public function destroyRab(RabItem $rabItem)
    {
        $usulan = $rabItem->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        // Restriction: Only allow editing in draft or revision_dosen
        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Proposal tidak dalam tahap pengeditan.'], 403);
        }

        try {
            DB::beginTransaction();

            RabItem::query()->where('id', '=', $rabItem->id)->delete();

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'RAB item berhasil dihapus!',
                'total_anggaran' => $usulan->getTotalAnggaran(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }
}