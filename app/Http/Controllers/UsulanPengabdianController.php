<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\RabItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UsulanPengabdianController extends Controller
{
    /**
     * Tampilkan daftar usulan pengabdian + auto-resume draft terakhir
     */
    public function index()
    {
        $user = Auth::user();

        // [TODO] Add reviewHistories relationship to UsulanPengabdian if needed (skipped for now or create migration)
        // For now, assuming similar structure logic
        $usulanList = UsulanPengabdian::with([
            // 'reviewHistories' // Uncomment if relation exists
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pertama ?? date('Y'),
                // 'makro_riset' => $u->kelompok_makro_riset ?? 'N/A', // Pengabdian might not use makro riset
                'peran' => 'Ketua',
                'status' => $u->status,
                // 'catatan' => ...,
                // 'reviewer_action' => ...,
            ]);

        $latestDraft = UsulanPengabdian::where('user_id', $user->id)
            ->where('status', 'draft')
            ->latest()
            ->first();

        // Ambil data master (reused from penelitian mostly, or specific tables if any)
        $masterData = $this->getMasterData();

        return Inertia::render('dosen/pengabdian/Index', [
            'usulanList' => $usulanList,
            'latestDraft' => $latestDraft ? [
                'id' => $latestDraft->id,
                'judul' => $latestDraft->judul,
                'tkt_saat_ini' => $latestDraft->tkt_saat_ini,
                'target_akhir_tkt' => $latestDraft->target_akhir_tkt,
                'kelompok_skema' => $latestDraft->kelompok_skema,
                'ruang_lingkup' => $latestDraft->ruang_lingkup,
                'bidang_fokus' => $latestDraft->bidang_fokus,
                'tahun_pertama' => $latestDraft->tahun_pertama,
                'lama_kegiatan' => $latestDraft->lama_kegiatan,
            ] : null,
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
            'kelompok_skema' => 'nullable|string',
            'ruang_lingkup' => 'nullable|string',
            'bidang_fokus' => 'nullable|string',
            'tahun_pertama' => 'nullable|integer',
            'lama_kegiatan' => 'nullable|integer',
        ]);

        try {
            DB::beginTransaction();

            $usulan = UsulanPengabdian::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                ...$validated,
            ]);

            DB::commit();

            Log::info('Draft Pengabdian created', ['usulan_id' => $usulan->id]);

            return response()->json([
                'success' => true,
                'usulanId' => $usulan->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create draft pengabdian', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan draft: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update usulan
     */
    public function update(Request $request, UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:500',
            'kelompok_skema' => 'nullable|string',
            'ruang_lingkup' => 'nullable|string',
            'bidang_fokus' => 'nullable|string',
            'tahun_pertama' => 'nullable|integer',
            'lama_kegiatan' => 'nullable|integer',
            'total_anggaran' => 'nullable|numeric',
        ]);

        try {
            $usulan->update($validated);
            return back()->with('success', 'Data berhasil diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    /**
     * Show form for specific step
     */
    public function showStep($usulanId, $step)
    {
        $step = (int) $step;
        $usulan = UsulanPengabdian::with(['anggotaDosen', 'anggotaNonDosen', 'rabItems'])->where('user_id', Auth::id())->findOrFail($usulanId);

        $masterData = $this->getMasterData();

        return Inertia::render("dosen/pengabdian/Index", [
            'usulanId' => $usulan->id,
            'usulan' => $usulan,
            'currentStep' => $step,
            ...$masterData,
        ]);
    }

    /**
     * Submit final
     */
    public function submit(UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            abort(403);
        }

        if (!$usulan->judul || !$usulan->kelompok_skema) {
            return back()->with('error', 'Data usulan belum lengkap!');
        }

        try {
            $usulan->update(['status' => 'submitted']);
            return redirect()->route('dosen.pengabdian.index')
                ->with('success', 'Usulan Pengabdian berhasil diajukan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengajukan usulan: ' . $e->getMessage());
        }
    }

    // Reuse helper methods or adapt as needed
    private function getMasterData()
    {
        // Adjust these queries if Pengabdian uses different master tables
        return [
            'kelompokSkemaList' => DB::table('kelompok_skema')->where('aktif', true)->get(), // Maybe filter by type?
            'ruangLingkupList' => DB::table('ruang_lingkup')->where('aktif', true)->get(),
            'bidangFokusList' => DB::table('bidang_fokus')->where('aktif', true)->get(),
            // Remove/Add tables as necessary for Pengabdian
        ];
    }

    // Anggota methods reused but pointing to Pengabdian relations
    public function getAnggotaDosen(UsulanPengabdian $usulan)
    { /* ... similar logic ... */
    }
    public function getAnggotaNonDosen(UsulanPengabdian $usulan)
    { /* ... similar logic ... */
    }

    // Upload Substansi
    public function uploadSubstansi(Request $request, UsulanPengabdian $usulan)
    {
        $request->validate([
            'file_substansi' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        try {
            if ($usulan->file_substansi) {
                Storage::disk('public')->delete($usulan->file_substansi);
            }
            $path = $request->file('file_substansi')->store('substansi_pengabdian', 'public');
            $usulan->update(['file_substansi' => $path]);
            return back()->with('success', 'File substansi berhasil diunggah!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunggah file: ' . $e->getMessage());
        }
    }

    public function destroy(UsulanPengabdian $usulan)
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
}
