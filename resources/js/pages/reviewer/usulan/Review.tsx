import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react'; // Import Link here
import Header from '../../../components/Header';
import styles from '../../../css/kaprodi.module.css'; // Assuming shared styles
import { Toaster, toast } from 'sonner';

// --- Interfaces ---
interface ReviewerReviewProps {
    proposal: any; // Using any to match structure from PageTinjauan loose typing, or refine if needed
    dosen: any;
}

const ReviewerReview: React.FC<ReviewerReviewProps> = ({ proposal, dosen }) => {
    // --- Reuse Logic from PageTinjauan for parsing data ---
    const usulan = proposal;

    // Calculate Total RAB from Relationship
    const rabItems = usulan.rab_items || usulan.rabItems || [];
    const totalAnggaran = rabItems.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);

    // Group items for display
    const rabBahan = rabItems.filter((item: any) => item.tipe === 'bahan');
    const rabPerjalanan = rabItems.filter((item: any) => item.tipe === 'perjalanan');
    const rabPublikasi = rabItems.filter((item: any) => item.tipe === 'publikasi');
    const rabData = rabItems.filter((item: any) => item.tipe === 'pengumpulan_data');
    const rabSewa = rabItems.filter((item: any) => item.tipe === 'sewa_peralatan');

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // --- Review Form Logic ---
    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        action: '',
        comments: '',
    });

    const handleActionClick = (type: 'approve' | 'reject' | 'revise') => {
        setActionType(type);
        setData('action', type);
        setIsConfirming(true);
    };

    const submitReview = () => {
        post(`/reviewer/review/${proposal.id}`, { // Updated route prefix
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirming(false);
                toast.success('Review berhasil disimpan');
            },
            onError: (err) => {
                console.error(err);
                setIsConfirming(false);
                toast.error('Gagal menyimpan review. Periksa input Anda.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Head title={`Review Usulan: ${usulan.judul}`} />
            <Header />
            <Toaster position="top-right" />

            <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <Link href="/reviewer/usulan" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">&larr; Kembali ke Daftar</Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Review Usulan Penelitian</h1>
                    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Ketua Pengusul</p>
                                <p className="font-semibold text-lg">{usulan.user?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Program Studi</p>
                                <p className="font-semibold text-lg">{usulan.user?.dosen?.prodi || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT FROM PAGE TINJAUAN REUSE --- */}
                <div className="space-y-8">

                    {/* 1. IDENTITAS */}
                    <section className="bg-white shadow rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">1. Identitas Usulan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-sm text-gray-500 block">Judul Penelitian</label>
                                <span className="font-medium text-gray-900">{usulan.judul}</span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Kelompok Skema</label>
                                <span className="font-medium text-gray-900">{usulan.kelompok_skema}</span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Lama Kegiatan</label>
                                <span className="font-medium text-gray-900">{usulan.lama_kegiatan} Tahun</span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Tahun Pelaksanaan</label>
                                <span className="font-medium text-gray-900">{usulan.tahun_pertama}</span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Ruang Lingkup</label>
                                <span className="font-medium text-gray-900">{usulan.ruang_lingkup}</span>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Bidang Fokus</label>
                                <span className="font-medium text-gray-900">{usulan.bidang_fokus}</span>
                            </div>
                        </div>
                    </section>

                    {/* 2. ANGGOTA TIM */}
                    <section className="bg-white shadow rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">2. Tim Peneliti</h2>

                        {/* Dosen */}
                        <h3 className="text-md font-semibold text-gray-700 mt-4 mb-2">Anggota Dosen</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Nama</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">NIDN</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Peran</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Tugas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(usulan.anggota_dosen || usulan.anggotaDosen) && (usulan.anggota_dosen || usulan.anggotaDosen).length > 0 ? (
                                        (usulan.anggota_dosen || usulan.anggotaDosen).map((anggota: any, idx: number) => (
                                            <tr key={anggota.nidn || idx}>
                                                <td className="px-4 py-2">{anggota.nama}</td>
                                                <td className="px-4 py-2">{anggota.nidn}</td>
                                                <td className="px-4 py-2 capitalize">{anggota.peran}</td>
                                                <td className="px-4 py-2">{anggota.tugas || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">Tidak ada anggota dosen</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mahasiswa */}
                        <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">Anggota Mahasiswa/Non-Dosen</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Nama</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">NIM/ID</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Peran</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Tugas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(usulan.anggota_non_dosen || usulan.anggotaNonDosen) && (usulan.anggota_non_dosen || usulan.anggotaNonDosen).length > 0 ? (
                                        (usulan.anggota_non_dosen || usulan.anggotaNonDosen).map((anggota: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2">{anggota.nama}</td>
                                                <td className="px-4 py-2">{anggota.no_identitas}</td>
                                                <td className="px-4 py-2">{anggota.jenis_anggota}</td>
                                                <td className="px-4 py-2">{anggota.tugas || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">Tidak ada anggota mahasiswa</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 3. SUBSTANSI & LUARAN */}
                    <section className="bg-white shadow rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">3. Substansi & Luaran</h2>

                        <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-md font-semibold text-blue-900">File Substansi Proposal</h3>
                                <p className="text-sm text-blue-700 mt-1">Dokumen proposal lengkap yang diunggah pengusul.</p>
                            </div>
                            <div>
                                {usulan.file_substansi ? (
                                    <a
                                        href={`/storage/${usulan.file_substansi}`}
                                        target="_blank"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Download Proposal
                                    </a>
                                ) : (
                                    <span className="text-red-500 font-medium text-sm">File belum diunggah</span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-md font-semibold text-gray-700 mb-2">Target Luaran</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Tahun</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Kategori</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Deskripsi</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(usulan.luaran_list || usulan.luaranList) && (usulan.luaran_list || usulan.luaranList).length > 0 ? (
                                        (usulan.luaran_list || usulan.luaranList).map((luaran: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2">Tahun {luaran.tahun}</td>
                                                <td className="px-4 py-2">{luaran.kategori}</td>
                                                <td className="px-4 py-2">{luaran.deskripsi}</td>
                                                <td className="px-4 py-2">{luaran.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">Tidak ada luaran</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. RAB */}
                    <section className="bg-white shadow rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-xl font-bold text-gray-800">4. Rencana Anggaran Biaya (RAB)</h2>
                            <span className="text-lg font-bold text-green-700 bg-green-50 px-3 py-1 rounded-md">
                                Total: {formatRupiah(totalAnggaran)}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Kelompok</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Item</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Satuan</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Vol</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Harga</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rabBahan.map((item: any, idx: number) => (
                                        <tr key={`bahan-${idx}`}>
                                            <td className="px-4 py-2 text-gray-500">Bahan Habis Pakai</td>
                                            <td className="px-4 py-2">{item.item || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.satuan || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.volume || 0}</td>
                                            <td className="px-4 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan || 0)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatRupiah(item.total || 0)}</td>
                                        </tr>
                                    ))}
                                    {rabPerjalanan.map((item: any, idx: number) => (
                                        <tr key={`perj-${idx}`}>
                                            <td className="px-4 py-2 text-gray-500">Perjalanan</td>
                                            <td className="px-4 py-2">{item.item || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.satuan || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.volume || 0}</td>
                                            <td className="px-4 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan || 0)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatRupiah(item.total || 0)}</td>
                                        </tr>
                                    ))}
                                    {rabPublikasi.map((item: any, idx: number) => (
                                        <tr key={`publ-${idx}`}>
                                            <td className="px-4 py-2 text-gray-500">Publikasi</td>
                                            <td className="px-4 py-2">{item.item || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.satuan || '-'}</td>
                                            <td className="px-4 py-2 text-right">{item.volume || 0}</td>
                                            <td className="px-4 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan || 0)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatRupiah(item.total || 0)}</td>
                                        </tr>
                                    ))}
                                    {rabData.map((item: any, idx: number) => (
                                        <tr key={`data-${idx}`}>
                                            <td className="px-4 py-2 text-gray-500">Pengumpulan Data</td>
                                            <td className="px-4 py-2">{item.item}</td>
                                            <td className="px-4 py-2 text-right">{item.satuan}</td>
                                            <td className="px-4 py-2 text-right">{item.volume}</td>
                                            <td className="px-4 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatRupiah(item.total)}</td>
                                        </tr>
                                    ))}
                                    {rabSewa.map((item: any, idx: number) => (
                                        <tr key={`sewa-${idx}`}>
                                            <td className="px-4 py-2 text-gray-500">Sewa Peralatan</td>
                                            <td className="px-4 py-2">{item.item}</td>
                                            <td className="px-4 py-2 text-right">{item.satuan}</td>
                                            <td className="px-4 py-2 text-right">{item.volume}</td>
                                            <td className="px-4 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan)}</td>
                                            <td className="px-4 py-2 text-right font-medium">{formatRupiah(item.total)}</td>
                                        </tr>
                                    ))}
                                    {rabItems.length === 0 && (
                                        <tr><td colSpan={6} className="px-4 py-2 text-center text-gray-500">Tidak ada data RAB</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* --- REVIEW ACTION FORM --- */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Keputusan Reviewer</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catatan / Masukan Reviewer</label>
                        <textarea
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                            placeholder="Berikan catatan, masukan, atau alasan penolakan..."
                            value={data.comments}
                            onChange={(e) => setData('comments', e.target.value)}
                        ></textarea>
                        {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments}</p>}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleActionClick('approve')}
                            disabled={processing}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Setujui Pendanaan
                        </button>
                        <button
                            onClick={() => handleActionClick('revise')}
                            disabled={processing}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Minta Revisi
                        </button>
                        <button
                            onClick={() => handleActionClick('reject')}
                            disabled={processing}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Tolak Usulan
                        </button>
                    </div>
                </div>

                {/* MODAL KONFIRMASI */}
                {isConfirming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl transform transition-all">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Konfirmasi {actionType === 'approve' ? 'Persetujuan' : actionType === 'revise' ? 'Permintaan Revisi' : 'Penolakan'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {actionType === 'approve'
                                    ? 'Anda yakin ingin MENYETUJUI usulan ini untuk didanai?'
                                    : actionType === 'revise'
                                        ? 'Anda yakin ingin MEMINTA REVISI untuk usulan ini? Pengusul akan diminta memperbaiki proposal.'
                                        : 'Anda yakin ingin MENOLAK usulan ini? Pastikan Anda telah memberikan alasan yang jelas.'}
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitReview}
                                    className={`px-4 py-2 rounded-md text-white font-bold ${actionType === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : actionType === 'revise'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Ya, {actionType === 'approve' ? 'Setujui' : actionType === 'revise' ? 'Minta Revisi' : 'Tolak'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ReviewerReview;
