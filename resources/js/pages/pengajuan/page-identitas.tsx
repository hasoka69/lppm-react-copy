import React from 'react';
import styles from '../../../css/pengajuan.module.css';

interface PageIdentitasProps {
  onSelanjutnya?: () => void;
  onTutupForm?: () => void;
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({ onSelanjutnya, onTutupForm }) => {
  return (
    <div className={styles.container}>
      {/* Form Section - Ketua Penelitian */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Identitas Pengusul - Anggota Penelitian</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nama Ketua
            </label>
            <input 
              type="text" 
              className={styles.input}
              placeholder="Masukan Nama Ketua"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>
              Uraian Tugas Dalam Penelitian
            </label>
            <textarea 
              className={styles.textarea}
              placeholder="Uraian Tugas"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Anggota Penelitian Table */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Identitas Pengusul - Anggota Penelitian</h2>
          <button className={styles.addButton}>
            Tambah
          </button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Nuptik</th>
                <th>Nama</th>
                <th>Peran</th>
                <th>Institusi</th>
                <th>Tugas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>08298B9280182018</td>
                <td>Alexxxx</td>
                <td>Ketua Pengusul</td>
                <td>Universitas</td>
                <td>Bahan Penelitian</td>
                <td>Menyetujui</td>
                <td>
                  <button className={styles.actionButton}>✅</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Anggota Non Dosen Table */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Identitas Pengusul - Anggota Penelitian Non Dosen</h2>
          <button className={styles.addButton}>
            Tambah
          </button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Jenis Anggota</th>
                <th>No Identitas</th>
                <th>Nama</th>
                <th>Instansi</th>
                <th>Tugas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>---</td>
                <td>03883286816</td>
                <td>Alexxx</td>
                <td>Universitas</td>
                <td>yyyyy</td>
                <td>
                  <button className={styles.actionButton}>✅</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionContainer}>
        <button className={styles.secondaryButton} onClick={onTutupForm}>
          Tutup Form
        </button>
        <button className={styles.secondaryButton}>
          Simpan Sebagai Draft ☎
        </button>
        <button className={styles.primaryButton} onClick={onSelanjutnya}>
          Selanjutnya &gt;
        </button>
      </div>
    </div>
  );
};

export default PageIdentitas;