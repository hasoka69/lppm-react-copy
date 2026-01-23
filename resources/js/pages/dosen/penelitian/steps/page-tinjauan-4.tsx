import React from 'react';
import { usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';

interface PageTinjauanProps {
    onKembali?: () => void;
    onKonfirmasi?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
}

const PageTinjauan: React.FC<PageTinjauanProps> = ({
    onKembali,
    onKonfirmasi,
    onTutupForm,
    usulanId: propUsulanId
}) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [isChecked, setIsChecked] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Helper untuk format rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const handleSubmit = () => {
        if (!usulanId) {
            alert('Usulan ID tidak ditemukan. Tidak dapat submit.');
            return;
        }

        if (!['draft', 'revision_dosen'].includes(usulan.status)) {
            alert('Status usulan tidak memungkinkan untuk pengiriman (Sudah diajukan atau diproses).');
            return;
        }

        if (confirm('Apakah Anda yakin ingin mengirim usulan ini? Data tidak dapat diubah setelah dikirim.')) {
            setIsSubmitting(true);
            router.post(`/dosen/penelitian/${usulanId}/submit`, {}, {
                onSuccess: () => {
                    alert('Usulan berhasil dikirim!');
                    onKonfirmasi?.();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error(errors);
                    alert('Gagal mengirim usulan. Silakan cek kembali kelengkapan data.');
                    setIsSubmitting(false);
                }
            });
        }
    };

    if (!usulan) return <div>Loading...</div>;

    // Calculate Total RAB from Relationship
    const rabItems = usulan.rab_items || usulan.rabItems || [];
    const totalAnggaran = rabItems.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);

    // Group items for display
    const rabBahan = rabItems.filter((item: any) => item.tipe === 'bahan');
    const rabPerjalanan = rabItems.filter((item: any) => item.tipe === 'perjalanan');
    const rabPublikasi = rabItems.filter((item: any) => item.tipe === 'publikasi');
    const rabData = rabItems.filter((item: any) => item.tipe === 'pengumpulan_data');
    const rabSewa = rabItems.filter((item: any) => item.tipe === 'sewa_peralatan');

    return (
        <>
            {!usulanId && (
                <div className={styles.alertWarning}>
                    ⚠️ <strong>Warning:</strong> Usulan ID tidak ditemukan.
                </div>
            )}

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Judul</h2>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Judul Penelitian</span>
                        <span className={styles.reviewValue}>{usulan.judul || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Lama Kegiatan</span>
                        <span className={styles.reviewValue}>{usulan.lama_kegiatan ? `${usulan.lama_kegiatan} Tahun` : '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Kelompok Skema</span>
                        <span className={styles.reviewValue}>{usulan.kelompok_skema || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Ruang Lingkup</span>
                        <span className={styles.reviewValue}>{usulan.ruang_lingkup || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Tema Penelitian</span>
                        <span className={styles.reviewValue}>{usulan.tema_penelitian || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Topik Penelitian</span>
                        <span className={styles.reviewValue}>{usulan.topik_penelitian || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Bidang Fokus</span>
                        <span className={styles.reviewValue}>{usulan.bidang_fokus || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Tahun Usulan</span>
                        <span className={styles.reviewValue}>{new Date().getFullYear()}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Tahun Pelaksanaan</span>
                        <span className={styles.reviewValue}>{usulan.tahun_pertama || '-'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Target TKT</span>
                        <span className={styles.reviewValue}>{usulan.target_akhir_tkt || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Identitas Anggota Dosen */}
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Identitas Anggota Dosen</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NIDN</th>
                                <th>Nama</th>
                                <th>Peran</th>
                                <th>Tugas</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(usulan.anggota_dosen || usulan.anggotaDosen) && (usulan.anggota_dosen || usulan.anggotaDosen).length > 0 ? (
                                (usulan.anggota_dosen || usulan.anggotaDosen).map((anggota: any, index: number) => (
                                    <tr key={anggota.id}>
                                        <td>{index + 1}</td>
                                        <td>{anggota.nidn}</td>
                                        <td>{anggota.nama}</td>
                                        <td>{anggota.peran}</td>
                                        <td>{anggota.tugas || '-'}</td>
                                        <td>
                                            <span className={anggota.status_approval === 'approved' ? styles.statusApproved : styles.statusPending}>
                                                {anggota.status_approval === 'approved' ? 'Menyetujui' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>Belum ada anggota dosen</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Identitas Anggota Non Dosen */}
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Identitas Anggota Non Dosen (Mahasiswa)</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NIM</th>
                                <th>Nama</th>
                                <th>Peran</th>
                                <th>Tugas</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(usulan.anggota_non_dosen || usulan.anggotaNonDosen) && (usulan.anggota_non_dosen || usulan.anggotaNonDosen).length > 0 ? (
                                (usulan.anggota_non_dosen || usulan.anggotaNonDosen).map((anggota: any, index: number) => (
                                    <tr key={anggota.id}>
                                        <td>{index + 1}</td>
                                        <td>{anggota.no_identitas}</td>
                                        <td>{anggota.nama}</td>
                                        <td>{anggota.jenis_anggota}</td>
                                        <td>{anggota.tugas || '-'}</td>
                                        <td>
                                            <span className={anggota.status_approval === 'approved' ? styles.statusApproved : styles.statusPending}>
                                                {anggota.status_approval === 'approved' ? 'Menyetujui' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>Belum ada anggota mahasiswa</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Substansi dan Luaran */}
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Substansi dan Luaran</h2>

                <div className={styles.reviewSection}>
                    <h3 className={styles.subTitle}>Makro Riset</h3>
                    <p className={styles.reviewText}>{usulan.kelompok_makro_riset || '-'}</p>
                </div>

                <div className={styles.reviewSection}>
                    <h3 className={styles.subTitle}>File Substansi</h3>
                    {usulan.file_substansi ? (
                        <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer" className={styles.link}>Lihat File Substansi</a>
                    ) : (
                        <span className={styles.reviewValue}>Belum diupload</span>
                    )}
                </div>

                <div className={styles.reviewSection}>
                    <div className={styles.tableContainer}>
                        <h3 className={styles.subTitle}>Target Luaran</h3>
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
                                {(usulan.luaran_list || usulan.luaranList)?.length > 0 ? (
                                    (usulan.luaran_list || usulan.luaranList).map((luaran: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>Tahun {luaran.tahun}</td>
                                            <td>{luaran.kategori}</td>
                                            <td>{luaran.deskripsi}</td>
                                            <td>{luaran.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className={styles.emptyState}>Belum ada luaran</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rancangan Anggaran Biaya */}
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Rancangan Anggaran Biaya (RAB)</h2>

                <div className={styles.rabInfo}>
                    <p><strong>Total Anggaran:</strong> {formatRupiah(totalAnggaran)}</p>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Kelompok</th>
                                <th>Komponen</th>
                                <th>Item</th>
                                <th>Satuan</th>
                                <th>Harga Satuan</th>
                                <th>Volume</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rabBahan.map((item: any) => (
                                <tr key={`bahan-${item.id}`}>
                                    <td>Bahan</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabPerjalanan.map((item: any) => (
                                <tr key={`perj-${item.id}`}>
                                    <td>Perjalanan</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabPublikasi.map((item: any) => (
                                <tr key={`publ-${item.id}`}>
                                    <td>Publikasi</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabData.map((item: any) => (
                                <tr key={`data-${item.id}`}>
                                    <td>Pengumpulan Data</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabSewa.map((item: any) => (
                                <tr key={`sewa-${item.id}`}>
                                    <td>Sewa Peralatan</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabItems.length === 0 && (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>Belum ada data RAB</td>
                                </tr>
                            )}
                            <tr className={styles.totalRow}>
                                <td colSpan={6}><strong>Total Anggaran</strong></td>
                                <td><strong>{formatRupiah(totalAnggaran)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Riwayat Usulan & Catatan */}
            {(usulan.review_histories || usulan.reviewHistories) && (usulan.review_histories || usulan.reviewHistories).length > 0 && (
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Riwayat Usulan & Catatan</h2>
                    <div className="space-y-4 pt-2">
                        {(usulan.review_histories || usulan.reviewHistories).map((h: any, i: number) => (
                            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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

            {/* Pernyataan Konfirmasi */}
            {['draft', 'revision_dosen'].includes(usulan.status) && (
                <div className={styles.warningBox}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404', fontWeight: 700 }}>Pernyataan Konfirmasi</h4>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm leading-relaxed text-gray-700 font-medium">
                            Dengan ini saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan.
                            Saya bersedia mengikuti segala ketentuan yang berlaku dalam pelaksanaan Penelitian ini.
                        </span>
                    </label>
                </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionContainer}>
                <div className={styles.actionLeft}>
                    <button className={styles.secondaryButton} onClick={onKembali}>
                        &lt; Kembali
                    </button>
                    <button className={styles.secondaryButton} onClick={onTutupForm}>
                        Tutup Form
                    </button>
                </div>
                <div className={styles.actionRight}>
                    <button className={styles.printButton} onClick={handlePrintPDF}>
                        Print PDF
                    </button>
                    <button
                        className={styles.primaryButton}
                        onClick={handleSubmit}
                        disabled={isSubmitting || !['draft', 'revision_dosen'].includes(usulan.status) || (['draft', 'revision_dosen'].includes(usulan.status) && !isChecked)}
                        style={{
                            backgroundColor: (['draft', 'revision_dosen'].includes(usulan.status) && isChecked) ? '#16a34a' : '#9ca3af',
                            cursor: (['draft', 'revision_dosen'].includes(usulan.status) && isChecked) ? 'pointer' : 'not-allowed',
                            opacity: (['draft', 'revision_dosen'].includes(usulan.status) && !isChecked) ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Mengirim...' : (['draft', 'revision_dosen'].includes(usulan.status) ? 'Kirim Usulan' : 'Sudah Dikirim')}
                    </button>
                </div>
            </div>

        </>
    );
};

export default PageTinjauan;