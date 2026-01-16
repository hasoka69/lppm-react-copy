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

                <div style={{ padding: 20, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 20 }}>
                    <h3 style={{ marginTop: 0, color: '#166534' }}>Ringkasan Usulan</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600, width: '200px' }}>Judul</td>
                                <td>: {usulan.judul}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Skema</td>
                                <td>: {usulan.kelompok_skema}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Tahun Pelaksanaan</td>
                                <td>: {usulan.tahun_pertama} (Selama {usulan.lama_kegiatan} Tahun)</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Anggota Dosen</td>
                                <td>: {usulan.anggota_dosen?.length || 0} Orang</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Anggota Mahasiswa</td>
                                <td>: {usulan.anggota_non_dosen?.length || 0} Orang</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Total Mitra</td>
                                <td>: {usulan.mitra?.length || 0} Mitra</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', fontWeight: 600 }}>Total Anggaran</td>
                                <td>: Rp {parseInt(usulan.total_anggaran || '0').toLocaleString('id-ID')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

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
                    <button className={styles.primaryButton} onClick={handleSubmit} disabled={isSubmitting || !isChecked} style={{ backgroundColor: isChecked ? '#16a34a' : '#9ca3af' }}>
                        {isSubmitting ? 'Mengirim...' : 'Kirim Usulan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageKonfirmasi;
