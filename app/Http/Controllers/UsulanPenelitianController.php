<?php

namespace App\Http\Controllers;

use App\Models\UsulanPenelitian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // ✅ TAMBAHKAN INI
use Inertia\Inertia;

class UsulanPenelitianController extends Controller
{
    /**
     * Tampilkan daftar usulan + auto-resume draft terakhir
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
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pertama ?? date('Y'),
                'makro_riset' => $u->kelompok_makro_riset ?? 'N/A',
                'peran' => 'Ketua',
                'status' => $u->status,
            ]);

        // ✅ TAMBAHAN: Ambil draft terakhir yang sedang dikerjakan
        $latestDraft = UsulanPenelitian::where('user_id', $user->id)
            ->where('status', 'draft')
            ->latest()
            ->first();

        // Ambil data master
        $masterData = $this->getMasterData();

        return Inertia::render('pengajuan/Index', [
            'usulanList' => $usulanList,
            'latestDraft' => $latestDraft ? [
                'id' => $latestDraft->id,
                'judul' => $latestDraft->judul,
                'tkt_saat_ini' => $latestDraft->tkt_saat_ini,
                'target_akhir_tkt' => $latestDraft->target_akhir_tkt,
                'kelompok_skema' => $latestDraft->kelompok_skema,
                'ruang_lingkup' => $latestDraft->ruang_lingkup,
                'kategori_sbk' => $latestDraft->kategori_sbk,
                'bidang_fokus' => $latestDraft->bidang_fokus,
                'tema_penelitian' => $latestDraft->tema_penelitian,
                'topik_penelitian' => $latestDraft->topik_penelitian,
                'rumpun_ilmu_1' => $latestDraft->rumpun_ilmu_1,
                'rumpun_ilmu_2' => $latestDraft->rumpun_ilmu_2,
                'rumpun_ilmu_3' => $latestDraft->rumpun_ilmu_3,
                'prioritas_riset' => $latestDraft->prioritas_riset,
                'tahun_pertama' => $latestDraft->tahun_pertama,
                'lama_kegiatan' => $latestDraft->lama_kegiatan,
            ] : null,
            'makroRisetList' => DB::table('makro_riset')->where('aktif', true)->get(), // ✅ TAMBAHAN
            ...$masterData,
        ]);
    }

    /**
     * Simpan draft baru
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

            Log::info('Draft created', ['usulan_id' => $usulan->id]);

            // ✅ PENTING: RETURN JSON
            return response()->json([
                'success' => true,
                'usulanId' => $usulan->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create draft', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan draft',
            ], 500);
        }
    }


    /**
     * Update usulan
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

        return Inertia::render('pengajuan/steps/page-identitas-1', [
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

    /**
     * GET: Fetch anggota dosen untuk usulan tertentu
     */
    public function getAnggotaDosen(UsulanPenelitian $usulan)
    {
        try {
            Log::info('getAnggotaDosen called', ['usulan_id' => $usulan->id, 'user_id' => Auth::id()]);
            
            // Check authorization
            if ($usulan->user_id !== Auth::id()) {
                Log::warning('Unauthorized access', ['usulan_user' => $usulan->user_id, 'auth_user' => Auth::id()]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $anggota = $usulan->anggotaDosen()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($item) => [
                    'id' => $item->id,
                    'nidn' => $item->nidn,
                    'nama' => $item->nama,
                    'peran' => $item->peran,
                    'prodi' => $item->prodi,
                    'tugas' => $item->tugas,
                    'status_approval' => $item->status_approval,
                    'created_at' => $item->created_at,
                ]);

            Log::info('getAnggotaDosen success', ['count' => count($anggota)]);
            return response()->json(['data' => $anggota]);
        } catch (\Exception $e) {
            Log::error('getAnggotaDosen error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error: ' . $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }


    // TAMBAHKAN method ini di UsulanPenelitianController.php

/**
 * Helper: Get master data for form
 */
private function getMasterDataWithMakroRiset()
{
    return [
        'makroRisetList' => DB::table('makro_riset')->where('aktif', true)->get(),
        'kelompokSkemaList' => DB::table('kelompok_skema')->where('aktif', true)->get(),
        'ruangLingkupList' => DB::table('ruang_lingkup')->where('aktif', true)->get(),
        // ... data master lainnya
    ];
}

/**
 * Show form for specific step
 */
public function showStep($usulanId, $step)
{
    $usulan = UsulanPenelitian::where('user_id', Auth::id())->findOrFail($usulanId);
    
    $masterData = $this->getMasterDataWithMakroRiset();
    
    return Inertia::render("pengajuan/Index", [
        'usulanId' => $usulan->id,
        'usulan' => $usulan,
        'currentStep' => $step,
        ...$masterData,
    ]);
}
    /**
     * GET: Fetch anggota non-dosen untuk usulan tertentu
     */
    public function getAnggotaNonDosen(UsulanPenelitian $usulan)
    {
        try {
            Log::info('getAnggotaNonDosen called', ['usulan_id' => $usulan->id]);
            
            // Check authorization
            if ($usulan->user_id !== Auth::id()) {
                Log::warning('Unauthorized access to non-dosen', ['usulan_user' => $usulan->user_id, 'auth_user' => Auth::id()]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $anggota = $usulan->anggotaNonDosen()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($item) => [
                    'id' => $item->id,
                    'jenis_anggota' => $item->jenis_anggota,
                    'no_identitas' => $item->no_identitas,
                    'nama' => $item->nama,
                    'jurusan' => $item->jurusan,
                    'tugas' => $item->tugas,
                    'status_approval' => $item->status_approval,
                    'created_at' => $item->created_at,
                ]);

            Log::info('getAnggotaNonDosen success', ['count' => count($anggota)]);
            return response()->json(['data' => $anggota]);
        } catch (\Exception $e) {
            Log::error('getAnggotaNonDosen error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error: ' . $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }
}
