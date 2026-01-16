import React, { useState, useEffect, useMemo } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import { LuaranForm, Luaran } from '../../../../components/Pengajuan/LuaranForm';
import { LuaranList } from '../../../../components/Pengajuan/LuaranList';

// ====================
//   TYPE DEFINITIONS
// ====================

interface SubstansiData {
    file_substansi: string | null;
    tahun_pelaksanaan: number | ''; // [NEW] 2.1
}

interface PageSubstansiProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

// ====================
//     COMPONENT
// ====================

const PageSubstansi: React.FC<PageSubstansiProps> = ({
    onKembali,
    onSelanjutnya,
    usulanId: propUsulanId
}) => {
    const { props } = usePage<{
        substansi?: SubstansiData;
        usulanId?: number;
    }>();

    const usulanId = propUsulanId ?? props.usulanId;
    const substansi = useMemo(() => props.substansi ?? null, [props.substansi]);

    // State untuk Luaran Management per Kategori
    const [showLuaranForm, setShowLuaranForm] = useState<string | null>(null); // 'A', 'B', 'C', or 'D'
    const [editingLuaran, setEditingLuaran] = useState<Luaran | undefined>(undefined);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Inertia form handler untuk Substansi
    const { data, setData, put, post, progress, transform } = useForm<{
        file_substansi: File | null;
        tahun_pelaksanaan: number | '';
    }>({
        file_substansi: null,
        tahun_pelaksanaan: substansi?.tahun_pelaksanaan ?? '',
    });

    // Submit handler untuk Substansi (Simpan Draft)
    const handleSimpan = () => {
        if (!usulanId) {
            alert('Usulan ID tidak ditemukan. Silakan simpan draft terlebih dahulu.');
            return;
        }

        transform((data) => ({
            ...data,
            _method: 'PUT'
        }));

        post(`/dosen/pengabdian/${usulanId}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Substansi saved successfully');
            },
            forceFormData: true,
        });
    };
    const handleAddLuaran = (kategoriKey: string) => {
        if (!usulanId) {
            alert('Silakan simpan draft identitas usulan terlebih dahulu sebelum menambah luaran.');
            return;
        }
        setEditingLuaran(undefined);
        setShowLuaranForm(kategoriKey);
    };

    const handleEditLuaran = (luaran: Luaran, kategoriKey: string) => {
        setEditingLuaran(luaran);
        setShowLuaranForm(kategoriKey);
    };

    const handleLuaranSubmitSuccess = () => {
        setShowLuaranForm(null);
        setEditingLuaran(undefined);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCancelLuaran = () => {
        setShowLuaranForm(null);
        setEditingLuaran(undefined);
    };

    const renderLuaranSection = (title: string, kategoriKey: string, kategoriLabel: string) => (
        <div className={styles.formSection} style={{ marginTop: 20 }}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.subSectionTitle}>{title}</h3>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => handleAddLuaran(kategoriKey)}
                    disabled={!usulanId}
                >
                    + Tambah {kategoriLabel}
                </button>
            </div>

            {/* Form Luaran specific to this category */}
            {showLuaranForm === kategoriKey && usulanId && (
                <LuaranForm
                    usulanId={usulanId}
                    luaran={editingLuaran}
                    fixedKategori={kategoriLabel} // Enforce this category
                    onSubmitSuccess={handleLuaranSubmitSuccess}
                    onCancel={handleCancelLuaran}
                    isPengabdian={true}
                />
            )}

            {/* List Luaran specific to this category */}
            {usulanId ? (
                <LuaranList
                    usulanId={usulanId}
                    filterKategori={kategoriLabel} // Filter by category
                    onEdit={(l) => handleEditLuaran(l, kategoriKey)}
                    refreshTrigger={refreshTrigger}
                    isPengabdian={true}
                />
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Simpan draft dahulu untuk menambah data.
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* 2.1 Dokumen Substansi */}
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>2.1 Dokumen Substansi</h2>

                {!usulanId && (
                    <div className={styles.warningBox}>
                        ⚠️ <strong>Warning:</strong> Usulan ID tidak ditemukan.
                    </div>
                )}

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={`${styles.label} ${styles.required}`}>
                            Unggah Dokumen Substansi Proposal (PDF)
                        </label>

                        <div className={styles.fileUpload}>
                            <input
                                type="file"
                                id="substansiFile"
                                className={styles.fileInput}
                                onChange={(e) => setData('file_substansi', e.target.files?.[0] ?? null)}
                                disabled={!usulanId}
                                accept=".pdf"
                            />

                            <label htmlFor="substansiFile" className={styles.fileLabel}>
                                Choose File
                            </label>

                            <span className={styles.fileName}>
                                {data.file_substansi?.name || substansi?.file_substansi || 'No file chosen'}
                            </span>
                        </div>

                        {progress && <p>Uploading: {progress.percentage}%</p>}

                        <div className={styles.templateLink}>
                            <a href="/template/substansi_pengabdian.docx" className={styles.link}>
                                Unduh Template
                            </a>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tahun Pelaksanaan</label>
                        <select
                            className={styles.select}
                            value={data.tahun_pelaksanaan}
                            onChange={(e) => setData('tahun_pelaksanaan', Number(e.target.value))}
                        >
                            <option value="">Pilih Tahun</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 2.2 Luaran Pengabdian */}
            <h2 className={styles.sectionTitle} style={{ marginTop: 40, borderBottom: '2px solid #ddd', paddingBottom: 10 }}>
                2.2 Luaran Pengabdian
            </h2>

            {renderLuaranSection('A. Luaran Peningkatan Pemberdayaan Mitra', 'A', 'Peningkatan Pemberdayaan Mitra')}
            {renderLuaranSection('B. Luaran Publikasi', 'B', 'Publikasi')}
            {renderLuaranSection('C. Luaran Publikasi Media', 'C', 'Publikasi Media')}
            {renderLuaranSection('D. Luaran Video', 'D', 'Video')}

            {/* Action Buttons */}
            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}>
                    &lt; Kembali
                </button>
                <button className={styles.secondaryButton} onClick={handleSimpan} disabled={!usulanId}>
                    Simpan Draft
                </button>
                <button
                    className={styles.primaryButton}
                    onClick={() => {
                        if (usulanId) {
                            put(`/dosen/pengabdian/${usulanId}`, {
                                preserveScroll: true,
                                onSuccess: () => onSelanjutnya?.()
                            });
                        }
                    }}
                    disabled={!usulanId}
                >
                    Selanjutnya &gt;
                </button>
            </div>
        </>
    );
};

export default PageSubstansi;