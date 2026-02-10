import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { formatAcademicYear } from '../../../../lib/utils';
import styles from '../../../../../css/pengajuan.module.css';
import {
    ClipboardCheck,
    FileText,
    Users,
    Building2,
    Layers,
    Wallet,
    History,
    ShieldCheck,
    ArrowLeft,
    Save,
    Send,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react';

interface PageKonfirmasiProps {
    onKembali?: () => void;
    onKonfirmasi?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
    isReadOnly?: boolean;
}

const PageKonfirmasi: React.FC<PageKonfirmasiProps> = ({
    onKembali,
    onKonfirmasi,
    onTutupForm,
    usulanId: propUsulanId,
    isReadOnly = false
}) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const handleSubmit = async () => {
        if (!usulanId) return;
        if (!isChecked) {
            alert('Harap setujui pernyataan konfirmasi terlebih dahulu.');
            return;
        }

        if (!['draft', 'revision_dosen'].includes(usulan.status)) {
            alert('Status usulan tidak memungkinkan untuk pengiriman.');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin mengirim usulan ini? Data tidak dapat diubah setelah dikirim.')) {
            return;
        }

        const rabItems = usulan.rab_items || usulan.rabItems || [];
        const totalAnggaran = rabItems.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);

        // Validation for Budget Cap logic
        if (usulan.dana_disetujui > 0 && totalAnggaran > Number(usulan.dana_disetujui)) {
            alert(`Gagal Kirim: Total RAB (Rp ${formatCurrency(totalAnggaran)}) melebihi pagu dana yang disetujui (Rp ${formatCurrency(usulan.dana_disetujui)}). Silakan revisi RAB Anda.`);
            return;
        }

        setIsSubmitting(true);
        router.post(route('dosen.pengabdian.submit', usulanId), {}, {
            onSuccess: (page) => {
                const flash = (page.props as any).flash;
                if (flash?.success) {
                    // Alert removed for smoother transition
                    onKonfirmasi?.();
                } else if (flash?.error) {
                    alert(`Gagal: ${flash.error}`);
                }
            },
            onError: (errors) => {
                console.error(errors);
                alert('Gagal mengirim usulan. Terjadi kesalahan sistem atau validasi.');
            },
            onFinish: () => setIsSubmitting(false)
        });
    };

    if (!usulan) return <div className="flex justify-center p-12 text-gray-500">Memuat data usulan...</div>;

    const renderReviewItem = (label: string, value: string | number) => (
        <div className={styles.reviewItemV2}>
            <div className={styles.reviewLabelV2}>{label}</div>
            <div className={styles.reviewValueV2}>{value || '-'}</div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header Konfirmasi */}
            <div className={styles.pageSection}>
                <div className={styles.formSection} style={{ borderBottom: '4px solid var(--primary)', borderRadius: '12px 12px 0 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                                <ClipboardCheck size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>Konfirmasi Usulan Pengabdian</h2>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>ID Usulan: #{usulanId}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className={styles.badge} style={{
                                background: usulan.status === 'draft' ? '#f1f5f9' : '#dcfce7',
                                color: usulan.status === 'draft' ? '#475569' : '#166534',
                                padding: '6px 16px'
                            }}>
                                {usulan.status.toUpperCase().replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Identitas Usulan */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><FileText size={20} className="text-blue-600" /> Identitas Usulan</h3>
                    <div className={styles.reviewGrid}>
                        <div className={styles.fullWidth}>{renderReviewItem('Judul Pengabdian', usulan.judul)}</div>
                        {renderReviewItem('Skema', usulan.kelompok_skema)}
                        {renderReviewItem('Bidang Fokus', usulan.bidang_fokus)}
                        {renderReviewItem('Tahun Pelaksanaan', formatAcademicYear(usulan.tahun_pertama))}
                    </div>
                </div>
            </div>

            {/* 2. Anggota */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><Users size={20} className="text-blue-600" /> Tim Pengabdi</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nama / Identitas</th>
                                <th>Peran</th>
                                <th>Tugas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Ketua Row */}
                            <tr className="bg-blue-50/50">
                                <td>
                                    <div style={{ fontWeight: 600 }}>{usulan.ketua?.name || usulan.user?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        {usulan.ketua?.dosen?.nidn || usulan.user?.dosen?.nidn || '-'} (Ketua Pengusul)
                                    </div>
                                </td>
                                <td>Ketua</td>
                                <td style={{ fontSize: '0.875rem' }}>{usulan.tugas_ketua || '-'}</td>
                            </tr>
                            {(usulan.anggota_dosen || usulan.anggotaDosen || []).map((m: any) => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{m.nama}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.nidn} (Dosen)</div>
                                    </td>
                                    <td>{m.peran}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{m.tugas}</td>
                                </tr>
                            ))}
                            {(usulan.anggota_non_dosen || usulan.anggotaNonDosen || []).map((m: any) => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{m.nama}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.no_identitas} ({m.jenis_anggota || 'Mahasiswa'})</div>
                                    </td>
                                    <td>{m.peran || 'Anggota'}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{m.tugas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Mitra Sasaran */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><Building2 size={20} className="text-blue-600" /> Mitra Sasaran</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nama Mitra</th>
                                <th>Lokasi</th>
                                <th>Pimpinan</th>
                                <th style={{ textAlign: 'center' }}>Dokumen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(usulan.mitra || []).map((m: any, idx: number) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>{m.nama_mitra}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{m.nama_kota}, {m.nama_provinsi}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{m.pimpinan_mitra}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {m.file_surat_kesediaan && (
                                            <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" className={styles.link}>
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(usulan.mitra || []).length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>Belum ada mitra</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Substansi & Luaran */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><Layers size={20} className="text-blue-600" /> Substansi & Target Luaran</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Dokumen Proposal: </span>
                        {usulan.file_substansi ? (
                            <a href={`/storage/${usulan.file_substansi}`} target="_blank" className={styles.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <ExternalLink size={16} /> Lihat Proposal
                            </a>
                        ) : 'Belum diunggah'}
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Kategori Luaran</th>
                                <th>Deskripsi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(usulan.luaran_items || usulan.luaranItems || []).map((l: any) => (
                                <tr key={l.id}>
                                    <td style={{ fontWeight: 600 }}>{l.kategori}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{l.deskripsi}</td>
                                    <td>{l.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. RAB */}
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className={styles.sectionTitle} style={{ margin: 0 }}><Wallet size={20} className="text-blue-600" /> Ringkasan Anggaran</h3>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Anggaran:</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginLeft: '8px' }}>{formatCurrency(Number(usulan.total_anggaran))}</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {['pelatihan', 'konsumsi', 'transport_mitra', 'alat_bahan'].map(tipe => {
                            const subtot = (usulan.rab_items || usulan.rabItems || []).filter((i: any) => i.tipe === tipe).reduce((acc: number, i: any) => acc + (Number(i.total) || 0), 0);
                            return (
                                <div key={tipe} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>{tipe.replace('_', ' ')}</span>
                                    <div style={{ fontWeight: 700, marginTop: '4px', fontSize: '0.9rem' }}>{formatCurrency(subtot)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Riwayat & Catatan Review */}
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
                                        {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                                            {h.action ? h.action.replace(/_/g, ' ') : '-'}
                                        </span>
                                        <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                                            "{h.comments || '-'}"
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Konfirmasi Summary */}
            <div className={styles.pageSection}>
                <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '12px', border: '1px solid #10b981' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <ShieldCheck size={28} className="text-emerald-600" />
                        <div>
                            <h4 style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>Pernyataan Konfirmasi Akhir</h4>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginTop: '1rem' }}>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    style={{ marginTop: '4px', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#064e3b' }}>
                                    Saya menyatakan bahwa seluruh data usulan pengabdian ini telah benar. Saya bersedia mengikuti
                                    seluruh ketentuan LPPM dan mempertanggungjawabkan data ini.
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className={styles.actionContainer}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.secondaryButton} onClick={onKembali} disabled={isSubmitting}>
                        <ArrowLeft size={18} /> Kembali Review
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.secondaryButton} onClick={onTutupForm} disabled={isSubmitting}>
                        <Save size={18} /> Simpan Draft & Tutup
                    </button>
                    {!isReadOnly || (['draft', 'revision_dosen'].includes(usulan.status)) ? (
                        <button
                            className={styles.primaryButton}
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isChecked || !['draft', 'revision_dosen'].includes(usulan.status)}
                            style={{
                                background: isChecked && ['draft', 'revision_dosen'].includes(usulan.status) ? '#10b981' : '#94a3b8',
                                padding: '0.75rem 2rem'
                            }}
                        >
                            {isSubmitting ? 'Mengirim...' : (
                                <>
                                    <Send size={18} /> Kirim Usulan
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            className={styles.secondaryButton}
                            disabled
                            style={{ opacity: 0.7, cursor: 'not-allowed', background: '#f1f5f9' }}
                        >
                            <ShieldCheck size={18} /> Mode Read Only
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageKonfirmasi;
