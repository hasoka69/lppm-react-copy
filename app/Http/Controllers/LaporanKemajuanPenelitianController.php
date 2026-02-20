<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use App\Models\LuaranPenelitian;
use App\Models\LaporanKemajuanPenelitian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanKemajuanPenelitianController extends Controller
{
    /**
     * Tampilkan daftar usulan yang didanai untuk laporan kemajuan
     */
    public function index()
    {
        $user = Auth::user();

        $fundedUsulan = UsulanPenelitian::where('user_id', '=', $user->id, 'and')
            ->where('status', '=', 'didanai', 'and')
            ->latest()
            ->paginate(10)
            ->through(fn($u) => [
                'id' => $u->id,
                'judul' => $u->judul,
                'skema' => $u->kelompok_skema,
                'tahun_pertama' => $u->tahun_pertama,
                'dana_disetujui' => (float) ($u->dana_disetujui ?? 0),
                // Check if already has a report
                'report' => LaporanKemajuanPenelitian::where('usulan_id', '=', $u->id, 'and')->first(),
            ]);

        return Inertia::render('dosen/penelitian/LaporanKemajuan/Index', [
            'fundedUsulan' => $fundedUsulan
        ]);
    }

    /**
     * Tampilkan detail laporan kemajuan untuk usulan tertentu
     */
    public function show($usulanId)
    {
        $usulan = UsulanPenelitian::with(['luaranList'])
            ->where('user_id', '=', Auth::id(), 'and')
            ->where('status', '=', 'didanai', 'and')
            ->findOrFail($usulanId);

        $report = LaporanKemajuanPenelitian::firstOrCreate(
            ['usulan_id' => $usulan->id],
            ['user_id' => Auth::id(), 'status' => 'Draft']
        );

        return Inertia::render('dosen/penelitian/LaporanKemajuan/Detail', [
            'usulan' => $usulan,
            'laporan_kemajuan' => $report,
            'outputs' => $usulan->luaranList
        ]);
    }

    /**
     * Update data laporan (Ringkasan, Keyword, File Laporan)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'ringkasan' => 'required|string',
            'keyword' => 'required|string|max:255',
            'file_laporan' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $report = LaporanKemajuanPenelitian::where('user_id', '=', Auth::id(), 'and')->findOrFail($id);

        if ($report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan tidak dapat diubah.');
        }

        $data = $request->only(['ringkasan', 'keyword']);

        if ($request->hasFile('file_laporan')) {
            if ($report->file_laporan) {
                Storage::disk('public')->delete($report->file_laporan);
            }
            $path = $request->file('file_laporan')->store('laporan_kemajuan_penelitian', 'public');
            $data['file_laporan'] = $path;
        }

        $report->update($data);

        return back()->with('success', 'Data laporan berhasil disimpan.');
    }

    /**
     * Update realisasi luaran
     */
    public function updateLuaran(Request $request, $luaranId)
    {
        $request->validate([
            'judul_realisasi' => 'required|string|max:500',
            'status' => 'required|string',
            'peran_penulis' => 'nullable|string|max:100',
            'nama_jurnal' => 'nullable|string|max:255',
            'issn' => 'nullable|string|max:100',
            // 'pengindek' => 'nullable|string|max:100', // Removed
            'keterangan' => 'nullable|string',
            // 'file_bukti' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:10240', // Removed
            'file_bukti_submit' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:10240',
            'url_bukti' => 'nullable|url',
        ]);

        $luaran = LuaranPenelitian::whereHas('usulan', function ($q) {
            $q->where('user_id', '=', Auth::id(), 'and');
        })->findOrFail($luaranId);

        // Check report status
        $report = LaporanKemajuanPenelitian::where('usulan_id', '=', $luaran->usulan_id, 'and')->first();
        if ($report && $report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan tidak dapat diubah.');
        }

        $data = $request->except(['file_bukti', 'file_bukti_submit']);

        if ($request->hasFile('file_bukti')) {
            if ($luaran->file_bukti) {
                Storage::disk('public')->delete($luaran->file_bukti);
            }
            $path = $request->file('file_bukti')->store('bukti_luaran_penelitian', 'public');
            $data['file_bukti'] = $path;
        }

        if ($request->hasFile('file_bukti_submit')) {
            if ($luaran->file_bukti_submit) {
                Storage::disk('public')->delete($luaran->file_bukti_submit);
            }
            $path = $request->file('file_bukti_submit')->store('bukti_submit_penelitian', 'public');
            $data['file_bukti_submit'] = $path;
        }

        $luaran->update($data);

        return back()->with('success', 'Realisasi luaran berhasil diperbarui.');
    }

    public function updateSPTB(Request $request, $id)
    {
        $request->validate([
            'file_sptb' => 'required|file|mimes:pdf|max:10240',
        ]);

        $report = LaporanKemajuanPenelitian::findOrFail($id);

        if ($report->status !== 'Draft') {
            return back()->with('error', 'Laporan sudah disubmit dan SPTB tidak dapat diubah.');
        }

        if ($request->hasFile('file_sptb')) {
            if ($report->file_sptb) {
                Storage::disk('public')->delete($report->file_sptb);
            }
            $path = $request->file('file_sptb')->store('laporan_kemajuan_penelitian/sptb', 'public');
            $report->update(['file_sptb' => $path]);
        }

        return back()->with('success', 'File SPTB berhasil diunggah.');
    }

    /**
     * Submit Laporan Kemajuan
     */
    public function submit($usulanId)
    {
        $report = LaporanKemajuanPenelitian::where('usulan_id', '=', $usulanId, 'and')
            ->where('user_id', '=', Auth::id(), 'and')
            ->firstOrFail();

        // Check if all mandatory outputs are filled
        $mandatoryOutputs = LuaranPenelitian::where('usulan_id', '=', $usulanId, 'and')
            ->where('is_wajib', '=', true, 'and')
            ->get();

        foreach ($mandatoryOutputs as $output) {
            if ($output->status === 'Rencana' || !$output->judul_realisasi) {
                return back()->with('error', "Luaran Wajib '{$output->kategori}' harus diisi realisasinya.");
            }
        }

        $report->update([
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        return redirect()->route('dosen.penelitian.laporan-kemajuan.index')
            ->with('success', 'Laporan Kemajuan berhasil disubmit.');
    }
}
