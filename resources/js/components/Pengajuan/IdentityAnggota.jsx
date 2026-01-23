import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import SearchableDosenSelect from './SearchableDosenSelect';
// Removed SearchableMahasiswaSelect for manual input

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
                data = data.map(item => ({ ...item, status_approval: item.status_persetujuan || 'menunggu' }));
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
        if (!confirm('Delete this member?')) return;
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
        if (!confirm('Delete this member?')) return;
        try {
            await api.delete(`${apiPrefix}/anggota-non-dosen/${id}`);
            loadAnggotaNonDosen();
        } catch (error) { alert('Error: ' + (error.response?.data?.message || error.message)); }
    };

    return (
        <div className="w-full bg-white p-6 shadow-sm rounded-lg border border-gray-200">
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg">
                    Identitas Pengusul - Ketua {isPengabdian ? 'Pengabdian' : 'Peneliti'}
                </div>
                <div className="border border-t-0 border-gray-200 p-6 rounded-b-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nama Ketua</label>
                            <input type="text" value={userKetua.name} disabled className="w-full p-2.5 border border-gray-300 rounded bg-gray-200 text-gray-600 cursor-not-allowed" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Uraian Tugas Dalam {isPengabdian ? 'Pengabdian' : 'Penelitian'}</label>
                            <textarea rows={3} placeholder="Deskripsikan tugas Anda sebagai ketua..." value={tugasKetua} onChange={(e) => setTugasKetua(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg flex justify-between items-center">
                    <span>Identitas Pengusul - Anggota {isPengabdian ? 'Pengabdian' : 'Penelitian'} (Dosen)</span>
                </div>
                <div className="border border-t-0 border-gray-200 p-4 rounded-b-md">
                    <button onClick={handleTambahDosen} type="button" className="mb-4 bg-[#1e4275] hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"><span>+ Tambah</span></button>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-3 text-left w-12">No</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">NIDN</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Nama</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Peran</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Tugas</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotaDosen.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-200 px-4 py-2 text-center">{idx + 1}</td>
                                        <td className="border border-gray-200 px-4 py-2">{item.nidn}</td>
                                        <td className="border border-gray-200 px-4 py-2 font-medium">{item.nama}</td>
                                        <td className="border border-gray-200 px-4 py-2">{item.peran}</td>
                                        <td className="border border-gray-200 px-4 py-2">{item.tugas}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEditDosen(item)} className="text-yellow-500 hover:text-yellow-600" title="Edit" type="button">✏️</button>
                                                <button onClick={() => handleDeleteDosen(item.id)} className="text-red-500 hover:text-red-600" title="Hapus" type="button">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal Form Dosen */}
            {formDosenVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingDosenId ? 'Edit Anggota Dosen' : 'Tambah Anggota Dosen'}</h2>
                        <div className="space-y-4">
                            <SearchableDosenSelect onChange={(selected) => setFormDosenData({ ...formDosenData, nidn: selected?.dosen.nidn || '', nama: selected?.dosen.nama || '' })} />
                            <select value={formDosenData.peran} onChange={(e) => setFormDosenData({ ...formDosenData, peran: e.target.value })} className="w-full px-3 py-2 border rounded">
                                <option value="anggota">Anggota</option>
                                <option value="ketua">Ketua</option>
                            </select>
                            <textarea placeholder="Uraian Tugas" value={formDosenData.tugas} onChange={(e) => setFormDosenData({ ...formDosenData, tugas: e.target.value })} className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setFormDosenVisible(false)} className="px-4 py-2 border rounded">Batal</button>
                            <button onClick={handleSaveDosenSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Anggota Non-Dosen Section */}
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg flex justify-between items-center">
                    <span>Identitas Pengusul - Anggota {isPengabdian ? 'Pengabdian' : 'Penelitian'} (Mahasiswa / Alumni / Eksternal)</span>
                </div>
                <div className="border border-t-0 border-gray-200 p-4 rounded-b-md">
                    <button onClick={handleTambahNonDosen} type="button" className="mb-4 bg-[#1e4275] hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"><span>+ Tambah</span></button>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-3 text-left w-12">No</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Jenis</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">NIM / ID</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Nama</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Prodi/Unit</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Tugas</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotaNonDosen.length === 0 ? (
                                    <tr><td colSpan={7} className="border border-gray-200 px-4 py-4 text-center text-gray-500 italic">Belum ada anggota non-dosen</td></tr>
                                ) : (
                                    anggotaNonDosen.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2 text-center">{idx + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2 capitalize">{item.jenis_anggota}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.no_identitas}</td>
                                            <td className="border border-gray-200 px-4 py-2 font-medium">{item.nama}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.jurusan}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.tugas}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleEditNonDosen(item)} className="text-yellow-500 hover:text-yellow-600" title="Edit" type="button">✏️</button>
                                                    <button onClick={() => handleDeleteNonDosen(item.id)} className="text-red-500 hover:text-red-600" title="Hapus" type="button">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Non-Dosen */}
            {formNonDosenVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingNonDosenId ? 'Edit Anggota Non-Dosen' : 'Tambah Anggota Non-Dosen'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Anggota</label>
                                <select value={formNonDosenData.jenis_anggota} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, jenis_anggota: e.target.value })} className="w-full px-3 py-2 border rounded">
                                    <option value="">Pilih Jenis</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="alumni">Alumni</option>
                                    <option value="eksternal">Eksternal / Umum</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No Identitas (NIM/NIK/Lainnya)</label>
                                <input type="text" value={formNonDosenData.no_identitas} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, no_identitas: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Masukkan nomor identitas" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input type="text" value={formNonDosenData.nama} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, nama: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Masukkan nama lengkap" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prodi / Unit / Instansi</label>
                                <input type="text" value={formNonDosenData.jurusan} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, jurusan: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Contoh: Teknik Informatika / PT. ABC" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uraian Tugas</label>
                                <textarea rows={3} placeholder="Apa tugas anggota ini?" value={formNonDosenData.tugas} onChange={(e) => setFormNonDosenData({ ...formNonDosenData, tugas: e.target.value })} className="w-full px-3 py-2 border rounded" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setFormNonDosenVisible(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Batal</button>
                            <button onClick={handleSaveNonDosenSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdentityAnggota;
