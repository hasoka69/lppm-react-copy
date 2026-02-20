import { Head, router, Link } from '@inertiajs/react';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, BookOpen } from 'lucide-react';
import { formatAcademicYear, getAcademicYearOptions, getCurrentAcademicYearCode } from '@/utils/academicYear';
import Select from 'react-select'; // Added react-select

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

interface Props {
    fundedUsulan: any[];
}

export default function Index({ fundedUsulan }: Props) {
    const [selectedYear, setSelectedYear] = React.useState<number | null>(null); // Default: All Years
    const [searchQuery, setSearchQuery] = React.useState<string>(''); // Search State

    const yearOptions = [
        { value: null, label: 'Semua Tahun Akademik' },
        ...getAcademicYearOptions().map(opt => ({ value: opt.value, label: opt.label }))
    ];

    const filteredList = fundedUsulan.filter(item => {
        const matchesYear = selectedYear ? item.tahun === selectedYear : true;
        const matchesSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase());
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
                            { label: 'Catatan Harian', active: true, route: route('dosen.pengabdian.catatan-harian.index') },
                            { label: 'Laporan Akhir', route: route('dosen.pengabdian.laporan-akhir.index') },
                            { label: 'Pengkinian Capaian Luaran', route: route('dosen.pengabdian.pengkinian-luaran.index') }
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
            <Head title="Catatan Harian Pengabdian" />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-10"
                >
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Catatan <span className="text-blue-600 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Harian</span>
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium uppercase tracking-[0.05em]">Modul Pengabdian</p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Cari judul..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-2xl py-2.5 pl-10 pr-4 text-[13px] font-medium text-gray-700 w-64 focus:border-blue-500 focus:ring-0 transition-all outline-none"
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

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-40">Program & Skema</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul & Anggaran</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-48">Progress</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredList.length > 0 ? (
                                        filteredList.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-blue-50/20 transition group">
                                                <td className="px-6 py-6 text-sm text-gray-400 font-bold text-center">{index + 1}</td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-bold text-blue-600 leading-tight uppercase mb-1">{item.skema}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tahun Pelaksanaan : {formatAcademicYear(item.tahun)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-900 leading-snug max-w-xl font-semibold group-hover:text-blue-700 transition-colors uppercase">{item.judul}</p>
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-100/50">
                                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                                                            DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(item.dana_disetujui)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                                                            <span className="text-gray-400">Total Log</span>
                                                            <span className="text-blue-600">{item.total_logs} ENTRI</span>
                                                        </div>
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.last_percentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                                                            <span className="text-gray-400">Progress</span>
                                                            <span className="text-emerald-600 font-extrabold">{item.last_percentage}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <Link
                                                        href={route('dosen.pengabdian.catatan-harian.show', item.id)}
                                                        className="inline-flex items-center justify-center w-10 h-10 border-2 border-emerald-100 bg-white text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm group-hover:-translate-y-1 shadow-emerald-200/20"
                                                        title="Buka Catatan Harian"
                                                    >
                                                        <BookOpen className="w-5 h-5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                        <Filter className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Tidak ada data pengabdian yang didanai.</p>
                                                </div>
                                            </td>
                                        </tr>
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
