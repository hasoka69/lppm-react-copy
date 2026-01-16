import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../../components/Header';
import styles from '../../../css/kaprodi.module.css'; // Reuse existing styles or generic

interface Proposal {
    id: number;
    judul: string;
    ketua: string;
    prodi: string;
    skema: string;
    tanggal_pengajuan: string;
    status: string;
    type?: 'penelitian' | 'pengabdian';
}

interface PageProps {
    proposals: Proposal[]; // Penelitian
    pengabdianProposals: Proposal[]; // Pengabdian
    [key: string]: unknown;
}

const ReviewerIndex: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { proposals, pengabdianProposals = [] } = props;

    const [activeTab, setActiveTab] = useState<'penelitian' | 'pengabdian'>('penelitian');

    // Combine data for display based on tab
    const activeData = activeTab === 'penelitian' ? proposals : pengabdianProposals;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Submitted</span>;
            case 'kaprodi_approved':
            case 'approved_prodi':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disetujui Prodi</span>;
            case 'reviewer_review':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Sedang Direview</span>;
            case 'didanai':
            case 'reviewer_approved':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Didanai</span>;
            case 'ditolak':
            case 'reviewer_rejected':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
            case 'needs_revision':
            case 'reviewer_revision_requested':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Perlu Revisi</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Daftar Usulan Reviewer" />
            <Header />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Usulan Masuk</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Usulan yang ditugaskan kepada Anda untuk direview.
                        </p>
                    </div>
                </div>

                {/* TABS */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('penelitian')}
                            className={`${activeTab === 'penelitian'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Penelitian
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">
                                {proposals.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('pengabdian')}
                            className={`${activeTab === 'pengabdian'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Pengabdian
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">
                                {pengabdianProposals.length}
                            </span>
                        </button>
                    </nav>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                    {activeData.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proposal</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Pengusul</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skema</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pengajuan</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2" title={item.judul}>
                                                {item.judul}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.ketua}</div>
                                            <div className="text-xs text-gray-500">{item.prodi}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.skema || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tanggal_pengajuan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={activeTab === 'penelitian'
                                                    ? `/reviewer/review/${item.id}`
                                                    : `/reviewer/review-pengabdian/${item.id}`}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                            >
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada usulan {activeTab}</h3>
                            <p className="mt-1 text-sm text-gray-500">Saat ini belum ada usulan {activeTab} yang ditugaskan kepada Anda.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReviewerIndex;
