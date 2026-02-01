import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import SearchableDosenSelect from './SearchableDosenSelect';
import styles from '../../../css/pengajuan.module.css';
import {
    User,
    Users,
    Plus,
    Edit,
    Trash,
    CheckCircle,
    Clock,
    Info,
    GraduationCap,
    School
} from 'lucide-react';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

api.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) config.headers['X-CSRF-TOKEN'] = token;
    return config;
});

const IdentityAnggota = ({ usulanId, onCreateDraft, isPengabdian = false }) => {
    const apiPrefix = isPengabdian ? '/dosen/pengabdian' : '/dosen/penelitian';
    const { props } = usePage();
    const userKetua = props.auth.user;
    const [tugasKetua, setTugasKetua] = useState('');
    const [anggotaDosen, setAnggotaDosen] = useState([]);
    const [loadingDosen, setLoadingDosen] = useState(false);
    const [formDosenVisible, setFormDosenVisible] = useState(false);
    const [editingDosenId, setEditingDosenId] = useState(null);
    const [formDosenData, setFormDosenData] = useState({ nidn: '', nama: '', peran: 'anggota', prodi: '', tugas: '' });
    const [anggotaNonDosen, setAnggotaNonDosen] = useState([]);
    const [loadingNonDosen, setLoadingNonDosen] = useState(false);
    const [formNonDosenVisible, setFormNonDosenVisible] = useState(false);
    const [editingNonDosenId, setEditingNonDosenId] = useState(null);
    const [formNonDosenData, setFormNonDosenData] = useState({ jenis_anggota: '', no_identitas: '', nama: '', jurusan: '', tugas: '' });

    useEffect(() => {
        if (usulanId) {
            loadAnggotaDosen();
            loadAnggotaNonDosen();
        }
    }, [usulanId]);

    const loadAnggotaDosen = async () => {
        if (!usulanId) return;
        setLoadingDosen(true);
        try {
            const response = await api.get(`${apiPrefix}/${usulanId}/anggota-dosen`);
            let data = response.data.data || [];
            if (isPengabdian) {
                // No longer mapping status since it's removed
                data = data.map(item => ({ ...item }));
            }
            setAnggotaDosen(data);
        } catch (error) { console.error('Error loading dosen:', error); } finally { setLoadingDosen(false); }
    };

    const loadAnggotaNonDosen = async () => {
        if (!usulanId) return;
        setLoadingNonDosen(true);
        try {
            const response = await api.get(`${apiPrefix}/${usulanId}/anggota-non-dosen`);
            setAnggotaNonDosen(response.data.data || []);
        } catch (error) { console.error('Error loading non-dosen:', error); } finally { setLoadingNonDosen(false); }
    };

    const handleTambahDosen = async () => {
        if (!usulanId && onCreateDraft) {
            try {
                const id = await onCreateDraft();
                if (!id) return;
            } catch (error) { return; }
        }
        handleShowFormDosen();
    };

    const handleShowFormDosen = () => {
        setFormDosenData({ nidn: '', nama: '', peran: 'anggota', prodi: '', tugas: '' });
        setEditingDosenId(null);
        setFormDosenVisible(true);
    };

    const handleEditDosen = (anggota) => {
        setFormDosenData({ nidn: anggota.nidn || '', nama: anggota.nama || '', peran: anggota.peran || 'anggota', prodi: anggota.prodi || '', tugas: anggota.tugas || '' });
        setEditingDosenId(anggota.id);
        setFormDosenVisible(true);
    };

    const handleSaveDosenSubmit = async (e) => {
        e?.preventDefault();
        if (!usulanId) return;
        try {
            const endpoint = isPengabdian ? `${apiPrefix}/anggota-pengabdian` : `${apiPrefix}/anggota-penelitian`;
            if (editingDosenId) {
                await api.put(`${endpoint}/${editingDosenId}`, formDosenData);
            } else {
                await api.post(`${apiPrefix}/${usulanId}/${isPengabdian ? 'anggota-pengabdian' : 'anggota-penelitian'}`, formDosenData);
            }
            setFormDosenVisible(false);
            loadAnggotaDosen();
        } catch (error) { alert('Error: ' + (error.response?.data?.message || error.message)); }
    };

    const handleDeleteDosen = async (id) => {
        if (!confirm('Hapus anggota ini?')) return;
        try {
            const endpoint = isPengabdian ? `${apiPrefix}/anggota-pengabdian` : `${apiPrefix}/anggota-penelitian`;
            await api.delete(`${endpoint}/${id}`);
            loadAnggotaDosen();
        } catch (error) { alert('Error: ' + (error.response?.data?.message || error.message)); }
    };

    const handleTambahNonDosen = async () => {
        if (!usulanId && onCreateDraft) { try { await onCreateDraft(); } catch (error) { return; } }
        handleShowFormNonDosen();
    };

    const handleShowFormNonDosen = () => {
        setFormNonDosenData({ jenis_anggota: '', no_identitas: '', nama: '', jurusan: '', tugas: '' });
        setEditingNonDosenId(null);
        setFormNonDosenVisible(true);
    };

    const handleEditNonDosen = (anggota) => {
        setFormNonDosenData({ jenis_anggota: anggota.jenis_anggota || '', no_identitas: anggota.no_identitas || '', nama: anggota.nama || '', jurusan: anggota.jurusan || '', tugas: anggota.tugas || '' });
        setEditingNonDosenId(anggota.id);
        setFormNonDosenVisible(true);
    };

    const handleSaveNonDosenSubmit = async (e) => {
        e?.preventDefault();
        if (!usulanId) return;
        try {
            if (editingNonDosenId) {
                await api.put(`${apiPrefix}/anggota-non-dosen/${editingNonDosenId}`, formNonDosenData);
            } else {
                await api.post(`${apiPrefix}/${usulanId}/anggota-non-dosen`, formNonDosenData);
            }
            setFormNonDosenVisible(false);
            loadAnggotaNonDosen();
        } catch (error) { alert('Error: ' + (error.response?.data?.message || error.message)); }
    };

    const handleDeleteNonDosen = async (id) => {
        if (!confirm('Hapus anggota ini?')) return;
        try {
            await api.delete(`${apiPrefix}/anggota-non-dosen/${id}`);
            loadAnggotaNonDosen();
        } catch (error) { alert('Error: ' + (error.response?.data?.message || error.message)); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Ketua Section */}
            <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px' }}>
                        <User size={20} color="var(--primary)" />
                    </div>
                    Ketua {isPengabdian ? 'Pengabdian' : 'Penelitian'}
                </h3>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Ketua</label>
                            <input type="text" value={userKetua.name} disabled className={styles.input} style={{ background: '#f1f5f9' }} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tugas Sebagai Ketua</label>
                            <textarea rows={2} placeholder="Deskripsikan tanggung jawab anda..." value={tugasKetua} onChange={(e) => setTugasKetua(e.target.value)} className={styles.textarea} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Anggota Dosen Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary)' }}>
                        <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px' }}>
                            <Users size={20} color="var(--primary)" />
                        </div>
                        Anggota Tim (Dosen)
                    </h3>
                    <button onClick={handleTambahDosen} type="button" className={styles.primaryButton} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Tambah Dosen
                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>No</th>
                                <th>Informasi Dosen</th>
                                <th>Peran</th>
                                <th>Tugas</th>
                                <th style={{ textAlign: 'center', width: '100px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggotaDosen.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                        Belum ada anggota dosen yang ditambahkan
                                    </td>
                                </tr>
                            ) : (
                                anggotaDosen.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600 }}>{idx + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{item.nama}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>NIDN: {item.nidn}</span>
                                            </div>
                                        </td>
                                        <td><span className={`${styles.badge}`}>{item.peran}</span></td>
                                        <td style={{ fontSize: '0.875rem' }}>{item.tugas || '-'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button onClick={() => handleEditDosen(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" type="button"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteDosen(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" type="button"><Trash size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Anggota Non-Dosen Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary)' }}>
                        <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px' }}>
                            <School size={20} color="var(--primary)" />
                        </div>
                        Anggota Tim (Mahasiswa/Eksternal)
                    </h3>
                    <button onClick={handleTambahNonDosen} type="button" className={styles.primaryButton} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Tambah Anggota
                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>No</th>
                                <th>Informasi Anggota</th>
                                <th>Jenis</th>
                                <th>Tugas</th>
                                <th style={{ textAlign: 'center', width: '100px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggotaNonDosen.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                        Belum ada anggota non-dosen yang ditambahkan
                                    </td>
                                </tr>
                            ) : (
                                anggotaNonDosen.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600 }}>{idx + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{item.nama}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.no_identitas} • {item.jurusan}</span>
                                            </div>
                                        </td>
                                        <td><span className={`${styles.badge}`}>{item.jenis_anggota}</span></td>
                                        <td style={{ fontSize: '0.875rem' }}>{item.tugas || '-'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button onClick={() => handleEditNonDosen(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" type="button"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteNonDosen(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" type="button"><Trash size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Forms (Common Style) */}
            {(formDosenVisible || formNonDosenVisible) && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
                                {formDosenVisible ? (editingDosenId ? 'Edit Anggota Dosen' : 'Tambah Anggota Dosen') : (editingNonDosenId ? 'Edit Anggota Non-Dosen' : 'Tambah Anggota Non-Dosen')}
                            </h2>
                            <button onClick={() => { setFormDosenVisible(false); setFormNonDosenVisible(false); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {formDosenVisible ? (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Cari & Pilih Dosen</label>
                                        <SearchableDosenSelect onChange={(selected) => setFormDosenData({ ...formDosenData, nidn: selected?.dosen.nidn || '', nama: selected?.dosen.nama || '' })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Peran Anggota</label>
                                        <select value={formDosenData.peran} onChange={(e) => setFormDosenData({ ...formDosenData, peran: e.target.value })} className={styles.select}>
                                            <option value="anggota">Anggota</option>
                                            <option value="ketua">Ketua</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Uraian Tugas</label>
                                        <textarea rows={2} placeholder="Tuliskan pembagian tugas..." value={formDosenData.tugas} onChange={(e) => setFormDosenData({ ...formDosenData, tugas: e.target.value })} className={styles.textarea} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Jenis Anggota</label>
                                        <select value={formNonDosenData.jenis_anggota} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, jenis_anggota: e.target.value })} className={styles.select}>
                                            <option value="">Pilih Jenis</option>
                                            <option value="mahasiswa">Mahasiswa</option>
                                            <option value="alumni">Alumni</option>
                                            <option value="eksternal">Eksternal / Umum</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>NIM / NIK / ID</label>
                                            <input type="text" value={formNonDosenData.no_identitas} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, no_identitas: e.target.value })} className={styles.input} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Nama Lengkap</label>
                                            <input type="text" value={formNonDosenData.nama} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, nama: e.target.value })} className={styles.input} />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Prodi / Unit / Instansi</label>
                                        <input type="text" value={formNonDosenData.jurusan} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, jurusan: e.target.value })} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Uraian Tugas</label>
                                        <textarea rows={2} placeholder="Tuliskan pembagian tugas..." value={formNonDosenData.tugas} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, tugas: e.target.value })} className={styles.textarea} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => { setFormDosenVisible(false); setFormNonDosenVisible(false); }} className={styles.secondaryButton}>Batal</button>
                            <button onClick={formDosenVisible ? handleSaveDosenSubmit : handleSaveNonDosenSubmit} className={styles.primaryButton}>Simpan Anggota</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const X = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default IdentityAnggota;
