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
        $usulan = UsulanPenelitian::where('user_id', Auth::id())->findOrFail($usulanId);

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

        $validated = $request->validate([
            'tipe' => 'required|in:bahan,pengumpulan_data',
            'kategori' => 'required|string|max:100',
            'item' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
            'volume' => 'required|integer|min:1',
            'harga_satuan' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem = RabItem::create([
                'usulan_id' => $usulan->id,
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

        $validated = $request->validate([
            'tipe' => 'sometimes|required|in:bahan,pengumpulan_data',
            'kategori' => 'sometimes|required|string|max:100',
            'item' => 'sometimes|required|string|max:255',
            'satuan' => 'sometimes|required|string|max:50',
            'volume' => 'sometimes|required|integer|min:1',
            'harga_satuan' => 'sometimes|required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $rabItem->update($validated);

            // Update total_anggaran di usulan_penelitian
            $usulan->update([
                'total_anggaran' => $usulan->getTotalAnggaran(),
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

        try {
            DB::beginTransaction();

            $rabItem->delete();

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