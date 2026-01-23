import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import IdentityAnggota from '../../../../components/Pengajuan/IdentityAnggota';
import axios from 'axios';

// Configure Axios locally to ensure CSRF token is sent
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

interface UsulanData {
    judul: string;
    tahun_pengusulan: number | string;
    jenis_bidang_fokus: 'tematik' | 'ririn' | '';
    bidang_fokus: string;
    kelompok_skema: string;
    ruang_lingkup: string;
    tahun_pertama: number | string;
    lama_kegiatan: number | string;
    rumpun_ilmu_level1_id: string | number;
    rumpun_ilmu_level2_id: string | number;
    rumpun_ilmu_level3_id: string | number;
    [key: string]: string | number;
}

interface PageIdentitasProps {
    onSelanjutnya?: () => void;
    onTutupForm?: () => void;
    usulanId?: number;
    usulan?: Partial<UsulanData>;
    onDraftCreated?: (usulanId: number) => void;
    isPengabdian?: boolean;
    kelompokSkemaList?: any[];
    ruangLingkupList?: any[];
    bidangFokusList?: any[]; // Legacy, might not need if hardcoded/fetched
    rumpunIlmuLevel1List?: any[];
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
    onSelanjutnya,
    onTutupForm,
    usulanId,
    usulan,
    onDraftCreated,
    isPengabdian,
    kelompokSkemaList = [],
    ruangLingkupList = [],
    rumpunIlmuLevel1List = [],
}) => {
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);

    // Cascading Rumpun Ilmu State
    const [rumpunLevel2, setRumpunLevel2] = useState<any[]>([]);
    const [rumpunLevel3, setRumpunLevel3] = useState<any[]>([]);

    const { data, setData, post, put, processing, errors } = useForm<UsulanData>({
        judul: usulan?.judul ?? '',
        tahun_pengusulan: 2026,
        jenis_bidang_fokus: (usulan?.jenis_bidang_fokus as 'tematik' | 'ririn') ?? '',
        bidang_fokus: usulan?.bidang_fokus ?? '',
        kelompok_skema: usulan?.kelompok_skema ?? '',
        ruang_lingkup: usulan?.ruang_lingkup ?? '',
        tahun_pertama: 2026,
        lama_kegiatan: usulan?.lama_kegiatan ?? '1',
        rumpun_ilmu_level1_id: usulan?.rumpun_ilmu_level1_id ?? '',
        rumpun_ilmu_level2_id: usulan?.rumpun_ilmu_level2_id ?? '',
        rumpun_ilmu_level3_id: usulan?.rumpun_ilmu_level3_id ?? '',
    });

    // Hardcoded Focus Options based on selection
    const tematikOptions = ['Ketahanan Pangan', 'Kesehatan', 'Pendidikan', 'UMKM & Kewirausahaan', 'Lingkungan', 'Sosial Budaya'];
    const ririnOptions = ['Teknologi Informasi', 'Energi', 'Kesehatan', 'Pertanian', 'Sosial Humaniora'];

    // Determine which list to show
    const currentFocusList = data.jenis_bidang_fokus === 'tematik' ? tematikOptions : (data.jenis_bidang_fokus === 'ririn' ? ririnOptions : []);

    // Load Level 2 when Level 1 changes
    useEffect(() => {
        if (data.rumpun_ilmu_level1_id) {
            axios.get(`/api/master/rumpun-ilmu?level=2&parent_id=${data.rumpun_ilmu_level1_id}`)
                .then(res => setRumpunLevel2(res.data));
        } else {
            setRumpunLevel2([]);
        }
    }, [data.rumpun_ilmu_level1_id]);

    // Load Level 3 when Level 2 changes
    useEffect(() => {
        if (data.rumpun_ilmu_level2_id) {
            axios.get(`/api/master/rumpun-ilmu?level=3&parent_id=${data.rumpun_ilmu_level2_id}`)
                .then(res => setRumpunLevel3(res.data));
        } else {
            setRumpunLevel3([]);
        }
    }, [data.rumpun_ilmu_level2_id]);

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        saveData(false);
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        saveData(true);
    };

    const saveData = (isNext: boolean) => {
        const payload = { ...data };

        if (currentUsulanId) {
            put(`/dosen/pengabdian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (isNext) {
                        onDraftCreated?.(currentUsulanId);
                        onSelanjutnya?.();
                    }
                }
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
                    if (isNext) onSelanjutnya?.();
                },
            });
        }
    };



    const ensureDraftExists = async (): Promise<number | null> => {
        if (currentUsulanId) return currentUsulanId;

        try {
            const response = await axios.post('/dosen/pengabdian/draft', {});
            if (response.data?.usulanId) {
                setCurrentUsulanId(response.data.usulanId);
                onDraftCreated?.(response.data.usulanId);
                return response.data.usulanId;
            }
            return null;
        } catch (error) {
            console.error('Failed to create draft:', error);
            return null;
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleNext}>
                {/* 1.1 Informasi Dasar */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>1.1 Informasi Dasar Usulan</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.fullWidth}>
                            <label className={`${styles.label} ${styles.required}`}>Judul Proposal Pengabdian</label>
                            <input type="text" className={styles.input} value={data.judul} onChange={(e) => setData('judul', e.target.value)} placeholder="Masukkan judul proposal lengkap" />
                            {errors.judul && <span className={styles.error}>{errors.judul}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tahun Pengusulan</label>
                            <input
                                type="text"
                                className={styles.input}
                                value="2026"
                                disabled
                                readOnly
                            />
                            <input type="hidden" name="tahun_pengusulan" value="2026" />
                        </div>
                    </div>
                </div>

                {/* 1.2 Fokus Pengabdian */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>1.2 Fokus Pengabdian</h2>
                    <div className={styles.formGroup}>
                        <label className={`${styles.label} ${styles.required}`}>Jenis Bidang Fokus</label>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="radio" value="tematik" checked={data.jenis_bidang_fokus === 'tematik'} onChange={(e) => setData('jenis_bidang_fokus', 'tematik')} style={{ marginRight: '8px' }} />
                                Tematik
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="radio" value="ririn" checked={data.jenis_bidang_fokus === 'ririn'} onChange={(e) => setData('jenis_bidang_fokus', 'ririn')} style={{ marginRight: '8px' }} />
                                RIRIN
                            </label>
                        </div>
                    </div>
                    {data.jenis_bidang_fokus && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Bidang Fokus {data.jenis_bidang_fokus === 'tematik' ? 'Tematik' : 'RIRIN'}</label>
                            <select className={styles.select} value={data.bidang_fokus} onChange={(e) => setData('bidang_fokus', e.target.value)}>
                                <option value="">Pilih Bidang Fokus</option>
                                {currentFocusList.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* 1.3 Skema & Pelaksanaan */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>1.3 Skema & Pelaksanaan</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={`${styles.label} ${styles.required}`}>Kelompok Skema</label>
                            <select className={styles.select} value={data.kelompok_skema} onChange={(e) => setData('kelompok_skema', e.target.value)}>
                                <option value="">Pilih Skema</option>
                                {kelompokSkemaList.map((item) => (
                                    <option key={item.id} value={item.nama}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ruang Lingkup Kegiatan</label>
                            <select className={styles.select} value={data.ruang_lingkup} onChange={(e) => setData('ruang_lingkup', e.target.value)}>
                                <option value="">Pilih Ruang Lingkup</option>
                                {ruangLingkupList.map((item) => (
                                    <option key={item.id} value={item.nama}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tahun Pertama Usulan</label>
                            <input
                                type="text"
                                className={styles.input}
                                value="2026"
                                disabled
                                readOnly
                            />
                            <input type="hidden" name="tahun_pertama" value="2026" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Lama Kegiatan</label>
                            <select className={styles.select} value={data.lama_kegiatan} onChange={(e) => setData('lama_kegiatan', e.target.value)}>
                                <option value="1">1 Tahun</option>
                                <option value="2">2 Tahun</option>
                                <option value="3">3 Tahun</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 1.4 Rumpun Ilmu */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>1.4 Rumpun Ilmu</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rumpun Ilmu Level 1</label>
                            <select className={styles.select} value={data.rumpun_ilmu_level1_id} onChange={(e) => setData('rumpun_ilmu_level1_id', e.target.value)}>
                                <option value="">Pilih Rumpun Level 1</option>
                                {rumpunIlmuLevel1List.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rumpun Ilmu Level 2</label>
                            <select className={styles.select} value={data.rumpun_ilmu_level2_id} onChange={(e) => setData('rumpun_ilmu_level2_id', e.target.value)} disabled={!data.rumpun_ilmu_level1_id}>
                                <option value="">Pilih Rumpun Level 2</option>
                                {rumpunLevel2.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rumpun Ilmu Level 3</label>
                            <select className={styles.select} value={data.rumpun_ilmu_level3_id} onChange={(e) => setData('rumpun_ilmu_level3_id', e.target.value)} disabled={!data.rumpun_ilmu_level2_id}>
                                <option value="">Pilih Rumpun Level 3</option>
                                {rumpunLevel3.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 1.5 & 1.6 Identitas Anggota */}
                <div style={{ padding: 20, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', marginBottom: 20 }}>
                    <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>1.5 & 1.6 Identitas Tim Pengusul</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 16 }}>
                        Ketua Pengusul otomatis diambil dari akun yang login. Silahkan tambahkan Anggota Dosen dan Mahasiswa.
                        Data anggota otomatis tersimpan saat Anda menekan tombol "Selanjutnya".
                    </p>
                    <IdentityAnggota
                        usulanId={currentUsulanId ?? 0}
                        isPengabdian={true}
                        onCreateDraft={ensureDraftExists}
                    />
                </div>

                <div className={styles.actionContainer}>
                    <button type="button" className={styles.secondaryButton} onClick={onTutupForm}>Tutup Form</button>
                    <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft} disabled={processing}>Simpan Draft</button>
                    <button type="submit" className={styles.primaryButton} disabled={processing}>Selanjutnya &gt;</button>
                </div>
            </form>
        </div>
    );
};

export default PageIdentitas;
