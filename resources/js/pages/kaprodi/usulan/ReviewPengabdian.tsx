import React, { useState } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { Home, ChevronRight, FileText, CheckCircle, XCircle, AlertTriangle, Users, MapPin, Target } from 'lucide-react';

interface ReviewProps {
    usulan: any;
    pengusul: any;
    anggota: any[];
    anggotaNonDosen: any[]; // [NEW]
    luaran: any[]; // [NEW]
    rabTotal: number;
}

export default function KaprodiUsulanReviewPengabdian({ usulan, pengusul, anggota, anggotaNonDosen, luaran = [], rabTotal }: ReviewProps) {
    const { data, setData, post, processing, errors } = useForm({
        decision: '',
        notes: '',
    });

    const [confirmModal, setConfirmModal] = useState<'approve' | 'reject' | null>(null);

    const handleSubmit = () => {
        post(route('kaprodi.usulan_pengabdian.review', usulan.id), {
            onSuccess: () => {
                setConfirmModal(null);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Validasi Usulan Pengabdian: ${usulan.judul}`} />
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link href="/kaprodi/dashboard" className="hover:text-blue-600 flex items-center">
                        <Home className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href="/kaprodi/usulan" className="hover:text-blue-600">
                        Daftar Usulan
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-700">Validasi Pengabdian</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Proposal Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Identitas */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4 border-b pb-2">
                                <h2 className="text-lg font-bold text-gray-800">Identitas Usulan</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Pengabdian Masyarakat
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold">Judul</label>
                                    <p className="text-gray-900 font-medium text-lg">{usulan.judul}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase font-semibold">Skema</label>
                                        <p className="text-gray-900">{usulan.kelompok_skema}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase font-semibold">Ruang Lingkup</label>
                                        <p className="text-gray-900">{usulan.ruang_lingkup}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase font-semibold">Tahun Pelaksanaan</label>
                                        <p className="text-gray-900">{usulan.tahun_pertama}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase font-semibold">Status</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${usulan.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                usulan.status === 'approved_prodi' ? 'bg-green-100 text-green-800' :
                                                    usulan.status === 'rejected_prodi' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                            {usulan.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold">Rumpun Ilmu (Level 3)</label>
                                    <p className="text-gray-900">{usulan.rumpun_ilmu_level3_label || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Pengusul & Anggota */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tim Pelaksana</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Ketua Pengusul</h3>
                                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                        <p className="font-medium text-gray-900">{pengusul.nama}</p>
                                        <p className="text-sm text-gray-500">Ketua - {pengusul.nidn}</p>
                                        <p className="text-xs text-gray-400 mt-1">{pengusul.prodi} - {pengusul.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Anggota</h3>
                                    {anggota.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">Tidak ada anggota dosen.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {anggota.map((ang: any) => (
                                                <li key={ang.id} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                                    <span className="font-medium block">{ang.nama_dosen}</span>
                                                    <span className="text-gray-500">Anggota - {ang.nidn || ang.nidn_dosen}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Anggota Mahasiswa / Non-Dosen</h3>
                                    {anggotaNonDosen && anggotaNonDosen.length > 0 ? (
                                        <ul className="space-y-2">
                                            {anggotaNonDosen.map((mhs: any) => (
                                                <li key={mhs.id} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                                    <span className="font-medium block">{mhs.nama}</span>
                                                    <span className="text-gray-500 capitalize">{mhs.role || 'Mahasiswa'} - {mhs.no_identitas}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Tidak ada anggota mahasiswa.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Mitra Sasaran [NEW] */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                                <Users className="w-5 h-5 mr-2" /> Mitra Sasaran
                            </h2>
                            <div className="space-y-4">
                                {usulan.mitra && usulan.mitra.length > 0 ? (
                                    <ul className="space-y-3">
                                        {usulan.mitra.map((m: any, idx: number) => (
                                            <li key={m.id || idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                                                <p className="font-semibold text-gray-900">{m.nama_mitra}</p>
                                                <div className="text-sm text-gray-600 mt-1 flex items-start">
                                                    <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                    <span>{m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 mb-2">
                                                    Jenis: {m.jenis_mitra} | Jarak: {m.jarak_mitra} km
                                                </div>
                                                {m.file_surat_kesediaan ? (
                                                    <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center">
                                                        <FileText className="w-3 h-3 mr-1" /> Lihat Surat Kesediaan
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-red-500 italic">Tidak ada surat kesediaan</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Data mitra tidak ditemukan.</p>
                                )}
                            </div>
                        </div>

                        {/* [NEW] Mitra Files Section if separate or integrated */}
                        {/* Assuming Kaprodi just views list, but if file link is needed: */}
                        {/* Will integrate file link into the list item above */}
                        {/* [NEW SECTION] Target Luaran */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                                <Target className="w-5 h-5 mr-2" /> Target Luaran
                            </h2>
                            {luaran && luaran.length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {luaran.map((item: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2">{item.kategori}</td>
                                                    <td className="px-4 py-2 text-gray-600">{item.deskripsi}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Tidak ada data luaran.</p>
                            )}
                        </div>

                        {/* 4. Substansi & RAB */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Berkas & Anggaran</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-2">File Substansi</label>
                                    {usulan.file_substansi ? (
                                        <a href={`/storage/${usulan.file_substansi}`} target="_blank" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            <FileText className="w-4 h-4 mr-2 text-red-500" /> Download PDF
                                        </a>
                                    ) : (
                                        <p className="text-red-500 text-sm italic">Belum diunggah</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-2">Total RAB</label>
                                    <p className="text-2xl font-bold text-gray-900">
                                        Rp {new Intl.NumberFormat('id-ID').format(rabTotal)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Action & Review */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Keputusan Kaprodi</h2>

                            {/* Disabled if already reviewed */}
                            {/* Disabled if already reviewed or not in submitted state */}
                            {usulan.status !== 'submitted' ? (
                                <div className={`p-4 rounded-lg text-center ${['approved_prodi', 'reviewer_review', 'reviewed', 'didanai', 'completed'].includes(usulan.status) ? 'bg-green-50 text-green-700' :
                                    ['rejected_prodi', 'ditolak_akhir', 'rejected', 'ditolak'].includes(usulan.status) ? 'bg-red-50 text-red-700' :
                                        'bg-blue-50 text-blue-700'
                                    }`}>
                                    {['approved_prodi', 'reviewer_review', 'reviewed', 'didanai', 'completed'].includes(usulan.status) ? (
                                        <>
                                            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                            <p className="font-bold">Usulan Disetujui</p>
                                            <p className="text-sm mt-2">Status: <span className="capitalize">{usulan.status.replace(/_/g, ' ')}</span></p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-12 h-12 mx-auto mb-2" />
                                            <p className="font-bold">Usulan Ditolak / Tidak Aktif</p>
                                            <p className="text-sm mt-2">Status: <span className="capitalize">{usulan.status.replace(/_/g, ' ')}</span></p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Verifikasi usulan pengabdian ini sebelum diteruskan ke reviewer.
                                    </p>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => { setData('decision', 'approve'); setConfirmModal('approve'); }}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Setujui Usulan
                                        </button>

                                        <button
                                            onClick={() => { setData('decision', 'reject'); setConfirmModal('reject'); }}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Tolak Usulan
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* CONFIRMATION MODAL */}
            {
                confirmModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setConfirmModal(null)}></div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${confirmModal === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {confirmModal === 'approve' ? <CheckCircle className="h-6 w-6 text-green-600" /> : <AlertTriangle className="h-6 w-6 text-red-600" />}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {confirmModal === 'approve' ? 'Setujui Usulan Pengabdian' : 'Tolak Usulan Pengabdian'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {confirmModal === 'approve'
                                                    ? 'Apakah Anda yakin? Usulan akan diteruskan ke proses review oleh Reviewer.'
                                                    : 'Apakah Anda yakin ingin menolak usulan ini?'}
                                            </p>

                                            {/* Optional Notes */}
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                                                <textarea
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    rows={3}
                                                    placeholder="Tambahkan catatan..."
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmModal === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
                                    >
                                        {processing ? 'Memproses...' : (confirmModal === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmModal(null)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
