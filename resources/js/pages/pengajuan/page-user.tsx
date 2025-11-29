import React from 'react';
import styles from '../../../css/pengajuan.module.css';

const PageUser = () => {
  return (
    <>
      
      {/* Form Section */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Identitas Usulan Penelitian</h2>
        
        <div className={styles.formGrid}>
          {/* Judul Field */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              1. Judul
            </label>
            <input 
              type="text" 
              className={styles.input}
              placeholder="Judul"
            />
          </div>

          {/* TKT Saat Ini Field */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              2. TKT Saat Ini
            </label>
            <input 
              type="text" 
              className={styles.input}
              placeholder=""
            />
          </div>

          {/* Target Akhir TKT Field */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              3. Target Akhir TKT
            </label>
            <select className={styles.select}>
              <option value="">Pilih Target TKT Akhir</option>
              <option value="1">TKT 1</option>
              <option value="2">TKT 2</option>
              <option value="3">TKT 3</option>
              <option value="4">TKT 4</option>
              <option value="5">TKT 5</option>
              <option value="6">TKT 6</option>
              <option value="7">TKT 7</option>
              <option value="8">TKT 8</option>
              <option value="9">TKT 9</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageUser;