<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Kontrak Penelitian/Pengabdian</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 1cm;
        }

        h3 {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .text-center {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        .mt-20 {
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .table-pihak td {
            vertical-align: top;
            padding: 2px;
        }

        .table-ttd {
            width: 100%;
            margin-top: 50px;
        }

        .table-ttd td {
            text-align: center;
            vertical-align: top;
            width: 50%;
        }

        .ttd-space {
            height: 80px;
        }

        p {
            text-align: justify;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .pasal-title {
            text-align: center;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>

    <h3>SURAT PERJANJIAN PENUGASAN PELAKSANAAN</h3>
    <h3>PROGRAM {{ strtoupper($usulan->kelompok_skema) ?? 'PENELITIAN/PENGABDIAN' }}</h3>
    <h3 style="margin-bottom: 20px;">NOMOR: {{ $usulan->nomor_kontrak ?? '................................' }}</h3>

    <p>Pada hari ini <strong>{{ $hari_kontrak }}</strong>, tanggal <strong>{{ $tanggal_lengkap }}</strong>, yang
        bertanda tangan di bawah ini:</p>

    <table class="table-pihak mb-20">
        <tr>
            <td style="width: 3%;">1.</td>
            <td style="width: 25%;">Nama</td>
            <td style="width: 2%;">:</td>
            <td class="bold">{{ $nama_pihak_pertama }}</td>
        </tr>
        <tr>
            <td></td>
            <td>NIDN</td>
            <td>:</td>
            <td>{{ $nidn_pihak_pertama }}</td>
        </tr>
        <tr>
            <td></td>
            <td>Jabatan</td>
            <td>:</td>
            <td>{{ $jabatan_pihak_pertama }}</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="3">Selanjutnya disebut <strong>PIHAK PERTAMA</strong>.</td>
        </tr>
    </table>

    <table class="table-pihak mb-20">
        <tr>
            <td style="width: 3%;">2.</td>
            <td style="width: 25%;">Nama</td>
            <td style="width: 2%;">:</td>
            <td class="bold">{{ $nama_ketua }}</td>
        </tr>
        <tr>
            <td></td>
            <td>NIDN</td>
            <td>:</td>
            <td>{{ $nidn_ketua }}</td>
        </tr>
        <tr>
            <td></td>
            <td>Program Studi</td>
            <td>:</td>
            <td>{{ $prodi_ketua }}</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="3">Selanjutnya disebut <strong>PIHAK KEDUA</strong>.</td>
        </tr>
    </table>

    <p><strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong> secara bersama-sama sepakat untuk mengikatkan
        diri dalam Perjanjian Penugasan Pelaksanaan Program {{ \Illuminate\Support\Str::title($usulan->kelompok_skema ?? 'Penelitian') }}
        dengan ketentuan dan syarat-syarat sebagai berikut:</p>

    <div class="pasal-title">PASAL 1<br>RUANG LINGKUP PERJANJIAN</div>
    <p><strong>PIHAK PERTAMA</strong> memberikan tugas kepada <strong>PIHAK KEDUA</strong> untuk melaksanakan program
        {{ \Illuminate\Support\Str::title($usulan->kelompok_skema) }} dengan judul:
    </p>
    <p class="text-center bold" style="margin: 15px 0;">"{{ strtoupper($judul) }}"</p>

    <div class="pasal-title">PASAL 2<br>PENDANAAN DAN TATA CARA PEMBAYARAN</div>
    <p>1. Biaya pelaksanaan program yang disetujui sebesar <strong>Rp {{ $dana }}</strong> ({{ $terbilang_dana }}).</p>
    <p>2. Pembayaran akan dilakukan dengan rincian pencairan tahap pertama sebesar 70% (Rp {{ $dana_70_persen }}) dan
        pencairan tahap kedua sebesar 30% (Rp {{ $dana_30_persen }}).</p>

    <div class="pasal-title">PASAL 3<br>JANGKA WAKTU PELAKSANAAN</div>
    <p>Jangka waktu pelaksanaan program ditetapkan selama <strong>{{ $durasi_bulan }}</strong> bulan, terhitung mulai
        tanggal <strong>{{ $tanggal_mulai }}</strong> sampai dengan tanggal <strong>{{ $tanggal_selesai }}</strong>.</p>

    <div class="pasal-title">PASAL 4<br>TARGET LUARAN</div>
    <p><strong>PIHAK KEDUA</strong> berkewajiban untuk mencapai target luaran yang dijanjikan, yaitu berupa:
        <strong>{{ $target_luaran }}</strong>.
    </p>

    <p style="margin-top: 40px;">Demikian surat perjanjian ini dibuat rangkap 2 (dua), bermaterai cukup dan
        masing-masing mempunyai kekuatan hukum yang sama.</p>

    <table class="table-ttd">
        <tr>
            <td>
                <strong>PIHAK PERTAMA</strong>,<br>
                Ketua LPPM
                <div class="ttd-space"></div>
                <u><strong>{{ $nama_pihak_pertama }}</strong></u><br>
                NIDN. {{ $nidn_pihak_pertama }}
            </td>
            <td>
                <strong>PIHAK KEDUA</strong>,<br>
                Ketua Peneliti/Pengabdi
                <div class="ttd-space"></div>
                <u><strong>{{ $nama_ketua }}</strong></u><br>
                NIDN. {{ $nidn_ketua }}
            </td>
        </tr>
    </table>

</body>

</html>