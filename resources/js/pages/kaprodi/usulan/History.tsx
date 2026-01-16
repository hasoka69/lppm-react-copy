import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { Home, ChevronRight, Eye } from 'lucide-react';

interface Usulan {
    no: number;
    id: number;
    judul: string;
    pengusul: string;
    skema: string;
    tahun: number;
    status: string;
    tanggal: string;
}

interface PageProps {
    usulanList: Usulan[];
    prodiName: string;
}

export default function KaprodiUsulanHistory({ usulanList, prodiName }: PageProps) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Riwayat Review Usulan" />
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link href="/kaprodi/dashboard" className="hover:text-blue-600 flex items-center">
                        <Home className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-700">Riwayat Review ({prodiName})</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Riwayat Review Usulan</h1>
                            <p className="text-gray-500 mt-1">
                                Berikut adalah daftar usulan penelitian yang telah Anda review.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul / Skema</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengusul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {usulanList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada riwayat review.
                                        </td>
                                    </tr>
                                ) : (
                                    usulanList.map((usulan) => (
                                        <tr key={usulan.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {usulan.no}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">{usulan.judul}</div>
                                                <div className="text-xs text-blue-600 mt-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-50">
                                                    {usulan.skema} ({usulan.type || 'Penelitian'})
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {usulan.pengusul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {usulan.tanggal}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 italic line-clamp-2 max-w-xs">
                                                {/* Display comments/notes if available */}
                                                {(usulan as any).comments || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${usulan.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                        usulan.status === 'approved_prodi' ? 'bg-green-100 text-green-800' :
                                                            usulan.status === 'rejected_prodi' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {usulan.status === 'submitted' && 'Menunggu Tinjauan'}
                                                    {usulan.status === 'approved_prodi' && 'Disetujui Prodi'}
                                                    {usulan.status === 'rejected_prodi' && 'Ditolak Prodi'}
                                                    {usulan.status === 'reviewer_review' && 'Sedang Direview'}
                                                    {!['submitted', 'approved_prodi', 'rejected_prodi', 'reviewer_review'].includes(usulan.status) && usulan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={`/kaprodi/review/${usulan.id}`} // Or logic for pengabdian link if necessary
                                                    className="text-gray-600 hover:text-gray-900 inline-flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" /> Lihat Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
