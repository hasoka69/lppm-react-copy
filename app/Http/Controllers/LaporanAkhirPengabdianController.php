<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\LuaranPengabdian;
use App\Models\LaporanAkhirPengabdian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanAkhirPengabdianController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $fundedUsulan = UsulanPengabdian::where('user_id', '=', $user->id, 'and')
            ->where('status', '=', 'didanai', 'and')
            ->latest()
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'judul' => $u->judul,
                'skema' => $u->kelompok_skema,
                'tahun_pertama' => $u->tahun_pertama,
                'dana_disetujui' => $u->dana_disetujui,
                'report' => LaporanAkhirPengabdian::where('usulan_id', '=', $u->id, 'and')->first(),
            ]);

        return Inertia::render('dosen/pengabdian/LaporanAkhir/Index', [
            'fundedUsulan' => $fundedUsulan
        ]);
    }

    public function show($usulanId)
    {
        $usulan = UsulanPengabdian::with(['luaranItems'])
            ->where('user_id', '=', Auth::id(), 'and')
            ->where('status', '=', 'didanai', 'and')
            ->findOrFail($usulanId);

        $report = LaporanAkhirPengabdian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => Auth::id(), 'status' => 'Draft']
        );

        return Inertia::render('dosen/pengabdian/LaporanAkhir/Detail', [
            'usulan' => $usulan,
            'report' => $report,
            'outputs' => $usulan->luaranItems
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'ringkasan' => 'required|string',
            'keyword' => 'required|string|max:255',
            'file_laporan' => 'nullable|file|mimes:pdf|max:10240',
            'file_poster' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'url_video' => 'nullable|url|max:255',
        ]);

        $report = LaporanAkhirPengabdian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

        if ($report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan tidak dapat diubah.');
        }

        $data = $request->only(['ringkasan', 'keyword', 'url_video']);

        if ($request->hasFile('file_laporan')) {
            if ($report->file_laporan) {
                Storage::disk('public')->delete($report->file_laporan);
            }
            $path = $request->file('file_laporan')->store('laporan_akhir_pengabdian', 'public');
            $data['file_laporan'] = $path;
        }

        if ($request->hasFile('file_poster')) {
            if ($report->file_poster) {
                Storage::disk('public')->delete($report->file_poster);
            }
            $path = $request->file('file_poster')->store('laporan_akhir_pengabdian/poster', 'public');
            $data['file_poster'] = $path;
        }

        $report->update($data);

        return back()->with('success', 'Data laporan akhir berhasil disimpan.');
    }

    public function updateLuaran(Request $request, $luaranId)
    {
        $request->validate([
            'judul_realisasi_akhir' => 'required|string|max:500',
            'status_akhir' => 'required|string',
            'peran_penulis' => 'nullable|string|max:100',
            'nama_jurnal' => 'nullable|string|max:255',
            'issn' => 'nullable|string|max:100',
            'pengindek' => 'nullable|string|max:100',
            'keterangan_akhir' => 'nullable|string',
            'file_bukti_akhir' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:10240',
            'url_bukti_akhir' => 'nullable|url',
        ]);

        $luaran = LuaranPengabdian::whereHas('usulan', function ($q) {
            $q->where('user_id', '=', Auth::id(), 'and');
        })->findOrFail($luaranId);

        $report = LaporanAkhirPengabdian::where('usulan_id', '=', $luaran->usulan_id, 'and')->first();
        if ($report && $report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan tidak dapat diubah.');
        }

        $data = $request->except(['file_bukti_akhir']);

        if ($request->hasFile('file_bukti_akhir')) {
            if ($luaran->file_bukti_akhir) {
                Storage::disk('public')->delete($luaran->file_bukti_akhir);
            }
            $path = $request->file('file_bukti_akhir')->store('bukti_luaran_pengabdian_akhir', 'public');
            $data['file_bukti_akhir'] = $path;
        }

        $luaran->update($data);

        return back()->with('success', 'Realisasi luaran akhir berhasil diperbarui.');
    }

    public function updateSPTB(Request $request, $id)
    {
        $request->validate([
            'file_sptb' => 'required|file|mimes:pdf|max:10240',
        ]);

        $report = LaporanAkhirPengabdian::findOrFail($id);

        if ($report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan SPTB tidak dapat diubah.');
        }

        if ($request->hasFile('file_sptb')) {
            if ($report->file_sptb) {
                Storage::disk('public')->delete($report->file_sptb);
            }
            $path = $request->file('file_sptb')->store('laporan_akhir_pengabdian/sptb', 'public');
            $report->update(['file_sptb' => $path]);
        }

        return back()->with('success', 'File SPTB akhir berhasil diunggah.');
    }

    public function submit($usulanId)
    {
        $report = LaporanAkhirPengabdian::where('usulan_id', '=', $usulanId, 'and')
            ->where('user_id', '=', Auth::id(), 'and')
            ->firstOrFail();

        if (!$report->file_poster) {
            return back()->with('error', "Dokumen Poster (Wajib) harus diunggah.");
        }

        $mandatoryOutputs = LuaranPengabdian::where('usulan_id', '=', $usulanId, 'and')
            ->where('is_wajib', '=', true, 'and')
            ->get();

        foreach ($mandatoryOutputs as $output) {
            if (!$output->judul_realisasi_akhir) {
                return back()->with('error', "Luaran Wajib '{$output->kategori}' harus diisi realisasi akhirnya.");
            }
        }

        $report->update([
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        return redirect()->route('dosen.pengabdian.laporan-akhir.index')
            ->with('success', 'Laporan Akhir berhasil disubmit.');
    }
}
