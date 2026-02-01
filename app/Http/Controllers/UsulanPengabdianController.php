<?php

namespace App\Http\Controllers;

use App\Models\UsulanPengabdian;
use App\Models\RabItem;
use App\Models\RumpunIlmu;
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

        // Ambil Data Dosen ID dari User yang login
        $dosenId = $user->dosen->id ?? null;

        $usulanList = UsulanPengabdian::with(['reviewHistories'])
            ->where(function ($query) use ($user, $dosenId) {
                // Sebagai Ketua (Owner)
                $query->where('user_id', $user->id)
                    // Atau Sebagai Anggota Dosen
                    ->orWhereHas('anggotaDosen', function ($q) use ($dosenId) {
                    if ($dosenId) {
                        $q->where('dosen_id', $dosenId);
                    } else {
                        $q->where('id', 0);
                    }
                });
            })
            ->whereNotIn('status', ['under_revision_admin', 'revision_dosen'])
            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pertama ?? date('Y'),
                'peran' => $u->user_id === $user->id ? 'Ketua' : 'Anggota',
                'status' => $u->status,
                // Get latest review comment (from Reviewer or Kaprodi)
                'catatan' => $u->reviewHistories->sortByDesc('reviewed_at')->first()?->comments ?? '-',
            ]);

        $latestDraft = UsulanPengabdian::where('user_id', $user->id)
            ->where('status', 'draft')
            ->latest()
            ->first();

        // Ambil data master
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
    /**
     * Simpan draft baru
     */
    public function storeDraft(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'nullable|string|max:500',
            'tahun_pengusulan' => 'nullable|integer',
            'kelompok_skema' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $usulan = UsulanPengabdian::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                'tahun_pengusulan' => 2026,
                'judul' => $validated['judul'] ?? 'Draft Usulan Pengabdian',
                'kelompok_skema' => $validated['kelompok_skema'] ?? null,
                'tahun_pertama' => 20261, // Defaulting to 20261 (Ganjil 2025/2026) for new drafts if not specified
            ]);

            DB::commit();

            Log::info('Draft Pengabdian created', ['usulan_id' => $usulan->id]);

            session()->flash('usulanId', $usulan->id);
            session()->flash('success', 'Draft pengabdian berhasil disimpan');

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
            'judul' => 'sometimes|nullable|string|max:500',
            'tahun_pengusulan' => 'sometimes|nullable|integer',
            // 1.2
            'jenis_bidang_fokus' => 'sometimes|nullable|string',
            'bidang_fokus' => 'sometimes|nullable|string',
            // 1.3
            'kelompok_skema' => 'sometimes|nullable|string',
            'ruang_lingkup' => 'sometimes|nullable|string',
            'tahun_pertama' => 'sometimes|nullable|integer',
            'lama_kegiatan' => 'sometimes|nullable|integer',
            // 1.4
            'rumpun_ilmu_level1_id' => 'sometimes|nullable|integer',
            'rumpun_ilmu_level2_id' => 'sometimes|nullable|integer',
            'rumpun_ilmu_level3_id' => 'sometimes|nullable|integer',

            'total_anggaran' => 'nullable|numeric',
        ]);

        try {
            $data = $request->all();

            // Handle Rumpun Ilmu Labels (Snapshotting)
            if (!empty($data['rumpun_ilmu_level1_id'])) {
                $r1 = RumpunIlmu::find($data['rumpun_ilmu_level1_id']);
                $data['rumpun_ilmu_level1_label'] = $r1 ? $r1->nama : null;
            }
            if (!empty($data['rumpun_ilmu_level2_id'])) {
                $r2 = RumpunIlmu::find($data['rumpun_ilmu_level2_id']);
                $data['rumpun_ilmu_level2_label'] = $r2 ? $r2->nama : null;
            }
            if (!empty($data['rumpun_ilmu_level3_id'])) {
                $r3 = RumpunIlmu::find($data['rumpun_ilmu_level3_id']);
                $data['rumpun_ilmu_level3_label'] = $r3 ? $r3->nama : null;
            }

            // Handle File Upload Manually if present
            if ($request->hasFile('file_substansi')) {
                // Delete old file if exists
                if ($usulan->file_substansi) {
                    Storage::disk('public')->delete($usulan->file_substansi);
                }
                $path = $request->file('file_substansi')->store('substansi_pengabdian', 'public');
                $data['file_substansi'] = $path;
            }

            $data['tahun_pengusulan'] = 2026;
            // $data['tahun_pertama'] = 2026; // Removed hardcoded override
            $usulan->update($data);
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
        $usulan = UsulanPengabdian::where('user_id', Auth::id())
            ->findOrFail($id);

        $masterData = $this->getMasterData();

        return Inertia::render('dosen/pengabdian/Index', [
            'usulanId' => $usulan->id,
            'usulan' => $usulan,
            'currentStep' => 1,
            'editMode' => true,
            ...$masterData,
        ]);
    }

    /**
     * Show form for specific step
     */
    /**
     * Show form for specific step
     */
    public function showStep($usulanId, $step)
    {
        $step = (int) $step;
        // Eager load everything needed for all steps to be safe, or optimize per step
        $usulan = UsulanPengabdian::with([
            'anggotaDosen',
            'anggotaNonDosen',
            'luaranItems',
            'rabItems',
            'mitra',
            'reviewHistories.reviewer'
        ])->find($usulanId); // Remove direct where('user_id') scope, handle manually

        if (!$usulan) {
            abort(404);
        }

        // Authorization Check
        $user = Auth::user();
        $dosenId = $user->dosen->id ?? null;

        $isOwner = $usulan->user_id === $user->id;
        $isMember = false;
        if ($dosenId) {
            $isMember = $usulan->anggotaDosen()->where('dosen_id', $dosenId)->exists();
        }

        if (!$isOwner && !$isMember) {
            abort(403, 'Unauthorized access to this proposal.');
        }

        // Determine ReadOnly Mode
        // If query param 'mode' is view OR User is Member -> ReadOnly
        // Or if we default members to read-only always
        $isReadOnly = request()->query('mode') === 'view' || $isMember;

        $masterData = $this->getMasterData();

        return Inertia::render("dosen/pengabdian/Index", [
            'usulanId' => $usulan->id,
            'usulan' => $usulan,
            'currentStep' => $step,
            'isReadOnly' => $isReadOnly,
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

        Log::info('Submitting Usulan: ' . $usulan->id);

        // 1. Validate Identitas
        if (!$usulan->judul || !$usulan->kelompok_skema || !$usulan->ruang_lingkup || !$usulan->rumpun_ilmu_level3_id) {
            Log::info('Validation Failed: Identitas incomplete', $usulan->toArray());
            return back()->with('error', 'Lengkapi Data Identitas & Rumpun Ilmu (Level 3) terlebih dahulu!');
        }

        // 2. Validate Substansi & Luaran
        if (!$usulan->file_substansi) {
            Log::info('Validation Failed: File substansi missing');
            return back()->with('error', 'File Substansi belum diunggah!');
        }
        if ($usulan->luaranItems()->count() === 0) {
            Log::info('Validation Failed: No Luaran items');
            return back()->with('error', 'Minimal harus ada satu Target Luaran!');
        }

        // 3. Validate RAB
        if ($usulan->rabItems()->count() === 0) {
            Log::info('Validation Failed: No RAB items');
            return back()->with('error', 'RAB belum diisi!');
        }

        // 4. Validate Mitra
        if ($usulan->mitra()->count() === 0) {
            Log::info('Validation Failed: No Mitra');
            return back()->with('error', 'Minimal harus ada satu Mitra Sasaran!');
        }

        // Only allowed to submit if status is draft or revision_dosen
        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return back()->with('error', 'Usulan tidak dalam tahap pengajuan/revisi.');
        }

        try {
            $oldStatus = $usulan->status;
            $newStatus = ($oldStatus === 'revision_dosen') ? 'resubmitted_revision' : 'submitted';

            Log::info('Validation Passed. Updating status to ' . $newStatus);
            $usulan->update([
                'status' => $newStatus,
                'submitted_at' => now(), // Assuming column is added or we fallback in view
            ]);

            // Create History entry
            \App\Models\ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => get_class($usulan),
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'dosen',
                'action' => $newStatus === 'resubmitted_revision' ? 'resubmit_revision' : 'submit',
                'comments' => $newStatus === 'resubmitted_revision' ? 'Revisi berhasil diajukan oleh Dosen.' : 'Usulan diajukan oleh Dosen.',
                'reviewed_at' => now(),
            ]);

            return redirect()->route('dosen.pengabdian.index')
                ->with('success', 'Usulan Berhasil Diajukan!');
        } catch (\Exception $e) {
            Log::error('Submission Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengajukan usulan: ' . $e->getMessage());
        }
    }

    private function getMasterData()
    {
        // Minimal master data required for pages to render dropdowns initially
        // Ririns/Tematiks can be hardcoded or fetched if in DB
        return [
            // Example hardcoded if DB tables missing, or fetch if exist
            'kelompokSkemaList' => [
                ['id' => 'PKM', 'nama' => 'PKM'],
                ['id' => 'PKM-K', 'nama' => 'PKM-K'],
                ['id' => 'PKM-M', 'nama' => 'PKM-M'],
                ['id' => 'PKM-T', 'nama' => 'PKM-T'],
            ],
            'ruangLingkupList' => [
                ['id' => 'Pendidikan', 'nama' => 'Pendidikan'],
                ['id' => 'Kesehatan', 'nama' => 'Kesehatan'],
                ['id' => 'Ekonomi', 'nama' => 'Ekonomi'],
                ['id' => 'Sosial Budaya', 'nama' => 'Sosial Budaya'],
                ['id' => 'Teknologi', 'nama' => 'Teknologi'],
            ],
            'rumpunIlmuLevel1List' => RumpunIlmu::where('level', 1)->get(),
        ];
    }

    public function getAnggotaDosen(UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = $usulan->anggotaDosen()->get();
        return response()->json(['data' => $data]);
    }

    public function getAnggotaNonDosen(UsulanPengabdian $usulan)
    {
        if ($usulan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = $usulan->anggotaNonDosen()->get();
        return response()->json(['data' => $data]);
    }

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

    /**
     * Tampilkan usulan yang perlu perbaikan
     */
    public function perbaikan()
    {
        $user = Auth::user();

        $usulanList = UsulanPengabdian::with(['reviewHistories'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['under_revision_admin', 'revision_dosen'])
            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => $u->tahun_pertama ?? date('Y'),
                'peran' => 'Ketua',
                'status' => $u->status,
                'catatan' => $u->reviewHistories->sortByDesc('reviewed_at')->first()?->comments ?? '-',
            ]);

        $masterData = $this->getMasterData();

        return Inertia::render('dosen/pengabdian/Index', [
            'usulanList' => $usulanList,
            'isPerbaikanView' => true,
            'title' => 'Perbaikan Usulan Pengabdian',
            ...$masterData,
        ]);
    }
}
