<?php
//app/Http/Controllers/UsulanPenelitianController.php

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
     * Tampilkan daftar usulan
     */
    public function index()
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */

        $usulanList = UsulanPenelitian::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pertama ?? date('Y'),
                'makro_riset' => $u->kelompok_makro_riset ?? 'N/A',
                'peran' => 'Ketua', // hardcoded, sesuaikan jika ada kolom peran
                'status' => $u->status,
            ]);

        // Ambil data master untuk dropdown
        $masterData = $this->getMasterData();

        return Inertia::render('pengajuan/Index', [
            'usulanList' => $usulanList,
            ...$masterData,
        ]);
    }

    /**
     * Simpan usulan sebagai draft
     */
    public function storeDraft(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'nullable|string|max:500',
            'tkt_saat_ini' => 'nullable|integer|min:1|max:9',
            'target_akhir_tkt' => 'nullable|integer|min:1|max:9',
            'kelompok_skema' => 'nullable|string',
            'ruang_lingkup' => 'nullable|string',
            'kategori_sbk' => 'nullable|string',
            'bidang_fokus' => 'nullable|string',
            'tema_penelitian' => 'nullable|string',
            'topik_penelitian' => 'nullable|string',
            'rumpun_ilmu_1' => 'nullable|string',
            'rumpun_ilmu_2' => 'nullable|string',
            'rumpun_ilmu_3' => 'nullable|string',
            'prioritas_riset' => 'nullable|string',
            'tahun_pertama' => 'nullable|integer',
            'lama_kegiatan' => 'nullable|integer',
        ]);

        try {
            DB::beginTransaction();

            $usulan = UsulanPenelitian::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                ...$validated,
            ]);

            DB::commit();

            return back()->with([
                'success' => 'Draft berhasil disimpan!',
                'usulanId' => $usulan->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan draft: ' . $e->getMessage());
        }
    }

    /**
     * Update usulan (navigasi antar step)
     */
    public function update(Request $request, UsulanPenelitian $usulan)
    {
        /** @var \App\Models\UsulanPenelitian $usulan */
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:500',
            'tkt_saat_ini' => 'nullable|integer',
            'target_akhir_tkt' => 'nullable|integer',
            'kelompok_skema' => 'nullable|string',
            'ruang_lingkup' => 'nullable|string',
            'kategori_sbk' => 'nullable|string',
            'bidang_fokus' => 'nullable|string',
            'tema_penelitian' => 'nullable|string',
            'topik_penelitian' => 'nullable|string',
            'rumpun_ilmu_1' => 'nullable|string',
            'rumpun_ilmu_2' => 'nullable|string',
            'rumpun_ilmu_3' => 'nullable|string',
            'prioritas_riset' => 'nullable|string',
            'tahun_pertama' => 'nullable|integer',
            'lama_kegiatan' => 'nullable|integer',
            'kelompok_makro_riset' => 'nullable|string',
            'rab_bahan' => 'nullable|array',
            'rab_pengumpulan_data' => 'nullable|array',
        ]);

        try {
            if (isset($validated['rab_bahan']) || isset($validated['rab_pengumpulan_data'])) {
                $totalBahan = collect($validated['rab_bahan'] ?? [])->sum('total');
                $totalData  = collect($validated['rab_pengumpulan_data'] ?? [])->sum('total');
                $validated['total_anggaran'] = $totalBahan + $totalData;
            }

            $usulan->update($validated);

            return back()->with('success', 'Data berhasil diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    /**
     * Edit usulan (redirect ke form dengan data)
     */
    public function edit($id)
    {
        $usulan = UsulanPenelitian::where('user_id', Auth::id())
            ->findOrFail($id);

        $masterData = $this->getMasterData();

        return Inertia::render('pengajuan/Identitas', [
            'usulanId' => $usulan->id,
            'usulan' => $usulan,
            'editMode' => true,
            ...$masterData,
        ]);
    }

    /**
     * Upload file substansi
     */
    public function uploadSubstansi(Request $request, UsulanPenelitian $usulan)
    {
        $request->validate([
            'file_substansi' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        try {
            if ($usulan->file_substansi) {
                Storage::disk('public')->delete($usulan->file_substansi);
            }

            $path = $request->file('file_substansi')->store('substansi', 'public');

            $usulan->update(['file_substansi' => $path]);

            return back()->with('success', 'File substansi berhasil diunggah!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunggah file: ' . $e->getMessage());
        }
    }

    /**
     * Submit final
     */
    public function submit(UsulanPenelitian $usulan)
    {
        /** @var \App\Models\UsulanPenelitian $usulan */
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!$usulan->judul || !$usulan->kelompok_skema) {
            return back()->with('error', 'Data usulan belum lengkap!');
        }

        try {
            $usulan->update(['status' => 'submitted']);

            return redirect()->route('pengajuan.index')
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
        /** @var \App\Models\UsulanPenelitian $usulan */
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            if ($usulan->file_substansi) {
                Storage::disk('public')->delete($usulan->file_substansi);
            }

            $usulan->delete();

            return back()->with('success', 'Usulan berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus usulan: ' . $e->getMessage());
        }
    }

    /**
     * Helper: Ambil data master untuk dropdown
     */
    private function getMasterData()
    {
        return [
            'kelompokSkemaList' => DB::table('kelompok_skema')->where('aktif', true)->get(),
            'ruangLingkupList' => DB::table('ruang_lingkup')->where('aktif', true)->get(),
            'kategoriSbkList' => DB::table('kategori_sbk')->where('aktif', true)->get(),
            'bidangFokusList' => DB::table('bidang_fokus')->where('aktif', true)->get(),
            'temaPenelitianList' => DB::table('tema_penelitian')->where('aktif', true)->get(),
            'topikPenelitianList' => DB::table('topik_penelitian')->where('aktif', true)->get(),
            'rumpunIlmuLevel1List' => DB::table('rumpun_ilmu_level1')->where('aktif', true)->get(),
            'rumpunIlmuLevel2List' => DB::table('rumpun_ilmu_level2')->where('aktif', true)->get(),
            'rumpunIlmuLevel3List' => DB::table('rumpun_ilmu_level3')->where('aktif', true)->get(),
            'prioritasRisetList' => DB::table('prioritas_riset')->where('aktif', true)->get(),
        ];
    }
}
