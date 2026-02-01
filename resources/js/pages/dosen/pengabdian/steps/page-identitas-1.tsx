import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import styles from '../../../../../css/pengajuan.module.css';
import IdentityAnggota from '../../../../components/Pengajuan/IdentityAnggota';
import axios from 'axios';
import {
    FileText,
    Settings,
    GraduationCap,
    ChevronRight,
    X,
    Save,
    Puzzle,
    Calendar,
    Search,
    Users,
    Layers
} from 'lucide-react';

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
    rumpunIlmuLevel1List?: any[];
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
    onSelanjutnya,
    onTutupForm,
    usulanId,
    usulan,
    onDraftCreated,
    kelompokSkemaList = [],
    ruangLingkupList = [],
    rumpunIlmuLevel1List = [],
}) => {
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);
    const [rumpunLevel2, setRumpunLevel2] = useState<any[]>([]);
    const [rumpunLevel3, setRumpunLevel3] = useState<any[]>([]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYearVal = currentDate.getFullYear();
    const currentYear = currentYearVal; // Keep for 'tahun_pengusulan'

    // Calculate Academic Year Logic
    let academicYearCode: number;
    let academicYearLabel: string;

    if (currentMonth >= 8 || currentMonth === 1) {
        // Ganjil (Aug - Jan of next year)
        const startY = currentMonth === 1 ? currentYearVal - 1 : currentYearVal;
        const endY = startY + 1;
        academicYearCode = parseInt(`${endY}1`);
        academicYearLabel = `Semester Ganjil ${startY}/${endY}`;
    } else {
        // Genap (Feb - Jul)
        const startY = currentYearVal - 1;
        const endY = currentYearVal;
        academicYearCode = parseInt(`${endY}2`);
        academicYearLabel = `Semester Genap ${startY}/${endY}`;
    }
    const { data, setData, post, put, processing, errors } = useForm<UsulanData>({
        judul: usulan?.judul ?? '',
        tahun_pengusulan: currentYear,
        jenis_bidang_fokus: (usulan?.jenis_bidang_fokus as 'tematik' | 'ririn') ?? '',
        bidang_fokus: usulan?.bidang_fokus ?? '',
        kelompok_skema: usulan?.kelompok_skema ?? '',
        ruang_lingkup: usulan?.ruang_lingkup ?? '',
        tahun_pertama: academicYearCode,
        lama_kegiatan: usulan?.lama_kegiatan ?? '1',
        rumpun_ilmu_level1_id: usulan?.rumpun_ilmu_level1_id ?? '',
        rumpun_ilmu_level2_id: usulan?.rumpun_ilmu_level2_id ?? '',
        rumpun_ilmu_level3_id: usulan?.rumpun_ilmu_level3_id ?? '',
    });

    const tematikOptions = ['Ketahanan Pangan', 'Kesehatan', 'Pendidikan', 'UMKM & Kewirausahaan', 'Lingkungan', 'Sosial Budaya'];
    const ririnOptions = ['Teknologi Informasi', 'Energi', 'Kesehatan', 'Pertanian', 'Sosial Humaniora'];
    const currentFocusList = data.jenis_bidang_fokus === 'tematik' ? tematikOptions : (data.jenis_bidang_fokus === 'ririn' ? ririnOptions : []);

    useEffect(() => {
        if (data.rumpun_ilmu_level1_id) {
            axios.get(`/api/master/rumpun-ilmu?level=2&parent_id=${data.rumpun_ilmu_level1_id}`)
                .then(res => setRumpunLevel2(res.data));
        } else {
            setRumpunLevel2([]);
        }
    }, [data.rumpun_ilmu_level1_id]);

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
        if (currentUsulanId) {
            put(`/dosen/pengabdian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (!isNext) alert('Draft berhasil diperbarui.');
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
                    if (!isNext) alert('Draft berhasil disimpan.');
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
                {/* Section 1: Dasar Usulan */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={24} className="text-emerald-600" />
                            Informasi Dasar Pengabdian
                        </h2>
                        <div className={styles.formGrid}>
                            <div className={styles.fullWidth}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Judul Proposal Pengabdian *</label>
                                    <textarea
                                        className={styles.textarea}
                                        rows={3}
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Masukkan judul proposal lengkap..."
                                    />
                                    {errors.judul && <span className={styles.error}>{errors.judul}</span>}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tahun Pengusulan</label>
                                <div className={styles.inputWithIcon}>
                                    <Calendar size={18} />
                                    <input type="text" className={styles.input} value={currentYear} disabled readOnly style={{ background: '#f1f5f9', color: '#64748b' }} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tahun Akademik (Pelaksanaan) *</label>
                                <div className={styles.inputWithIcon}>
                                    <Calendar size={18} />
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={academicYearLabel}
                                        disabled
                                        readOnly
                                        style={{ background: '#f1f5f9', color: '#64748b' }}
                                    />
                                </div>
                                <small className="text-gray-500 text-xs mt-1">
                                    Otomatis mengikuti Tahun Akademik berjalan (Kode: {data.tahun_pertama})
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Fokus & Skema */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <Puzzle size={24} className="text-emerald-600" />
                            Fokus & Skema Pengabdian
                        </h2>
                        <div className={styles.formGrid}>
                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Jenis Bidang Fokus *</label>
                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="radio" value="tematik" checked={data.jenis_bidang_fokus === 'tematik'} onChange={() => setData('jenis_bidang_fokus', 'tematik')} />
                                        <span style={{ fontWeight: 600 }}>Tematik</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="radio" value="ririn" checked={data.jenis_bidang_fokus === 'ririn'} onChange={() => setData('jenis_bidang_fokus', 'ririn')} />
                                        <span style={{ fontWeight: 600 }}>RIRIN</span>
                                    </label>
                                </div>
                            </div>

                            {data.jenis_bidang_fokus && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Bidang Fokus {data.jenis_bidang_fokus.toUpperCase()} *</label>
                                    <select className={styles.select} value={data.bidang_fokus} onChange={(e) => setData('bidang_fokus', e.target.value)}>
                                        <option value="">Pilih Bidang Fokus</option>
                                        {currentFocusList.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kelompok Skema *</label>
                                <select className={styles.select} value={data.kelompok_skema} onChange={(e) => setData('kelompok_skema', e.target.value)}>
                                    <option value="">Pilih Skema</option>
                                    {kelompokSkemaList.map((item) => (
                                        <option key={item.id} value={item.nama}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Ruang Lingkup Kegiatan *</label>
                                <select className={styles.select} value={data.ruang_lingkup} onChange={(e) => setData('ruang_lingkup', e.target.value)}>
                                    <option value="">Pilih Ruang Lingkup</option>
                                    {ruangLingkupList.map((item) => (
                                        <option key={item.id} value={item.nama}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Lama Kegiatan (Tahun) *</label>
                                <select className={styles.select} value={data.lama_kegiatan} onChange={(e) => setData('lama_kegiatan', e.target.value)}>
                                    <option value="1">1 Tahun</option>
                                    <option value="2">2 Tahun</option>
                                    <option value="3">3 Tahun</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Rumpun Ilmu */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <GraduationCap size={24} className="text-emerald-600" />
                            Klasifikasi Rumpun Ilmu
                        </h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Rumpun Ilmu Level 1 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_level1_id} onChange={(e) => setData('rumpun_ilmu_level1_id', e.target.value)}>
                                    <option value="">Pilih Level 1</option>
                                    {rumpunIlmuLevel1List.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Rumpun Ilmu Level 2 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_level2_id} onChange={(e) => setData('rumpun_ilmu_level2_id', e.target.value)} disabled={!data.rumpun_ilmu_level1_id}>
                                    <option value="">Pilih Level 2</option>
                                    {rumpunLevel2.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Rumpun Ilmu Level 3 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_level3_id} onChange={(e) => setData('rumpun_ilmu_level3_id', e.target.value)} disabled={!data.rumpun_ilmu_level2_id}>
                                    <option value="">Pilih Level 3</option>
                                    {rumpunLevel3.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Tim Pengusul */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <Users size={24} className="text-emerald-600" />
                            Identitas Tim Pengusul
                        </h2>
                        <IdentityAnggota
                            usulanId={currentUsulanId ?? 0}
                            isPengabdian={true}
                            onCreateDraft={ensureDraftExists}
                        />
                    </div>
                </div>

                <div className={styles.actionContainer}>
                    <button type="button" className={styles.secondaryButton} onClick={onTutupForm}>
                        <X size={18} style={{ marginRight: '8px' }} /> Tutup
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft} disabled={processing}>
                        <Save size={18} style={{ marginRight: '8px' }} /> Simpan Draft
                    </button>
                    <button type="submit" className={styles.primaryButton} disabled={processing}>
                        Selanjutnya <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PageIdentitas;
