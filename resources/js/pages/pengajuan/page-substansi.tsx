import React from 'react';
import styles from '../../../css/pengajuan.module.css';

interface PageSubstansiProps {
  onKembali?: () => void;
  onSelanjutnya?: () => void;
}

const PageSubstansi: React.FC<PageSubstansiProps> = ({ onKembali, onSelanjutnya }) => {
  return (
    <>
      {/* Form Section - Substansi Usulan */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Substansi Usulan</h2>
        
        <div className={styles.formGrid}>
          {/* Kelompok Makro Riset */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              Kelompok Makro Riset
            </label>
            <select className={styles.select}>
              <option value="">Pilih Kelompok Makro Riset</option>
              <option value="teknologi">Teknologi Tinggi</option>
              <option value="sains">Sains Dasar</option>
              <option value="sosial">Sosial Humaniora</option>
            </select>
          </div>

          {/* Unggah Substansi Laporan */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              Unggah Substansi Laporan
            </label>
            <div className={styles.fileUpload}>
              <input 
                type="file" 
                className={styles.fileInput}
                id="substansiFile"
              />
              <label htmlFor="substansiFile" className={styles.fileLabel}>
                Choose File
              </label>
              <span className={styles.fileName}>No file chosen</span>
            </div>
            <div className={styles.templateLink}>
              <a href="#" className={styles.link}>Unduh Template</a>
            </div>
          </div>
        </div>
      </div>

      {/* Luaran Target Capaian Section */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Luaran Target Capaian</h2>
        
        <div className={styles.subSection}>
          <h3 className={styles.subTitle}>Luaran Wajib</h3>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Urutan Tahun</th>
                  <th>Kategori Luaran</th>
                  <th>Luaran</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Artikel di jurnal</td>
                  <td>Artikel di jurnal bereputasi</td>
                  <td>Accepted/Published</td>
                  <td>ajurnal.asaindo.ac.id</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionContainer}>
        <div className={styles.actionRow}>
          <button className={styles.secondaryButton} onClick={onKembali}>
            &lt; Kembali
          </button>
          <button className={styles.secondaryButton}>
            Tutup Form
          </button>
        </div>
        <div className={styles.actionRow}>
          <button className={styles.secondaryButton}>
            Simpan Sebagai Draft
          </button>
          <button 
            className={styles.primaryButton} 
            onClick={onSelanjutnya}
            style={{ marginLeft: 'auto' }}
          >
            Selanjutnya &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default PageSubstansi;