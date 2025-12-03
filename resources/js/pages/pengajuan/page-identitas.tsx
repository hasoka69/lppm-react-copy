import React from 'react';
import { useForm } from '@inertiajs/react';
import styles from '../../../css/pengajuan.module.css';

interface PageIdentitasProps {
  onSelanjutnya?: () => void;
  onTutupForm?: () => void;
  usulanId?: number; // ID usulan jika edit
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
  onSelanjutnya,
  onTutupForm,
  usulanId
}) => {
  // Inertia form helper
  const { data, setData, post, put, processing, errors } = useForm({
    judul: '',
    tkt_saat_ini: '',
    target_akhir_tkt: '',
    kelompok_skema: '',
    ruang_lingkup: '',
    // ... field lainnya
  });

  // Handle simpan draft
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();

    if (usulanId) {
      // Update usulan yang sudah ada
      put(`/pengajuan/${usulanId}`, {
        preserveScroll: true,
        onSuccess: () => {
          console.log('Draft updated successfully');
        },
      });
    } else {
      // Buat usulan baru
      post('/pengajuan/draft', {
        preserveScroll: true,
        onSuccess: () => {
          console.log('Draft saved successfully');
        },
      });
    }
  };

  // Handle next step
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Simpan dulu ke backend
    if (usulanId) {
      put(`/pengajuan/${usulanId}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Lanjut ke step berikutnya
          onSelanjutnya?.();
        },
        onError: (validationErrors) => {
          console.error('Validation errors:', validationErrors);
        },
      });
    } else {
      post('/pengajuan/draft', {
        preserveScroll: true,
        onSuccess: () => {
          // Lanjut ke step berikutnya
          onSelanjutnya?.();
        },
        onError: (validationErrors) => {
          console.error('Validation errors:', validationErrors);
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleNext}>
        {/* Form Section - Identitas */}
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
                value={data.judul}
                onChange={(e) => setData('judul', e.target.value)}
              />
              {errors.judul && (
                <span className={styles.error}>{errors.judul}</span>
              )}
            </div>

            {/* TKT Saat Ini Field */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>
                2. TKT Saat Ini
              </label>
              <input
                type="number"
                className={styles.input}
                placeholder="1-9"
                value={data.tkt_saat_ini}
                onChange={(e) => setData('tkt_saat_ini', e.target.value)}
              />
              {errors.tkt_saat_ini && (
                <span className={styles.error}>{errors.tkt_saat_ini}</span>
              )}
            </div>

            {/* Target Akhir TKT Field */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>
                3. Target Akhir TKT
              </label>
              <select
                className={styles.select}
                value={data.target_akhir_tkt}
                onChange={(e) => setData('target_akhir_tkt', e.target.value)}
              >
                <option value="">Pilih Target TKT Akhir</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>TKT {num}</option>
                ))}
              </select>
              {errors.target_akhir_tkt && (
                <span className={styles.error}>{errors.target_akhir_tkt}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionContainer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onTutupForm}
            disabled={processing}
          >
            Tutup Form
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleSaveDraft}
            disabled={processing}
          >
            {processing ? 'Menyimpan...' : 'Simpan Sebagai Draft ☎'}
          </button>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={processing}
          >
            {processing ? 'Memproses...' : 'Selanjutnya >'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageIdentitas;