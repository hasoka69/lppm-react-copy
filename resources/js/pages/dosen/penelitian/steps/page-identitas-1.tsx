import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';
import IdentityAnggota from '../../../../components/Pengajuan/IdentityAnggota';
import {
    FileText,
    Settings,
    GraduationCap,
    ChevronRight,
    X,
    Save,
    Trophy,
    Target,
    BookOpen,
    Layers,
    Calendar,
    Users
} from 'lucide-react';

interface UsulanData {
    judul: string;
    tkt_saat_ini: number | string;
    target_akhir_tkt: number | string;
    kelompok_skema: string;
    ruang_lingkup: string;
    kategori_sbk: string;
    bidang_fokus: string;
    tema_penelitian: string;
    topik_penelitian: string;
    rumpun_ilmu_1: string;
    rumpun_ilmu_2: string;
    rumpun_ilmu_3: string;
    prioritas_riset: string;
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
}

const PageIdentitas: React.FC<PageIdentitasProps> = ({
    onSelanjutnya,
    onTutupForm,
    usulanId,
    usulan,
    onDraftCreated,
}) => {
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);

    // Calculate Academic Year Logic
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYearVal = currentDate.getFullYear();

    let academicYearCode: number;
    let academicYearLabel: string;

    if (currentMonth >= 8 || currentMonth === 1) {
        // Ganjil (Aug - Jan of next year)
        // If Jan 2026, it is Sem Ganjil 2025/2026. StartY=2025, EndY=2026.
        const startY = currentMonth === 1 ? currentYearVal - 1 : currentYearVal;
        const endY = startY + 1;
        academicYearCode = parseInt(`${endY}1`);
        academicYearLabel = `Semester Ganjil ${startY}/${endY}`;
    } else {
        // Genap (Feb - Jul)
        // If Feb 2026, it is Sem Genap 2025/2026. StartY=2025, EndY=2026.
        const startY = currentYearVal - 1;
        const endY = currentYearVal;
        academicYearCode = parseInt(`${endY}2`);
        academicYearLabel = `Semester Genap ${startY}/${endY}`;
    }

    const { data, setData, post, put, processing, errors } = useForm<UsulanData>({
        judul: usulan?.judul ?? '',
        tkt_saat_ini: usulan?.tkt_saat_ini ?? '',
        target_akhir_tkt: usulan?.target_akhir_tkt ?? '',
        kelompok_skema: usulan?.kelompok_skema ?? '',
        ruang_lingkup: usulan?.ruang_lingkup ?? '',
        kategori_sbk: usulan?.kategori_sbk ?? '',
        bidang_fokus: usulan?.bidang_fokus ?? '',
        tema_penelitian: usulan?.tema_penelitian ?? '',
        topik_penelitian: usulan?.topik_penelitian ?? '',
        rumpun_ilmu_1: usulan?.rumpun_ilmu_1 ?? '',
        rumpun_ilmu_2: usulan?.rumpun_ilmu_2 ?? '',
        rumpun_ilmu_3: usulan?.rumpun_ilmu_3 ?? '',
        prioritas_riset: usulan?.prioritas_riset ?? '',
        tahun_pertama: academicYearCode,
        lama_kegiatan: usulan?.lama_kegiatan ?? '',
    });

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUsulanId) {
            put(`/dosen/penelitian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => alert('Draft berhasil diperbarui.')
            });
        } else {
            post('/dosen/penelitian/draft', {
                preserveScroll: true,
                onSuccess: (page) => {
                    const id = (page.props.flash as Record<string, unknown>)?.usulanId as number | undefined;
                    if (id) {
                        setCurrentUsulanId(id);
                        onDraftCreated?.(id);
                    }
                    alert('Draft berhasil disimpan.');
                },
            });
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION: Check for mandatory fields
        const requiredFields = [
            'judul',
            'tkt_saat_ini',
            'target_akhir_tkt',
            'kelompok_skema',
            'ruang_lingkup',
            'kategori_sbk',
            'bidang_fokus',
            'tema_penelitian',
            'topik_penelitian',
            'rumpun_ilmu_1',
            'rumpun_ilmu_2',
            'rumpun_ilmu_3',
            'prioritas_riset',
            'lama_kegiatan'
        ];

        const emptyFields = requiredFields.filter(field => !data[field]);

        if (emptyFields.length > 0) {
            alert('Mohon lengkapi semua data sebelum melanjutkan.');
            return;
        }

        if (currentUsulanId) {
            put(`/dosen/penelitian/${currentUsulanId}`, {
                preserveScroll: true,
                onSuccess: () => onSelanjutnya?.(),
            });
        } else {
            post('/dosen/penelitian/draft', {
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
            const response = await axios.post('/dosen/penelitian/draft', {}, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.data?.usulanId) {
                setCurrentUsulanId(response.data.usulanId);
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
                {/* Section 1: Informasi Dasar */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={24} className="text-blue-600" />
                            Informasi Dasar Usulan
                        </h2>

                        <div className={styles.formGrid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>1. Judul Penelitian *</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Masukkan judul lengkap penelitian anda..."
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    rows={3}
                                />
                                {errors.judul && <span className={styles.error}>{errors.judul}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>2. TKT Saat Ini *</label>
                                <div style={{ position: 'relative' }}>
                                    <Target size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <select
                                        className={styles.select}
                                        style={{ paddingLeft: '40px' }}
                                        value={data.tkt_saat_ini}
                                        onChange={(e) => setData('tkt_saat_ini', e.target.value)}
                                    >
                                        <option value="">Pilih TKT</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                            <option key={n} value={n}>TKT {n}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.tkt_saat_ini && <span className={styles.error}>{errors.tkt_saat_ini}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>3. Target Akhir TKT *</label>
                                <div style={{ position: 'relative' }}>
                                    <Trophy size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <select
                                        className={styles.select}
                                        style={{ paddingLeft: '40px' }}
                                        value={data.target_akhir_tkt}
                                        onChange={(e) => setData('target_akhir_tkt', e.target.value)}
                                    >
                                        <option value="">Pilih Target</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                            <option key={n} value={n}>TKT {n}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.target_akhir_tkt && <span className={styles.error}>{errors.target_akhir_tkt}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>4. Kelompok Skema *</label>
                                <select
                                    className={styles.select}
                                    value={data.kelompok_skema}
                                    onChange={(e) => setData("kelompok_skema", e.target.value)}
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="Penelitian Dasar">Penelitian Dasar</option>
                                    <option value="Penelitian Terapan">Penelitian Terapan</option>
                                    <option value="Penelitian Pengembangan">Penelitian Pengembangan</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>5. Ruang Lingkup *</label>
                                <select
                                    className={styles.select}
                                    value={data.ruang_lingkup}
                                    onChange={(e) => setData("ruang_lingkup", e.target.value)}
                                >
                                    <option value="">Pilih Ruang Lingkup</option>
                                    <option value="Nasional">Nasional</option>
                                    <option value="Internasional">Internasional</option>
                                    <option value="Regional">Regional</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Klasifikasi & Fokus */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <Layers size={24} className="text-blue-600" />
                            Klasifikasi & Bidang Fokus
                        </h2>
                        <div className={styles.formGrid}>


                            <div className={styles.formGroup}>
                                <label className={styles.label}>7. Bidang Fokus *</label>
                                <select className={styles.select} value={data.bidang_fokus} onChange={(e) => setData("bidang_fokus", e.target.value)}>
                                    <option value="">Pilih Bidang Fokus</option>
                                    <option value="Kesehatan">Kesehatan</option>
                                    <option value="Pertanian">Pertanian</option>
                                    <option value="Teknologi">Teknologi</option>
                                    <option value="Sosial Humaniora">Sosial Humaniora</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>8. Tema Penelitian</label>
                                <select className={styles.select} value={data.tema_penelitian} onChange={(e) => setData("tema_penelitian", e.target.value)}>
                                    <option value="">Pilih Tema</option>
                                    <option value="Tema 1">Tema 1</option>
                                    <option value="Tema 2">Tema 2</option>
                                    <option value="Tema 3">Tema 3</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>9. Topik Penelitian</label>
                                <select className={styles.select} value={data.topik_penelitian} onChange={(e) => setData("topik_penelitian", e.target.value)}>
                                    <option value="">Pilih Topik</option>
                                    <option value="Topik 1">Topik 1</option>
                                    <option value="Topik 2">Topik 2</option>
                                    <option value="Topik 3">Topik 3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Rumpun Ilmu & Pelaksanaan */}
                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <GraduationCap size={24} className="text-blue-600" />
                            Rumpun Ilmu & Pelaksanaan
                        </h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Level 1 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_1} onChange={(e) => setData("rumpun_ilmu_1", e.target.value)}>
                                    <option value="">Pilih Lvl 1</option>
                                    <option value="Ilmu Alam">Ilmu Alam</option>
                                    <option value="Ilmu Sosial">Ilmu Sosial</option>
                                    <option value="Ilmu Humaniora">Ilmu Humaniora</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Level 2 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_2} onChange={(e) => setData("rumpun_ilmu_2", e.target.value)}>
                                    <option value="">Pilih Lvl 2</option>
                                    <option value="Matematika">Matematika</option>
                                    <option value="Fisika">Fisika</option>
                                    <option value="Kimia">Kimia</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Level 3 *</label>
                                <select className={styles.select} value={data.rumpun_ilmu_3} onChange={(e) => setData("rumpun_ilmu_3", e.target.value)}>
                                    <option value="">Pilih Lvl 3</option>
                                    <option value="Aljabar">Aljabar</option>
                                    <option value="Geometri">Geometri</option>
                                    <option value="Statistika">Statistika</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>13. Prioritas Riset</label>
                                <select className={styles.select} value={data.prioritas_riset} onChange={(e) => setData("prioritas_riset", e.target.value)}>
                                    <option value="">Pilih Prioritas</option>
                                    <option value="Prioritas 1">Prioritas 1</option>
                                    <option value="Prioritas 2">Prioritas 2</option>
                                    <option value="Prioritas 3">Prioritas 3</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>14. Tahun Akademik *</label>
                                <div className={styles.inputWithIcon}>
                                    <Calendar size={18} />
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={academicYearLabel} // Display Human Readable Label
                                        disabled
                                        readOnly
                                        style={{ background: '#f1f5f9', color: '#64748b' }}
                                    />
                                    {/* Hidden input to ensure data integrity if needed, though 'data.tahun_pertama' handles submission */}
                                </div>
                                <small className="text-gray-500 text-xs mt-1">
                                    Otomatis mengikuti Tahun Akademik berjalan (Kode: {data.tahun_pertama})
                                </small>
                            </div>


                        </div>
                    </div>
                </div>

                <div className={styles.pageSection}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>
                            <Users size={24} className="text-blue-600" />
                            Identitas Tim Pengusul
                        </h2>
                        <IdentityAnggota usulanId={currentUsulanId} onCreateDraft={ensureDraftExists} />
                    </div>
                </div>

                {/* Tombol aksi */}
                <div className={styles.actionContainer}>
                    <button type="button" className={styles.secondaryButton} onClick={onTutupForm} disabled={processing}>
                        <X size={18} style={{ marginRight: '8px' }} /> Tutup
                    </button>

                    <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft} disabled={processing}>
                        <Save size={18} style={{ marginRight: '8px' }} /> {processing ? 'Menyimpan...' : 'Simpan Draft'}
                    </button>

                    <button type="submit" className={styles.primaryButton} disabled={processing}>
                        {processing ? 'Memproses...' : 'Selanjutnya'} <ChevronRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PageIdentitas;