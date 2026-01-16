import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';

interface Mitra {
    id: number;
    nama_mitra: string;
    jenis_mitra: string;
    alamat_mitra: string;
    penanggung_jawab: string;
    kontak_mitra: string;
    dana_pendamping?: number;
    nama_provinsi: string;
    nama_kota: string;
    file_mitra?: string;
}

interface PageMitraProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

const PageMitra: React.FC<PageMitraProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    const [mitraList, setMitraList] = useState<Mitra[]>([]);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        nama_mitra: '',
        jenis_mitra: '',
        alamat_mitra: '',
        penanggung_jawab: '',
        kontak_mitra: '',
        dana_pendamping: 0,
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
        payload.append('jenis_mitra', data.jenis_mitra);
        payload.append('alamat_mitra', data.alamat_mitra);
        payload.append('penanggung_jawab', data.penanggung_jawab);
        payload.append('kontak_mitra', data.kontak_mitra);
        payload.append('dana_pendamping', String(data.dana_pendamping));
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
            // Update local list
            setMitraList(prev => [...prev, res.data.mitra]); // Be sure BE returns 'mitra' or handle accordingly
            // If BE returns simple success, we might re-fetch or just append local data if we trust it, 
            // but getting ID is important. Assuming BE returns json with 'mitra' object.
            if (res.data?.mitra) {
                // ok
            } else {
                // Fallback or reload
                router.reload({ only: ['usulan'] });
            }

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
                        if (!m) return null; // Safety check
                        return (
                            <div key={m.id || idx} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, marginBottom: 10, position: 'relative' }}>
                                <button onClick={() => handleDeleteMitra(m.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{idx + 1}. {m.nama_mitra}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    {m.jenis_mitra} • {m.penanggung_jawab} • {m.kontak_mitra} <br />
                                    {m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}
                                </p>
                                {m.dana_pendamping ? (
                                    <p style={{ margin: '5px 0 0 0', fontWeight: 500, color: '#059669' }}>
                                        Dana Pendamping: Rp {m.dana_pendamping.toLocaleString('id-ID')}
                                    </p>
                                ) : null}
                                {m.file_mitra && (
                                    <div style={{ marginTop: 8 }}>
                                        <a href={`/storage/${m.file_mitra}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            📄 Lihat Surat Kesediaan
                                        </a>
                                    </div>
                                )}
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
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Penanggung Jawab *</label>
                                <input className={styles.input} value={data.penanggung_jawab} onChange={e => setData('penanggung_jawab', e.target.value)} placeholder="Nama Pimpinan/PIC" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kontak (HP/Email) *</label>
                                <input className={styles.input} value={data.kontak_mitra} onChange={e => setData('kontak_mitra', e.target.value)} placeholder="No. HP / Email" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Dana Pendamping (Rp) *</label>
                                <input type="number" className={styles.input} value={data.dana_pendamping} onChange={e => setData('dana_pendamping', Number(e.target.value))} />
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Isi 0 jika tidak ada.</span>
                            </div>
                            <div className={styles.fullWidth}>
                                <label className={styles.label}>Alamat Lengkap Mitra *</label>
                                <textarea className={styles.textarea} value={data.alamat_mitra} onChange={e => setData('alamat_mitra', e.target.value)} rows={2}></textarea>
                            </div>

                            {/* Wilayah */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Provinsi *</label>
                                <input className={styles.input} value={data.nama_provinsi} onChange={e => setData('nama_provinsi', e.target.value)} placeholder="Contoh: Jawa Timur" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kota/Kabupaten *</label>
                                <input className={styles.input} value={data.nama_kota} onChange={e => setData('nama_kota', e.target.value)} placeholder="Contoh: Surabaya" />
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
