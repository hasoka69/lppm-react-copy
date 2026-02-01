import React, { useState, useEffect, useMemo } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import { LuaranForm } from '../../../../components/Pengajuan/LuaranForm';
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
    X
} from 'lucide-react';

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
    usulanId?: number;
}

const PageSubstansi: React.FC<PageSubstansiProps> = ({
    onKembali,
    onSelanjutnya,
    usulanId: propUsulanId
}) => {
    const { props } = usePage<{
        makroRisetList?: MakroRiset[];
        substansi?: SubstansiData;
        usulanId?: number;
    }>();

    const usulanId = propUsulanId ?? props.usulanId;
    const makroRisetList = useMemo(() => props.makroRisetList ?? [], [props.makroRisetList]);
    const substansi = useMemo(() => props.substansi ?? null, [props.substansi]);

    const [showLuaranForm, setShowLuaranForm] = useState(false);
    const [editingLuaran, setEditingLuaran] = useState<Luaran | undefined>(undefined);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { data, setData, post, processing, errors, progress } = useForm<{
        makro_riset_id: number | '';
        file_substansi: File | null;
        _method: string;
    }>({
        makro_riset_id: props.substansi?.makro_riset_id ?? '',
        file_substansi: null,
        _method: 'put',
    });

    const handleSimpan = () => {
        if (!usulanId) {
            alert('Usulan ID tidak ditemukan.');
            return;
        }
        post(`/dosen/penelitian/${usulanId}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert('Draft dokumen substansi berhasil disimpan.');
            }
        });
    };

    const handleAddLuaran = () => {
        if (!usulanId) return;
        setEditingLuaran(undefined);
        setShowLuaranForm(true);
    };

    const handleEditLuaran = (luaran: Luaran) => {
        // Map to correct Luaran type if needed
        setEditingLuaran(luaran as any);
        setShowLuaranForm(true);
    };

    const handleLuaranSubmitSuccess = () => {
        setShowLuaranForm(false);
        setEditingLuaran(undefined);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className={styles.container}>
            {/* 2.1 Substansi Section */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <FileText size={24} className="text-emerald-600" />
                        Dokumen Substansi Usulan
                    </h2>

                    {!usulanId && (
                        <div className={styles.warningBox} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertCircle size={20} />
                            <span>Silakan simpan draft identitas usulan pada Langkah 1 terlebih dahulu.</span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '1.5rem' }}>
                        {/* Kelompok Makro Riset Selection */}
                        <div style={{
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}>
                                    <Layers size={20} />
                                </div>
                                <label className={styles.label} style={{ margin: 0, fontWeight: 700 }}>Kelompok Makro Riset *</label>
                            </div>
                            <select
                                className={styles.select}
                                value={data.makro_riset_id}
                                onChange={(e) => setData('makro_riset_id', e.target.value === '' ? '' : (Number(e.target.value) || 0))}
                                disabled={!usulanId}
                                style={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    background: 'white'
                                }}
                            >
                                <option value="">Pilih Kelompok Makro Riset</option>
                                {makroRisetList.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                                Pilih kelompok makro riset yang paling sesuai dengan fokus penelitian Anda.
                            </p>
                            {errors.makro_riset_id && (
                                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    <span>{errors.makro_riset_id}</span>
                                </div>
                            )}
                        </div>

                        {/* File Upload Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', color: '#10b981' }}>
                                    <UploadCloud size={20} />
                                </div>
                                <label className={styles.label} style={{ margin: 0, fontWeight: 700 }}>Unggah Proposal Penelitian (PDF) *</label>
                            </div>

                            <div
                                className={styles.fileUploadArea}
                                style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '16px',
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    background: data.file_substansi || substansi?.file_substansi ? '#f0fdf4' : '#f8fafc',
                                    borderColor: data.file_substansi || substansi?.file_substansi ? '#22c55e' : '#cbd5e1',
                                    cursor: usulanId ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
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

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    {data.file_substansi || substansi?.file_substansi ? (
                                        <div style={{ background: '#22c55e', padding: '1rem', borderRadius: '50%', color: 'white' }}>
                                            <CheckCircle2 size={32} />
                                        </div>
                                    ) : (
                                        <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                                            <UploadCloud size={32} color="var(--primary)" />
                                        </div>
                                    )}

                                    <div>
                                        <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.25rem', fontSize: '1.125rem' }}>
                                            {data.file_substansi?.name || (substansi?.file_substansi ? 'File: ' + substansi.file_substansi.split('/').pop() : 'Klik untuk mengunggah proposal')}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            {data.file_substansi || substansi?.file_substansi ? 'Klik untuk mengganti file yang sudah ada' : 'Hanya menerima format PDF dengan ukuran maksimal 5MB'}
                                        </p>
                                    </div>
                                </div>

                                {progress && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#e2e8f0' }}>
                                        <div style={{ height: '100%', width: `${progress.percentage}%`, background: '#22c55e', transition: 'width 0.3s' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', alignItems: 'center' }}>
                                <a href="/template/substansi_penelitian.docx" className={styles.link} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    padding: '8px 16px',
                                    background: '#f1f5f9',
                                    borderRadius: '8px',
                                    color: '#475569'
                                }}>
                                    <Download size={16} /> Unduh Template Substansi
                                </a>
                                {(data.file_substansi || substansi?.file_substansi) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {substansi?.file_substansi && (
                                            <a
                                                href={`/storage/${substansi.file_substansi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.link}
                                                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}
                                            >
                                                Lihat File Terunggah
                                            </a>
                                        )}
                                        <span style={{ fontSize: '0.875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                            <CheckCircle2 size={16} /> Berhasil
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2.2 Luaran Section */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                            <Layers size={24} className="text-emerald-600" />
                            Target Luaran Penelitian
                        </h2>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={handleAddLuaran}
                            disabled={!usulanId}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            <Plus size={18} /> Tambah Luaran
                        </button>
                    </div>

                    {showLuaranForm && usulanId && (
                        <div style={{ marginBottom: '2rem' }}>
                            <LuaranForm
                                usulanId={usulanId}
                                luaran={editingLuaran as any}
                                onSubmitSuccess={handleLuaranSubmitSuccess}
                                onCancel={() => setShowLuaranForm(false)}
                                isPengabdian={false}
                            />
                        </div>
                    )}

                    {usulanId ? (
                        <LuaranList
                            usulanId={usulanId}
                            onEdit={handleEditLuaran}
                            refreshTrigger={refreshTrigger}
                            isPengabdian={false}
                        />
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                            <Layers size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Data luaran akan muncul setelah Anda mulai mengisi identitas usulan.</p>
                        </div>
                    )}
                </div>
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
                            post(`/dosen/penelitian/${usulanId}`, {
                                forceFormData: true,
                                preserveScroll: true,
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