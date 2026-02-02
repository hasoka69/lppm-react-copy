import React, { useState, useEffect, useMemo } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import { LuaranForm, Luaran } from '../../../../components/Pengajuan/LuaranForm';
import { LuaranList } from '../../../../components/Pengajuan/LuaranList';
import {
    FileText,
    Layers,
    Plus,
    UploadCloud,
    Download,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Save,
    Calendar,
    Target
} from 'lucide-react';

interface SubstansiData {
    file_substansi: string | null;
}

interface PageSubstansiProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

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

    const [showLuaranForm, setShowLuaranForm] = useState<string | null>(null);
    const [editingLuaran, setEditingLuaran] = useState<Luaran | undefined>(undefined);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { data, setData, put, post, progress, transform, processing } = useForm<{
        file_substansi: File | null;
    }>({
        file_substansi: null,
    });

    const handleSimpan = () => {
        if (!usulanId) {
            alert('Usulan ID tidak ditemukan.');
            return;
        }

        transform((data) => ({
            ...data,
            _method: 'PUT'
        }));

        post(`/dosen/pengabdian/${usulanId}`, {
            preserveScroll: true,
            onSuccess: () => alert('Draft substansi berhasil disimpan.'),
            forceFormData: true,
        });
    };

    const handleAddLuaran = (kategoriKey: string) => {
        if (!usulanId) return;
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

    const renderLuaranSection = (title: string, kategoriKey: string, kategoriLabel: string) => (
        <div className={styles.pageSection} style={{ marginTop: '1.5rem' }}>
            <div className={styles.formSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className={styles.subSectionTitle} style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary)', fontWeight: 700 }}>
                        {title}
                    </h3>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => handleAddLuaran(kategoriKey)}
                        disabled={!usulanId}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        <Plus size={14} /> Tambah
                    </button>
                </div>

                {showLuaranForm === kategoriKey && usulanId && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <LuaranForm
                            usulanId={usulanId}
                            luaran={editingLuaran}
                            fixedKategori={kategoriLabel}
                            onSubmitSuccess={handleLuaranSubmitSuccess}
                            onCancel={() => setShowLuaranForm(null)}
                            isPengabdian={true}
                        />
                    </div>
                )}

                {usulanId ? (
                    <LuaranList
                        usulanId={usulanId}
                        filterKategori={kategoriLabel}
                        onEdit={(l) => handleEditLuaran(l, kategoriKey)}
                        refreshTrigger={refreshTrigger}
                        isPengabdian={true}
                    />
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem' }}>Simpan draft untuk menambah data.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* 2.1 Dokumen Substansi */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <FileText size={24} className="text-emerald-600" />
                        Dokumen Substansi & Pelaksanaan
                    </h2>

                    {!usulanId && (
                        <div className={styles.warningBox} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertCircle size={20} />
                            <span>Silakan simpan draft didentitas pada Langkah 1 terlebih dahulu.</span>
                        </div>
                    )}

                    <div className={styles.formGrid}>
                        {/* Tahun Pelaksanaan removed as per request */}

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Unggah Dokumen Proposal (PDF) *</label>
                            <div
                                className={styles.fileUploadArea}
                                style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: usulanId ? 'pointer' : 'not-allowed'
                                }}
                                onClick={() => usulanId && document.getElementById('substansiFile')?.click()}
                            >
                                <input
                                    type="file"
                                    id="substansiFile"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setData('file_substansi', e.target.files?.[0] ?? null)}
                                    disabled={!usulanId}
                                    accept=".pdf"
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                    <UploadCloud size={32} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                                            {data.file_substansi?.name || substansi?.file_substansi || 'Klik atau seret file PDF ke sini'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Format PDF, Max 5MB</p>
                                    </div>
                                </div>

                                {progress && (
                                    <div style={{ marginTop: '1.5rem', width: '100%', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '8px', width: `${progress.percentage}%`, background: 'var(--primary)' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <a href="/template/substansi_pengabdian.docx" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                    <Download size={16} /> Unduh Template Substansi
                                </a>
                                {substansi?.file_substansi && (
                                    <span style={{ fontSize: '0.875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle2 size={16} /> File Terupload
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2.2 Luaran Pengabdian */}
            <div style={{ marginTop: '3rem' }}>
                <h2 className={styles.sectionTitle}>
                    <Target size={24} className="text-emerald-600" />
                    Target Luaran Pengabdian
                </h2>

                {renderLuaranSection('A. Luaran Peningkatan Pemberdayaan Mitra', 'A', 'Peningkatan Pemberdayaan Mitra')}
                {renderLuaranSection('B. Luaran Publikasi', 'B', 'Publikasi')}
                {renderLuaranSection('C. Luaran Publikasi Media', 'C', 'Publikasi Media')}
                {renderLuaranSection('D. Luaran Video', 'D', 'Video')}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionContainer}>
                <button type="button" className={styles.secondaryButton} onClick={onKembali}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Kembali
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className={styles.secondaryButton} onClick={handleSimpan} disabled={processing || !usulanId}>
                        <Save size={18} style={{ marginRight: '8px' }} /> Simpan Draft
                    </button>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => {
                            if (!usulanId) return;
                            transform((data) => ({ ...data, _method: 'PUT' }));
                            post(`/dosen/pengabdian/${usulanId}`, {
                                preserveScroll: true,
                                forceFormData: true,
                                onSuccess: () => onSelanjutnya?.()
                            });
                        }}
                        disabled={processing || !usulanId}
                    >
                        Selanjutnya <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageSubstansi;