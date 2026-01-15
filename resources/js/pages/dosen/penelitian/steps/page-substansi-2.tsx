import React, { useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';

interface PageSubstansiProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

const PageSubstansi: React.FC<PageSubstansiProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulanId?: number; substansi?: any }>();
    const usulanId = propUsulanId ?? props.usulanId;
    const substansi = props.substansi;

    const { data, setData, put, progress } = useForm<{
        makro_riset_id: number | '';
        file_substansi: File | null;
    }>({
        makro_riset_id: substansi?.makro_riset_id ?? '',
        file_substansi: null,
    });

    const handleSimpan = () => {
        if (!usulanId) return;
        put(`/dosen/penelitian/${usulanId}`, {
            preserveScroll: true,
            onSuccess: () => console.log('Substansi saved')
        });
    };

    return (
        <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Substansi Usulan Penelitian</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>Unggah File Substansi</label>
                <input type="file" onChange={e => setData('file_substansi', e.target.files?.[0] || null)} />
                {progress && <p>Uploading: {progress.percentage}%</p>}
            </div>
            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}>Kembali</button>
                <button className={styles.primaryButton} onClick={() => {
                    if (usulanId) {
                        put(`/dosen/penelitian/${usulanId}`, {
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
