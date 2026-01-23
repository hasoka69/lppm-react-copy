<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\RabItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RabItemPengabdianController extends Controller
{
    /**
     * Tampilkan daftar RAB item Pengabdian
     */
    public function showRab($usulanId)
    {
        $usulan = UsulanPengabdian::where('user_id', Auth::id())->findOrFail($usulanId);

        // Fetch RAB items polymorphic
        $rabItems = $usulan->rabItems()->get();

        return response()->json([
            'success' => true,
            'data' => $rabItems,
            'total_anggaran' => $usulan->getTotalAnggaran(),
        ]);
    }

    /**
     * Tambah RAB item Pengabdian
     */
    public function storeRab(Request $request, UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tipe' => 'required|string|in:pelatihan,konsumsi,transport_mitra,alat_bahan',
            'kategori' => 'required|string|max:100', // Could be redundant if 'tipe' covers it, but keeping structure
            'item' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
            'volume' => 'required|integer|min:1',
            'harga_satuan' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Create Poly RabItem
            $rabItem = new RabItem([
                'tipe' => $validated['tipe'],
                'kategori' => $validated['kategori'],
                'item' => $validated['item'],
                'satuan' => $validated['satuan'],
                'volume' => $validated['volume'],
                'harga_satuan' => $validated['harga_satuan'],
                'keterangan' => $validated['keterangan'] ?? null,
            ]);

            // Set polymorphic relation manually or via relation create
            $rabItem->usulan_type = UsulanPengabdian::class;
            $rabItem->usulan_id = $usulan->id;
            $rabItem->total = $validated['volume'] * $validated['harga_satuan']; // explicitly set total if needed or let model boot handle it
            $rabItem->save();

            // Update total_anggaran di usulan_pengabdian
            $newTotal = $usulan->getTotalAnggaran();

            // Validation: Budget Limit
            if ($usulan->status === 'revision_dosen' && $usulan->dana_disetujui > 0 && $newTotal > $usulan->dana_disetujui) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Total anggaran melebihi dana yang ditetapkan Admin (' . number_format($usulan->dana_disetujui) . ')',
                ], 422);
            }

            $usulan->update([
                'total_anggaran' => $newTotal,
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
            Log::error('Failed to store RAB item', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan RAB item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update RAB item
     */
    public function updateRab(Request $request, RabItem $rabItem)
    {
        // Check ownership via usulan relation
        $usulan = $rabItem->usulan;

        // Ensure it is UsulanPengabdian
        if (!($usulan instanceof UsulanPengabdian)) {
            abort(404, 'Item not found in pengabdian scope');
        }

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Proposal tidak dalam tahap pengeditan.'], 403);
        }

        $validated = $request->validate([
            'tipe' => 'sometimes|required|string|in:pelatihan,konsumsi,transport_mitra,alat_bahan',
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

            // Allow model boot to recalc total or do it:
            if (isset($validated['volume']) || isset($validated['harga_satuan'])) {
                $rabItem->total = $rabItem->volume * $rabItem->harga_satuan;
                $rabItem->save(); // Save again if boot didn't trigger on update (standard update might not trigger saving event with changed values in some laravel versions without specific setup, but usually it does. explicit is safe)
            }

            // Update total_anggaran di usulan
            $newTotal = $usulan->getTotalAnggaran();

            // Validation: Budget Limit
            if ($usulan->status === 'revision_dosen' && $usulan->dana_disetujui > 0 && $newTotal > $usulan->dana_disetujui) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Total anggaran melebihi dana yang ditetapkan Admin (' . number_format($usulan->dana_disetujui) . ')',
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
     */
    public function destroyRab(RabItem $rabItem)
    {
        $usulan = $rabItem->usulan;
        if (!($usulan instanceof UsulanPengabdian) || $usulan->user_id !== Auth::id()) {
            abort(403);
        }

        // Restriction: Only allow editing in draft or revision_dosen
        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Proposal tidak dalam tahap pengeditan.'], 403);
        }

        try {
            DB::beginTransaction();
            RabItem::destroy($rabItem->id);
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
