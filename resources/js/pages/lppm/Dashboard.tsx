import React from "react";
import { Head, Link } from "@inertiajs/react";
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
import { FileText, Users, HandHeart, Banknote, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Select from 'react-select';
import { formatAcademicYear, getAcademicYearOptions } from '@/utils/academicYear';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
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
    const { stats, chartData, activities, statusDist } = props;

    // Format IDR for funds
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prepare Pie Data (Simplified)
    const pieData = [
        { name: 'Penelitian', value: stats.penelitian, color: '#3b82f6' },
        { name: 'Pengabdian', value: stats.pengabdian, color: '#10b981' },
    ];
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    // -- Filter Logic --
    const yearOptions = getAcademicYearOptions();
    const [selectedYear, setSelectedYear] = useState<{ value: number, label: string } | null>(
        props.filters?.tahun_akademik ? {
            value: parseInt(props.filters.tahun_akademik),
            label: formatAcademicYear(props.filters.tahun_akademik)
        } : null
    );

    const handleFilterChange = (year: string | undefined) => {
        router.get(route(route().current() as string), {
            tahun_akademik: year
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Dashboard LPPM" />
            <Header />

            <main className="p-6 max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-500 text-sm mt-1">Monitoring real-time kinerja penelitian dan pengabdian.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <Link href={route('lppm.penelitian.index')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                            Kelola Penelitian
                        </Link>
                        <Link href={route('lppm.pengabdian.index')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">
                            Kelola Pengabdian
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Penelitian"
                        value={stats.penelitian}
                        icon={FileText}
                        color="bg-blue-500"
                        trend="Active"
                    />
                    <StatCard
                        title="Total Pengabdian"
                        value={stats.pengabdian}
                        icon={HandHeart}
                        color="bg-emerald-500"
                        trend="Active"
                    />
                    <StatCard
                        title="Total Dosen"
                        value={stats.dosen}
                        icon={Users}
                        color="bg-violet-500"
                        trend="Registered"
                    />
                    <StatCard
                        title="Dana Disalurkan"
                        value={formatCurrency(stats.total_funds)}
                        icon={Banknote}
                        color="bg-amber-500"
                        trend="Total"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Bar Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Tren Usulan Masuk</h3>
                            <div className="w-64">
                                <Select
                                    options={yearOptions}
                                    value={selectedYear}
                                    onChange={(option) => {
                                        setSelectedYear(option);
                                        handleFilterChange(option?.value.toString());
                                    }}
                                    placeholder="Filter Tahun Akademik..."
                                    className="text-sm"
                                    isClearable
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderColor: '#e5e7eb',
                                            borderRadius: '0.5rem',
                                            padding: '2px',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: '#d1d5db'
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPenelitian" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPengabdian" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="penelitian" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPenelitian)" name="Penelitian" />
                                    <Area type="monotone" dataKey="pengabdian" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPengabdian)" name="Pengabdian" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Stats / Pie Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-6">Distribusi Tipe</h3>
                        <div className="h-60 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <span className="text-3xl font-bold text-gray-800">{stats.penelitian + stats.pengabdian}</span>
                                <span className="text-xs text-gray-400">Total Usulan</span>
                            </div>
                        </div>

                        {/* Status Summary */}
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-600"><CheckCircle2 size={16} className="text-green-500 mr-2" /> Didanai</span>
                                <span className="font-bold">{(statusDist.penelitian['didanai'] || 0) + (statusDist.pengabdian['didanai'] || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-600"><AlertCircle size={16} className="text-blue-500 mr-2" /> Submitted</span>
                                <span className="font-bold">{(statusDist.penelitian['submitted'] || 0) + (statusDist.pengabdian['submitted'] || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Recent Activities & Shortcuts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Aktivitas Terbaru</h3>
                            <span className="text-xs font-medium text-gray-400">Real-time update</span>
                        </div>
                        <div>
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <ActivityItem key={activity.id} activity={activity} />
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">Belum ada aktivitas tercatat.</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-xl mb-2">Panduan Admin</h3>
                            <p className="text-blue-100 text-sm mb-4">Unduh panduan lengkap penggunaan dashboard admin untuk memaksimalkan fitur.</p>
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                Download PDF
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">Shortcut Cepat</h3>
                            <div className="space-y-2">
                                <Link href={route('lppm.penelitian.index')} className="flex items-center p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Data Penelitian</span>
                                </Link>
                                <Link href={route('lppm.pengabdian.index')} className="flex items-center p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <HandHeart size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Data Pengabdian</span>
                                </Link>
                                <Link href="#" className="flex items-center p-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Users size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Kelola Pengguna</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}