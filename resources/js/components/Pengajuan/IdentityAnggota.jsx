import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import SearchableDosenSelect from './SearchableDosenSelect';
import SearchableMahasiswaSelect from './SearchableMahasiswaSelect';

// CSRF-enabled axios instance
const api = axios.create({
    baseURL: '/',
    withCredentials: true,
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
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status_approval === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status_approval === 'rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.status_approval === 'approved' ? 'Disetujui' :
                                                        item.status_approval === 'rejected' ? 'Ditolak' :
                                                            'Menunggu'}
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
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Status</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotaNonDosen.length === 0 ? (
                                    <tr><td colSpan={8} className="p-4 text-center text-gray-500">Belum ada anggota non-dosen.</td></tr>
                                ) : (
                                    anggotaNonDosen.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2 text-center">{idx + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.jenis_anggota}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.no_identitas}</td>
                                            <td className="border border-gray-200 px-4 py-2 font-medium">{item.nama}</td>
                                            <td className="border border-gray-200 px-4 py-2">{item.institusi}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-gray-600 italic">
                                                {item.tugas || 'Belum diisi'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status_approval === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status_approval === 'rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.status_approval === 'approved' ? 'Disetujui' :
                                                        item.status_approval === 'rejected' ? 'Ditolak' :
                                                            'Menunggu'}
                                                </span>
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
                            {/* Searchable Dosen Select */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Dosen</label>
                                <SearchableDosenSelect
                                    value={
                                        formDosenData.nuptik && formDosenData.nama && typeof formDosenData.nuptik === 'string' && typeof formDosenData.nama === 'string'
                                            ? {
                                                value: formDosenData.nuptik,
                                                label: `${String(formDosenData.nuptik).trim()} - ${String(formDosenData.nama).trim()}`,
                                                dosen: {
                                                    id: formDosenData.nuptik,
                                                    nidn: formDosenData.nuptik,
                                                    nama: formDosenData.nama,
                                                    email: formDosenData.institusi || ''
                                                }
                                            }
                                            : null
                                    }
                                    onChange={(selected) => {
                                        if (selected && selected.dosen) {
                                            setFormDosenData({
                                                ...formDosenData,
                                                nuptik: selected.dosen.nidn,
                                                nama: selected.dosen.nama,
                                                institusi: selected.dosen.email || ''
                                            });
                                        } else {
                                            setFormDosenData({
                                                ...formDosenData,
                                                nuptik: '',
                                                nama: '',
                                            });
                                        }
                                    }}
                                    placeholder="Cari NIDN atau Nama Dosen..."
                                />
                            </div>

                            {/* NIDN (Hidden but still tracked) */}
                            <input
                                type="hidden"
                                value={formDosenData.nuptik}
                            />

                            {/* Nama (Hidden but still tracked) */}
                            <input
                                type="hidden"
                                value={formDosenData.nama}
                            />

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
                                onClick={handleSaveDosenSubmit}
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
                                    value={formNonDosenData.jenis_anggota}
                                    onChange={(e) => {
                                        // Reset no_identitas dan nama saat jenis berubah
                                        setFormNonDosenData({
                                            ...formNonDosenData,
                                            jenis_anggota: e.target.value,
                                            no_identitas: '',
                                            nama: '',
                                            institusi: ''
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Pilih Jenis</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="peneliti_lain">Peneliti Lain</option>
                                    <option value="teknisi">Teknisi</option>
                                </select>
                            </div>

                            {/* Searchable Mahasiswa Select - Only show if jenis is mahasiswa */}
                            {formNonDosenData.jenis_anggota === 'mahasiswa' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Mahasiswa</label>
                                    <SearchableMahasiswaSelect
                                        value={
                                            formNonDosenData.no_identitas && formNonDosenData.nama
                                                ? {
                                                    value: formNonDosenData.no_identitas,
                                                    label: `${formNonDosenData.no_identitas} - ${formNonDosenData.nama}`,
                                                    mahasiswa: {
                                                        id: 0, // Temporary ID
                                                        nim: formNonDosenData.no_identitas,
                                                        nama: formNonDosenData.nama,
                                                        jurusan: formNonDosenData.institusi || '',
                                                        angkatan: new Date().getFullYear(),
                                                        email: '',
                                                        status: 'aktif'
                                                    }
                                                }
                                                : null
                                        }
                                        onChange={(selected) => {
                                            console.log('Mahasiswa onChange called with:', selected);
                                            if (selected && selected.mahasiswa) {
                                                setFormNonDosenData({
                                                    ...formNonDosenData,
                                                    no_identitas: selected.mahasiswa.nim,
                                                    nama: selected.mahasiswa.nama,
                                                    institusi: selected.mahasiswa.jurusan || ''
                                                });
                                            } else {
                                                // Clear when selection is removed
                                                setFormNonDosenData({
                                                    ...formNonDosenData,
                                                    no_identitas: '',
                                                    nama: '',
                                                    institusi: ''
                                                });
                                            }
                                        }}
                                        placeholder="Cari NIM atau Nama Mahasiswa..."
                                    />
                                    {/* Show selected values below for debugging */}
                                    {formNonDosenData.no_identitas && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                            <strong>Selected:</strong> {formNonDosenData.no_identitas} - {formNonDosenData.nama}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* No Identitas - Show for non-mahasiswa types */}
                            {formNonDosenData.jenis_anggota !== 'mahasiswa' && formNonDosenData.jenis_anggota !== '' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">No Identitas (KTP)</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan KTP"
                                        value={formNonDosenData.no_identitas}
                                        onChange={(e) => setFormNonDosenData({ ...formNonDosenData, no_identitas: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            {/* Nama - Show for non-mahasiswa types */}
                            {formNonDosenData.jenis_anggota !== 'mahasiswa' && formNonDosenData.jenis_anggota !== '' && (
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
                            )}

                            {/* Instansi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {formNonDosenData.jenis_anggota === 'mahasiswa' ? 'Jurusan' : 'Instansi/Universitas'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={formNonDosenData.jenis_anggota === 'mahasiswa' ? 'Jurusan' : 'Masukkan instansi'}
                                    value={formNonDosenData.institusi}
                                    onChange={(e) => setFormNonDosenData({ ...formNonDosenData, institusi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={formNonDosenData.jenis_anggota === 'mahasiswa'} // Auto-filled from search
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
                                onClick={() => {
                                    setFormNonDosenVisible(false);
                                    // Reset form when closing
                                    setFormNonDosenData({
                                        jenis_anggota: '',
                                        no_identitas: '',
                                        nama: '',
                                        institusi: '',
                                        tugas: '',
                                    });
                                }}
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveNonDosenSubmit}
                                disabled={loadingNonDosen || !formNonDosenData.jenis_anggota || !formNonDosenData.no_identitas || !formNonDosenData.nama}
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
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