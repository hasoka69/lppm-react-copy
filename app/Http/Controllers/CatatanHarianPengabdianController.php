<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\CatatanHarianPengabdian;
use App\Models\CatatanHarianPengabdianFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CatatanHarianPengabdianController extends Controller
{
    /**
     * Tampilkan daftar usulan yang didanai untuk catatan harian
     */
    public function index()
    {
        $user = Auth::user();

        $fundedUsulan = UsulanPengabdian::where('user_id', '=', $user->id, 'and')
            ->where('status', '=', 'didanai', 'and')
            ->latest()
            ->get()
            ->map(function ($u) {
                $logs = CatatanHarianPengabdian::where('usulan_id', '=', $u->id, 'and')->get();
                return [
                    'id' => $u->id,
                    'judul' => $u->judul,
                    'skema' => $u->kelompok_skema,
                    'tahun' => $u->tahun_pertama,
                    'dana_disetujui' => $u->dana_disetujui,
                    'last_percentage' => $logs->max('persentase') ?? 0,
                    'total_logs' => $logs->count(),
                ];
            });

        return Inertia::render('dosen/pengabdian/CatatanHarian/Index', [
            'fundedUsulan' => $fundedUsulan
        ]);
    }

    /**
     * Tampilkan detail catatan harian untuk usulan tertentu
     */
    public function show($usulanId)
    {
        $usulan = UsulanPengabdian::where('user_id', '=', Auth::id(), 'and')
            ->where('status', '=', 'didanai', 'and')
            ->findOrFail($usulanId);

        $logs = CatatanHarianPengabdian::with('files')
            ->where('usulan_id', '=', $usulan->id, 'and')
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('dosen/pengabdian/CatatanHarian/Show', [
            'usulan' => $usulan,
            'logs' => $logs
        ]);
    }

    /**
     * Simpan catatan harian baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'usulan_id' => 'required|exists:usulan_pengabdian,id',
            'tanggal' => 'required|date',
            'kegiatan' => 'required|string',
            'persentase' => 'required|integer|min:0|max:100',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $log = CatatanHarianPengabdian::create([
            'usulan_id' => $request->usulan_id,
            'user_id' => Auth::id(),
            'tanggal' => $request->tanggal,
            'kegiatan' => $request->kegiatan,
            'persentase' => $request->persentase,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('catatan_harian_pengabdian/' . $log->id, 'public');
                CatatanHarianPengabdianFile::create([
                    'catatan_id' => $log->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return back()->with('success', 'Catatan harian berhasil disimpan.');
    }

    /**
     * Update catatan harian
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kegiatan' => 'required|string',
            'persentase' => 'required|integer|min:0|max:100',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $log = CatatanHarianPengabdian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

        $log->update([
            'tanggal' => $request->tanggal,
            'kegiatan' => $request->kegiatan,
            'persentase' => $request->persentase,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('catatan_harian_pengabdian/' . $log->id, 'public');
                CatatanHarianPengabdianFile::create([
                    'catatan_id' => $log->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return back()->with('success', 'Catatan harian berhasil diperbarui.');
    }

    /**
     * Hapus catatan harian
     */
    public function destroy($id)
    {
        $log = CatatanHarianPengabdian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

        foreach ($log->files as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        $log->delete();

        return back()->with('success', 'Catatan harian berhasil dihapus.');
    }

    /**
     * Hapus file tertentu dari catatan harian
     */
    public function destroyFile($fileId)
    {
        $file = CatatanHarianPengabdianFile::whereHas('catatan', function ($q) {
            $q->where('user_id', '=', Auth::id(), 'and');
        })->findOrFail($fileId);

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return back()->with('success', 'File berhasil dihapus.');
    }
}
