<?php
// app/Http/Controllers/UsulanPenelitianController.php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UsulanPenelitianController extends Controller
{
    /**
     * Tampilkan halaman index (daftar usulan)
     */
    public function index()
    {
        $usulan = UsulanPenelitian::with(['ketua', 'anggotaDosen'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('pengajuan/Index', [
            'usulanList' => $usulan,
        ]);
    }

    /**
     * Simpan draft usulan (step 1)
     */
    public function storeDraft(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:500',
            'tkt_saat_ini' => 'nullable|integer|min:1|max:9',
            'target_akhir_tkt' => 'nullable|integer|min:1|max:9',
            'kelompok_skema' => 'nullable|string',
            'ruang_lingkup' => 'nullable|string',
            // ... tambahkan validasi lainnya
        ]);

        try {
            DB::beginTransaction();

            $usulan = UsulanPenelitian::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                ...$validated,
            ]);

            DB::commit();

            return back()->with('success', 'Draft berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan draft: ' . $e->getMessage());
        }
    }

    /**
     * Update usulan (untuk navigasi antar step)
     */
    public function update(Request $request, UsulanPenelitian $usulan)
    {
        // Cek authorization
        if ($usulan->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:500',
            'tkt_saat_ini' => 'nullable|integer',
            'target_akhir_tkt' => 'nullable|integer',
            'kelompok_makro_riset' => 'nullable|string',
            'rab_bahan' => 'nullable|array',
            'rab_pengumpulan_data' => 'nullable|array',
            // ... validasi lainnya
        ]);

        try {
            // Hitung total anggaran jika ada RAB
            if (isset($validated['rab_bahan']) || isset($validated['rab_pengumpulan_data'])) {
                $totalBahan = collect($validated['rab_bahan'] ?? [])->sum('total');
                $totalData = collect($validated['rab_pengumpulan_data'] ?? [])->sum('total');
                $validated['total_anggaran'] = $totalBahan + $totalData;
            }

            $usulan->update($validated);

            return back()->with('success', 'Data berhasil diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    /**
     * Upload file substansi
     */
    public function uploadSubstansi(Request $request, UsulanPenelitian $usulan)
    {
        $request->validate([
            'file_substansi' => 'required|file|mimes:pdf,doc,docx|max:10240', // max 10MB
        ]);

        try {
            // Hapus file lama jika ada
            if ($usulan->file_substansi) {
                Storage::delete($usulan->file_substansi);
            }

            // Upload file baru
            $path = $request->file('file_substansi')->store('substansi', 'public');

            $usulan->update(['file_substansi' => $path]);

            return back()->with('success', 'File substansi berhasil diunggah!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunggah file: ' . $e->getMessage());
        }
    }

    /**
     * Submit final usulan (dari draft ke submitted)
     */
    public function submit(UsulanPenelitian $usulan)
    {
        // Cek authorization
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        // Validasi: pastikan data lengkap
        if (!$usulan->judul || !$usulan->kelompok_skema) {
            return back()->with('error', 'Data usulan belum lengkap!');
        }

        try {
            $usulan->update(['status' => 'submitted']);

            // TODO: Kirim notifikasi ke reviewer/admin

            return redirect()
                ->route('pengajuan.index')
                ->with('success', 'Usulan berhasil diajukan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengajukan usulan: ' . $e->getMessage());
        }
    }

    /**
     * Hapus usulan
     */
    public function destroy(UsulanPenelitian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            // Hapus file jika ada
            if ($usulan->file_substansi) {
                Storage::delete($usulan->file_substansi);
            }

            $usulan->delete();

            return back()->with('success', 'Usulan berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus usulan: ' . $e->getMessage());
        }
    }
}