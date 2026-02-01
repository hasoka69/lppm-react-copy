import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '../../../components/Header';
import Footer from '@/components/footer';
import ReviewerPageUsulan, { Proposal } from './ReviewerPageUsulan';
import { motion } from 'framer-motion';

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

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans">
            <Head title="Daftar Usulan Reviewer" />
            <Header />

            {/* Sticky Tab Navigation (Simulating Dosen Theme) */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('penelitian')}
                            className={`py-4 text-[13px] font-bold transition-all whitespace-nowrap relative ${activeTab === 'penelitian' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Penelitian
                            {proposals.length > 0 && <span className="ml-2 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px]">{proposals.length}</span>}
                            {activeTab === 'penelitian' && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('pengabdian')}
                            className={`py-4 text-[13px] font-bold transition-all whitespace-nowrap relative ${activeTab === 'pengabdian' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Pengabdian
                            {pengabdianProposals.length > 0 && <span className="ml-2 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px]">{pengabdianProposals.length}</span>}
                            {activeTab === 'pengabdian' && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <ReviewerPageUsulan
                    proposals={activeData}
                    type={activeTab}
                    title={activeTab === 'penelitian' ? 'Usulan Penelitian Masuk' : 'Usulan Pengabdian Masuk'}
                />
            </main>

            <Footer />
        </div>
    );
};

export default ReviewerIndex;
