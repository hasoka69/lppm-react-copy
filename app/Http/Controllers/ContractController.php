<?php

namespace App\Http\Controllers;

use App\Models\TemplateDokumen;
use App\Models\UsulanPenelitian;
use App\Models\UsulanPengabdian;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;

class ContractController extends Controller
{
    public function update(Request $request, $type, $id)
    {
        $request->validate([
            'nomor_kontrak' => 'required|string|max:255',
            'tanggal_kontrak' => 'required|date',
            'tanggal_mulai_kontrak' => 'required|date',
            'tanggal_selesai_kontrak' => 'required|date|after_or_equal:tanggal_mulai_kontrak',
        ]);

        $model = $type === 'penelitian' ? UsulanPenelitian::findOrFail($id) : UsulanPengabdian::findOrFail($id);

        $model->update([
            'nomor_kontrak' => $request->nomor_kontrak,
            'tanggal_kontrak' => $request->tanggal_kontrak,
            'tanggal_mulai_kontrak' => $request->tanggal_mulai_kontrak,
            'tanggal_selesai_kontrak' => $request->tanggal_selesai_kontrak,
        ]);

        return redirect()->back()->with('success', 'Nomor kontrak berhasil disimpan.');
    }

    public function generate($type, $id)
    {
        $usulan = $type === 'penelitian'
            ? UsulanPenelitian::with(['ketua.dosen', 'anggotaDosen.dosen', 'anggotaNonDosen'])->findOrFail($id)
            : UsulanPengabdian::with(['ketua.dosen', 'anggotaDosen.dosen', 'anggotaNonDosen'])->findOrFail($id);

        // Find active template for this type
        $template = TemplateDokumen::where('jenis', ucfirst($type))
            ->where('is_active', true)
            ->first();

        if (!$template) {
            return redirect()->back()->with('error', 'Template kontrak belum tersedia.');
        }

        $templatePath = storage_path('app/public/' . $template->file_path);

        if (!file_exists($templatePath)) {
            return redirect()->back()->with('error', 'File template tidak ditemukan di server.');
        }

        try {
            $templateProcessor = new TemplateProcessor($templatePath);

            // Basic Info
            $judulSanitized = strtoupper(trim(str_replace(["\r", "\n"], " ", strip_tags($usulan->judul))));
            $templateProcessor->setValue('JUDUL', $judulSanitized);
            $templateProcessor->setValue('NOMOR_KONTRAK', trim($usulan->nomor_kontrak) ?? '-');
            $templateProcessor->setValue('TANGGAL_KONTRAK', $usulan->tanggal_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_kontrak)->translatedFormat('d F Y') : '-');
            $templateProcessor->setValue('TAHUN', $usulan->tahun_pertama);
            $templateProcessor->setValue('DANA', number_format($usulan->dana_disetujui, 0, ',', '.'));
            $templateProcessor->setValue('TERBILANG_DANA', $this->terbilang($usulan->dana_disetujui) . ' rupiah');

            // Hitung 30% dan 70%
            $dana30 = $usulan->dana_disetujui * 0.30;
            $dana70 = $usulan->dana_disetujui * 0.70;

            $templateProcessor->setValue('DANA_30_PERSEN', number_format($dana30, 0, ',', '.'));
            $templateProcessor->setValue('TERBILANG_DANA_30_PERSEN', $this->terbilang($dana30) . ' rupiah');

            $templateProcessor->setValue('DANA_70_PERSEN', number_format($dana70, 0, ',', '.'));
            $templateProcessor->setValue('TERBILANG_DANA_70_PERSEN', $this->terbilang($dana70) . ' rupiah');

            $templateProcessor->setValue('SKEMA', $usulan->kelompok_skema);

            // Tanggal & Hari
            $tanggal = $usulan->tanggal_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_kontrak) : null;
            $mulai = $usulan->tanggal_mulai_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_mulai_kontrak) : null;
            $selesai = $usulan->tanggal_selesai_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_selesai_kontrak) : null;

            $templateProcessor->setValue('HARI_KONTRAK', $tanggal ? $tanggal->translatedFormat('l') : '-');
            $templateProcessor->setValue('TANGGAL_LENGKAP', $tanggal ? $tanggal->translatedFormat('d F Y') : '-');
            $templateProcessor->setValue('TAHUN_AKADEMIK', $usulan->tahun_pertama . '/' . ($usulan->tahun_pertama + 1));

            $templateProcessor->setValue('TANGGAL_MULAI', $mulai ? $mulai->translatedFormat('d F Y') : '-');
            $templateProcessor->setValue('TANGGAL_SELESAI', $selesai ? $selesai->translatedFormat('d F Y') : '-');

            $durasi = ($mulai && $selesai) ? $mulai->diffInMonths($selesai) + 1 : 0; // +1 to include start month if needed, or just diffInMonths
            // If user wants exact months regardless of days:
            // $durasi = $mulai->diffInMonths($selesai); 
            // Checking logic: 1 Jan to 1 Feb is 1 month. 
            // Often contracts count inclusive months? Let's check diffInMonths first.
            // If 24 Oct to 28 Feb: Oct, Nov, Dec, Jan, Feb = ~4-5 months.
            // diffInMonths(24 Oct, 28 Feb) = 4. 
            // Let's us just use diffInMonths for now.
            $templateProcessor->setValue('DURASI_BULAN', $durasi);


            // Target Luaran (Ambil dari Luaran Wajib Pertama)
            $luaranWajib = $usulan->luaranList()->where('is_wajib', true)->first();
            $templateProcessor->setValue('TARGET_LUARAN', $luaranWajib ? $luaranWajib->kategori : 'Belum ditentukan');

            // Ketua Info
            $ketua = $usulan->ketua;
            $dosen = $ketua->dosen;

            $templateProcessor->setValue('NAMA_KETUA', $dosen ? $dosen->nama : $ketua->name);
            $templateProcessor->setValue('NIDN_KETUA', $dosen ? $dosen->nidn : '-');
            $templateProcessor->setValue('PRODI_KETUA', $dosen ? ($dosen->prodi ?? '-') : '-');
            $templateProcessor->setValue('FAKULTAS_KETUA', '-'); // Fakultas belum ada di tabel dosen

            // Pihak Pertama (Admin LPPM / Ketua LPPM)
            $adminLppm = \App\Models\User::whereHas('roles', function ($query) {
                $query->where('name', 'Admin LPPM');
            })->first();
            $dosenAdmin = $adminLppm ? $adminLppm->dosen : null;

            $templateProcessor->setValue('NAMA_PIHAK_PERTAMA', $dosenAdmin ? $dosenAdmin->nama : ($adminLppm ? $adminLppm->name : '-'));
            $templateProcessor->setValue('NIDN_PIHAK_PERTAMA', $dosenAdmin ? $dosenAdmin->nidn : '-');
            $templateProcessor->setValue('JABATAN_PIHAK_PERTAMA', 'Ketua LPPM'); // Default/Hardcoded for now

            // Save Temporary File
            $fileName = 'KONTRAK_' . preg_replace('/[^A-Za-z0-9]/', '_', $usulan->judul) . '.docx';
            $tempPath = storage_path('app/public/temp/' . $fileName);

            // Ensure temp dir exists
            if (!file_exists(dirname($tempPath))) {
                mkdir(dirname($tempPath), 0755, true);
            }

            $templateProcessor->saveAs($tempPath);

            return response()->download($tempPath)->deleteFileAfterSend(true);

        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Gagal generate dokumen: ' . $e->getMessage());
        }
    }

    private function terbilang($nilai)
    {
        if ($nilai < 0) {
            return "minus " . $this->terbilang(abs($nilai));
        }

        $huruf = [
            "",
            "satu",
            "dua",
            "tiga",
            "empat",
            "lima",
            "enam",
            "tujuh",
            "delapan",
            "sembilan",
            "sepuluh",
            "sebelas"
        ];
        $hasil = "";

        if ($nilai < 12) {
            $hasil = " " . $huruf[$nilai];
        } else if ($nilai < 20) {
            $hasil = $this->terbilang($nilai - 10) . " belas";
        } else if ($nilai < 100) {
            $hasil = $this->terbilang(floor($nilai / 10)) . " puluh" . $this->terbilang($nilai % 10);
        } else if ($nilai < 200) {
            $hasil = " seratus" . $this->terbilang($nilai - 100);
        } else if ($nilai < 1000) {
            $hasil = $this->terbilang(floor($nilai / 100)) . " ratus" . $this->terbilang($nilai % 100);
        } else if ($nilai < 2000) {
            $hasil = " seribu" . $this->terbilang($nilai - 1000);
        } else if ($nilai < 1000000) {
            $hasil = $this->terbilang(floor($nilai / 1000)) . " ribu" . $this->terbilang($nilai % 1000);
        } else if ($nilai < 1000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000)) . " juta" . $this->terbilang($nilai % 1000000);
        } else if ($nilai < 1000000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000000)) . " milyar" . $this->terbilang(fmod($nilai, 1000000000));
        } else if ($nilai < 1000000000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000000000)) . " trilyun" . $this->terbilang(fmod($nilai, 1000000000000));
        }

        return trim($hasil);
    }
}
