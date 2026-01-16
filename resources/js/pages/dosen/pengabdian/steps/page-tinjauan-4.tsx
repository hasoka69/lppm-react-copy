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

    if (!usulan) return <div className={styles.loading}>Memuat data...</div>;

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
        if (confirm('Kirim usulan pengabdian ini?')) {
            router.post(`/dosen/pengabdian/${usulanId}/submit`, {}, {
                onSuccess: () => {
                    alert('Usulan berhasil dikirim!');
                    onKonfirmasi?.();
                    onTutupForm?.();
                }
            });
        }
    };

    const rabItems = usulan?.rab_items || usulan?.rabItems || [];
    const totalAnggaran = rabItems.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0);
    const luaranList = usulan?.luaran_items || usulan?.luaranItems || [];
    const anggotaDosen = usulan?.anggota_dosen || usulan?.anggotaDosen || [];
    const anggotaNonDosen = usulan?.anggota_non_dosen || usulan?.anggotaNonDosen || [];

    // Group items for display
    const rabPelatihan = rabItems.filter((i: any) => i.tipe === 'pelatihan');
    const rabKonsumsi = rabItems.filter((i: any) => i.tipe === 'konsumsi');
    const rabTransport = rabItems.filter((i: any) => i.tipe === 'transport_mitra');
    const rabAlatBahan = rabItems.filter((i: any) => i.tipe === 'alat_bahan');

    return (
        <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Tinjauan Akhir Pengabdian</h2>

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
                            {anggotaDosen.map((m: any) => (
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
                            {anggotaNonDosen.map((m: any) => (
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
                            {anggotaDosen.length === 0 && anggotaNonDosen.length === 0 && (
                                <tr><td colSpan={4} className="text-center italic">Tidak ada anggota</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.reviewGroup}>
                <h3 className={styles.subTitle}>3. Substansi & Luaran</h3>
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
                            {luaranList.map((l: any) => (
                                <tr key={l.id}>
                                    <td>Tahun {l.tahun}</td>
                                    <td>{l.kategori}</td>
                                    <td>{l.deskripsi}</td>
                                    <td>{l.status}</td>
                                </tr>
                            ))}
                            {luaranList.length === 0 && <tr><td colSpan={4} className="text-center italic">Belum ada target luaran</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.reviewGroup}>
                <h3 className={styles.subTitle}>4. Rencana Anggaran Belanja (RAB)</h3>
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
                            {rabPelatihan.map((item: any) => (
                                <tr key={item.id}>
                                    <td>Pelatihan</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabKonsumsi.map((item: any) => (
                                <tr key={item.id}>
                                    <td>Konsumsi</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabTransport.map((item: any) => (
                                <tr key={item.id}>
                                    <td>Transport</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            {rabAlatBahan.map((item: any) => (
                                <tr key={item.id}>
                                    <td>Alat & Bahan</td>
                                    <td>{item.item}</td>
                                    <td>{item.satuan}</td>
                                    <td>{item.volume}</td>
                                    <td>{formatRupiah(item.harga_satuan)}</td>
                                    <td>{formatRupiah(item.total)}</td>
                                </tr>
                            ))}
                            <tr className={styles.totalRow}>
                                <td colSpan={5}><strong>Total Anggaran</strong></td>
                                <td><strong>{formatRupiah(totalAnggaran)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.actionContainer}>
                <div className={styles.actionLeft}>
                    <button className={styles.secondaryButton} onClick={onKembali}>&lt; Kembali</button>
                    <button className={styles.secondaryButton} onClick={onTutupForm}>Tutup Form</button>
                </div>
                <div className={styles.actionRight}>
                    <button className={styles.printButton} onClick={handlePrintPDF}>Print PDF</button>
                    <button className={styles.primaryButton} onClick={handleSubmit}>Kirim Usulan &gt;</button>
                </div>
            </div>
        </div>
    );
};
export default PageTinjauan;
