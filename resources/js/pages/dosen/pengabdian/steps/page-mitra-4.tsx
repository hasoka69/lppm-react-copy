import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';

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
}

interface PageMitraProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
    provinsiList?: any[];
}

const PageMitra: React.FC<PageMitraProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [mitraList, setMitraList] = useState<Mitra[]>([]);
    const [showForm, setShowForm] = useState(false);

    // [NEW] Master Data States
    const [provinsiList, setProvinsiList] = useState<any[]>([]);
    const [kotaList, setKotaList] = useState<any[]>([]);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        nama_mitra: '',
        email: '',
        jenis_mitra: '',
        alamat_mitra: '',
        pimpinan_mitra: '',
        penanggung_jawab: '', // backend might still use this, but requested field is Pimpinan
        kontak_mitra: '', // For backward compat
        dana_pendamping: 0,
        pendanaan_tahun_1: 0,
        kelompok_mitra: '',
        provinsi_id: '',
        kota_id: '',
        nama_provinsi: '',
        nama_kota: '',
        file_mitra: null as File | null,
    });

    // Load Mitra from Usulan on Mount
    useEffect(() => {
        if (usulan && usulan.mitra) {
            setMitraList(usulan.mitra);
        }
    }, [usulan]);

    // [NEW] Fetch Provinces
    useEffect(() => {
        if (showForm) {
            axios.get('/api/master/provinsi').then(res => setProvinsiList(res.data));
        }
    }, [showForm]);

    // [NEW] Fetch Cities when Province Changes
    useEffect(() => {
        if (data.provinsi_id) {
            axios.get(`/api/master/kota?provinsi_id=${data.provinsi_id}`)
                .then(res => setKotaList(res.data));
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
        payload.append('penanggung_jawab', data.pimpinan_mitra); // Dual map for safety
        payload.append('kontak_mitra', data.email); // Map email as primary contact if needed
        payload.append('pendanaan_tahun_1', String(data.pendanaan_tahun_1));
        payload.append('kelompok_mitra', data.kelompok_mitra);
        payload.append('provinsi_id', data.provinsi_id);
        payload.append('kota_id', data.kota_id);
        payload.append('nama_provinsi', data.nama_provinsi);
        payload.append('nama_kota', data.nama_kota);

        if (data.file_mitra) {
            payload.append('file_mitra', data.file_mitra);
        }

        axios.post(route('dosen.pengabdian.mitra.store'), payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        }).then(res => {
            setMitraList(prev => [...prev, res.data.mitra]);
            setShowForm(false);
            reset();
            alert('Mitra berhasil ditambahkan');
        }).catch(err => {
            console.error(err);
            alert('Gagal menyimpan mitra. Periksa inputan.');
        });
    };

    const handleDeleteMitra = (id: number) => {
        if (!confirm('Hapus data mitra ini?')) return;

        axios.delete(route('dosen.pengabdian.mitra.destroy', id))
            .then(() => {
                setMitraList(prev => prev.filter(m => m.id !== id));
            })
            .catch(err => {
                console.error(err);
                alert('Gagal menghapus mitra.');
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>4.1 Data Mitra Sasaran</h2>

                {/* List Mitra */}
                <div style={{ marginBottom: 20 }}>
                    {mitraList.length === 0 && <p className={styles.emptyState}>Belum ada mitra ditambahkan.</p>}
                    {mitraList.map((m, idx) => {
                        if (!m) return null;
                        return (
                            <div key={m.id || idx} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, marginBottom: 10, position: 'relative' }}>
                                <button onClick={() => handleDeleteMitra(m.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{idx + 1}. {m.nama_mitra}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    {m.jenis_mitra} • {m.pimpinan_mitra || m.penanggung_jawab} • {m.email || m.kontak_mitra} <br />
                                    {m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}
                                </p>
                                {m.pendanaan_tahun_1 || m.dana_pendamping ? (
                                    <p style={{ margin: '5px 0 0 0', fontWeight: 500, color: '#059669' }}>
                                        Dana Pendamping: Rp {(m.pendanaan_tahun_1 || m.dana_pendamping || 0).toLocaleString('id-ID')}
                                    </p>
                                ) : null}
                                {m.file_mitra || m.file_surat_kesediaan ? (
                                    <div style={{ marginTop: 8 }}>
                                        <a href={`/storage/${m.file_mitra || m.file_surat_kesediaan}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            📄 Lihat Surat Kesediaan
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        )
                    })}
                </div>

                {!showForm && (
                    <button className={styles.addButton} onClick={handleAddMitra} disabled={!usulanId}>+ Tambah Mitra</button>
                )}

                {/* Form Tambah Mitra */}
                {showForm && (
                    <div style={{ borderTop: '2px dashed #ddd', marginTop: 20, paddingTop: 20 }}>
                        <h3 className={styles.subSectionTitle}>Form Tambah Mitra</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Nama Mitra *</label>
                                <input className={styles.input} value={data.nama_mitra} onChange={e => setData('nama_mitra', e.target.value)} placeholder="Nama Instansi/Kelompok Mitra" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Mitra *</label>
                                <input type="email" className={styles.input} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Email Aktif Mitra" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Jenis Mitra *</label>
                                <select className={styles.select} value={data.jenis_mitra} onChange={e => setData('jenis_mitra', e.target.value)}>
                                    <option value="">Pilih Jenis Mitra</option>
                                    <option value="Produktif Ekspor">Produktif Ekspor</option>
                                    <option value="Produktif Non Ekspor">Produktif Non Ekspor</option>
                                    <option value="Calon Wirausaha">Calon Wirausaha</option>
                                    <option value="Wilayah/Pemda">Wilayah/Pemda</option>
                                    <option value="Sekolah">Sekolah</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            {/* Wilayah */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Provinsi (Pulau Jawa) *</label>
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
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kota/Kabupaten *</label>
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

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Pimpinan Mitra *</label>
                                <input className={styles.input} value={data.pimpinan_mitra} onChange={e => setData('pimpinan_mitra', e.target.value)} placeholder="Nama Pimpinan/PIC" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kelompok Mitra *</label>
                                <select className={styles.select} value={data.kelompok_mitra} onChange={e => setData('kelompok_mitra', e.target.value)}>
                                    <option value="">Pilih Kelompok</option>
                                    <option value="Masyarakat Umum">Masyarakat Umum</option>
                                    <option value="Kelompok Tani">Kelompok Tani</option>
                                    <option value="UMKM">UMKM</option>
                                    <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                                    <option value="Sekolah/Pendidikan">Sekolah/Pendidikan</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kontribusi Pendanaan Tahun 1 (Rp) *</label>
                                <input type="number" className={styles.input} value={data.pendanaan_tahun_1} onChange={e => setData('pendanaan_tahun_1', Number(e.target.value))} />
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Isi 0 jika tidak ada.</span>
                            </div>

                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Alamat Lengkap Mitra *</label>
                                <textarea className={styles.textarea} value={data.alamat_mitra} onChange={e => setData('alamat_mitra', e.target.value)} rows={2}></textarea>
                            </div>

                            {/* File Upload */}
                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Surat Kesediaan Kerjasama Mitra (PDF) *</label>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        id="file_mitra"
                                        className={styles.fileInput}
                                        onChange={e => setData('file_mitra', e.target.files?.[0] ?? null)}
                                        accept=".pdf"
                                    />
                                    <label htmlFor="file_mitra" className={styles.fileLabel}>
                                        Pilih File PDF
                                    </label>
                                    <span className={styles.fileName}>
                                        {data.file_mitra?.name || 'Belum ada file dipilih'}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginTop: '4px' }}>Maks size 2MB</span>
                            </div>
                        </div>

                        <div className={styles.actionRow} style={{ marginTop: 15 }}>
                            <button className={styles.secondaryButton} onClick={() => setShowForm(false)}>Batal</button>
                            <button className={styles.primaryButton} onClick={handleSaveMitra} disabled={processing}>Simpan Mitra</button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali}>&lt; Kembali</button>
                <button className={styles.primaryButton} onClick={onSelanjutnya} disabled={mitraList.length === 0}>Selanjutnya &gt;</button>
            </div>
        </div>
    );
};

export default PageMitra;
