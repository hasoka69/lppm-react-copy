<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaNonDosenPengabdian;
use App\Models\UsulanPengabdian;
use Illuminate\Support\Facades\Auth;

class AnggotaNonDosenPengabdianController extends Controller
{
    public function store(Request $request, $usulanId)
    {
        $usulan = UsulanPengabdian::findOrFail($usulanId);
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'jenis_anggota' => 'required|string',
            'no_identitas' => 'required|string',
            'nama' => 'required|string',
            'jurusan' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        $anggota = AnggotaNonDosenPengabdian::create([
            'usulan_id' => $usulanId,
            ...$validated
        ]);

        return response()->json([
            'message' => 'Anggota non-dosen pengabdian berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $anggota = AnggotaNonDosenPengabdian::findOrFail($id);
        if ($anggota->usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'jenis_anggota' => 'sometimes|required|string',
            'no_identitas' => 'sometimes|required|string',
            'nama' => 'sometimes|required|string',
            'jurusan' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        $anggota->update($validated);

        return response()->json([
            'message' => 'Anggota non-dosen pengabdian berhasil diperbarui',
            'data' => $anggota
        ]);
    }

    public function destroy($id)
    {
        $anggota = AnggotaNonDosenPengabdian::findOrFail($id);
        if ($anggota->usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $anggota->delete();

        return response()->json([
            'message' => 'Anggota non-dosen pengabdian berhasil dihapus'
        ]);
    }
}
