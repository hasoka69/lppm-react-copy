import React from 'react';
import { usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import {
    ClipboardCheck,
    FileText,
    Users,
    Layers,
    Wallet,
    History,
    ShieldCheck,
    Printer,
    Send,
    ArrowLeft,
    X,
    ExternalLink,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface PageTinjauanProps {
    onKembali?: () => void;
    onKonfirmasi?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
    isReadOnly?: boolean;
}

const PageTinjauan: React.FC<PageTinjauanProps> = ({
    onKembali,
    onKonfirmasi,
    onTutupForm,

    usulanId: propUsulanId,
    isReadOnly = false
}) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [isChecked, setIsChecked] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handlePrintPDF = () => window.print();

    const handleSubmit = () => {
        if (!usulanId) {
            alert('Usulan ID tidak ditemukan.');
            return;
        }

        if (!['draft', 'revision_dosen'].includes(usulan.status)) {
            alert('Status usulan tidak memungkinkan untuk pengiriman.');
            return;
        }

        const rabItems = usulan.rab_items || usulan.rabItems || [];
        const totalAnggaran = rabItems.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);

        // Validation for Budget Cap logic
        if (usulan.dana_disetujui > 0 && totalAnggaran > Number(usulan.dana_disetujui)) {
            alert(`Gagal Kirim: Total RAB (Rp ${formatCurrency(totalAnggaran)}) melebihi pagu dana yang disetujui (Rp ${formatCurrency(usulan.dana_disetujui)}). Silakan revisi RAB Anda.`);
            return;
        }

        if (confirm('Apakah Anda yakin ingin mengirim usulan ini? Data tidak dapat diubah setelah dikirim.')) {
            setIsSubmitting(true);
            router.post(`/dosen/penelitian/${usulanId}/submit`, {}, {
                onSuccess: () => {
                    alert('Usulan berhasil dikirim!');
                    onKonfirmasi?.();
                },
                onError: () => alert('Gagal mengirim usulan. Silakan cek kembali kelengkapan data.'),
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    if (!usulan) return <div className="flex justify-center p-12 text-gray-500">Memuat data usulan...</div>;

    const rabItems = usulan.rab_items || usulan.rabItems || [];
    const totalAnggaran = rabItems.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);

    const renderReviewItem = (label: string, value: string | number) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
            }}>
                {label}
            </span>
            <div style={{
                padding: '0.75rem 1rem',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                color: 'var(--secondary)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
            }}>
                {value || '-'}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header Document */}
            <div className={styles.pageSection}>
                <div className={styles.formSection} style={{ borderBottom: '4px solid var(--primary)', borderRadius: '12px 12px 0 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                                <ClipboardCheck size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>Review Usulan Penelitian</h2>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>ID Usulan: #{usulanId}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className={styles.badge} style={{
                                background: usulan.status === 'draft' ? '#f1f5f9' : '#dcfce7',
                                color: usulan.status === 'draft' ? '#475569' : '#166534',
                                fontSize: '0.875rem',
                                padding: '6px 16px'
                            }}>
                                {usulan.status.toUpperCase().replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Informasi Dasar */}
            <div className={styles.pageSection}>
                <div className={styles.formSection} style={{ background: 'transparent', padding: 0, border: 'none', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <FileText size={20} className="text-blue-600" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>Identitas & Judul Usulan</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Title Card */}
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: 'linear-gradient(to bottom, var(--primary), #3b82f6)'
                            }} />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Judul Penelitian
                            </span>
                            <h1 style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: 'var(--secondary)',
                                lineHeight: 1.4,
                                margin: 0
                            }}>
                                {usulan.judul}
                            </h1>
                        </div>

                        {/* Metadata Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            {/* Group: Skema & Waktu */}
                            <div style={{
                                background: '#f8fafc',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                                    <Layers size={16} className="text-blue-500" />
                                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#475569' }}>Skema & Durasi</span>
                                </div>
                                {renderReviewItem('Kelompok Skema', usulan.kelompok_skema)}
                                {renderReviewItem('Lama Kegiatan', `${usulan.lama_kegiatan} Tahun`)}
                                {renderReviewItem('Tahun Pertama', usulan.tahun_pertama)}
                            </div>

                            {/* Group: Fokus & Bidang */}
                            <div style={{
                                background: '#f8fafc',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                                    <ShieldCheck size={16} className="text-blue-500" />
                                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#475569' }}>Fokus & Spesifikasi</span>
                                </div>
                                {renderReviewItem('Bidang Fokus', usulan.bidang_fokus)}
                                {renderReviewItem('Target Akhir TKT', `Level ${usulan.target_akhir_tkt}`)}
                                {renderReviewItem('Tema Penelitian', usulan.tema_penelitian)}
                                {renderReviewItem('Topik Penelitian', usulan.topik_penelitian)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Personil */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <Users size={20} className="text-blue-600" />
                        Anggota Tim Peneliti
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nama / NIDN</th>
                                    <th>Peran</th>
                                    <th>Tugas dlm Penelitian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.anggota_dosen || usulan.anggotaDosen || []).map((m: any) => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{m.nama}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.nidn}</div>
                                        </td>
                                        <td><span className={styles.badge} style={{ background: '#dcfce7', color: '#166534' }}>{m.peran}</span></td>
                                        <td style={{ fontSize: '0.875rem' }}>{m.tugas || '-'}</td>
                                    </tr>
                                ))}
                                {(usulan.anggota_non_dosen || usulan.anggotaNonDosen || []).map((m: any) => (
                                    <tr key={m.id || `nd-${m.no_identitas}`}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{m.nama}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.no_identitas} • {m.jurusan}</div>
                                        </td>
                                        <td><span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569' }}>{m.jenis_anggota}</span></td>
                                        <td style={{ fontSize: '0.875rem' }}>{m.tugas || '-'}</td>
                                    </tr>
                                ))}
                                {(usulan.anggota_dosen || usulan.anggotaDosen || []).length === 0 && (usulan.anggota_non_dosen || usulan.anggotaNonDosen || []).length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Belum ada anggota tim tambahan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3. Substansi & Luaran */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <Layers size={20} className="text-blue-600" />
                        Substansi & Target Luaran
                    </h3>
                    <div className={styles.reviewGrid}>
                        {renderReviewItem('Kelompok Makro Riset', usulan.kelompok_makro_riset)}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                Dokumen Proposal
                            </span>
                            <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                                {usulan.file_substansi ? (
                                    <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                        <ExternalLink size={16} /> Lihat Dokumen Laporan
                                    </a>
                                ) : <span className="text-red-500" style={{ fontWeight: 600 }}>Belum diunggah</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem' }}>Target Luaran Capaian:</p>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Tahun</th>
                                    <th>Kategori</th>
                                    <th>Deskripsi Luaran</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.luaran_list || usulan.luaranList || []).map((l: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>Tahun {l.tahun}</td>
                                        <td style={{ fontWeight: 600 }}>{l.kategori}</td>
                                        <td style={{ fontSize: '0.875rem' }}>{l.deskripsi}</td>
                                        <td>{l.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4. RAB Summary */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                            <Wallet size={20} className="text-blue-600" />
                            Rerincian Anggaran (RAB)
                        </h3>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Usulan:</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginLeft: '8px' }}>{formatCurrency(totalAnggaran)}</span>
                        </div>
                    </div>
                    {/* Simplified RAB Review */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {['bahan', 'perjalanan', 'publikasi', 'pengumpulan_data'].map(tipe => {
                            const subtot = rabItems.filter((i: any) => i.tipe === tipe).reduce((acc: number, i: any) => acc + (Number(i.total) || 0), 0);
                            return (
                                <div key={tipe} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>{tipe.replace('_', ' ')}</span>
                                    <div style={{ fontWeight: 700, marginTop: '4px' }}>{formatCurrency(subtot)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 5. Riwayat - if exists */}
            {(usulan.review_histories || usulan.reviewHistories || []).length > 0 && (
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>
                            <History size={20} className="text-blue-600" />
                            Riwayat Usulan & Catatan Review
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(usulan.review_histories || usulan.reviewHistories).map((h: any, i: number) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ minWidth: '100px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                        {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>{h.action}</span>
                                        <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>"{h.comments}"</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Area */}
            {['draft', 'revision_dosen'].includes(usulan.status) && (
                <div className={styles.pageSection}>
                    <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '12px', border: '1px solid #10b981' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <ShieldCheck size={28} className="text-emerald-600" />
                            <div>
                                <h4 style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>Pernyataan Konfirmasi</h4>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginTop: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        style={{ marginTop: '4px', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#064e3b' }}>
                                        Saya menyatakan bahwa seluruh data usulan ini telah diisi dengan benar dan sesuai dengan panduan yang berlaku.
                                        Saya bersedia mempertanggungjawabkan data ini dan mengikuti seluruh proses seleksi serta pelaksanaan penelitian
                                        sesuai aturan LPPM.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Footer */}
            <div className={styles.actionContainer}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.secondaryButton} onClick={onKembali}>
                        <ArrowLeft size={18} /> Kembali
                    </button>
                    <button className={styles.secondaryButton} onClick={onTutupForm}>
                        <X size={18} /> Tutup
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.secondaryButton} onClick={handlePrintPDF}>
                        <Printer size={18} /> Print Review
                    </button>
                    {!isReadOnly ? (
                        <button
                            className={styles.primaryButton}
                            onClick={handleSubmit}
                            disabled={isSubmitting || !['draft', 'revision_dosen'].includes(usulan.status) || !isChecked}
                            style={{
                                background: isChecked ? '#10b981' : '#94a3b8',
                                padding: '0.75rem 2rem'
                            }}
                        >
                            {isSubmitting ? 'Memproses...' : (
                                <>
                                    <Send size={18} /> Kirim Usulan Sekarang
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            className={styles.secondaryButton}
                            disabled
                            style={{ opacity: 0.7, cursor: 'not-allowed', background: '#f1f5f9' }}
                        >
                            <ShieldCheck size={18} /> Mode Tinjauan (Read Only)
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PageTinjauan;