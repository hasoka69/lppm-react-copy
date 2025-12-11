<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\LuaranPenelitian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LuaranPenelitianController extends Controller
{
    /**
     * Tampilkan daftar luaran penelitian
     */
    public function showLuaran($usulanId)
    {
        $usulan = UsulanPenelitian::where('user_id', Auth::id())->findOrFail($usulanId);

        $luaranList = $usulan->luaranList()->get();

        return response()->json([
            'success' => true,
            'data' => $luaranList,
        ]);
    }

    /**
     * Tambah luaran penelitian
     */
    public function storeLuaran(Request $request, UsulanPenelitian $usulan)
    {
        /** @var \App\Models\UsulanPenelitian $usulan */
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tahun' => 'required|integer|min:1|max:5',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'required|string|min:10',
            'status' => 'nullable|in:Rencana,Dalam Proses,Selesai',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $luaran = LuaranPenelitian::create([
                'usulan_id' => $usulan->id,
                ...$validated,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Luaran berhasil ditambahkan!',
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
     * Update luaran penelitian
     */
    public function updateLuaran(Request $request, LuaranPenelitian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
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
                'message' => 'Luaran berhasil diperbarui!',
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
     * Hapus luaran penelitian
     */
    public function destroyLuaran(LuaranPenelitian $luaran)
    {
        $usulan = $luaran->usulan;

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            $luaran->delete();

            return response()->json([
                'success' => true,
                'message' => 'Luaran berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus luaran: ' . $e->getMessage(),
            ], 500);
        }
    }
}
