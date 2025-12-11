import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

// CSRF-enabled axios instance
const api = axios.create({
    baseURL: '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

const IdentityAnggota = ({ usulanId, onCreateDraft }) => {
    const { props } = usePage();
    const userKetua = props.auth.user;
    // 1. Ambil data User Login (Ketua)
    // 2. State untuk Uraian Tugas Ketua
    const [tugasKetua, setTugasKetua] = useState('');

    // 3. State untuk Anggota Dosen (dari backend)
    const [anggotaDosen, setAnggotaDosen] = useState([]);
    const [loadingDosen, setLoadingDosen] = useState(false);
    const [formDosenVisible, setFormDosenVisible] = useState(false);
    const [editingDosenId, setEditingDosenId] = useState(null);
    const [formDosenData, setFormDosenData] = useState({
        nuptik: '',
        nama: '',
        peran: 'anggota',
        institusi: '',
        tugas: '',
    });

    // 4. State untuk Anggota Non-Dosen (dari backend)
    const [anggotaNonDosen, setAnggotaNonDosen] = useState([]);
    const [loadingNonDosen, setLoadingNonDosen] = useState(false);
    const [formNonDosenVisible, setFormNonDosenVisible] = useState(false);
    const [editingNonDosenId, setEditingNonDosenId] = useState(null);
    const [formNonDosenData, setFormNonDosenData] = useState({
        jenis_anggota: '',
        no_identitas: '',
        nama: '',
        institusi: '',
        tugas: '',
    });

    // Load data dari backend saat usulanId berubah
    useEffect(() => {
        if (usulanId) {
            loadAnggotaDosen();
            loadAnggotaNonDosen();
        }
    }, [usulanId]);

    // Load anggota dosen dari backend
    const loadAnggotaDosen = async () => {
        if (!usulanId) return;
        setLoadingDosen(true);
        try {
            const response = await api.get(`/pengajuan/${usulanId}/anggota-dosen`);
            setAnggotaDosen(response.data.data || []);
        } catch (error) {
            console.error('Error loading dosen:', error);
        } finally {
            setLoadingDosen(false);
        }
    };

    // Load anggota non-dosen dari backend
    const loadAnggotaNonDosen = async () => {
        if (!usulanId) return;
        setLoadingNonDosen(true);
        try {
            const response = await api.get(`/pengajuan/${usulanId}/anggota-non-dosen`);
            setAnggotaNonDosen(response.data.data || []);
        } catch (error) {
            console.error('Error loading non-dosen:', error);
        } finally {
            setLoadingNonDosen(false);
        }
    };

    // Handler Anggota Dosen
    const handleTambahDosen = async () => {
        console.log('handleTambahDosen called, usulanId:', usulanId);

        if (!usulanId && !onCreateDraft) {
            alert('Error: Cannot create member - no draft creator available');
            return;
        }

        let validUsulanId = usulanId;
        if (!validUsulanId && onCreateDraft) {
            try {
                console.log('Creating draft before adding member...');
                validUsulanId = await onCreateDraft();
                console.log('Draft created with ID:', validUsulanId);

                if (!validUsulanId) {
                    alert('Failed to create proposal draft');
                    return;
                }
            } catch (error) {
                console.error('Error creating draft:', error);
                alert('Error creating draft: ' + error.message);
                return;
            }
        }

        console.log('Showing form for new member, usulanId:', validUsulanId);
        handleShowFormDosen();
    };

    const handleShowFormDosen = () => {
        setFormDosenData({
            nuptik: '',
            nama: '',
            peran: 'anggota',
            institusi: '',
            tugas: '',
        });
        setEditingDosenId(null);
        setFormDosenVisible(true);
    };

    const handleEditDosen = (anggota) => {
        setFormDosenData({
            nuptik: anggota.nuptik || '',
            nama: anggota.nama || '',
            peran: anggota.peran || 'anggota',
            institusi: anggota.institusi || '',
            tugas: anggota.tugas || '',
        });
        setEditingDosenId(anggota.id);
        setFormDosenVisible(true);
    };

    const handleSaveDosenSubmit = async (e) => {
        e?.preventDefault();
        if (!usulanId) {
            alert('Error: No proposal ID');
            return;
        }

        try {
            if (editingDosenId) {
                // Update
                await api.put(`/pengajuan/anggota-dosen/${editingDosenId}`, formDosenData);
                alert('Dosen updated successfully');
            } else {
                // Create
                await api.post(`/pengajuan/${usulanId}/anggota-dosen`, formDosenData);
                alert('Dosen added successfully');
            }
            setFormDosenVisible(false);
            loadAnggotaDosen();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            alert('Error: ' + message);
        }
    };

    const handleDeleteDosen = async (id) => {
        if (!confirm('Delete this member?')) return;
        try {
            await api.delete(`/pengajuan/anggota-dosen/${id}`);
            alert('Dosen deleted successfully');
            loadAnggotaDosen();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            alert('Error: ' + message);
        }
    };

    // Handler Anggota Non-Dosen
    const handleTambahNonDosen = async () => {
        console.log('handleTambahNonDosen called, usulanId:', usulanId);

        if (!usulanId && !onCreateDraft) {
            alert('Error: Cannot create member - no draft creator available');
            return;
        }

        let validUsulanId = usulanId;
        if (!validUsulanId && onCreateDraft) {
            try {
                console.log('Creating draft before adding non-dosen member...');
                validUsulanId = await onCreateDraft();
                console.log('Draft created with ID:', validUsulanId);

                if (!validUsulanId) {
                    alert('Failed to create proposal draft');
                    return;
                }
            } catch (error) {
                console.error('Error creating draft:', error);
                alert('Error creating draft: ' + error.message);
                return;
            }
        }

        console.log('Showing form for new non-dosen member, usulanId:', validUsulanId);
        handleShowFormNonDosen();
    };

    const handleShowFormNonDosen = () => {
        setFormNonDosenData({
            jenis_anggota: '',
            no_identitas: '',
            nama: '',
            institusi: '',
            tugas: '',
        });
        setEditingNonDosenId(null);
        setFormNonDosenVisible(true);
    };

    const handleEditNonDosen = (anggota) => {
        setFormNonDosenData({
            jenis_anggota: anggota.jenis_anggota || '',
            no_identitas: anggota.no_identitas || '',
            nama: anggota.nama || '',
            institusi: anggota.institusi || '',
            tugas: anggota.tugas || '',
        });
        setEditingNonDosenId(anggota.id);
        setFormNonDosenVisible(true);
    };

    const handleSaveNonDosenSubmit = async (e) => {
        e?.preventDefault();
        if (!usulanId) {
            alert('Error: No proposal ID');
            return;
        }

        try {
            if (editingNonDosenId) {
                // Update
                await api.put(`/pengajuan/anggota-non-dosen/${editingNonDosenId}`, formNonDosenData);
                alert('Non-dosen member updated successfully');
            } else {
                // Create
                await api.post(`/pengajuan/${usulanId}/anggota-non-dosen`, formNonDosenData);
                alert('Non-dosen member added successfully');
            }
            setFormNonDosenVisible(false);
            loadAnggotaNonDosen();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            alert('Error: ' + message);
        }
    };

    const handleDeleteNonDosen = async (id) => {
        if (!confirm('Delete this member?')) return;
        try {
            await api.delete(`/pengajuan/anggota-non-dosen/${id}`);
            alert('Non-dosen member deleted successfully');
            loadAnggotaNonDosen();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            alert('Error: ' + message);
        }
    };

    return (
        <div className="w-full bg-white p-6 shadow-sm rounded-lg border border-gray-200">

            {/* BAGIAN 1: Identitas Ketua (User Login) */}
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg">
                    Identitas Pengusul - Ketua Peneliti
                </div>
                <div className="border border-t-0 border-gray-200 p-6 rounded-b-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Kiri: Nama Ketua (Readonly) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nama Ketua</label>
                            <input
                                type="text"
                                value={userKetua.name} // Otomatis dari Auth
                                disabled
                                className="w-full p-2.5 border border-gray-300 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
                            />
                            <span className="text-xs text-gray-500">*Nama diambil otomatis dari akun Anda.</span>
                        </div>

                        {/* Kanan: Uraian Tugas (Input Manual) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Uraian Tugas Dalam Penelitian</label>
                            <textarea
                                rows={3}
                                placeholder="Deskripsikan tugas Anda sebagai ketua..."
                                value={tugasKetua}
                                onChange={(e) => setTugasKetua(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* BAGIAN 2: Tabel Anggota Dosen */}
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg flex justify-between items-center">
                    <span>Identitas Pengusul - Anggota Penelitian (Dosen)</span>
                </div>

                <div className="border border-t-0 border-gray-200 p-4 rounded-b-md">
                    <button
                        onClick={handleTambahDosen}
                        type="button"
                        className="mb-4 bg-[#1e4275] hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                    >
                        <span>+ Tambah</span>
                    </button>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-3 text-left w-12">No</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">NIDN/NIDK</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Nama</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Peran</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Institusi</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Tugas</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Status</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotaDosen.length === 0 ? (
                                    <tr><td colSpan={8} className="p-4 text-center text-gray-500">Belum ada anggota dosen.</td></tr>
                                ) : (
                                    anggotaDosen.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2 text-center">{idx + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.nidn}</td>
                                            <td className="border border-gray-200 px-4 py-2 font-medium">{item.nama}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.peran}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.institusi}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-gray-600 italic">
                                                {item.tugas || 'Belum diisi'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditDosen(item)}
                                                        className="text-yellow-500 hover:text-yellow-600"
                                                        title="Edit"
                                                        type="button"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDosen(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                        title="Hapus"
                                                        type="button"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
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

            {/* BAGIAN 3: Tabel Anggota Non Dosen */}
            <div className="mb-8">
                <div className="bg-[#1e4275] text-white px-4 py-2 rounded-t-md font-semibold text-lg flex justify-between items-center">
                    <span>Identitas Pengusul - Anggota Penelitian Non Dosen</span>
                </div>

                <div className="border border-t-0 border-gray-200 p-4 rounded-b-md">
                    <button
                        onClick={handleTambahNonDosen}
                        type="button"
                        className="mb-4 bg-[#1e4275] hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                    >
                        <span>+ Tambah</span>
                    </button>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-3 text-left w-12">No</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Jenis Anggota</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">No Identitas (NIM/KTP)</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Nama</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Instansi</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left">Tugas</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotaNonDosen.length === 0 ? (
                                    <tr><td colSpan={7} className="p-4 text-center text-gray-500">Belum ada anggota non-dosen.</td></tr>
                                ) : (
                                    anggotaNonDosen.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2 text-center">{idx + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.jenis}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.identitasId}</td>
                                            <td className="border border-gray-200 px-4 py-2 font-medium">{item.nama}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.instansi}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-gray-600 italic">
                                                {item.tugas || 'Belum diisi'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditNonDosen(item)}
                                                        className="text-yellow-500 hover:text-yellow-600"
                                                        title="Edit"
                                                        type="button"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNonDosen(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                        title="Hapus"
                                                        type="button"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
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

            {/* MODAL FORM DOSEN */}
            {formDosenVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingDosenId ? 'Edit Anggota Dosen' : 'Tambah Anggota Dosen'}
                        </h2>

                        <div className="space-y-4">
                            {/* NIDN */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">NIDN/NIDK</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan NIDN/NIDK"
                                    value={formDosenData.nuptik}
                                    onChange={(e) => setFormDosenData({ ...formDosenData, nuptik: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={formDosenData.nama}
                                    onChange={(e) => setFormDosenData({ ...formDosenData, nama: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Peran */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Peran</label>
                                <select
                                    value={formDosenData.peran}
                                    onChange={(e) => setFormDosenData({ ...formDosenData, peran: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="anggota">Anggota</option>
                                    <option value="ketua">Ketua</option>
                                </select>
                            </div>

                            {/* Institusi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Institusi</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan institusi"
                                    value={formDosenData.institusi}
                                    onChange={(e) => setFormDosenData({ ...formDosenData, institusi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Tugas */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Uraian Tugas</label>
                                <textarea
                                    placeholder="Deskripsikan tugas dalam penelitian"
                                    rows={3}
                                    value={formDosenData.tugas}
                                    onChange={(e) => setFormDosenData({ ...formDosenData, tugas: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setFormDosenVisible(false)}
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleSaveDosen(usulanId)}
                                disabled={loadingDosen}
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:bg-gray-400"
                            >
                                {loadingDosen ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL FORM NON-DOSEN */}
            {formNonDosenVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingNonDosenId ? 'Edit Anggota Non-Dosen' : 'Tambah Anggota Non-Dosen'}
                        </h2>

                        <div className="space-y-4">
                            {/* Jenis */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Anggota</label>
                                <select
                                    value={formNonDosenData.jenis}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, jenis: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Pilih Jenis</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="peneliti_lain">Peneliti Lain</option>
                                    <option value="teknisi">Teknisi</option>
                                </select>
                            </div>

                            {/* No Identitas */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">No Identitas (NIM/KTP)</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan NIM atau KTP"
                                    value={formNonDosenData.identitasId}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, identitasId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={formNonDosenData.nama}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, nama: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Instansi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Instansi/Universitas</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan instansi"
                                    value={formNonDosenData.instansi}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, instansi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Tugas */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Uraian Tugas</label>
                                <textarea
                                    placeholder="Deskripsikan tugas dalam penelitian"
                                    rows={3}
                                    value={formNonDosenData.tugas}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, tugas: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setFormNonDosenVisible(false)}
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleSaveNonDosen(usulanId)}
                                disabled={loadingNonDosen}
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:bg-gray-400"
                            >
                                {loadingNonDosen ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default IdentityAnggota;