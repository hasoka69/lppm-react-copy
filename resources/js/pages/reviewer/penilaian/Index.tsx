import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import Header from '../../../components/Header';

interface ReviewHistory {
    id: number;
    usulan_id: number;
    judul: string;
    ketua: string;
    prodi: string;
    action: string;
    comments: string;
    reviewed_at: string;
    status_usulan: string;
    type: 'penelitian' | 'pengabdian';
}

interface PageProps {
    reviewHistories: ReviewHistory[];
    [key: string]: unknown;
}

const ReviewerPenilaianIndex: React.FC = () => {
    const { props } = usePage<PageProps>();
    const reviewHistories = props.reviewHistories;

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'reviewer_approved':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>;
            case 'reviewer_rejected':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
            case 'reviewer_revision_requested':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Minta Revisi</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{action}</span>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'didanai':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">Didanai</span>;
            case 'ditolak':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">Ditolak</span>;
            case 'needs_revision':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-50 text-yellow-700">Perlu Revisi</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Riwayat Penilaian" />
            <Header />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Penilaian Saya</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Daftar usulan penelitian yang telah Anda review.
                    </p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                    {reviewHistories.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proposal</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keputusan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Review</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Usulan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reviewHistories.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 max-w-md line-clamp-2" title={item.judul}>
                                                    {item.judul}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.ketua}</div>
                                                <div className="text-xs text-gray-500">{item.prodi}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getActionBadge(item.action)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.reviewed_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(item.status_usulan)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={item.type === 'penelitian'
                                                        ? route('reviewer.usulan.show', item.usulan_id)
                                                        : route('reviewer.usulan_pengabdian.show', item.usulan_id)}
                                                    data={{ mode: 'view' }}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada riwayat penilaian</h3>
                            <p className="mt-1 text-sm text-gray-500">Anda belum melakukan penilaian terhadap usulan apapun.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReviewerPenilaianIndex;
