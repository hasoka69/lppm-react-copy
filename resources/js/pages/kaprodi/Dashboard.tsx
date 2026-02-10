import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    Activity,
    CheckCircle2,
    Clock,
    XCircle,
    Users,
    FileText,
    TrendingUp,
    Building2,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPES ---

interface ProgramData {
    name: string;
    faculty: string;
    lecturers_count: number;
    proposals_current_year: number;
    year: string;
}

interface ProposalData {
    id: number;
    title: string;
    type: string;
    proposer: {
        name: string;
        prodi: string;
    };
    date: string; // "d M Y"
    status: string;
}

interface DashboardProps {
    program: ProgramData;
    summary: {
        waiting_review: number; // Controller sends 'waiting_review'
        rejected: number;       // Controller sends 'rejected'
        forwarded: number;      // Controller sends 'forwarded'
    };
    proposals: ProposalData[];
    activities: any[];
    error?: string;
}

export default function DashboardKaprodi({ program, summary, proposals, activities, error }: DashboardProps) {

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
                <div className="bg-red-50 text-red-700 p-8 rounded-2xl text-center shadow-xl border border-red-100">
                    <h2 className="text-2xl font-bold mb-2">Akses Terbatas</h2>
                    <p className="mb-6">{error}</p>
                    <Link href="/" className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">Kembali ke Beranda</Link>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const stats = [
        {
            title: "Menunggu Validasi",
            value: summary.waiting_review,
            icon: Clock,
            color: 'blue',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            desc: "Usulan baru masuk"
        },
        {
            title: "Telah Divalidasi",
            value: summary.forwarded,
            icon: CheckCircle2,
            color: 'emerald',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            desc: "Ke Reviewer / Didanai"
        },
        {
            title: "Ditolak",
            value: summary.rejected,
            icon: XCircle,
            color: 'rose',
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            desc: "Tidak lolos seleksi"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Dashboard Kaprodi" />
            <Header />

            <main className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* HERO SECTION */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-xs font-bold text-emerald-100 tracking-wide uppercase">Kaprodi Dashboard</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                    Selamat Datang, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Kaprodi {program.name}</span>
                                </h1>
                                <p className="text-blue-100/80 text-lg font-medium max-w-lg leading-relaxed">
                                    Pantau kinerja penelitian dan pengabdian dosen di program studi Anda secara real-time.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/kaprodi/usulan"
                                    className="px-6 py-3 bg-white text-blue-900 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Mulai Validasi Usulan
                                </Link>
                                <div className="flex items-center justify-center gap-4 text-sm font-semibold text-blue-200/60">
                                    <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Stats & Table (8 cols) */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* STAT CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform duration-300`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            {/* Sparkline placeholder or badge */}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">{stat.value}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* TABLE SECTION */}
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Usulan Terbaru</h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Belum divalidasi</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative group/search">
                                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Cari usulan..."
                                                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-blue-500/20 w-48 transition-all"
                                            />
                                        </div>
                                        <Link href="/kaprodi/usulan" className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Judul & Jenis</th>
                                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pengusul</th>
                                                <th className="px-8 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-8 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {proposals.length > 0 ? proposals.map((p) => (
                                                <tr key={`${p.type}-${p.id}`} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide w-fit border ${p.type === 'Penelitian' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                                                                }`}>
                                                                {p.type}
                                                            </span>
                                                            <p className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                                {p.title}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border border-white shadow-sm">
                                                                {p.proposer.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-700">{p.proposer.name}</p>
                                                                <p className="text-[11px] font-medium text-gray-400">{p.proposer.prodi}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                            Menunggu
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <Link
                                                            href={p.type === 'Pengabdian' ? `/kaprodi/review-pengabdian/${p.id}` : `/kaprodi/review/${p.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200"
                                                        >
                                                            Validasi
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="p-4 bg-gray-50 rounded-full">
                                                                <Activity className="w-6 h-6 opacity-40" />
                                                            </div>
                                                            <p className="text-sm font-medium">Tidak ada usulan baru yang perlu divalidasi.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Profile & Activity (4 cols) */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* PROFILE SUMMARY CARD */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-blue-100 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                            <Building2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Program Studi</p>
                                            <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{program.name}</h3>
                                            <p className="text-sm font-medium text-blue-600">{program.faculty}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">Dosen Aktif</span>
                                            </div>
                                            <span className="text-lg font-extrabold text-gray-900">{program.lecturers_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">Proposal {program.year}</span>
                                            </div>
                                            <span className="text-lg font-extrabold text-gray-900">{program.proposals_current_year}</span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                                        Lihat Kinerja Dosen
                                    </button>
                                </div>
                            </div>

                            {/* RECENT ACTIVITY */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-fit">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900">Aktivitas</h3>
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                    {activities && activities.length > 0 ? activities.map((act, i) => (
                                        <div key={i} className="relative pl-10">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center z-10">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 leading-tight">{act.title}</p>
                                            <p className="text-xs font-medium text-gray-400 mt-1">{act.subtitle}</p>
                                        </div>
                                    )) : (
                                        <div className="relative pl-10 opacity-60">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10">
                                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                            </div>
                                            <p className="text-sm font-bold text-gray-600">Belum ada aktivitas</p>
                                            <p className="text-xs text-gray-400 mt-1">Sistem belum mencatat kegiatan terbaru.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}