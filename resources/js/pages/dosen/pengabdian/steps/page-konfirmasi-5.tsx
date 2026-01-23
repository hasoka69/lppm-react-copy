import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';

interface PageKonfirmasiProps {
    onKembali?: () => void;
    onKonfirmasi?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
}

const PageKonfirmasi: React.FC<PageKonfirmasiProps> = ({
    onKembali,
    onKonfirmasi,
    onTutupForm,
    usulanId: propUsulanId
}) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = async () => {
        if (!usulanId) return;
        if (!isChecked) {
            alert('Harap setujui pernyataan konfirmasi terlebih dahulu.');
            return;
        }

        if (!['draft', 'revision_dosen'].includes(usulan.status)) {
            alert('Status usulan tidak memungkinkan untuk pengiriman (Sudah diajukan atau diproses).');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin mengirim usulan ini? Data yang sudah dikirim tidak dapat diubah lagi.')) {
            return;
        }

        setIsSubmitting(true);
        router.post(route('dosen.pengabdian.submit', usulanId), {}, {
            onSuccess: (page) => {
                const flash = (page.props as any).flash;
                if (flash?.success) {
                    alert(flash.success);
                    onKonfirmasi?.();
                } else if (flash?.error) {
                    alert(flash.error);
                }
                setIsSubmitting(false);
            },
            onError: (err) => {
                console.error(err);
                alert('Gagal mengirim usulan. Silakan periksa kembali kelengkapan data.');
                setIsSubmitting(false);
            }
        });
    };

    if (!usulan) return <div>Loading data usulan...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Konfirmasi Usulan Pengabdian</h2>

                <div className={styles.reviewGroup}>
                    <h3 className={styles.subTitle}>1. Identitas Usulan</h3>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Judul</span>
                            <span className={styles.reviewValue}>{usulan.judul}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Skema</span>
                            <span className={styles.reviewValue}>{usulan.kelompok_skema}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Bidang Fokus</span>
                            <span className={styles.reviewValue}>{usulan.bidang_fokus}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Tahun Pelaksanaan</span>
                            <span className={styles.reviewValue}>{usulan.tahun_pertama}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Lama Kegiatan</span>
                            <span className={styles.reviewValue}>{usulan.lama_kegiatan} Tahun</span>
                        </div>
                    </div>
                </div>

                <div className={styles.reviewGroup}>
                    <h3 className={styles.subTitle}>2. Anggota Pengabdi</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nama / NIDN</th>
                                    <th>Peran / Instansi</th>
                                    <th>Tugas</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.anggota_dosen || usulan.anggotaDosen || []).map((m: any) => (
                                    <tr key={m.id}>
                                        <td>
                                            <div className="font-bold">{m.nama}</div>
                                            <div className="text-xs text-gray-500">{m.nidn}</div>
                                        </td>
                                        <td>
                                            <div>{m.peran}</div>
                                            <div className="text-xs italic">{m.instansi || 'Internal'}</div>
                                        </td>
                                        <td className="text-sm">{m.tugas}</td>
                                        <td>
                                            <span className={m.status_approval === 'approved' ? styles.statusApproved : styles.statusPending}>
                                                {m.status_approval === 'approved' ? 'Menyetujui' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(usulan.anggota_non_dosen || usulan.anggotaNonDosen || []).map((m: any) => (
                                    <tr key={m.id}>
                                        <td>
                                            <div className="font-bold">{m.nama}</div>
                                            <div className="text-xs text-gray-500">{m.no_identitas} ({m.jenis_anggota})</div>
                                        </td>
                                        <td>{m.jurusan || '-'}</td>
                                        <td className="text-sm">{m.tugas}</td>
                                        <td>
                                            <span className={m.status_approval === 'approved' ? styles.statusApproved : styles.statusPending}>
                                                {m.status_approval === 'approved' ? 'Menyetujui' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.reviewGroup}>
                    <h3 className={styles.subTitle}>3. Mitra Sasaran</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nama Mitra</th>
                                    <th>Lokasi</th>
                                    <th>Pimpinan/PJ</th>
                                    <th>File Surat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.mitra || []).map((m: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="font-bold">{m.nama_mitra}</td>
                                        <td className="text-xs">{m.nama_kota}, {m.nama_provinsi}</td>
                                        <td className="text-xs">{m.pimpinan_mitra}</td>
                                        <td>
                                            {m.file_surat_kesediaan && (
                                                <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" className="text-blue-600 hover:underline text-xs">Lihat File</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(usulan.mitra || []).length === 0 && <tr><td colSpan={4} className="text-center italic">Belum ada mitra</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.reviewGroup}>
                    <h3 className={styles.subTitle}>4. Substansi & Luaran</h3>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>File Substansi</span>
                        <span className={styles.reviewValue}>
                            {usulan.file_substansi ? (
                                <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    Download File
                                </a>
                            ) : 'Belum diunggah'}
                        </span>
                    </div>

                    <h4 className={styles.miniTitle} style={{ marginTop: 10 }}>Target Luaran:</h4>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Tahun</th>
                                    <th>Kategori</th>
                                    <th>Deskripsi</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.luaran_items || usulan.luaranItems || []).map((l: any) => (
                                    <tr key={l.id}>
                                        <td>Tahun {l.tahun}</td>
                                        <td>{l.kategori}</td>
                                        <td>{l.deskripsi}</td>
                                        <td>{l.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.reviewGroup}>
                    <h3 className={styles.subTitle}>5. Rencana Anggaran Belanja (RAB)</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Kelompok</th>
                                    <th>Item</th>
                                    <th>Satuan</th>
                                    <th>Vol</th>
                                    <th>Harga Satuan</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usulan.rab_items || usulan.rabItems || []).map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="capitalize">{item.tipe.replace('_', ' ')}</td>
                                        <td>{item.item}</td>
                                        <td>{item.satuan}</td>
                                        <td>{item.volume}</td>
                                        <td className="text-right">Rp {item.harga_satuan?.toLocaleString('id-ID')}</td>
                                        <td className="text-right">Rp {item.total?.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                                <tr className={styles.totalRow}>
                                    <td colSpan={5}><strong>Total Anggaran</strong></td>
                                    <td className="text-right"><strong>Rp {parseInt(usulan.total_anggaran || '0').toLocaleString('id-ID')}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* History Status */}
                {(usulan.review_histories || usulan.reviewHistories) && (usulan.review_histories || usulan.reviewHistories).length > 0 && (
                    <div style={{ marginTop: 25, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#f9fafb', padding: '10px 15px', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>
                            Riwayat Usulan & Catatan
                        </div>
                        <div style={{ padding: 15 }}>
                            {(usulan.review_histories || usulan.reviewHistories).map((h: any, i: number) => (
                                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                                    <div className="min-w-[120px]">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                            {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-500 tabular-nums">
                                            {new Date(h.reviewed_at || h.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                                {h.action.toUpperCase().replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black border border-blue-200 uppercase tracking-tighter">
                                                {h.reviewer_type?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        {h.comments && (
                                            <div className="text-sm text-gray-600 italic bg-white p-3 rounded border border-gray-100 shadow-sm mt-2 border-l-4 border-l-blue-400">
                                                "{h.comments}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.warningBox} style={{ marginTop: 20 }}>
                    <h4 style={{ marginTop: 0 }}>Pernyataan Konfirmasi</h4>
                    <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: 10 }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            style={{ marginTop: 4, transform: 'scale(1.2)' }}
                        />
                        <span style={{ lineHeight: 1.5 }}>
                            Dengan ini saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan.
                            Saya bersedia mengikuti segala ketentuan yang berlaku dalam pelaksanaan Pengabdian kepada Masyarakat ini.
                        </span>
                    </label>
                </div>
            </div>

            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali} disabled={isSubmitting}>&lt; Kembali Review</button>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className={styles.secondaryButton} onClick={onTutupForm} disabled={isSubmitting}>Simpan & Tutup</button>
                    <button
                        className={styles.primaryButton}
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isChecked || !['draft', 'revision_dosen'].includes(usulan.status)}
                        style={{ backgroundColor: (isChecked && ['draft', 'revision_dosen'].includes(usulan.status)) ? '#16a34a' : '#9ca3af' }}
                    >
                        {isSubmitting ? 'Mengirim...' : (!['draft', 'revision_dosen'].includes(usulan.status) ? 'Sudah Dikirim' : 'Kirim Usulan')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageKonfirmasi;
