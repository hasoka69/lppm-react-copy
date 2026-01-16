<?php

namespace App\Http\Controllers;

use App\Models\MitraPengabdian;
use App\Models\UsulanPengabdian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MitraPengabdianController extends Controller
{
    /**
     * Store a newly created Mitra in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'usulan_id' => 'required|exists:usulan_pengabdian,id',
            'nama_mitra' => 'required|string',
            'jenis_mitra' => 'required|string',
            'pendanaan_tahun_1' => 'nullable|numeric',
            'nama_provinsi' => 'required|string|max:255',
            'nama_kota' => 'required|string|max:255',
            'alamat_mitra' => 'nullable|string',
            'penanggung_jawab' => 'nullable|string',
            'kontak_mitra' => 'nullable|string', // Frontend sends kontak_mitra
            'provinsi_id' => 'nullable',
            'kota_id' => 'nullable',
        ]);

        // Ensure user owns the usulan
        $usulan = UsulanPengabdian::where('id', $request->usulan_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Map frontend fields to DB columns if needed
        $data = $request->except(['file_mitra']);
        $data['no_telepon'] = $request->kontak_mitra; // Map kontak_mitra -> no_telepon

        // Handle File Upload
        if ($request->hasFile('file_mitra')) {
            $path = $request->file('file_mitra')->store('mitra_files', 'public');
            $data['file_surat_kesediaan'] = $path; // Fixed column name
        }

        $mitra = MitraPengabdian::create($data);

        if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json(['mitra' => $mitra, 'message' => 'Mitra berhasil ditambahkan']);
        }

        return back()->with('success', 'Mitra berhasil ditambahkan');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $mitra = MitraPengabdian::findOrFail($id);

        // Check ownership
        if ($mitra->usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $mitra->delete();

        return back()->with('success', 'Mitra berhasil dihapus');
    }
}
