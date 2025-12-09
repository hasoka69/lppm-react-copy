import React, { useState } from 'react';
// Import usePage dari Inertia untuk data user login
// Di lingkungan asli Anda: import { usePage } from '@inertiajs/react';

// --- MOCK / SIMULASI INERTIA (Hapus bagian ini di kode asli Anda) ---
const usePage = () => {
    return {
        props: {
            auth: {
                user: {
                    id: '123-user-id',
                    name: 'Agus Santoso, S.Kom., M.T.', // Nama User Login (Ketua)
                    nidn: '0412345678',
                    role: 'dosen'
                }
            }
        }
    };
};
// -------------------------------------------------------------------

const IdentitasAnggotaPengajuan = () => {
    // 1. Ambil data User Login (Ketua)
    const { props } = usePage();
    const userKetua = props.auth.user;

    // 2. State untuk Uraian Tugas Ketua
    const [tugasKetua, setTugasKetua] = useState('');

    // 3. Data Dummy Anggota Dosen
    const [anggotaDosen, setAnggotaDosen] = useState([
        {
            id: 1,
            nidn: '082981928',
            nama: 'Alexxxx',
            peran: 'Anggota Pengusul',
            institusi: 'Politeknik Pertanian',
            tugas: 'Analisis Data',
            status: 'Menunggu' // Menunggu / Disetujui
        }
    ]);

    // 4. Data Dummy Anggota Non-Dosen (Mahasiswa/Luar)
    const [anggotaNonDosen, setAnggotaNonDosen] = useState([
        {
            id: 1,
            jenis: 'Mahasiswa',
            identitasId: '01363726816', // NIM atau KTP
            nama: 'Budi (Mahasiswa)',
            instansi: 'Politeknik Pertanian',
            tugas: 'Survey Lapangan'
        }
    ]);

    // Handler Tambah Dummy (Simulasi tombol Tambah)
    const handleTambahDosen = () => {
        const newId = anggotaDosen.length + 1;
        setAnggotaDosen([
            ...anggotaDosen,
            { id: newId, nidn: '', nama: 'Dosen Baru (Dummy)', peran: 'Anggota', institusi: '-', tugas: '', status: 'Draft' }
        ]);
    };

    const handleTambahNonDosen = () => {
        const newId = anggotaNonDosen.length + 1;
        setAnggotaNonDosen([
            ...anggotaNonDosen,
            { id: newId, jenis: '-', identitasId: '', nama: 'Anggota Baru (Dummy)', instansi: '-', tugas: '' }
        ]);
    };

    // Handler Hapus
    const handleHapusDosen = (id) => {
        setAnggotaDosen(anggotaDosen.filter(item => item.id !== id));
    };

    const handleHapusNonDosen = (id) => {
        setAnggotaNonDosen(anggotaNonDosen.filter(item => item.id !== id));
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
                                                    <button className="text-yellow-500 hover:text-yellow-600" title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleHapusDosen(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                        title="Hapus"
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
                                                    <button className="text-yellow-500 hover:text-yellow-600" title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleHapusNonDosen(item.id)}
                                                        className="text-red-500 hover:text-red-600"
                                                        title="Hapus"
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

        </div>
    );
};

export default IdentitasAnggotaPengajuan;