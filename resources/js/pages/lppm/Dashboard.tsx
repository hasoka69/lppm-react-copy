import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Header from "@/components/Header";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";
import { FileText, Users, HandHeart, Banknote, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp, MoreHorizontal } from "lucide-react";
import Select from 'react-select';
import { formatAcademicYear, getAcademicYearOptions } from '@/utils/academicYear';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

interface DashboardProps {
    stats: {
        dosen: number;
        penelitian: number;
        pengabdian: number;
        total_funds: number;
    };
    chartData: {
        name: string;
        penelitian: number;
        pengabdian: number;
    }[];
    activities: {
        id: number;
        title: string;
        user: string;
        type: 'Penelitian' | 'Pengabdian';
        status: string;
        time: string;
    }[];
    statusDist: {
        penelitian: Record<string, number>;
        pengabdian: Record<string, number>;
    };
    filters?: {
        tahun_akademik?: string;
    }
}

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-300 group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-100">
                    {trend}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
            {subtitle && (
                <p className="text-slate-400 text-[10px] mt-2 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    {subtitle}
                </p>
            )}
        </div>
    </motion.div>
);

const ActivityItem = ({ activity }: { activity: DashboardProps['activities'][0] }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'didanai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    return (
        <div className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${activity.type === 'Penelitian' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {activity.type === 'Penelitian' ? <FileText size={18} /> : <HandHeart size={18} />}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">{activity.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{activity.user} • {activity.type}</p>
            </div>
            <div className="flex flex-col items-end ml-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 uppercase ${getStatusColor(activity.status)}`}>
                    {activity.status}
                </span>
                <span className="text-xs text-gray-400 flex items-center">
                    <Clock size={10} className="mr-1" /> {activity.time}
                </span>
            </div>
        </div>
    );
};

export default function DashboardAdmin(props: DashboardProps) {
    const pageProps = usePage().props as any;

    // Favor props passed to the component, but fallback to usePage().props
    const stats = props.stats || pageProps.stats || { dosen: 0, penelitian: 0, pengabdian: 0, total_funds: 0 };
    const chartData = props.chartData || pageProps.chartData || [];
    const activities = props.activities || pageProps.activities || [];
    const statusDist = props.statusDist || pageProps.statusDist || { penelitian: {}, pengabdian: {} };
    const filters = props.filters || pageProps.filters || {};
    // Format IDR for funds
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Prepare Pie Data (Simplified)
    const pieData = [
        { name: 'Penelitian', value: stats?.penelitian || 0, color: '#3b82f6' },
        { name: 'Pengabdian', value: stats?.pengabdian || 0, color: '#10b981' },
    ];
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    // -- Filter Logic --
    const yearOptions = getAcademicYearOptions();
    const [selectedYear, setSelectedYear] = useState<{ value: number, label: string } | null>(
        filters?.tahun_akademik ? {
            value: parseInt(filters.tahun_akademik),
            label: formatAcademicYear(filters.tahun_akademik)
        } : null
    );

    // Sync state with props when backend changes it (e.g. via fallback)
    useEffect(() => {
        if (filters?.tahun_akademik) {
            setSelectedYear({
                value: parseInt(filters.tahun_akademik),
                label: formatAcademicYear(filters.tahun_akademik)
            });
        }
    }, [filters?.tahun_akademik]);

    const handleFilterChange = (year: string | undefined) => {
        router.get(route(route().current() as string), {
            tahun_akademik: year
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Dashboard LPPM" />
            <Header />

            <main className="p-6 max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Monitoring real-time kinerja penelitian dan pengabdian.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <Link href={route('lppm.penelitian.index')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300">
                            Kelola Penelitian
                        </Link>
                        <Link href={route('lppm.pengabdian.index')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                            Kelola Pengabdian
                        </Link>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        title="Total Penelitian"
                        value={stats?.penelitian ?? 0}
                        icon={FileText}
                        color="bg-blue-600"
                        trend="Active"
                        subtitle="Usulan Penelitian Terdaftar"
                    />
                    <StatCard
                        title="Total Pengabdian"
                        value={stats?.pengabdian ?? 0}
                        icon={HandHeart}
                        color="bg-emerald-600"
                        trend="Active"
                        subtitle="Usulan Pengabdian Terdaftar"
                    />
                    <StatCard
                        title="Total Dosen"
                        value={stats?.dosen ?? 0}
                        icon={Users}
                        color="bg-violet-600"
                        trend="Verified"
                        subtitle="Dosen Aktif di Sistem"
                    />
                    <StatCard
                        title="Dana Disalurkan"
                        value={formatCurrency(stats?.total_funds ?? 0)}
                        icon={Banknote}
                        color="bg-amber-600"
                        trend="Total"
                        subtitle="Akumulasi Seluruh Dana"
                    />
                </motion.div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-extrabold text-xl text-slate-800 tracking-tight flex items-center gap-2">
                                    <TrendingUp size={24} className="text-blue-600" />
                                    Tren Usulan Masuk
                                </h3>
                                <p className="text-slate-400 text-xs font-medium mt-1">Komparasi penelitian dan pengabdian per tahun</p>
                            </div>
                            <div className="w-64">
                                <Select
                                    options={yearOptions}
                                    value={selectedYear}
                                    onChange={(option) => {
                                        setSelectedYear(option);
                                        handleFilterChange(option?.value.toString());
                                    }}
                                    placeholder="Filter Tahun..."
                                    className="text-sm font-semibold"
                                    isClearable
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderColor: '#f1f5f9',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '0.75rem',
                                            padding: '4px',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: '#e2e8f0'
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="h-80 w-full font-sans">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPenelitian" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                                        </linearGradient>
                                        <linearGradient id="colorPengabdian" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '11px', fontWeight: 700, padding: '2px 0' }}
                                        labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '24px', fontSize: '12px', fontWeight: 600 }}
                                        formatter={(value) => <span className="text-slate-600 font-bold ml-1">{value}</span>}
                                    />
                                    <Area type="monotone" dataKey="penelitian" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPenelitian)" name="Penelitian" strokeLinejoin="round" />
                                    <Area type="monotone" dataKey="pengabdian" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorPengabdian)" name="Pengabdian" strokeLinejoin="round" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col"
                    >
                        <h3 className="font-extrabold text-lg text-slate-800 tracking-tight mb-8">Distribusi Tipe</h3>
                        <div className="h-48 relative mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={8}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 700 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-extrabold text-slate-800 tracking-tighter">{(stats?.penelitian || 0) + (stats?.pengabdian || 0)}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usulan</span>
                            </div>
                        </div>

                        {/* Detailed Status Grid */}
                        <div className="space-y-4 mt-auto">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="flex items-center text-xs font-bold text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                        Total Didanai
                                    </span>
                                    <span className="text-sm font-extrabold text-slate-800">
                                        {(statusDist?.penelitian?.['didanai'] || 0) + (statusDist?.pengabdian?.['didanai'] || 0)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Penelitian</p>
                                        <p className="text-xs font-bold text-blue-600">{statusDist?.penelitian?.['didanai'] || 0}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Pengabdian</p>
                                        <p className="text-xs font-bold text-emerald-600">{statusDist?.pengabdian?.['didanai'] || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100/50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="flex items-center text-xs font-bold text-slate-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                        Total Submitted
                                    </span>
                                    <span className="text-sm font-extrabold text-slate-800">
                                        {(statusDist?.penelitian?.['submitted'] || 0) + (statusDist?.pengabdian?.['submitted'] || 0)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/50 p-2 rounded-xl border border-white text-center">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Penelitian</p>
                                        <p className="text-xs font-bold text-blue-600">{statusDist?.penelitian?.['submitted'] || 0}</p>
                                    </div>
                                    <div className="bg-white/50 p-2 rounded-xl border border-white text-center">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Pengabdian</p>
                                        <p className="text-xs font-bold text-emerald-600">{statusDist?.pengabdian?.['submitted'] || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section: Recent Activities & Shortcuts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    {/* Recent Activities */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">Aktivitas Terbaru</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time update sistem</p>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <ActivityItem key={activity.id} activity={activity} />
                                ))
                            ) : (
                                <div className="p-16 text-center">
                                    <AlertCircle size={40} className="text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold text-sm">Belum ada aktivitas tercatat.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                <FileText size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-extrabold text-2xl mb-3 tracking-tight">Panduan Admin</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Unduh panduan lengkap penggunaan dashboard admin untuk memaksimalkan fitur.</p>
                                <button className="w-full bg-white text-slate-900 text-xs font-extrabold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-black/20">
                                    Download PDF
                                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight mb-6">Shortcut Cepat</h3>
                            <div className="space-y-3">
                                <Link href={route('lppm.penelitian.index')} className="flex items-center p-3.5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <FileText size={18} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">Data Penelitian</span>
                                </Link>
                                <Link href={route('lppm.pengabdian.index')} className="flex items-center p-3.5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                        <HandHeart size={18} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">Data Pengabdian</span>
                                </Link>
                                <Link href="#" className="flex items-center p-3.5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mr-4 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                                        <Users size={18} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">Kelola Pengguna</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}