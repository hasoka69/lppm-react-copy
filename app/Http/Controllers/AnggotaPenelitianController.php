<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnggotaPenelitian;
use App\Models\Dosen;

class AnggotaPenelitianController extends Controller
{
    public function index($usulanId)
    {
        $data = AnggotaPenelitian::where('usulan_id', $usulanId)
            ->with('dosen')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nidn' => $item->nidn,
                    'nama' => $item->nama,
                    'status_approval' => $item->status_approval,
                ];
            });

        return response()->json([
            'data' => $data
        ]);
    }

    public function store(Request $request, $usulanId)
    {
        $request->validate([
            'nidn' => 'required',
            'nama' => 'required',
            'peran' => 'required|in:ketua,anggota',
            'prodi' => 'nullable|string',
            'tugas' => 'nullable|string',
        ]);

        // Check if anggota with same NIDN already exists
        $exists = AnggotaPenelitian::where('usulan_id', $usulanId)
            ->where('nidn', $request->nidn)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Dosen sudah terdaftar pada penelitian ini'
            ], 422);
        }

        $anggota = AnggotaPenelitian::create([
            'usulan_id' => $usulanId,
            'nidn'      => $request->nidn,
            'nama'      => $request->nama,
            'peran'     => $request->peran,
            'prodi'     => $request->prodi,
            'tugas'     => $request->tugas,
            'status_approval' => 'pending',
        ]);

        return response()->json([
            'message' => 'Anggota dosen berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function destroy($id)
    {
        AnggotaPenelitian::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Anggota dihapus'
        ]);
    }
}
