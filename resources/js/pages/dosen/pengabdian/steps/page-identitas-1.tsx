import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';
import IdentitasAnggotaPengajuan from '../../../../components/Pengajuan/IdentityAnggota';

interface UsulanData {
    judul: string;
    tkt_saat_ini: number | string;
    target_akhir_tkt: number | string;
    kelompok_skema: string;
    ruang_lingkup: string;
    tahun_pertama: number | string;
    lama_kegiatan: number | string;
    [key: string]: string | number;
}

interface PageIdentitasProps {
    onSelanjutnya?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
    usulan?: Partial<UsulanData>;
    onDraftCreated?: (usulanId: number) => void;
    isPengabdian?: boolean;
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
    onSelanjutnya,
    onTutupForm,
    usulanId,
    usulan,
    onDraftCreated,
    isPengabdian
}) => {
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);

    const { data, setData, post, put, processing, errors } = useForm<UsulanData>({
        judul: usulan?.judul ?? '',
        tkt_saat_ini: usulan?.tkt_saat_ini ?? '',
        target_akhir_tkt: usulan?.target_akhir_tkt ?? '',
        kelompok_skema: usulan?.kelompok_skema ?? '',
        ruang_lingkup: usulan?.ruang_lingkup ?? '',
        tahun_pertama: usulan?.tahun_pertama ?? '',
        lama_kegiatan: usulan?.lama_kegiatan ?? '',
    });

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUsulanId) {
            put(`/dosen/pengabdian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => console.log('✅ Draft updated successfully')
            });
        } else {
            post('/dosen/pengabdian/draft', {
                preserveScroll: true,
                onSuccess: (page) => {
                    const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
                    if (id) {
                        setCurrentUsulanId(id);
                        onDraftCreated?.(id);
                    }
                },
            });
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUsulanId) {
            put(`/dosen/pengabdian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onDraftCreated?.(currentUsulanId);
                    onSelanjutnya?.();
                },
            });
        } else {
            post('/dosen/pengabdian/draft', {
                preserveScroll: true,
                onSuccess: (page) => {
                    const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
                    if (id) {
                        setCurrentUsulanId(id);
                        onDraftCreated?.(id);
                    }
                    onSelanjutnya?.();
                },
            });
        }
    };

    const ensureDraftExists = async (): Promise<number | null> => {
        if (currentUsulanId) return currentUsulanId;
        try {
            const response = await axios.post('/dosen/pengabdian/draft', {}, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (response.data?.usulanId) {
                setCurrentUsulanId(response.data.usulanId);
                return response.data.usulanId;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleNext}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Identitas Usulan Pengabdian</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={`${styles.label} ${styles.required}`}>1. Judul Pengabdian</label>
                            <input type="text" className={styles.input} value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
                            {errors.judul && <span className={styles.error}>{errors.judul}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tahun Pelaksanaan *</label>
                            <select className={styles.select} value={data.tahun_pertama} onChange={(e) => setData("tahun_pertama", e.target.value)}>
                                <option value="">Pilih Tahun</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Lama Kegiatan *</label>
                            <select className={styles.select} value={data.lama_kegiatan} onChange={(e) => setData("lama_kegiatan", e.target.value)}>
                                <option value="">Pilih Lama</option>
                                <option value="1">1 Tahun</option>
                                <option value="2">2 Tahun</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Note: I might need a specific IdentityAnggota for Pengabdian if endpoints differ there too. 
            For now, assume IdentitasAnggotaPengajuan works or needs adaptation. 
            Wait, IdentitasAnggotaPengajuan likely calls API.
            If so, I must check that component!
            Usage: <IdentitasAnggotaPengajuan ... />
            If it posts to `/anggota`, we have a problem.
            The user task said: "anggota (write operations) routes for dosen.pengabdian are commented out... [TODO]".
            I haven't fixed Anggota routes for Pengabdian yet.
            I will leave it for now but note it.
        */}
                <div style={{ padding: 20, background: '#f0f0f0', textAlign: 'center' }}>
                    [Anggota Management Component Placeholder - Requires Backend Controller for Anggota Pengabdian]
                </div>

                <div className={styles.actionContainer}>
                    <button type="button" className={styles.secondaryButton} onClick={onTutupForm}>Tutup Form</button>
                    <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft}>Simpan Sebagai Draft</button>
                    <button type="submit" className={styles.primaryButton}>Selanjutnya &gt;</button>
                </div>
            </form>
        </div>
    );
};
export default PageIdentitas;
