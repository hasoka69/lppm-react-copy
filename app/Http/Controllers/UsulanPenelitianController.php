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

        // Ambil Data Dosen ID dari User yang login
        // Asumsi relasi User -> Dosen (hasOne 'dosen') sudah ada via email
        $dosenId = $user->dosen->id ?? null;

        $usulanList = UsulanPenelitian::with([
            'reviewHistories' => function ($query) {
                $query->latest('reviewed_at')->limit(1);
            }
        ])
            ->where(function ($query) use ($user, $dosenId) {
                // Sebagai Ketua (Owner)
                $query->where('user_id', $user->id)
                    // Atau Sebagai Anggota Dosen
                    ->orWhereHas('anggotaDosen', function ($q) use ($dosenId) {
                    if ($dosenId) {
                        $q->where('dosen_id', $dosenId);
                    } else {
                        // If user is not mapped to dosen yet, fallback safely (shouldn't happen for valid dosen)
                        $q->where('id', 0);
                    }
                });
            })
            // ->whereNotIn('status', ['under_revision_admin', 'revision_dosen']) // Logic existing: hide revising ?? Wait, revision_dosen should be visible to owner?
            // Note: The original code excluded 'under_revision_admin' and 'revision_dosen' from this main list?? 
            // Usually 'revision_dosen' should be visible in 'Perbaikan' tab or main list? 
            // The original code passed 'revision_dosen' to 'Perbaikan' view separately.
            // Let's keep existing logic for now.
            // UPDATE: User requested to SHOW revision status in main list.

            ->latest()
            ->get()
            ->map(fn($u, $i) => [
                'no' => $i + 1,
                'id' => $u->id,
                'skema' => $u->kelompok_skema ?? 'N/A',
                'judul' => $u->judul,
                'tahun_pelaksanaan' => tap($u->tahun_pertama, function ($val) use ($u) {
                    // Log::info("Row ID {$u->id}: tahun_pertama = " . var_export($val, true));
                }) ?? date('Y'),
                'makro_riset' => $u->kelompok_makro_riset ?? 'N/A',
                'peran' => $u->user_id === $user->id ? 'Ketua' : 'Anggota', // Determine Role
                'status' => $u->status,
                'catatan' => $u->reviewHistories->first()?->comments ?? null,
                'reviewer_action' => $u->reviewHistories->first()?->action ?? null,
                'nomor_kontrak' => $u->nomor_kontrak, // [NEW] Supported for contract download
            ]);

        // ✅ TAMBAHAN: Ambil draft terakhir yang sedang dikerjakan
        $latestDraft = UsulanPenelitian::where('user_id', '=', Auth::id(), 'and')
            ->where('status', 'draft')
            ->latest()
            ->first(['*']);

        // Ambil data master
        $masterData = $this->getMasterData();

        return Inertia::render('dosen/penelitian/Index', [
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
            'tugas_ketua' => 'nullable|string', // [NEW] Added tugas_ketua
        ]);

        try {
            DB::beginTransaction();

            $usulan = UsulanPenelitian::create([
                'user_id' => Auth::id(),
                'status' => 'draft',
                ...$validated,
                'tahun_pertama' => $validated['tahun_pertama'] ?? 20261,
            ]);

            DB::commit();

            Log::info('Draft created', ['usulan_id' => $usulan->id]);

            // ✅ Simpan ke session agar Inertia bisa baca flash data
            session()->flash('usulanId', $usulan->id);
            session()->flash('success', 'Draft penelitian berhasil disimpan');

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

        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return back()->with('error', 'Usulan tidak dalam tahap pengeditan.');
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
            'tugas_ketua' => 'nullable|string', // [NEW] Added tugas_ketua
            // [NEW] Handle Makro Riset
            'makro_riset_id' => 'nullable|exists:makro_riset,id',
            // RAB Validation
            'rab_bahan' => 'nullable|array',
            'rab_pengumpulan_data' => 'nullable|array',
            'total_anggaran' => 'nullable|numeric',
            'file_substansi' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        try {
            // [NEW] Map makro_riset_id to kelompok_makro_riset name if provided
            // [NEW] Map makro_riset_id to kelompok_makro_riset name if provided
            if (isset($validated['makro_riset_id'])) {
                Log::info('Processing makro_riset_id', ['id' => $validated['makro_riset_id']]);
                $makroData = DB::table('makro_riset')->where('id', $validated['makro_riset_id'])->first();
                if ($makroData) {
                    $validated['kelompok_makro_riset'] = $makroData->nama; // Simpan nama untuk display
                    Log::info('Mapped makro_riset', ['nama' => $makroData->nama]);
                } else {
                    Log::warning('Makro riset data not found for ID', ['id' => $validated['makro_riset_id']]);
                }
            } else {
                Log::info('makro_riset_id not set in validated data', ['validated' => $validated]);
            }

            // Handle File Substansi Upload
            if ($request->hasFile('file_substansi')) {
                if ($usulan->file_substansi) {
                    Storage::disk('public')->delete($usulan->file_substansi);
                }
                $path = $request->file('file_substansi')->store('substansi', 'public');
                $validated['file_substansi'] = $path;
            } else {
                // ✅ JANGAN OVERWRITE JIKA TIDAK ADA FILE BARU
                unset($validated['file_substansi']);
            }

            // [NEW] Sync dana_usulan_awal with total_anggaran ONLY if status is draft or submitted
            // If status is revision_dosen (or any other post-review status), we maintain the original dana_usulan_awal
            if (in_array($usulan->status, ['draft', 'submitted'])) {
                if (isset($validated['total_anggaran'])) {
                    $validated['dana_usulan_awal'] = $validated['total_anggaran'];
                }
            }

            // $validated['tahun_pertama'] = 2026; // Removed hardcoding
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
        $usulan = UsulanPenelitian::where('user_id', '=', Auth::id(), 'and')
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

        // Only allowed to submit if status is draft or revision_dosen
        if (!in_array($usulan->status, ['draft', 'revision_dosen'])) {
            return back()->with('error', 'Usulan tidak dalam tahap pengajuan/revisi.');
        }

        try {
            $oldStatus = $usulan->status;

            // [NEW] Check Member Approval Status
            $pendingMembers = $usulan->anggotaDosen()->whereIn('status_approval', ['pending', 'rejected'])->count();

            if ($pendingMembers > 0) {
                // If there are pending members, set status to 'waiting_member_approval'
                $newStatus = 'waiting_member_approval';
                $message = 'Usulan berhasil disubmit. Menunggu persetujuan anggota dosen sebelum diteruskan ke Kaprodi.';
                $action = 'submit_waiting';
                $comment = 'Usulan disubmit oleh Ketua. Menunggu persetujuan anggota.';
            } else {
                // Determine new status based on previous status
                $newStatus = ($oldStatus === 'revision_dosen') ? 'resubmitted_revision' : 'submitted';
                $message = 'Usulan berhasil diajukan!';
                $action = ($newStatus === 'resubmitted_revision') ? 'resubmit_revision' : 'submit';
                $comment = ($newStatus === 'resubmitted_revision') ? 'Revisi berhasil diajukan oleh Dosen.' : 'Usulan diajukan oleh Dosen.';
            }

            $usulan->update([
                'status' => $newStatus,
                'submitted_at' => now(),
            ]);

            // Create History for submission
            \App\Models\ReviewHistory::create([
                'usulan_id' => $usulan->id,
                'usulan_type' => get_class($usulan),
                'reviewer_id' => Auth::id(),
                'reviewer_type' => 'dosen',
                'action' => $action,
                'comments' => $comment,
                'reviewed_at' => now(),
            ]);

            return redirect()->route('dosen.penelitian.index')
                ->with('success', $message);
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

            UsulanPenelitian::destroy($usulan->id);

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
            'makroRisetList' => DB::table('makro_riset')->where('aktif', true)->get(), // [NEW] Add Makro Riset here
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
        return array_merge($this->getMasterData(), [
            'makroRisetList' => DB::table('makro_riset')->where('aktif', true)->get(),
        ]);
    }

    /**
     * Show form for specific step
     */
    public function showStep(Request $request, $usulanId, $step)
    {
        $step = (int) $step;
        $usulan = UsulanPenelitian::with([
            'anggotaDosen',
            'anggotaNonDosen',
            'luaranList',
            'rabItems',
            'anggotaDosen',
            'anggotaNonDosen',
            'luaranList',
            'rabItems',
            'reviewHistories.reviewer',
            'user.dosen' // [NEW] Needed for Step 4 Confirmation display
        ])->where(function ($query) {
            // We cannot easily filter query by 'user_id' OR relation here without complex query
            // Instead, findOrFail first, then check policy.
            // But to be consistent with scoping:
            // Let's just findOrFail($usulanId) then check logic manually for granular error.
        })->find($usulanId); // Remove where('user_id', Auth::id()) constraint from query

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
        $isReadOnly = $request->query('mode') === 'view' || $isMember;

        $masterData = $this->getMasterDataWithMakroRiset();

        // Cari ID Makro Riset berdasarkan nama yang tersimpan
        $makroRisetId = null;
        if ($usulan->kelompok_makro_riset) {
            $makro = DB::table('makro_riset')
                ->where('nama', '=', $usulan->kelompok_makro_riset)
                ->first();
            $makroRisetId = $makro?->id;
        }

        return Inertia::render("dosen/penelitian/Index", [
            'usulanId' => $usulan->id,
            'usulan' => $usulan,
            'currentStep' => $step,
            'isReadOnly' => $isReadOnly, // logic determined above
            'substansi' => [
                'makro_riset_id' => $makroRisetId,
                'file_substansi' => $usulan->file_substansi,
            ],
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

    /**
     * Tampilkan usulan yang perlu perbaikan
     */
    public function perbaikan()
    {
        $user = Auth::user();

        $usulanList = UsulanPenelitian::with([
            'reviewHistories' => function ($query) {
                $query->latest('reviewed_at')->limit(1);
            }
        ])
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
                'makro_riset' => $u->kelompok_makro_riset ?? 'N/A',
                'peran' => 'Ketua',
                'status' => $u->status,
                'catatan' => $u->reviewHistories->first()?->comments ?? null,
                'reviewer_action' => $u->reviewHistories->first()?->action ?? null,
            ]);

        $masterData = $this->getMasterData();

        return Inertia::render('dosen/penelitian/Index', [
            'usulanList' => $usulanList,
            'isPerbaikanView' => true,
            'title' => 'Perbaikan Usulan Penelitian',
            ...$masterData,
        ]);
    }
}
