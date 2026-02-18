<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\LuaranPengabdian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengkinianCapaianPengabdianController extends Controller
{
    /**
     * Tampilkan daftar usulan yang didanai untuk pengkinian luaran
     */
    public function index()
    {
        $user = Auth::user();

        $fundedUsulan = UsulanPengabdian::where('user_id', '=', $user->id, 'and')
            ->where('status', '=', 'didanai', 'and')
            ->with('luaranList')
            ->latest()
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'judul' => $u->judul,
                'skema' => $u->kelompok_skema,
                'tahun_pertama' => $u->tahun_pertama,
                'dana_disetujui' => (float) ($u->dana_disetujui ?? 0),
                'progress' => $u->luaranList->count() > 0 ? $u->luaranList->avg(function ($luaran) {
                    return match ($luaran->status) {
                        'Draft' => 20,
                        'Submitted' => 40,
                        'In Review' => 60,
                        'Accepted' => 80,
                        'Published' => 100,
                        default => 0,
                    };
                }) : 0,
            ]);

        return Inertia::render('dosen/pengabdian/PengkinianLuaran/Index', [
            'fundedUsulan' => $fundedUsulan
        ]);
    }

    /**
     * Tampilkan detail pengkinian luaran untuk usulan tertentu
     */
    public function show($usulanId)
    {
        $usulan = UsulanPengabdian::with(['luaranList'])
            ->where('user_id', '=', Auth::id(), 'and')
            ->where('status', '=', 'didanai', 'and')
            ->findOrFail($usulanId);

        return Inertia::render('dosen/pengabdian/PengkinianLuaran/Detail', [
            'usulan' => $usulan,
            'mandatory_outputs' => $usulan->luaranList->where('is_wajib', 1)->values(),
            'additional_outputs' => $usulan->luaranList->where('is_wajib', 0)->values(),
        ]);
    }

    /**
     * Update realisasi luaran (Pengkinian)
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
            // 'tahun_realisasi' => 'nullable|string|max:4', // Removed
            'volume' => 'nullable|string|max:50',
            'nomor' => 'nullable|string|max:50',
            'halaman_awal' => 'nullable|string|max:20',
            'halaman_akhir' => 'nullable|string|max:20',
            'url_bukti' => 'nullable|url',
            'url_artikel' => 'nullable|url',
            'doi' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
            // 'file_bukti' => 'nullable|file|mimes:pdf,jpg,png,doc,docx|max:10240', // Removed
        ]);

        $luaran = LuaranPengabdian::whereHas('usulan', function ($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($luaranId);

        $data = $request->except(['file_bukti']);

        if ($request->hasFile('file_bukti')) {
            if ($luaran->file_bukti) {
                Storage::disk('public')->delete($luaran->file_bukti);
            }
            $path = $request->file('file_bukti')->store('bukti_luaran_pengabdian', 'public');
            $data['file_bukti'] = $path;
        }

        $luaran->update($data);

        return back()->with('success', 'Pengkinian luaran berhasil diperbarui.');
    }
}
