import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import WelcomeHero from '@/components/Shared/WelcomeHero';
import {
    FlaskConical,
    HandHeart,
    Wallet,
    FileText,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    GraduationCap,
    Mail,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPES ---
interface DashboardProps {
    stats: {
        total_penelitian: number;
        total_pengabdian: number;
        active_grants: number;
        total_funds: number;
    };
    activities: {
        id: number;
        title: string;
        type: string;
        date: string;
        status: string;
        link: string;
    }[];
    user: {
        name: string;
        email: string;
        nidn?: string;
        role?: string;
        avatar?: string;
        prodi?: string;
    };
}

export default function DashboardDosen({ stats, activities, user }: DashboardProps) {

    // Format Currency
    const formatIDR = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            } as any
        }
    };

    const statCards = [
        {
            title: "Total Penelitian",
            value: stats.total_penelitian,
            icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
            color: 'blue' as const,
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            desc: "Usulan Diajukan"
        },
        {
            title: "Total Pengabdian",
            value: stats.total_pengabdian,
            icon: <HandHeart className="w-6 h-6 text-emerald-600" />,
            color: 'emerald' as const,
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            desc: "Usulan Diajukan"
        },
    ];

    // Helper: Status Badge Logic
    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('didanai') || s.includes('setuju') || s.includes('accepted')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> {status}
                </span>
            );
        } else if (s.includes('tolak') || s.includes('reject')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3 h-3" /> {status}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" /> {status}
                </span>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Dashboard Dosen" />
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <WelcomeHero
                        title={`Selamat Datang, ${user.name} `}
                        subtitle="Sistem Informasi Manajemen Penelitian dan Pengabdian Kepada Masyarakat (LPPM)"
                    >
                        <div className="flex flex-wrap gap-4 mt-6">
                            <Link
                                href={route('dosen.penelitian.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm shadow-sm group"
                            >
                                <FlaskConical className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Kelola Penelitian
                            </Link>
                            <Link
                                href={route('dosen.pengabdian.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm shadow-sm group"
                            >
                                <HandHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Kelola Pengabdian
                            </Link>
                        </div>
                    </WelcomeHero>
                </motion.div>

                {/* 2. STATS GRID */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p - 3 rounded - xl ${stat.bg} group - hover: scale - 110 transition - transform duration - 300`}>
                                    {stat.icon}
                                </div>
                                <div className={`px - 2.5 py - 1 rounded - lg text - [10px] font - bold uppercase tracking - wider ${stat.bg} ${stat.text} `}>
                                    Active
                                </div>
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.title}</p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <div className={`w - 1.5 h - 1.5 rounded - full ${stat.text.replace('text-', 'bg-')} `}></div>
                                {stat.desc}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 3. RECENT ACTIVITIES & INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Aktivitas Terbaru</h3>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Status Proposal & Laporan</p>
                                </div>
                                <Link
                                    href={route('dosen.penelitian.index')}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {activities.length > 0 ? activities.map((act) => (
                                    <div key={`${act.type} -${act.id} `} className="p-6 hover:bg-slate-50 transition-colors group flex items-center gap-5">
                                        <div className={`p - 3 rounded - xl shrink - 0 ${act.type === 'Penelitian' ? 'bg-blue-100/50 text-blue-600' : 'bg-emerald-100/50 text-emerald-600'} `}>
                                            {act.type === 'Penelitian' ? <FlaskConical className="w-5 h-5" /> : <HandHeart className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text - [10px] font - bold px - 2 py - 0.5 rounded - md uppercase tracking - wider border ${act.type === 'Penelitian' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    } `}>
                                                    {act.type}
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {act.date}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                                                {act.title}
                                            </h4>
                                        </div>
                                        <div>
                                            {getStatusBadge(act.status)}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">Belum ada aktivitas terbaru.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Researcher Profile Card */}
                        <div className="group relative bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]"></div>

                            {/* Curved Header */}
                            <div className="relative h-32 bg-gradient-to-br from-[#2D4261] to-[#1e293b] overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-50">
                                    <svg className="absolute w-full h-full opacity-30 animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
                                    </svg>
                                </div>
                                {/* Wave Shape */}
                                <div className="absolute bottom-0 left-0 right-0">
                                    <svg viewBox="0 0 1440 320" className="w-full h-auto text-white fill-current block translate-y-1">
                                        <path fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 pb-8 relative z-10">
                                {/* Floating Avatar */}
                                <div className="relative -mt-20 mb-6 flex justify-center">
                                    <div className="relative">
                                        {user.avatar ? (
                                            <div className="w-[6.5rem] h-[6.5rem] rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white ring-4 ring-blue-50/50">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[6.5rem] h-[6.5rem] rounded-full border-[6px] border-white shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500 ring-4 ring-blue-50/50">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        {/* Status Dot */}
                                        <div className="absolute bottom-2 right-1 w-6 h-6 bg-emerald-500 border-[3px] border-white rounded-full shadow-lg" title="Active">
                                            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Identity */}
                                <div className="text-center space-y-3 mb-8">
                                    <div>
                                        <h4 className="text-xl font-extrabold text-slate-800 tracking-tight leading-7 mb-1">{user.name}</h4>
                                        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] border border-slate-200 shadow-sm">
                                            {user.role || 'Dosen'}
                                        </span>
                                    </div>

                                    {/* Styled Prodi Badge */}
                                    <div className="relative inline-flex group/prodi">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover/prodi:opacity-40 transition-opacity"></div>
                                        <div className="relative flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-xl shadow-sm text-blue-700">
                                            <div className="p-1 bg-blue-50 rounded-lg">
                                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-xs font-bold">{user.prodi || 'Program Studi Tidak Ada'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Pills */}
                                <div className="space-y-3">
                                    {/* NIDN Pill */}
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-300 group/item">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 group-hover/item:border-blue-200 transition-colors">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">NIDN</p>
                                            <p className="text-sm font-bold text-slate-700 font-mono tracking-tight">{user.nidn || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Email Pill */}
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-emerald-100 hover:-translate-y-0.5 transition-all duration-300 group/item">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 group-hover/item:border-emerald-200 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                                            <p className="text-sm font-bold text-slate-700 truncate" title={user.email}>{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                                    <span>Edit Profil Lengkap</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Important Info */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 p-6">
                            <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                Informasi Penting
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { text: "Batas akhir proposal 2026: 30 Mar", important: true },
                                    { text: "Laporan kemajuan: Juni 2025", important: false },
                                    { text: "Update data profil SINTA anda", important: false }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-start text-xs font-medium text-amber-900/80 leading-relaxed">
                                        <span className={`mt - 1.5 w - 1.5 h - 1.5 rounded - full shrink - 0 ${item.important ? 'bg-amber-600 ring-2 ring-amber-200/50' : 'bg-amber-400'} `}></span>
                                        <span className={item.important ? 'font-bold' : ''}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

            </main>
            <Footer />
        </div>
    );
}