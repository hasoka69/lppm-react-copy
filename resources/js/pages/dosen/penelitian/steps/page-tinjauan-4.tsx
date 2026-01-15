import React from 'react';
import { usePage, router } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';

interface PageTinjauanProps {
    onKembali?: () => void;
    onKonfirmasi?: () => void;
    usulanId?: number;
}

const PageTinjauan: React.FC<PageTinjauanProps> = ({ onKembali, onKonfirmasi, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const handleSubmit = () => {
        if (confirm('Kirim usulan penelitian ini?')) {
            router.post(`/dosen/penelitian/${usulanId}/submit`, {}, {
                onSuccess: () => {
                    alert('Usulan berhasil dikirim!');
                    onKonfirmasi?.();
                }
            });
        }
    };

    const rabItems = usulan?.rab_items || [];
    const totalAnggaran = rabItems.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0);

    // Group by Tipe for display
    const groupedRab: Record<string, any[]> = {};
    rabItems.forEach((item: any) => {
        if (!groupedRab[item.tipe]) groupedRab[item.tipe] = [];
        groupedRab[item.tipe].push(item);
    });

    return (
        <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Tinjauan Akhir Penelitian</h2>
            <div className={styles.reviewItem}><span className={styles.reviewLabel}>Judul</span>: {usulan.judul}</div>
            <div className={styles.reviewItem}><span className={styles.reviewLabel}>Tahun</span>: {usulan.tahun_pertama}</div>

            <h3 className={styles.subTitle} style={{ marginTop: 20 }}>RAB Summary</h3>
            {Object.keys(groupedRab).map(tipe => (
                <div key={tipe} style={{ marginBottom: 10 }}>
                    <strong>{tipe.toUpperCase().replace('_', ' ')}:</strong>
                    <ul style={{ paddingLeft: 20 }}>
                        {groupedRab[tipe].map((item: any) => (
                            <li key={item.id}>{item.item} - Rp {Number(item.total).toLocaleString('id-ID')}</li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className={styles.infoBox}>Total Anggaran: Rp {totalAnggaran.toLocaleString('id-ID')}</div>

            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}>Kembali</button>
                <button className={styles.primaryButton} onClick={handleSubmit}>Kirim Usulan</button>
            </div>
        </div>
    );
};
export default PageTinjauan;
