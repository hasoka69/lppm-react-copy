import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';
import {
    Users,
    Plus,
    Trash2,
    MapPin,
    Mail,
    User,
    Building2,
    Wallet,
    FileText,
    ArrowLeft,
    ChevronRight,
    Map,
    PlusCircle,
    X,
    ExternalLink
} from 'lucide-react';

interface Mitra {
    id: number;
    nama_mitra: string;
    email?: string;
    jenis_mitra: string;
    alamat_mitra: string;
    penanggung_jawab: string;
    pimpinan_mitra?: string;
    kontak_mitra: string;
    no_telepon?: string;
    dana_pendamping?: number;
    pendanaan_tahun_1?: number;
    nama_provinsi: string;
    nama_kota: string;
    file_mitra?: string;
    file_surat_kesediaan?: string;
    kelompok_mitra?: string;
}

interface PageMitraProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
    provinsiList?: any[];
}

const PageMitra: React.FC<PageMitraProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId, provinsiList: propProvinsiList }) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [mitraList, setMitraList] = useState<Mitra[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [provinsiList, setProvinsiList] = useState<any[]>(propProvinsiList || []);
    const [kotaList, setKotaList] = useState<any[]>([]);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        nama_mitra: '',
        email: '',
        jenis_mitra: '',
        alamat_mitra: '',
        pimpinan_mitra: '',
        penanggung_jawab: '',
        kontak_mitra: '',
        dana_pendamping: 0,
        pendanaan_tahun_1: 0,
        kelompok_mitra: '',
        provinsi_id: '',
        kota_id: '',
        nama_provinsi: '',
        nama_kota: '',
        file_mitra: null as File | null,
    });

    useEffect(() => {
        if (usulan?.mitra) setMitraList(usulan.mitra);
    }, [usulan]);

    useEffect(() => {
        if (showForm && provinsiList.length === 0) {
            axios.get('/api/master/provinsi').then(res => setProvinsiList(res.data));
        }
    }, [showForm, provinsiList.length]);

    useEffect(() => {
        if (data.provinsi_id) {
            axios.get(`/api/master/kota?provinsi_id=${data.provinsi_id}`).then(res => setKotaList(res.data));
        } else {
            setKotaList([]);
        }
    }, [data.provinsi_id]);

    const handleAddMitra = () => {
        if (!usulanId) {
            alert('Simpan draft usulan terlebih dahulu.');
            return;
        }
        setShowForm(true);
        reset();
        clearErrors();
    };

    const handleSaveMitra = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('usulan_id', String(usulanId));
        payload.append('nama_mitra', data.nama_mitra);
        payload.append('email', data.email);
        payload.append('jenis_mitra', data.jenis_mitra);
        payload.append('alamat_mitra', data.alamat_mitra);
        payload.append('pimpinan_mitra', data.pimpinan_mitra);
        payload.append('penanggung_jawab', data.pimpinan_mitra);
        payload.append('kontak_mitra', data.email);
        payload.append('pendanaan_tahun_1', String(data.pendanaan_tahun_1));
        payload.append('kelompok_mitra', data.kelompok_mitra);
        payload.append('provinsi_id', data.provinsi_id);
        payload.append('kota_id', data.kota_id);
        payload.append('nama_provinsi', data.nama_provinsi);
        payload.append('nama_kota', data.nama_kota);
        if (data.file_mitra) payload.append('file_mitra', data.file_mitra);

        axios.post(route('dosen.pengabdian.mitra.store'), payload, {
            headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
        }).then(res => {
            setMitraList(prev => [...prev, res.data.mitra]);
            setShowForm(false);
            reset();
            alert('Mitra berhasil ditambahkan');
        }).catch(() => alert('Gagal menyimpan mitra. Periksa inputan.'));
    };

    const handleDeleteMitra = (id: number) => {
        if (!confirm('Hapus data mitra ini?')) return;
        axios.delete(route('dosen.pengabdian.mitra.destroy', id))
            .then(() => setMitraList(prev => prev.filter(m => m.id !== id)))
            .catch(() => alert('Gagal menghapus mitra.'));
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageSection}>
                <div className={styles.formSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--primary)' }}><Users size={28} /></div>
                            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Data Mitra Sasaran</h2>
                        </div>
                        {!showForm && (
                            <button className={styles.primaryButton} onClick={handleAddMitra} disabled={!usulanId}>
                                <Plus size={18} /> Tambah Mitra Baru
                            </button>
                        )}
                    </div>

                    {/* Mitra Cards List */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        {mitraList.length === 0 && !showForm && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', color: '#64748b' }}>
                                <Building2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>Belum ada mitra yang ditambahkan. Pengabdian membutuhkan minimal 1 mitra sasaran.</p>
                            </div>
                        )}
                        {mitraList.map((m, idx) => (
                            <div key={m.id || idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <button
                                    onClick={() => handleDeleteMitra(m.id)}
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <span className={styles.badge} style={{ fontSize: '0.7rem' }}>{m.jenis_mitra}</span>
                                    <span className={styles.badge} style={{ fontSize: '0.7rem', background: '#f0f9ff', color: '#0369a1' }}>{m.kelompok_mitra}</span>
                                </div>

                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--secondary)' }}>{m.nama_mitra}</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                                        <User size={16} className="text-gray-400" />
                                        <span>{m.pimpinan_mitra || m.penanggung_jawab} (Pimpinan)</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{m.email || m.kontak_mitra}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                                        <MapPin size={16} className="text-gray-400" />
                                        <span style={{ fontSize: '0.8rem' }}>{m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                                        <Wallet size={16} />
                                        <span>Dana Pendamping: Rp {(m.pendanaan_tahun_1 || m.dana_pendamping || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {(m.file_mitra || m.file_surat_kesediaan) && (
                                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                        <a
                                            href={`/storage/${m.file_mitra || m.file_surat_kesediaan}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.link}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
                                        >
                                            <FileText size={16} /> Lihat Surat Kesediaan Kerjasama
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* NEW: Modern Form for Adding Mitra */}
                    {showForm && (
                        <div style={{ marginTop: '2.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                                        <PlusCircle size={24} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Form Registrasi Mitra</h3>
                                </div>
                                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}><X size={24} /></button>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.fullWidth}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Nama Instansi/Kelompok Mitra *</label>
                                        <div className={styles.inputWithIcon}>
                                            <Building2 size={18} />
                                            <input className={styles.input} value={data.nama_mitra} onChange={e => setData('nama_mitra', e.target.value)} placeholder="Contoh: Kelompok Tani Makmur Sejahtera" />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email Korespondensi *</label>
                                    <div className={styles.inputWithIcon}>
                                        <Mail size={18} />
                                        <input type="email" className={styles.input} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="mitra@email.com" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Jenis Mitra *</label>
                                    <select className={styles.select} value={data.jenis_mitra} onChange={e => setData('jenis_mitra', e.target.value)}>
                                        <option value="">Pilih Jenis Mitra</option>
                                        {['Produktif Ekspor', 'Produktif Non Ekspor', 'Calon Wirausaha', 'Wilayah/Pemda', 'Sekolah', 'Lainnya'].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Provinsi *</label>
                                    <div className={styles.inputWithIcon}>
                                        <Map size={18} />
                                        <select
                                            className={styles.select}
                                            value={data.provinsi_id}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const name = provinsiList.find(p => p.id == id)?.nama || '';
                                                setData(prev => ({ ...prev, provinsi_id: id, nama_provinsi: name, kota_id: '', nama_kota: '' }));
                                            }}
                                        >
                                            <option value="">Pilih Provinsi</option>
                                            {provinsiList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Kota/Kabupaten *</label>
                                    <div className={styles.inputWithIcon}>
                                        <MapPin size={18} />
                                        <select
                                            className={styles.select}
                                            value={data.kota_id}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const name = kotaList.find(c => c.id == id)?.nama || '';
                                                setData(prev => ({ ...prev, kota_id: id, nama_kota: name }));
                                            }}
                                            disabled={!data.provinsi_id}
                                        >
                                            <option value="">Pilih Kota/Kabupaten</option>
                                            {kotaList.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nama Pimpinan/PIC *</label>
                                    <div className={styles.inputWithIcon}>
                                        <User size={18} />
                                        <input className={styles.input} value={data.pimpinan_mitra} onChange={e => setData('pimpinan_mitra', e.target.value)} placeholder="Nama Lengkap Tanpa Gelar" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Kelompok Mitra *</label>
                                    <select className={styles.select} value={data.kelompok_mitra} onChange={e => setData('kelompok_mitra', e.target.value)}>
                                        <option value="">Pilih Kelompok</option>
                                        {['Masyarakat Umum', 'Kelompok Tani', 'UMKM', 'Instansi Pemerintah', 'Sekolah/Pendidikan'].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Kontribusi Dana Thn 1 (Rp) *</label>
                                    <div className={styles.inputWithIcon}>
                                        <Wallet size={18} />
                                        <input type="number" className={styles.input} value={data.pendanaan_tahun_1} onChange={e => setData('pendanaan_tahun_1', e.target.value === '' ? 0 : Number(e.target.value))} placeholder="0" />
                                    </div>
                                </div>

                                <div className={styles.fullWidth}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Alamat Lengkap *</label>
                                        <textarea className={styles.textarea} value={data.alamat_mitra} onChange={e => setData('alamat_mitra', e.target.value)} rows={3} placeholder="Masukkan alamat lengkap sesuai domisili mitra..."></textarea>
                                    </div>
                                </div>

                                <div className={styles.fullWidth}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Surat Kesediaan Kerjasama (PDF) *</label>
                                        <div className={styles.fileUpload}>
                                            <input type="file" id="file_mitra" className={styles.fileInput} onChange={e => setData('file_mitra', e.target.files?.[0] ?? null)} accept=".pdf" />
                                            <label htmlFor="file_mitra" className={styles.fileLabel}><FileText size={18} /> Pilih Dokumen PDF</label>
                                            <div className={styles.fileName}>
                                                {data.file_mitra ? (
                                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{data.file_mitra.name}</span>
                                                ) : (
                                                    <span>Belum ada file dipilih (Maks 2MB)</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button className={styles.secondaryButton} onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem' }}>Batal</button>
                                <button className={styles.primaryButton} onClick={handleSaveMitra} disabled={processing} style={{ padding: '0.75rem 2rem' }}>
                                    {processing ? 'Menyimpan...' : 'Registrasikan Mitra'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}><ArrowLeft size={18} /> Kembali</button>
                <button className={styles.primaryButton} onClick={onSelanjutnya} disabled={mitraList.length === 0 || showForm}>
                    Selanjutnya <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default PageMitra;
