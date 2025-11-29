import React from 'react';
import styles from '../../../css/pengajuan.module.css';

interface PageUsulanProps {
  onTambahUsulan?: () => void;
}

const PageUsulan: React.FC<PageUsulanProps> = ({ onTambahUsulan }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usulan Penelitian</h1>
      </div>

      {/* Add New Proposal Button */}
      <div className={styles.actionHeader}>
        <button 
          className={styles.addButton}
          onClick={onTambahUsulan}
        >
        Tambah Usulan Baru
        </button>
      </div>

      {/* Proposals Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Skema</th>
                <th>Judul</th>
                <th>Tahun Pelaksanaan</th>
                <th>Makro Riset</th>
                <th>Peran</th>
                <th>Status Usulan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>Penelitian Dosen Pemula</td>
                <td className={styles.judulCell}>
                  Portable Water Quality Measuring Tools Dalam Mendukung Budidaya Perikanan
                </td>
                <td>2025</td>
                <td>Kolompok Riset maju berbasis sumber daya alam</td>
                <td>Ketua</td>
                <td>
                  <span className={styles.statusDraft}>Draft</span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} title="Edit">
                      ✏️
                    </button>
                    <button className={styles.actionButton} title="Hapus">
                      🗑️
                    </button>
                    <button className={styles.actionButton} title="Lihat">
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Eligibilities Section */}
      <div className={styles.infoSection}>
        <h2 className={styles.infoTitle}>Info Eligibilities</h2>
        <div className={styles.infoContent}>
          <p>Informasi mengenai eligibilities dan persyaratan pengajuan usulan penelitian akan ditampilkan di sini.</p>
        </div>
      </div>
    </div>
  );
};

export default PageUsulan;