import React from 'react';
import Header from '../../components/Header';
import { Head } from '@inertiajs/react'; // Add Head title
import StatCard from '../../components/Shared/StatCard';
import WelcomeHero from '../../components/Shared/WelcomeHero';
import { Link } from '@inertiajs/react';
import { FileText, Clock } from 'lucide-react';

// --- ICONS (Inline SVG) ---
const ClockIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
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
        nidn?: string;
        prodi?: string;
        email?: string;
        sinta?: string;
        scopus?: string;
        avatar?: string;
    };
}

export default function DashboardReviewer({ stats, recentActivities, profile }: DashboardProps) {

    const statItems = [
        { title: "Menunggu Penilaian", value: stats.pending, icon: ClockIcon, color: 'blue' as const },
        { title: "Sudah Direview", value: stats.reviewed, icon: <FileText className="w-8 h-8" />, color: 'purple' as const }, // Renamed from Dalam Review to Total Reviewed
        { title: "Disetujui", value: stats.approved, icon: CheckCircleIcon, color: 'green' as const },
        { title: "Ditolak", value: stats.rejected, icon: XCircleIcon, color: 'red' as const },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10 opacity-50"></div>
            <div className="absolute top-0 right-0 -m-32 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply pointer-events-none"></div>

            <Header />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10">

                <WelcomeHero
                    title={`Selamat Datang, ${profile.name}`}
                    subtitle="Lakukan evaluasi mendalam dan berikan keputusan terhadap usulan yang masuk."
                    buttonLabel="Mulai Review Usulan"
                    buttonLink="/reviewer/usulan"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {statItems.map((stat, index) => (
                                <div key={index} className="transform transition-all duration-300 hover:-translate-y-1">
                                    <StatCard {...stat} />
                                </div>
                            ))}
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 tracking-tight">Aktivitas Terbaru</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem Penilaian</p>
                                </div>
                                <Link href="/reviewer/penilaian" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Lihat Semua</Link>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((act, i) => (
                                        <div key={i} className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0
                                                ${act.type === 'success' ? 'bg-green-50 text-green-600' :
                                                    act.type === 'danger' ? 'bg-red-50 text-red-600' :
                                                        'bg-blue-50 text-blue-600'}`}>
                                                <FileText size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{act.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                                            </div>
                                            <div className="flex flex-col items-end ml-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 uppercase
                                                    ${act.type === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        act.type === 'danger' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                                    {act.type === 'success' ? 'Disetujui' : act.type === 'danger' ? 'Ditolak' : 'Direvisi'}
                                                </span>
                                                <span className="text-xs text-gray-400 flex items-center">
                                                    <Clock size={12} className="mr-1" />
                                                    {act.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-16 text-center">
                                        <FileText size={40} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold text-sm">Belum ada aktivitas tercatat.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8 relative">
                        {/* Profile Card Fixed to Top when scrolling */}
                        <div className="sticky top-24">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-8 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                {/* Decorative Background */}
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent h-32 -z-10"></div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group/avatar cursor-pointer">
                                        <div className="w-28 h-28 bg-white rounded-full mb-5 overflow-hidden p-1 shadow-md border border-slate-100 group-hover/avatar:shadow-lg group-hover/avatar:border-blue-200 transition-all duration-300 group-hover/avatar:scale-105">
                                            <img
                                                src={profile.avatar || "https://i.pravatar.cc/150?img=11"}
                                                alt="Reviewer"
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + profile.name}
                                            />
                                        </div>
                                        <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/10 scale-150 opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:scale-100 transition-all duration-500 ease-out pointer-events-none"></div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">{profile.name}</h3>

                                    <div className="flex flex-wrap gap-2 justify-center mt-3 mb-4">
                                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                            {profile.role}
                                        </span>
                                    </div>

                                    <div className="w-full text-left bg-slate-50 rounded-xl p-4 mb-2 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">NIDN</span>
                                            <span className="text-slate-800 font-semibold">{profile.nidn || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium whitespace-nowrap mr-2">Prodi</span>
                                            <span className="text-slate-800 font-semibold text-right truncate" title={profile.prodi}>{profile.prodi || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">Email</span>
                                            <span className="text-slate-800 font-semibold text-right truncate max-w-[150px]" title={profile.email}>{profile.email || '-'}</span>
                                        </div>
                                        {profile.expertise && profile.expertise !== '-' && (
                                            <div className="flex flex-col gap-1 text-sm border-t border-slate-200/60 pt-2 mt-2">
                                                <span className="text-slate-500 font-medium">Kepakaran</span>
                                                <span className="text-slate-800 font-semibold text-sm leading-snug">{profile.expertise}</span>
                                            </div>
                                        )}
                                        {(profile.sinta && profile.sinta !== '-' || profile.scopus && profile.scopus !== '-') && (
                                            <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-medium">ID Akademik</span>
                                                <div className="flex gap-2">
                                                    {profile.sinta && profile.sinta !== '-' && <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold" title="SINTA ID">SINTA: {profile.sinta}</span>}
                                                    {profile.scopus && profile.scopus !== '-' && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold" title="Scopus ID">Scopus: {profile.scopus}</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4 pt-6 border-t border-slate-100">
                                    <Link
                                        href="/reviewer/penilaian"
                                        className="relative flex items-center justify-center w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm overflow-hidden group/btn"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <FileText size={16} className="shrink-0" />
                                            Lihat Riwayat Penilaian
                                        </span>
                                        <div className="absolute inset-0 bg-blue-50 translate-y-[100%] group-hover/btn:translate-y-[0%] transition-transform duration-300 ease-in-out"></div>
                                    </Link>

                                    <Link
                                        href="/profile"
                                        className="relative flex items-center justify-center w-full bg-slate-900 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] hover:shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:-translate-y-0.5 duration-200"
                                    >
                                        <span className="flex items-center gap-2">
                                            Edit Profil Pribadi
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}