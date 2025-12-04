<?php

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

        $usulanList = UsulanPenelitian::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->skema,
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pelaksanaan,
                'makro_riset' => $u->makro_riset,
                'peran' => $u->peran,
                'status' => $u->status,
            ]);

        return Inertia::render('pengajuan/steps/page-usulan', [
            'usulanList' => $usulanList,
        ]);
    }


    /**
     * Simpan draft step 1
     */
    public function storeDraft(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:500',
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

            // Kirim usulanId via flash supaya React tahu
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
     * Update navigasi antar step
     */
    public function update(Request $request, UsulanPenelitian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:500',
            'tkt_saat_ini' => 'nullable|integer',
            'target_akhir_tkt' => 'nullable|integer',
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


    public function edit($id)
{
    $usulan = UsulanPenelitian::findOrFail($id);

    return Inertia::render('pengajuan/steps/page-identitas-1', [
        'usulanId' => $usulan->id,
        'usulan' => $usulan
    ]);
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
     * Halaman Substansi (GET)
     */
    public function pageSubstansi($id)
    {
        $usulan = UsulanPenelitian::findOrFail($id);

        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $makroRiset = [
            ['value' => 'teknologi', 'label' => 'Teknologi Tinggi'],
            ['value' => 'sains', 'label' => 'Sains Dasar'],
            ['value' => 'sosial', 'label' => 'Sosial Humaniora'],
        ];

        $luaranTarget = [
            [
                'tahun' => 1,
                'kategori' => 'Artikel di jurnal',
                'luaran' => 'Artikel di jurnal bereputasi',
                'status' => 'Accepted/Published',
                'keterangan' => 'ajurnal.asaindo.ac.id',
            ]
        ];

        return Inertia::render('pengajuan/steps/page-substansi-2', [
            'usulan'         => $usulan,
            'makroRisetList' => $makroRiset,
            'luaranList'     => $luaranTarget,
            'substansi'      => $usulan->file_substansi,
        ]);
    }
}
