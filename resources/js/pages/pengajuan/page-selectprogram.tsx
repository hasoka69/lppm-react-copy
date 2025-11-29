import React from 'react';
import styles from '../../../css/pengajuan.module.css';

const PageSelectProgram = () => {
  return (
    <div className={styles.container}>

      {/* Form Section */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Pemilihan Program Penelitian</h2>
        
        <div className={styles.formGrid}>
          {/* Kelompok Skema */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              4. Kelompok Skema *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Kategori Penelitian</option>
              <option value="1">Penelitian Dasar</option>
              <option value="2">Penelitian Terapan</option>
              <option value="3">Penelitian Pengembangan</option>
            </select>
          </div>

          {/* Ruang Lingkup */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              5. Ruang Lingkup *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Ruang Lingkup</option>
              <option value="1">Nasional</option>
              <option value="2">Internasional</option>
              <option value="3">Regional</option>
            </select>
          </div>

          {/* Kategori SBK */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              6. Kategori SBK *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Kategori SBK</option>
              <option value="1">SBK A</option>
              <option value="2">SBK B</option>
              <option value="3">SBK C</option>
            </select>
          </div>

          {/* Bidang Fokus Penelitian */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              7. Bidang Fokus Penelitian *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Bidang Fokus</option>
              <option value="1">Kesehatan</option>
              <option value="2">Pertanian</option>
              <option value="3">Teknologi</option>
              <option value="4">Sosial Humaniora</option>
            </select>
          </div>

          {/* Tema Penelitian */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              8. Tema Penelitian
            </label>
            <select className={styles.select}>
              <option value="">Pilih Tema Penelitian</option>
              <option value="1">Tema 1</option>
              <option value="2">Tema 2</option>
              <option value="3">Tema 3</option>
            </select>
          </div>

          {/* Topik Penelitian */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              9. Topik Penelitian
            </label>
            <select className={styles.select}>
              <option value="">Pilih Topik Penelitian</option>
              <option value="1">Topik 1</option>
              <option value="2">Topik 2</option>
              <option value="3">Topik 3</option>
            </select>
          </div>

          {/* Rumpun Ilmu Level 1 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              10. Rumpun Ilmu Level 1 *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Rumpun Ilmu Level 1</option>
              <option value="1">Ilmu Alam</option>
              <option value="2">Ilmu Sosial</option>
              <option value="3">Ilmu Humaniora</option>
            </select>
          </div>

          {/* Rumpun Ilmu Level 2 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              11. Rumpun Ilmu Level 2 *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Rumpun Ilmu Level 2</option>
              <option value="1">Matematika</option>
              <option value="2">Fisika</option>
              <option value="3">Kimia</option>
            </select>
          </div>

          {/* Rumpun Ilmu Level 3 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              12. Rumpun Ilmu Level 3 *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Rumpun Ilmu Level 3</option>
              <option value="1">Aljabar</option>
              <option value="2">Geometri</option>
              <option value="3">Statistika</option>
            </select>
          </div>

          {/* Prioritas Riset */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              13. Prioritas Riset
            </label>
            <select className={styles.select}>
              <option value="">Pilih Prioritas Riset</option>
              <option value="1">Prioritas 1</option>
              <option value="2">Prioritas 2</option>
              <option value="3">Prioritas 3</option>
            </select>
          </div>

          {/* Tahun Pertama Usulan */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              14. Tahun Pertama Usulan *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Tahun Pertama Usulan</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Lama Kegiatan */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              15. Lama Kegiatan *
            </label>
            <select className={styles.select}>
              <option value="">Pilih Lama Kegiatan</option>
              <option value="1">1 Tahun</option>
              <option value="2">2 Tahun</option>
              <option value="3">3 Tahun</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSelectProgram;