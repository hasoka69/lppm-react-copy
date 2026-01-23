<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\LuaranPengabdian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LuaranPengabdianController extends Controller
{
    /**
     * Tampilkan daftar luaran pengabdian
     */
    public function showLuaran($usulanId)
    {
        $usulan = UsulanPengabdian::where('user_id', Auth::id())->findOrFail($usulanId);
        $luaranList = $usulan->luaranItems()->get(); // Assuming relationship exists or we can just query

        return response()->json([
            'success' => true,
            'data' => $luaranList,
        ]);
    }

    /**
     * Tambah luaran pengabdian
     */
    public function storeLuaran(Request $request, UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Usulan tidak dalam tahap pengeditan'], 403);
        }

        $validated = $request->validate([
            'tahun' => 'required|integer|min:1|max:5',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'required|string|min:10',
            'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $luaran = LuaranPengabdian::create([
                'usulan_id' => $usulan->id,
                ...$validated,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Luaran pengabdian berhasil ditambahkan!',
                'data' => $luaran,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan luaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update luaran pengabdian
     */
    public function updateLuaran(Request $request, LuaranPengabdian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Usulan tidak dalam tahap pengeditan'], 403);
        }

        $validated = $request->validate([
            'tahun' => 'sometimes|required|integer|min:1|max:5',
            'kategori' => 'sometimes|required|string|max:100',
            'deskripsi' => 'sometimes|required|string|min:10',
            'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $luaran->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Luaran pengabdian berhasil diperbarui!',
                'data' => $luaran,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui luaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus luaran pengabdian
     */
    public function destroyLuaran(LuaranPengabdian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return response()->json(['success' => false, 'message' => 'Usulan tidak dalam tahap pengeditan'], 403);
        }

        try {
            $luaran->delete();

            return response()->json([
                'success' => true,
                'message' => 'Luaran pengabdian berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus luaran: ' . $e->getMessage(),
            ], 500);
        }
    }
}
