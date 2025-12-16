<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaNonDosen;

class AnggotaNonDosenController extends Controller
{
    public function store(Request $request, $usulanId)
    {
        $validated = $request->validate([
            'jenis_anggota' => 'required|string',
            'no_identitas'  => 'required|string',
            'nama'          => 'required|string',
            'jurusan'       => 'nullable|string',
            'tugas'         => 'nullable|string',
        ]);

        AnggotaNonDosen::create([
            'usulan_id'     => $usulanId,
            'jenis_anggota' => $validated['jenis_anggota'],
            'no_identitas'  => $validated['no_identitas'],
            'nama'          => $validated['nama'],
            'jurusan'       => $validated['jurusan'] ?? null,
            'tugas'         => $validated['tugas'] ?? null,
            'status_approval' => 'pending',
        ]);

        return response()->json([
            'message' => 'Anggota non-dosen berhasil ditambahkan'
        ], 201);
    }
}
