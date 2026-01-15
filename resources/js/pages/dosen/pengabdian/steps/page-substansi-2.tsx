import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';

interface PageSubstansiProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

const PageSubstansi: React.FC<PageSubstansiProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulanId?: number; }>();
    const usulanId = propUsulanId ?? props.usulanId;

    const { data, setData, put, progress } = useForm<{
        file_substansi: File | null;
    }>({
        file_substansi: null,
    });

    return (
        <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Substansi Pengabdian</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>Unggah File Substansi Pengabdian</label>
                <input type="file" onChange={e => setData('file_substansi', e.target.files?.[0] || null)} />
                {progress && <p>Uploading: {progress.percentage}%</p>}
            </div>
            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}>Kembali</button>
                <button className={styles.primaryButton} onClick={() => {
                    if (usulanId) {
                        put(`/dosen/pengabdian/${usulanId}`, {
                            preserveScroll: true,
                            onSuccess: () => onSelanjutnya?.()
                        });
                    }
                }}>Selanjutnya</button>
            </div>
        </div>
    );
};
export default PageSubstansi;
