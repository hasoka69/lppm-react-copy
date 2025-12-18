import React from 'react';
import styles from '../../../../css/pengajuan.module.css';

interface PageTinjauanProps {
  onKembali?: () => void;
  onKonfirmasi?: () => void;
  onTutupForm?: () => void;
  usulanId?: number; // ✅ TAMBAHKAN INI

}

const PageTinjauan: React.FC<PageTinjauanProps> = ({
  onKembali,
  onKonfirmasi,
  onTutupForm,
  usulanId // ✅ TAMBAHKAN INI
}) => {

  // ✅ Debug log
  console.log('🔍 PageTinjauan - usulanId:', usulanId);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSubmit = () => {
    if (!usulanId) {
      alert('Usulan ID tidak ditemukan. Tidak dapat submit.');
      return;
    }
    onKonfirmasi?.();
  };

  return (
    <>

      {/* ✅ Warning jika usulanId tidak ada */}
      {!usulanId && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '16px',
          color: '#c00'
        }}>
          ⚠️ <strong>Warning:</strong> Usulan ID tidak ditemukan. Tidak dapat submit usulan.
        </div>
      )}

      {/* Informasi Status */}
      <div className={styles.alertWarning}>
        <div className={styles.alertIcon}>⚠️</div>
        <div className={styles.alertText}>
          Anda belum bisa melakukan submit usulan, status keanggotaan belum semuanya <strong>Menyetujui</strong>
        </div>
      </div>

      {/* Judul dan Informasi Utama */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Judul</h2>

        <div className={styles.reviewGrid}>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Judul Penelitian</span>
            <span className={styles.reviewValue}>
              Sistem pendukung keputusan pemilihan bibit tanaman di kawasan perkotaan berbasis machine learning dengan algoritma random forest
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Lama Kegiatan</span>
            <span className={styles.reviewValue}>1 Tahun</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Kelompok Skema</span>
            <span className={styles.reviewValue}>Riset Dasar</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Tema Penelitian</span>
            <span className={styles.reviewValue}>Pengembangan sistem/platform berbasis open source</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Ruang Lingkup</span>
            <span className={styles.reviewValue}>Penelitian Dosen Pemula</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Topik Penelitian</span>
            <span className={styles.reviewValue}>Sistem informasi berbasis kearifan lokal</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Bidang Fokus</span>
            <span className={styles.reviewValue}>Produk Rekayasa Keteknikan</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Rumpun Ilmu Level 3</span>
            <span className={styles.reviewValue}>Ilmu Komputer/Sistem Informasi</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Tahun Usulan</span>
            <span className={styles.reviewValue}>2026</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Target TKT</span>
            <span className={styles.reviewValue}>3</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Tahun Pelaksanaan</span>
            <span className={styles.reviewValue}>2026</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Profile SINTA Ketua</span>
            <span className={styles.reviewValue}>0217939173</span>
          </div>
        </div>
      </div>

      {/* Identitas Anggota Dosen */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Identitas Anggota Dosen</h2>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>NUPIK/NIDN</th>
                <th>Nama</th>
                <th>Institusi</th>
                <th>Prodi</th>
                <th>Tugas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>08218309701820</td>
                <td>YANKADLN</td>
                <td>Universitas oxkwb</td>
                <td>Sistem Informasi</td>
                <td>Ketua</td>
                <td>
                  <span className={styles.statusApproved}>Menyetujui</span>
                </td>
              </tr>
              <tr>
                <td>2.</td>
                <td>08218309701820</td>
                <td>YANKADLN</td>
                <td>Universitas oxkwb</td>
                <td>Sistem Informasi</td>
                <td>Ketua</td>
                <td>
                  <span className={styles.statusPending}>Menunggu</span>
                </td>
              </tr>
              <tr>
                <td>3.</td>
                <td>08218309701820</td>
                <td>YANKADLN</td>
                <td>Universitas oxkwb</td>
                <td>Sistem Informasi</td>
                <td>Ketua</td>
                <td>
                  <span className={styles.statusPending}>Menunggu</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Substansi dan Luaran */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Substansi dan Luaran</h2>

        <div className={styles.reviewSection}>
          <h3 className={styles.subTitle}>Nama Makro Riset</h3>
          <p className={styles.reviewText}>Kelompok Riset Teknologi Tinggi</p>
        </div>

        <div className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.subTitle}>Substansi</h3>
            <button className={styles.downloadButton}>
              Download
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Urutan Tahun</th>
                  <th>Kelompok Luaran</th>
                  <th>Jenis Luaran</th>
                  <th>Target</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tahun Ke-1</td>
                  <td>Artikel di jurnal</td>
                  <td>Artikel di jurnal bereputasi</td>
                  <td>Accepted/Published</td>
                  <td>ajurmal.asaindo.co.id</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rancangan Anggaran Biaya */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Rancangan Anggaran Biaya (RAB)</h2>

        <div className={styles.rabInfo}>
          <p><strong>Total Anggaran yang diajukan:</strong> Rp 200.000,00</p>
          <p><strong>Tahun ke 1</strong></p>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kelompok</th>
                <th>Komponen</th>
                <th>Item</th>
                <th>Satuan</th>
                <th>Harga Satuan</th>
                <th>Volume</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bahan</td>
                <td>ATK</td>
                <td>Tinta Printer</td>
                <td>Paket</td>
                <td>200.000</td>
                <td>1</td>
                <td>200.000</td>
              </tr>
              <tr className={styles.totalRow}>
                <td colSpan={6}><strong>Total Anggaran Tahun Ke 1</strong></td>
                <td><strong>Rp. 200.000,00</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mitra */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Mitra</h2>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Mitra</th>
                <th>Institusi</th>
                <th>Alamat Institusi</th>
                <th>Negara</th>
                <th>Surel</th>
                <th>Surat Kesanggupan</th>
                <th>Dana</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Mitra Kosong
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionContainer}>
        <div className={styles.actionLeft}>
          <button className={styles.secondaryButton} onClick={onKembali}>
            &lt; Kembali
          </button>
          <button className={styles.secondaryButton} onClick={onTutupForm}>
            Tutup Form
          </button>
        </div>
        <div className={styles.actionRight}>
          <button className={styles.printButton} onClick={handlePrintPDF}>
            Print PDF
          </button>
          <button className={styles.primaryButton} onClick={handleSubmit}>
            Submit &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default PageTinjauan;