import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { Home, ChevronRight, Eye, FileText } from 'lucide-react';

interface Usulan {
    id: number;
    judul: string;
    ketua: string;
    prodi: string;
    skema: string;
    tanggal: string;
    status: string;
    type: string;
}

interface PageProps {
    proposals: Usulan[];
}

export default function AdminPenelitianIndex({ proposals = [] }: PageProps) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Admin LPPM - Daftar Penelitian" />
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link href="/lppm/dashboard" className="hover:text-blue-600 flex items-center">
                        <Home className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-700">Daftar Penelitian</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                                Monitoring Usulan Penelitian
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Kelola dan pantau seluruh usulan penelitian yang masuk ke LPPM.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul / Skema</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua / Prodi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {proposals.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada data usulan penelitian.
                                        </td>
                                    </tr>
                                ) : (
                                    proposals.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.judul}</div>
                                                <div className="text-xs text-blue-600 mt-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-50">
                                                    {item.skema}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{item.ketua}</div>
                                                <div className="text-xs text-gray-500">{item.prodi}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.tanggal}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest border
                                                    ${item.status === 'submitted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        ['approved_prodi', 'reviewer_assigned', 'revision_dosen', 'resubmitted_revision'].includes(item.status) ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            item.status === 'reviewed_approved' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                item.status === 'didanai' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    item.status === 'ditolak_akhir' || item.status === 'rejected_reviewer' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}>
                                                    {item.status === 'submitted' ? 'MENUNGGU PROS' :
                                                        item.status === 'reviewed_approved' ? 'SIAP PUTUSAN' :
                                                            item.status.toUpperCase().replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('lppm.penelitian.show', item.id)}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
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
