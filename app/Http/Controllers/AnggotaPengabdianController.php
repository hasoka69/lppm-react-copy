<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaPengabdian;
use App\Models\UsulanPengabdian;
use Illuminate\Support\Facades\Auth;

class AnggotaPengabdianController extends Controller
{
    public function store(Request $request, $usulanId)
    {
        $usulan = UsulanPengabdian::findOrFail($usulanId);
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'nidn' => 'required',
            'nama' => 'required',
            'peran' => 'required|in:ketua,anggota',
            'prodi' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        $exists = AnggotaPengabdian::where('usulan_id', $usulanId)
            ->where('nidn', $request->nidn)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Dosen sudah terdaftar pada pengabdian ini'
            ], 422);
        }

        $anggota = AnggotaPengabdian::create([
            'usulan_id' => $usulanId,
            'nidn' => $request->nidn,
            'nama' => $request->nama,
            'peran' => $request->peran,
            'tugas' => $request->tugas,
            'status_persetujuan' => 'menunggu',
        ]);

        return response()->json([
            'message' => 'Anggota dosen pengabdian berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $anggota = AnggotaPengabdian::findOrFail($id);
        if ($anggota->usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'peran' => 'sometimes|required|in:ketua,anggota',
            'tugas' => 'nullable|string',
        ]);

        $anggota->update($validated);

        return response()->json([
            'message' => 'Anggota dosen pengabdian berhasil diperbarui',
            'data' => $anggota
        ]);
    }

    public function destroy($id)
    {
        $anggota = AnggotaPengabdian::findOrFail($id);
        if ($anggota->usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $anggota->delete();

        return response()->json([
            'message' => 'Anggota dosen pengabdian berhasil dihapus'
        ]);
    }
}
