<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        body {
            font-family: "Times New Roman", serif;
            font-size: 16pt;
            line-height: 1.6;
            text-align: justify;
        }

        .center {
            text-align: center;
        }

        .pasal {
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
        }

        table {
            width: 100%;
        }

        .ttd {
            margin-top: 80px;
        }
    </style>

</head>

<body>


    <div class="center">
        <strong>KONTRAK PROGRAM PENGABDIAN KEPADA MASYARAKAT</strong><br>
        {{ $semester_tahun_akademik_upper }}<br>
        Nomor : {{ $nomor_kontrak }}
    </div>

    <br>

    Pada hari ini {{ $hari_kontrak }} {{ $tanggal_mulai }}, kami yang bertanda tangan di bawah ini :

    <table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
        <tr>
            <td valign="top" width="5%">1.</td>
            <td valign="top" width="30%">{{ $nama_pihak_pertama }}</td>
            <td valign="top" width="2%">:</td>
            <td valign="top" style="text-align: justify;">{{ $jabatan_pihak_pertama }}, dalam hal ini bertindak untuk
                dan atas nama Rektor Universitas Asa Indonesia yang berkedudukan di Jakarta, untuk selanjutnya
                disebut &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">2.</td>
            <td valign="top">{{ $nama_ketua }}</td>
            <td valign="top">:</td>
            <td valign="top" style="text-align: justify;">Dosen Universitas Asa Indonesia dalam hal ini bertindak
                sebagai pengusul dan Ketua Pelaksana {{ $semester_tahun_anggaran }}, untuk selanjutnya disebut
                &nbsp;<strong>PIHAK KEDUA</strong>. </td>
        </tr>
    </table>

    <p style="text-align: justify;">Surat Perjanjian Pelaksanaan PkM bagi dosen Universitas Asa Indonesia,&nbsp;
        ({{ $nama_ketua }}) dengan Penugasan Program PkM {{ $semester_tahun_anggaran }} {{ $nomor_kontrak }},
        {{ $tanggal_lengkap }}
    </p>

    <p style="text-align: justify;"> <strong>PIHAK PERTAMA</strong>&nbsp; dan &nbsp;<strong>PIHAK KEDUA</strong>&nbsp;
        secara bersama-sama bersepakat mengikatkan diri dalam
        suatu Perjanjian Pelaksanaan PkM {{ $semester_tahun }} dengan ketentuan dan syarat-syarat diatur dalam
        Pasal-Pasal berikut :</p>

    <div class="pasal">Pasal 1<br>Ruang Lingkup Perjanjian</div>

    <p style="text-align: justify;"> <strong>PIHAK PERTAMA</strong>&nbsp; memberi tugas
        kepada &nbsp;<strong>PIHAK KEDUA</strong>, dan &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; menerima tugas tersebut
        untuk melaksanakan kegiatan PkM
        {{ $semester_tahun }} dengan judul: <strong>{{ $judul }}</strong>
    </p>

    <div class="pasal">Pasal 2<br>Dana PkM</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;">Pelaksanaan PkM sebagaimana dimaksud pada pasal 1 ayat
                (1) menggunakan anggaran sebesar Rp. {{ $dana }}.,- ({{ $terbilang_dana }}) sudah termasuk pajak.</td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;">Dana PkM sebagaimana yang dimaksud pada ayat (1)
                dibebankan pada anggaran akademi sebagaimana yang tertuang dalam program Kerja dan Anggaran
                LPPM&nbsp;Tahun&nbsp;
                {{ $tahun_akademik }} , yang disyahkan melalui SK Ketua YLBPP.
            </td>
        </tr>
    </table>

    <div class="pasal">Pasal 3<br>Tata Cara Pembayaran Dana PkM</div>

    <p style="text-align: justify;">Dana pelaksanaan hibah sebagaimana dimaksud pada ayat (1) dibayarkan oleh
        &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; kepada &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; secara bertahap
        dengan ketentuan sebagai berikut:</p>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">a)</td>
            <td valign="top" style="text-align: justify;">Pembayaran tahap pertama sebesar 30% dari total bantuan dana
                kegiatan, yaitu 30% x Rp. {{ $dana }},- = Rp. {{ $dana_30_persen }},- ({{ $terbilang_dana_30_persen }}),
                &nbsp;yang akan dibayarkan kepada &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; oleh &nbsp;<strong>PIHAK
                    PERTAMA</strong>&nbsp; setelah penandatangan kontrak.</td>
        </tr>
        <tr>
            <td valign="top">b)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; wajib menyerahkan dokumen
                revisi proposal
                PkM (jika diperlukan)
                kepada &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">c)</td>
            <td valign="top" style="text-align: justify;">Penyampaian dokumen laporan sebagaimana point b). di atas
                dilaksanakan sebelum pelaksanaan pencairan dana PkM tahap pertama.</td>
        </tr>
        <tr>
            <td valign="top">d)</td>
            <td valign="top" style="text-align: justify;">Pembayaran tahap kedua/ terakhir sebesar 70% dari total dana
                PkM yaitu 70% x Rp. {{ $dana }},- = Rp. {{ $dana_70_persen }},- ({{ $terbilang_dana_70_persen }})
                ‎ dari total bantuan dana kegiatan, yang dibayarkan setelah &nbsp;<strong>PIHAK KEDUA</strong>&nbsp;
                menyerahkan dokumen di bawah ini:
                <div style="margin-left: 15px; margin-top: 5px;">1. Laporan akhir pelaksanaan PkM<br> 2. Laporan
                    perkembangan luaran hasil PkM (submit/review/published) *pilih salah satu</div>
            </td>
        </tr>
    </table>

    <div class="pasal">Pasal 4<br>Jangka Waktu</div>

    <p style="text-align: justify;">Jangka waktu pelaksanaan PkM sebagaimana dimaksud pada pasal 1 adalah
        &nbsp;terhitung sejak tanggal {{ $tanggal_mulai }} dan berakhir pada tanggal {{ $tanggal_selesai }}</p>

    <div class="pasal">Pasal 5<br>Target Luaran</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban untuk
                mencapai target luaran wajib
                PkM berupa &nbsp;<strong>{{ $target_luaran }}</strong>&nbsp; sesuai dengan target publikasi yang
                dijanjikan.
            </td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban untuk
                melaporkan perkembangan
                pencapaian target luaran sebagaimana
                dimaksud pada ayat (1) kepada &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
    </table>

    <div class="pasal">Pasal 6<br>Hak dan Kewajiban &nbsp;<strong>PARA PIHAK</strong> </div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;">Hak dan kewajiban &nbsp;<strong>PIHAK PERTAMA</strong> <br>
                <div style="margin-left: 15px; margin-top: 5px;">a. <strong>PIHAK PERTAMA</strong>&nbsp; berhak untuk
                    mendapatkan dari &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; luaran PkM sebagaimana dimaksud
                    dalam Pasal 7.<br> b. <strong>PIHAK PERTAMA</strong>&nbsp; berkewajiban untuk
                    memberikan dana
                    PkM kepada &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; dengan jumlah
                    sebagaimana yang dimaksud dalam Pasal 2 ayat (1) dan dengan tata cara pembayaran sebagaimana
                    dimaksud dalam Pasal (2)</div>
            </td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;">Hak dan kewajiban &nbsp;<strong>PIHAK KEDUA</strong> <br>
                <div style="margin-left: 15px; margin-top: 5px;">a. <strong>PIHAK KEDUA</strong>&nbsp; berhak menerima
                    dana PkM dari &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; dengan jumlah sebagaimana dimaksud
                    dalam
                    Pasal 2 ayat (1);<br> b. <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban
                    menyerahkan kepada &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; publikasi luaran
                    PkM.<br> c. <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban untuk
                    bertanggung jawab dalam penggunaan dana PkM yang diterimanya sesuai dengan proposal kegiatan
                    PkM yang telah disetujui.<br> d. <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban untuk
                    menyampaikan kepada &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; laporan penggunaan dana sebagaimanan
                    dimaksud dalam Pasal 7.</div>
            </td>
        </tr>
    </table>

    <div class="pasal">Pasal 7<br>Laporan Pelaksanaan PkM</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban untuk
                menyampaikan kepada &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; berupa laporan kemajuan dan laporan akhir
                mengenai luaran PkM dan
                rekapitulasi penggunaan anggaran sesuai dengan jumlah dana yang diberikan oleh
                &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; yang
                tersusun sistematis sesuai pedoman yang
                ditentukan oleh &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban mengunggah
                Laporan Kemajuan dan
                Catatan harian PkM yang telah
                dilaksanakan ke laman simlitasa.asaindo.ac.id sesuai dengan jadwal yang ditetapkan &nbsp;<strong>PIHAK
                    PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">(3)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban mengunggah
                Laporan Akhir, capaian
                luaran PkM, pada laman
                simlitasa.asaindo.ac.id sesuai dengan jadwal yang ditetapkan &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">(4)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; berkewajiban surat
                keterangan bebas plagiasi yang
                diterbitkan oleh LPPM bersamaan
                dengan unggah laporan akhir PkM.</td>
        </tr>
    </table>

    <div class="pasal">Pasal 8<br>Monitoring dan Evaluasi</div>

    <p style="text-align: justify;"> <strong>PIHAK PERTAMA</strong>&nbsp; dalam rangka
        pengawasan akan melakukan Monitoring dan Evaluasi internal terhadap kemajuan pelaksanaan PkM
        {{ $semester_tahun_anggaran }}. Jadwal pelaksanaan akan ditentukan oleh &nbsp;<strong>PIHAK
            PERTAMA</strong>&nbsp; dan akan diinformasikan
        kepada &nbsp;<strong>PIHAK KEDUA</strong>.
    </p>

    <div class="pasal">Pasal 9<br>Penilaian Luaran</div>

    <p style="text-align: justify;">Luaran hasil PkM dilakukan oleh Reviewer Luar sesuai dengan ketentuan yang
        &nbsp;berlaku dari target jurnal yang dituju.</p>

    <div class="pasal">Pasal 10<br>Perubahan Susunan Tim Pelaksana Dan Substansi Pelaksanaan</div>

    <p style="text-align: justify;">Perubahan terhadap susunan tim pelaksanaan dan substansi pelaksanaan PkM ini
        dapat dibenarkan apabila telah mendapat persetujuan tertulis dari &nbsp;<strong>PIHAK PERTAMA</strong>. </p>

    <div class="pasal">Pasal 11<br>Penggantian Ketua Pelaksana</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;">Apabila &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; selaku ketua
                pelaksanaan tidak dapat
                melaksanakan PkM, maka &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; wajib mengusulkan pengganti ketua
                pelaksana yang
                merupakan salah satu anggota tim kepada &nbsp;<strong>PIHAK PERTAMA</strong>. </td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;">Apabila &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; tidak dapat
                melaksanakan tugas dan tidak
                ada pengganti ketua sebagaimana dimaksud
                pada ayat (1), maka &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; harus mengembalikan
                dana PkM kepada &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; yang selanjutnya
                disetor ke kas akademik.</td>
        </tr>
        <tr>
            <td valign="top">(3)</td>
            <td valign="top" style="text-align: justify;">Bukti setor sebagaimana dimaksud pada ayat (2) disimpan
                oleh &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; dan bagian keuangan akademik.</td>
        </tr>
    </table>

    <div class="pasal">Pasal 12<br>Sanksi</div>

    <p style="text-align: justify;">Apabila sampai dengan batas waktu yang telah ditetapkan untuk melaksanakan
        PkM ini telah berakhir, namun &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; belum menyelesaikan tugasnya,
        terlambat mengirim laporan
        Kemajuan, dan/atau terlambat mengirim laporan akhir serta
        belum menghasilkan luaran yang terpublikasikan, maka &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; dikenakan sanksi
        administratif berupa
        penghentian pembayaran dan tidak dapat mengajukan proposal PkM pada periode berikutnya sebelum
        menyelesaikan seluruh kewajibannya.</p>

    <div class="pasal">Pasal 13<br>Pembatalan Perjanjian</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;">Apabila dikemudian hari terhadap judul PkM sebagaimana
                dimaksud dalam Pasal 1 ditemukan adanya duplikasi dengan PkM lain dan/atau ditemukan adanya
                ketidakjujuran, itikad tidak baik dan/atau perbuatan yang tidak sesuai dengan kaidah ilmiah dari atas
                dilakukan oleh &nbsp;<strong>PIHAK KEDUA</strong>, maka perjanjian PkM
                ini dinyatakan batal dan &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; wajib
                mengembalikan dana PkM yang telah diterima kepada &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; yang
                selanjutnya akan disetor ke
                kas akademik.</td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;">Bukti setor sebagaimana dimaksud pada ayat (1) disimpan
                oleh &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; dan kaur keuangan akademik.</td>
        </tr>
    </table>

    <div class="pasal">Pasal 14<br>Penyelesaian Sengketa</div>

    <p style="text-align: justify;">Apabila terjadi perselisihan antara &nbsp;<strong>PIHAK PERTAMA</strong>&nbsp; dan
        &nbsp;<strong>PIHAK KEDUA</strong>&nbsp; dalam pelaksanaan
        perjanjian ini akan dilakukan penyelesaian secara musyawarah dan mufakat, dan apabila tidak tercapai
        penyelesaian secara musyawarah dan mufakat maka penyelesaian dilakukan melalui proses hukum.</p>

    <div class="pasal">Pasal 15<br>Lain-lain</div>

    <table style="width: 100%;">
        <tr>
            <td valign="top" width="5%">(1)</td>
            <td valign="top" style="text-align: justify;"> <strong>PIHAK KEDUA</strong>&nbsp; menjamin bahwa PkM
                dengan judul tersebut
                diatas belum pernah dibiayai
                dan/atau diikutsertakan pada Pendanaan PkM lainnya, baik yang diselenggarakan oleh instansi,
                lembaga perusahaan atau yayasan baik di dalam maupun di luar negeri.</td>
        </tr>
        <tr>
            <td valign="top">(2)</td>
            <td valign="top" style="text-align: justify;">Segala sesuatu yang belum cukup diatur dalam Perjanjian ini
                dan dipandang perlu diatur lebih lanjut dan dilakukan perubahan oleh &nbsp;<strong>PARA PIHAK</strong>,
                maka
                perubahan-perubahan akan diatur dalam
                perjanjian tambahan atau perubahan yang merupakan satu kesatuan dan bagian yang tidak terpisahkan dari
                Perjanjian ini.</td>
        </tr>
        <tr>
            <td valign="top">(3)</td>
            <td valign="top" style="text-align: justify;">Perjanjian ini dibuat dan ditandatangani oleh
                &nbsp;<strong>PARA PIHAK</strong>&nbsp; pada
                hari dan Tanggal tersebut di atas, dibuat
                dalam rangkap 2 (dua) dan bermaterai cukup sesuai dengan ketentuan yang berlaku, yang masing-masing
                mempunyai kekuatan yang sama.</td>
        </tr>
    </table>

    <br><br><br>

    <table>
        <tr>
            <td width="50%" align="center"> <strong>PIHAK PERTAMA</strong> <br>
                @php
                    $path1 = public_path('ttd/ttd-lppm.png');
                    if (file_exists($path1)) {
                        $type1 = pathinfo($path1, PATHINFO_EXTENSION);
                        $data1 = file_get_contents($path1);
                        $base64_1 = 'data:image/' . $type1 . ';base64,' . base64_encode($data1);
                    } else {
                        $base64_1 = '';
                    }
                 @endphp
                @if($base64_1)
                    <img src="{{ $base64_1 }}" width="280" style="margin-bottom:-40px; margin-top:-20px;">
                @else
                    <br><br><br>
                @endif
                <br>
                <strong>{{ $nama_pihak_pertama }}</strong><br>
                NIDN {{ $nidn_pihak_pertama }}
            </td>

            <td width="50%" align="center"> <strong>PIHAK KEDUA</strong> <br><br><br>
                <!-- Biarkan kosong untuk ditandatangani basah oleh dosen, atau beri placeholder gaib jika ada ttd_dosen -->
                <div style="width: 150px; height: 100px;"></div>
                <br>
                <strong>{{ $nama_ketua }}</strong><br>
                NIDN {{ $nidn_ketua }}
            </td>
        </tr>
    </table>

    <br><br>

    <div class="center">
        Mengetahui,<br>
        Rektor AKPINDO
    </div>

    <!-- Tanda Tangan Rektor di tengah bawah -->
    <div class="center">
        @php
            $path2 = public_path('ttd/ttd-rektor.png');
            if (file_exists($path2)) {
                $type2 = pathinfo($path2, PATHINFO_EXTENSION);
                $data2 = file_get_contents($path2);
                $base64_2 = 'data:image/' . $type2 . ';base64,' . base64_encode($data2);
            } else {
                $base64_2 = '';
            }
         @endphp
        @if($base64_2)
            <img src="{{ $base64_2 }}" width="280" style="margin-bottom:-40px; margin-top:-20px;">
        @else
            <br><br><br>
        @endif
        <br>
        <strong>Dr. Bonifasius MH Nainggolan, M.Si., M.M.</strong><br>
        NIDN 0016127001
    </div>

</body>

</html>