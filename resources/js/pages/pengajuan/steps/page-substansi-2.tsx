import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import styles from '../../../../css/pengajuan.module.css';

// ====================
//   TYPE DEFINITIONS
// ====================

interface MakroRiset {
  id: number;
  nama: string;
}

interface SubstansiData {
  makro_riset_id: number | '';
  file_substansi: string | null;
}

interface LuaranItem {
  id: number;
  tahun: number;
  kategori: string;
  luaran: string;
  status: string;
  keterangan: string;
}

interface BackendProps {
  makroRisetList: MakroRiset[];
  substansi?: SubstansiData | null;
  luaranList: LuaranItem[];
}

interface PageSubstansiProps {
  onKembali?: () => void;
  onSelanjutnya?: () => void;
}

// ====================
//     COMPONENT
// ====================

const PageSubstansi: React.FC<PageSubstansiProps> = ({ onKembali, onSelanjutnya }) => {
  const { props } = usePage<{ makroRisetList: MakroRiset[]; substansi?: SubstansiData; luaranList: LuaranItem[] }>();

  const makroRisetList = props.makroRisetList ?? [];
  const substansi = props.substansi ?? null;
  const luaranList = props.luaranList ?? [];

  // Inertia form handler (TSX SAFE)
  const { data, setData, post, progress } = useForm<{
    makro_riset_id: number | '';
    file_substansi: File | null;
  }>({
    makro_riset_id: substansi?.makro_riset_id ?? '',
    file_substansi: null,
  });

  // Submit handler
  const handleSimpan = () => {
    post('/pengajuan/substansi/save'); // ubah sesuai routing kamu
  };

  return (
    <>
      {/* ============================ */}
      {/*      SUBSTANSI USULAN       */}
      {/* ============================ */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Substansi Usulan</h2>

        <div className={styles.formGrid}>
          {/* Select: Makro Riset */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              Kelompok Makro Riset
            </label>
            <select
              className={styles.select}
              value={data.makro_riset_id}
              onChange={(e) => setData('makro_riset_id', Number(e.target.value))}
            >
              <option value="">Pilih Kelompok Makro Riset</option>
              {makroRisetList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.required}`}>
              Unggah Substansi Laporan
            </label>

            <div className={styles.fileUpload}>
              <input
                type="file"
                id="substansiFile"
                className={styles.fileInput}
                onChange={(e) => setData('file_substansi', e.target.files?.[0] ?? null)}
              />

              <label htmlFor="substansiFile" className={styles.fileLabel}>
                Choose File
              </label>

              <span className={styles.fileName}>
                {data.file_substansi?.name ||
                  substansi?.file_substansi ||
                  'No file chosen'}
              </span>
            </div>

            {progress && (
              <p style={{ marginTop: 4 }}>
                Uploading: {progress.percentage}%
              </p>
            )}

            <div className={styles.templateLink}>
              <a href="/template/substansi.docx" className={styles.link}>
                Unduh Template
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/*        LUARAN WAJIB         */}
      {/* ============================ */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Luaran Target Capaian</h2>

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
              {luaranList.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 10 }}>
                    Tidak ada data luaran
                  </td>
                </tr>
              ) : (
                luaranList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}.</td>
                    <td>{item.kategori}</td>
                    <td>{item.luaran}</td>
                    <td>{item.status}</td>
                    <td>{item.keterangan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================ */}
      {/*        ACTION BUTTONS        */}
      {/* ============================ */}
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
          <button className={styles.secondaryButton} onClick={handleSimpan}>
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
