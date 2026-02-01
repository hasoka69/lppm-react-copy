<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\CatatanHarianPenelitian;
use App\Models\CatatanHarianPenelitianFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CatatanHarianPenelitianController extends Controller
{
    /**
     * Tampilkan daftar usulan yang didanai untuk catatan harian
     */
    public function index()
    {
        $user = Auth::user();

        $fundedUsulan = UsulanPenelitian::where('user_id', '=', $user->id, 'and')
            ->where('status', '=', 'didanai', 'and')
            ->latest()
            ->get()
            ->map(function ($u) {
                $logs = CatatanHarianPenelitian::where('usulan_id', '=', $u->id, 'and')->get();
                return [
                    'id' => $u->id,
                    'judul' => $u->judul,
                    'skema' => $u->kelompok_skema,
                    'tahun' => $u->tahun_pertama,
                    'dana_disetujui' => (float) ($u->dana_disetujui ?? 0),
                    'last_percentage' => $logs->max('persentase') ?? 0,
                    'total_logs' => $logs->count(),
                ];
            });

        return Inertia::render('dosen/penelitian/CatatanHarian/Index', [
            'fundedUsulan' => $fundedUsulan
        ]);
    }

    /**
     * Tampilkan detail catatan harian untuk usulan tertentu
     */
    public function show(Request $request, $usulanId)
    {
        $usulan = UsulanPenelitian::where('user_id', '=', Auth::id(), 'and')
            ->where('status', '=', 'didanai', 'and')
            ->findOrFail($usulanId);

        $months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];

        $selectedMonth = $request->query('month', $months[date('n') - 1]);

        $logsQuery = CatatanHarianPenelitian::with('files')
            ->where('usulan_id', '=', $usulan->id, 'and')
            ->orderBy('tanggal', 'desc');

        if ($selectedMonth) {
            $monthIndex = array_search($selectedMonth, $months) + 1;
            $logsQuery->whereMonth('tanggal', '=', $monthIndex);
        }

        $logs = $logsQuery->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'tanggal' => $log->tanggal,
                'uraian_kegiatan' => $log->kegiatan,
                'persentase_capaian' => $log->persentase,
                'supporting_docs' => $log->files->map(function ($f) {
                    return [
                        'id' => $f->id,
                        'path' => $f->file_path,
                        'name' => $f->file_name
                    ];
                })
            ];
        });

        return Inertia::render('dosen/penelitian/CatatanHarian/Show', [
            'usulan' => $usulan,
            'logs' => $logs,
            'months' => $months,
            'selectedMonth' => $selectedMonth
        ]);
    }

    /**
     * Simpan catatan harian baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'usulan_id' => 'required|exists:usulan_penelitian,id',
            'tanggal' => 'required|date',
            'uraian_kegiatan' => 'required|string',
            'persentase_capaian' => 'required|integer|min:0|max:100',
            'files.*' => 'nullable|file|max:10240', // 10MB limit per file
        ]);

        $log = CatatanHarianPenelitian::create([
            'usulan_id' => $request->usulan_id,
            'user_id' => Auth::id(),
            'tanggal' => $request->tanggal,
            'kegiatan' => $request->uraian_kegiatan,
            'persentase' => $request->persentase_capaian,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('catatan_harian_penelitian/' . $log->id, 'public');
                CatatanHarianPenelitianFile::create([
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
            'uraian_kegiatan' => 'required|string',
            'persentase_capaian' => 'required|integer|min:0|max:100',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $log = CatatanHarianPenelitian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

        $log->update([
            'tanggal' => $request->tanggal,
            'kegiatan' => $request->uraian_kegiatan,
            'persentase' => $request->persentase_capaian,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('catatan_harian_penelitian/' . $log->id, 'public');
                CatatanHarianPenelitianFile::create([
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
        $log = CatatanHarianPenelitian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

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
        $file = CatatanHarianPenelitianFile::whereHas('catatan', function ($q) {
            $q->where('user_id', '=', Auth::id(), 'and');
        })->findOrFail($fileId);

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return back()->with('success', 'File berhasil dihapus.');
    }
}
