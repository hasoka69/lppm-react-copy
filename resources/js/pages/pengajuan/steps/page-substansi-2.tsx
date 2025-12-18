import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import styles from '../../../../css/pengajuan.module.css';
import { LuaranForm } from '../components/LuaranForm';
import { LuaranList } from '../components/LuaranList';

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

interface Luaran {
  id: number;
  usulan_id: number;
  tahun: number;
  kategori: string;
  deskripsi: string;
  status: string;
  keterangan?: string;
}

interface PageSubstansiProps {
  onKembali?: () => void;
  onSelanjutnya?: () => void;
  usulanId?: number; // Tambahkan prop usulanId
}

// ====================
//     COMPONENT
// ====================

const PageSubstansi: React.FC<PageSubstansiProps> = ({
  onKembali,
  onSelanjutnya,
  usulanId: propUsulanId // Terima dari props
}) => {
  const { props } = usePage<{
    makroRisetList: MakroRiset[];
    substansi?: SubstansiData;
    usulanId?: number; // Bisa juga dari usePage
  }>();

  const makroRisetList = props.makroRisetList ?? [];
  const substansi = props.substansi ?? null;

  // Ambil usulanId dari props atau dari usePage
  const usulanId = propUsulanId ?? props.usulanId;

  // State untuk Luaran Management
  const [showLuaranForm, setShowLuaranForm] = useState(false);
  const [editingLuaran, setEditingLuaran] = useState<Luaran | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Inertia form handler untuk Substansi
  const { data, setData, post, progress } = useForm<{
    makro_riset_id: number | '';
    file_substansi: File | null;
  }>({
    makro_riset_id: substansi?.makro_riset_id ?? '',
    file_substansi: null,
  });

  // Submit handler untuk Substansi
  const handleSimpan = () => {
    if (!usulanId) {
      alert('Usulan ID tidak ditemukan. Silakan simpan draft terlebih dahulu.');
      return;
    }
    post(`/pengajuan/${usulanId}/substansi/save`);
  };

  // Handler untuk Luaran
  const handleAddLuaran = () => {
    if (!usulanId) {
      alert('Silakan simpan draft identitas usulan terlebih dahulu sebelum menambah luaran.');
      return;
    }
    setEditingLuaran(undefined);
    setShowLuaranForm(true);
  };

  const handleEditLuaran = (luaran: Luaran) => {
    setEditingLuaran(luaran);
    setShowLuaranForm(true);
  };

  const handleLuaranSubmitSuccess = () => {
    setShowLuaranForm(false);
    setEditingLuaran(undefined);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh list
  };

  const handleCancelLuaran = () => {
    setShowLuaranForm(false);
    setEditingLuaran(undefined);
  };

  // Debug: Log usulanId untuk memastikan nilainya
  useEffect(() => {
    console.log('PageSubstansi - usulanId:', usulanId);
  }, [usulanId]);

  return (
    <>
      {/* ============================ */}
      {/*      SUBSTANSI USULAN       */}
      {/* ============================ */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Substansi Usulan</h2>

        {/* Debug Info - Hapus setelah testing */}
        {!usulanId && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#c00'
          }}>
            ⚠️ <strong>Warning:</strong> Usulan ID tidak ditemukan. Silakan simpan draft identitas usulan terlebih dahulu.
          </div>
        )}

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
      {/*        LUARAN PENELITIAN    */}
      {/* ============================ */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Luaran Target Capaian</h2>
          <button
            className={styles.addButton}
            onClick={handleAddLuaran}
            disabled={!usulanId}
          >
            + Tambah Luaran
          </button>
        </div>

        {/* Form Luaran (Show/Hide) */}
        {showLuaranForm && usulanId && (
          <LuaranForm
            usulanId={usulanId}
            luaran={editingLuaran}
            onSubmitSuccess={handleLuaranSubmitSuccess}
            onCancel={handleCancelLuaran}
          />
        )}

        {/* List Luaran */}
        {usulanId && (
          <LuaranList
            usulanId={usulanId}
            onEdit={handleEditLuaran}
            refreshTrigger={refreshTrigger}
          />
        )}

        {!usulanId && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <p>Silakan simpan draft identitas usulan terlebih dahulu untuk menambahkan luaran penelitian.</p>
          </div>
        )}
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
          <button
            className={styles.secondaryButton}
            onClick={handleSimpan}
            disabled={!usulanId}
          >
            Simpan Sebagai Draft
          </button>

          <button
            className={styles.primaryButton}
            onClick={onSelanjutnya}
            disabled={!usulanId}
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