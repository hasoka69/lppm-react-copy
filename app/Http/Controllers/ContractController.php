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
            'tanggal_kontrak' => 'nullable|date',
            'tanggal_mulai_kontrak' => 'required|date',
            'tanggal_selesai_kontrak' => 'required|date|after_or_equal:tanggal_mulai_kontrak',
        ]);

        $model = $type === 'penelitian' ? UsulanPenelitian::findOrFail($id) : UsulanPengabdian::findOrFail($id);

        $updateData = [
            'nomor_kontrak' => $request->nomor_kontrak,
            'tanggal_mulai_kontrak' => $request->tanggal_mulai_kontrak,
            'tanggal_selesai_kontrak' => $request->tanggal_selesai_kontrak,
        ];

        if ($request->has('tanggal_kontrak')) {
            $updateData['tanggal_kontrak'] = $request->tanggal_kontrak;
        }

        $model->update($updateData);

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
            // Set Locale to Indonesian for date translation
            \Carbon\Carbon::setLocale('id');
            setlocale(LC_TIME, 'id_ID', 'id', 'id_ID.utf8', 'Indonesian');

            $templateProcessor = new TemplateProcessor($templatePath);

            // Year and Semester Parsing
            $tahunStr = (string) $usulan->tahun_pertama;
            if (strlen($tahunStr) === 5) {
                $year = substr($tahunStr, 0, 4);
                $semesterCode = substr($tahunStr, 4, 1);
                $semesterLabel = $semesterCode === '1' ? 'Ganjil' : ($semesterCode === '2' ? 'Genap' : 'Pendek');
                $academicYear = $year . '/' . (intval($year) + 1);
            } else {
                $year = $tahunStr;
                $academicYear = $tahunStr; // Fallback
                $semesterLabel = '-';
            }

            // Basic Info
            $judulSanitized = strtoupper(trim(str_replace(["\r", "\n"], " ", strip_tags($usulan->judul))));
            $templateProcessor->setValue('JUDUL', $judulSanitized);
            $templateProcessor->setValue('NOMOR_KONTRAK', trim($usulan->nomor_kontrak) ?? '-');
            $templateProcessor->setValue('TANGGAL_KONTRAK', $usulan->tanggal_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_kontrak)->translatedFormat('d F Y') : '-');
            $templateProcessor->setValue('TAHUN', $year);
            $templateProcessor->setValue('SEMESTER', $semesterLabel);
            $templateProcessor->setValue('SEMESTER_TAHUN_ANGGARAN', 'Semester ' . $semesterLabel . ' Tahun Anggaran ' . $academicYear);
            $templateProcessor->setValue('SEMESTER_TAHUN', 'Semester ' . $semesterLabel . ' Tahun ' . $academicYear);
            $templateProcessor->setValue('SEMESTER_TAHUN_AKADEMIK_UPPER', strtoupper('Semester ' . $semesterLabel . ' Tahun Akademik ' . $academicYear));
            $templateProcessor->setValue('DANA', number_format($usulan->dana_disetujui, 0, ',', '.'));
            $templateProcessor->setValue('TERBILANG_DANA', $this->terbilang($usulan->dana_disetujui) . ' rupiah');

            // Hitung 30% dan 70%
            // Tanggal & Hari
            $tanggal = $usulan->tanggal_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_kontrak) : null;
            $mulai = $usulan->tanggal_mulai_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_mulai_kontrak) : null;
            $selesai = $usulan->tanggal_selesai_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_selesai_kontrak) : null;

            // Ketua Info
            $ketua = $usulan->ketua;
            $dosen = $ketua->dosen;

            // Pihak Pertama (Admin LPPM / Ketua LPPM)
            $adminLppm = \App\Models\User::whereHas('roles', function ($query) {
                $query->where('name', 'Admin LPPM');
            })->first();
            // $dosenAdmin = $adminLppm ? $adminLppm->dosen : null; // This variable is not used in the new data array, but the logic is inline.

            $dana_disetujui = $usulan->dana_disetujui;

            $data = [
                'usulan' => $usulan,
                'judul' => strtoupper(trim(str_replace(["\r", "\n"], " ", strip_tags($usulan->judul)))),
                'nomor_kontrak' => trim($usulan->nomor_kontrak) ?? '-',
                'tanggal_kontrak' => $usulan->tanggal_kontrak ? \Carbon\Carbon::parse($usulan->tanggal_kontrak)->translatedFormat('d F Y') : '-',
                'tahun' => $year,
                'semester' => $semesterLabel,
                'semester_tahun_anggaran' => 'Semester ' . $semesterLabel . ' Tahun Anggaran ' . $academicYear,
                'semester_tahun' => 'Semester ' . $semesterLabel . ' Tahun ' . $academicYear,
                'semester_tahun_akademik_upper' => strtoupper('Semester ' . $semesterLabel . ' Tahun Akademik ' . $academicYear),
                'dana' => number_format($dana_disetujui, 0, ',', '.'),
                'terbilang_dana' => ucwords(trim($this->terbilang($dana_disetujui))) . ' Rupiah',
                'dana_70_persen' => number_format($dana_disetujui * 0.70, 0, ',', '.'),
                'terbilang_dana_70_persen' => ucwords(trim($this->terbilang($dana_disetujui * 0.70))) . ' Rupiah',
                'dana_30_persen' => number_format($dana_disetujui * 0.30, 0, ',', '.'),
                'terbilang_dana_30_persen' => ucwords(trim($this->terbilang($dana_disetujui * 0.30))) . ' Rupiah',
                'skema' => $usulan->kelompok_skema,

                'hari_kontrak' => $tanggal ? $tanggal->translatedFormat('l') : '-',
                'tanggal_lengkap' => $tanggal ? $tanggal->translatedFormat('d F Y') : '-',
                'tahun_akademik' => $academicYear,
                'tanggal_mulai' => $mulai ? $mulai->translatedFormat('d F Y') : '-',
                'tanggal_selesai' => $selesai ? $selesai->translatedFormat('d F Y') : '-',
                'durasi_bulan' => ($mulai && $selesai) ? $mulai->diffInMonths($selesai) + 1 : 0,

                'target_luaran' => $usulan->luaranList()->where('is_wajib', true)->first()?->kategori ?? 'Belum ditentukan',

                'nama_ketua' => $dosen ? $dosen->nama : $ketua->name,
                'nidn_ketua' => $dosen ? $dosen->nidn : '-',
                'prodi_ketua' => $dosen ? ($dosen->prodi ?? '-') : '-',
                'fakultas_ketua' => '-', // Fakultas belum ada di tabel dosen

                'nama_pihak_pertama' => $adminLppm ? ($adminLppm->dosen ? $adminLppm->dosen->nama : $adminLppm->name) : '-',
                'nidn_pihak_pertama' => $adminLppm && $adminLppm->dosen ? $adminLppm->dosen->nidn : '-',
                'jabatan_pihak_pertama' => 'Ketua LPPM',
            ];

            $pdfFileName = 'KONTRAK_' . preg_replace('/[^A-Za-z0-9]/', '_', $usulan->judul) . '.pdf';

            // Bersihkan output buffer jika ada sebelum mengembalikan file stream
            if (ob_get_length()) {
                ob_end_clean();
            }

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('lppm.kontrak.template', $data);
            return $pdf->download($pdfFileName);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Gagal generate dokumen',
                'pesan' => $e->getMessage(),
                'file' => $e->getFile(),
                'baris' => $e->getLine()
            ], 500);
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
            $hasil = $this->terbilang(floor($nilai / 10)) . " puluh " . $this->terbilang($nilai % 10);
        } else if ($nilai < 200) {
            $hasil = " seratus " . $this->terbilang($nilai - 100);
        } else if ($nilai < 1000) {
            $hasil = $this->terbilang(floor($nilai / 100)) . " ratus " . $this->terbilang($nilai % 100);
        } else if ($nilai < 2000) {
            $hasil = " seribu " . $this->terbilang($nilai - 1000);
        } else if ($nilai < 1000000) {
            $hasil = $this->terbilang(floor($nilai / 1000)) . " ribu " . $this->terbilang($nilai % 1000);
        } else if ($nilai < 1000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000)) . " juta " . $this->terbilang($nilai % 1000000);
        } else if ($nilai < 1000000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000000)) . " milyar " . $this->terbilang(fmod($nilai, 1000000000));
        } else if ($nilai < 1000000000000000) {
            $hasil = $this->terbilang(floor($nilai / 1000000000000)) . " trilyun " . $this->terbilang(fmod($nilai, 1000000000000));
        }

        return trim($hasil);
    }
}
