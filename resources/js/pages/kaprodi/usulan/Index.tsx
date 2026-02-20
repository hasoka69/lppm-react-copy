import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import Pagination from '@/components/Pagination';
import { PaginatedResponse } from '@/types';
import { Home, ChevronRight, Eye, Layers } from 'lucide-react';
import { formatAcademicYear } from '@/utils/academicYear';

interface Usulan {
    no: number;
    id: number;
    judul: string;
    pengusul: string;
    skema: string;
    tahun: number;
    status: string;
    tanggal: string;
    type?: 'penelitian' | 'pengabdian';
}

interface PageProps {
    penelitianList: PaginatedResponse<Usulan>;
    pengabdianList: PaginatedResponse<Usulan>;
    prodiName: string;
}

export default function KaprodiUsulanIndex({ penelitianList, pengabdianList, prodiName }: PageProps) {
    const [activeTab, setActiveTab] = useState<'penelitian' | 'pengabdian'>('penelitian');

    const activeList = activeTab === 'penelitian' ? penelitianList : pengabdianList;
    const items = activeList.data || [];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Daftar Usulan - ${activeTab === 'penelitian' ? 'Penelitian' : 'Pengabdian'}`} />
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link href="/kaprodi/dashboard" className="hover:text-blue-600 flex items-center">
                        <Home className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-700">Daftar Usulan ({prodiName})</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Daftar Usulan Masuk</h1>
                            <p className="text-gray-500 mt-1">
                                Berikut adalah daftar usulan dari dosen Program Studi {prodiName}.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-2 mt-4 md:mt-0 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('penelitian')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'penelitian'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Penelitian
                            </button>
                            <button
                                onClick={() => setActiveTab('pengabdian')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pengabdian'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Pengabdian
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul / Skema</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengusul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Akademik</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Tidak ada data usulan {activeTab}.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((usulan, idx) => (
                                        <tr key={usulan.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Correct numbering across pages: (current_page - 1) * per_page + idx + 1 */}
                                                {(activeList.current_page - 1) * activeList.per_page + idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">{usulan.judul}</div>
                                                <div className="text-xs text-blue-600 mt-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-50">
                                                    {usulan.skema}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {usulan.pengusul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatAcademicYear(usulan.tahun)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {usulan.tanggal}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${usulan.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                        usulan.status === 'approved_prodi' ? 'bg-green-100 text-green-800' :
                                                            usulan.status === 'rejected_prodi' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {usulan.status === 'submitted' && 'Menunggu Validasi'}
                                                    {usulan.status === 'approved_prodi' && 'Telah Divalidasi'}
                                                    {usulan.status === 'rejected_prodi' && 'Ditolak Prodi'}
                                                    {!['submitted', 'approved_prodi', 'rejected_prodi'].includes(usulan.status) && usulan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={activeTab === 'penelitian'
                                                        ? `/kaprodi/review/${usulan.id}`
                                                        : route('kaprodi.usulan_pengabdian.show', usulan.id)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" /> Validasi
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6">
                    <Pagination links={activeList.links} />
                </div>
            </div>
            <Footer />
        </div>
    );
}
