<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaNonDosen;

class AnggotaNonDosenController extends Controller
{
    public function store(Request $request, $usulanId)
    {
        $usulan = \App\Models\UsulanPenelitian::findOrFail($usulanId);

        $validated = $request->validate([
            'jenis_anggota' => 'required|string',
            'no_identitas' => 'required|string',
            'nama' => 'required|string',
            'jurusan' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        $anggota = AnggotaNonDosen::create([
            'usulan_id' => $usulanId,
            'jenis_anggota' => $validated['jenis_anggota'],
            'no_identitas' => $validated['no_identitas'],
            'nama' => $validated['nama'],
            'jurusan' => $validated['jurusan'] ?? null,
            'tugas' => $validated['tugas'] ?? null,
        ]);

        return response()->json([
            'message' => 'Anggota non-dosen berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $anggota = AnggotaNonDosen::findOrFail($id);

        $validated = $request->validate([
            'jenis_anggota' => 'sometimes|required|string',
            'no_identitas' => 'sometimes|required|string',
            'nama' => 'sometimes|required|string',
            'jurusan' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        $anggota->update($validated);

        return response()->json([
            'message' => 'Anggota non-dosen berhasil diperbarui',
            'data' => $anggota
        ]);
    }

    public function destroy($id)
    {
        $anggota = AnggotaNonDosen::findOrFail($id);

        $anggota->delete();

        return response()->json([
            'message' => 'Anggota non-dosen berhasil dihapus'
        ]);
    }
}
