import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Search, BookOpen, Clock, BadgeCheck } from 'lucide-react';
import { formatAcademicYear, getAcademicYearOptions, getCurrentAcademicYearCode } from '@/utils/academicYear';
import Select from 'react-select'; // Added react-select

interface FundedUsulan {
    id: number;
    judul: string;
    skema: string;
    tahun_pertama: number;
    dana_disetujui: number;
    progress: number;
}

interface Props {
    fundedUsulan: FundedUsulan[];
}

export default function Index({ fundedUsulan }: Props) {
    const [selectedYear, setSelectedYear] = React.useState<number | null>(null); // Default: All Years
    const [searchQuery, setSearchQuery] = React.useState<string>(''); // Search State

    const yearOptions = [
        { value: null, label: 'Semua Tahun Akademik' },
        ...getAcademicYearOptions().map(opt => ({ value: opt.value, label: opt.label }))
    ];

    const filteredList = fundedUsulan.filter(u => {
        const matchesYear = selectedYear ? u.tahun_pertama === selectedYear : true;
        const matchesSearch = u.judul.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesSearch;
    });

    const customSelectStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '2px 8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #cbd5e1'
            }
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            fontSize: '0.875rem',
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#1e293b',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#1e293b',
            fontWeight: 600
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#94a3b8',
            fontSize: '0.875rem'
        })
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                            { label: 'Daftar Pengabdian', route: route('dosen.pengabdian.index') },
                            { label: 'Perbaikan Usulan', route: route('dosen.pengabdian.perbaikan') },
                            { label: 'Laporan Kemajuan', route: route('dosen.pengabdian.laporan-kemajuan.index') },
                            { label: 'Catatan Harian', route: route('dosen.pengabdian.catatan-harian.index') },
                            { label: 'Laporan Akhir', route: route('dosen.pengabdian.laporan-akhir.index') },
                            { label: 'Pengkinian Capaian Luaran', active: true, route: route('dosen.pengabdian.pengkinian-luaran.index') }
                        ].map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => !tab.active && router.visit(tab.route)}
                                className={`px-5 py-4 text-[13px] font-semibold transition-all whitespace-nowrap relative ${tab.active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.label}
                                {tab.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Head title="Pengkinian Capaian Luaran" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                Pengkinian <span className="text-blue-600">Luaran</span>
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium uppercase tracking-[0.1em] ml-14">Manajemen capaian dan target luaran pengabdian</p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Cari judul pengabdian..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-[13px] font-semibold text-gray-700 w-80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3 min-w-[250px]">
                                <Select
                                    options={yearOptions}
                                    value={yearOptions.find(opt => opt.value === selectedYear)}
                                    onChange={(option: any) => setSelectedYear(option ? option.value : null)}
                                    styles={customSelectStyles}
                                    placeholder="Filter Tahun Akademik..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-blue-900/10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-16">No</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Program & Skema</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Judul Pengabdian</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-40">Capaian</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-6 bg-gray-50 rounded-full">
                                                        <Search className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-400 font-bold tracking-tight">Tidak ada usulan pengabdian yang memerlukan pengkinian luaran.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((usulan, index) => (
                                            <motion.tr
                                                key={usulan.id}
                                                variants={itemVariants}
                                                className="hover:bg-blue-50/30 transition-all duration-300 group"
                                            >
                                                <td className="px-8 py-8 text-sm text-gray-400 font-black tracking-tighter">{(index + 1).toString().padStart(2, '0')}</td>
                                                <td className="px-8 py-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest leading-none">
                                                                {usulan.skema}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{formatAcademicYear(usulan.tahun_pertama)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="space-y-3">
                                                        <p className="text-sm font-bold text-gray-800 leading-relaxed max-w-xl group-hover:text-blue-700 transition-colors uppercase">
                                                            {usulan.judul}
                                                        </p>
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-100/50">
                                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                                                            DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui || 0)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-blue-900/5 transition-all duration-500 min-w-[140px]">
                                                            <div className="flex items-center gap-2">
                                                                <BadgeCheck className="w-4 h-4 text-blue-600" />
                                                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Progress</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                                    style={{ width: `${usulan.progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
                                                                {Math.round(usulan.progress)}% Complete
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex justify-center">
                                                        <Link
                                                            href={route('dosen.pengabdian.pengkinian-luaran.show', usulan.id)}
                                                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300"
                                                        >
                                                            Update
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
