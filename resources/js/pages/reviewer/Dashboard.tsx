import React from 'react';
import Header from '../../components/Header';
import { Head } from '@inertiajs/react'; // Add Head title
import StatCard from '../../components/Shared/StatCard';
import WelcomeHero from '../../components/Shared/WelcomeHero';
import { Link } from '@inertiajs/react';

// --- ICONS (Inline SVG) ---
const ClockIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClipboardIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CheckCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface DashboardProps {
    stats: {
        pending: number;
        reviewed: number;
        approved: number;
        rejected: number;
    };
    recentActivities: {
        id: number;
        title: string;
        desc: string;
        time: string;
        type: 'success' | 'info' | 'danger';
    }[];
    profile: {
        name: string;
        role: string;
        expertise: string;
        avatar?: string;
    };
}

export default function DashboardReviewer({ stats, recentActivities, profile }: DashboardProps) {

    const statItems = [
        { title: "Menunggu Penilaian", value: stats.pending, icon: ClockIcon, color: 'blue' as const },
        { title: "Sudah Direview", value: stats.reviewed, icon: ClipboardIcon, color: 'purple' as const }, // Renamed from Dalam Review to Total Reviewed
        { title: "Disetujui", value: stats.approved, icon: CheckCircleIcon, color: 'green' as const },
        { title: "Ditolak", value: stats.rejected, icon: XCircleIcon, color: 'red' as const },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            {/* Simple Head Title if not in Header */}

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <WelcomeHero
                    title={`Selamat Datang, ${profile.name}`}
                    subtitle="Lakukan evaluasi mendalam dan berikan keputusan terhadap usulan yang masuk."
                    buttonLabel="Mulai Review Usulan"
                    buttonLink="/reviewer/usulan"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {statItems.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terakhir</h2>
                            {recentActivities.length > 0 ? (
                                <div className="space-y-6">
                                    {recentActivities.map((act, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1
                                                ${act.type === 'success' ? 'bg-green-100 text-green-600' :
                                                    act.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-red-100 text-red-600'}`}>
                                                <div className="w-3 h-3 bg-current rounded-full opacity-60"></div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800">{act.title}</h4>
                                                <p className="text-sm text-gray-600 mt-0.5">{act.desc}</p>
                                                <span className="text-xs text-gray-400 mt-1 block">{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Belum ada aktivitas review.</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 bg-blue-50 rounded-full mb-4 overflow-hidden p-1 border-2 border-dashed border-blue-200">
                                    <img
                                        src={profile.avatar || "https://i.pravatar.cc/150?img=11"}
                                        alt="Reviewer"
                                        className="w-full h-full rounded-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + profile.name}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
                                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    {profile.role}
                                </span>
                            </div>

                            <Link
                                href="/reviewer/penilaian"
                                className="block w-full mt-4 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm text-center hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                            >
                                Lihat Riwayat Penilaian
                            </Link>

                            <Link
                                href="/profile"
                                className="block w-full mt-3 bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm text-center hover:bg-slate-800 transition-all shadow-md"
                            >
                                Edit Profil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}