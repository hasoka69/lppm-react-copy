import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';
import { formatAcademicYear, getAcademicYearOptions, getCurrentAcademicYearCode } from '@/utils/academicYear';
import { motion } from 'framer-motion';
import {
    FileText,
    Edit,
    Download,
    Filter,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search
} from 'lucide-react';
import Select from 'react-select'; // Added react-select

interface FundedUsulan {
    id: number;
    judul: string;
    skema: string;
    tahun_pertama: number;
    dana_disetujui: number;
    report: {
        id: number;
        status: string;
        file_laporan: string | null;
    } | null;
}

interface Props {
    fundedUsulan: FundedUsulan[];
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
                            { label: 'Laporan Akhir', active: true, route: route('dosen.pengabdian.laporan-akhir.index') },
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
            <Head title="Laporan Akhir Pengabdian" />

            <motion.main
                className={styles.contentArea}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            Laporan <span className="text-blue-600">Akhir</span>
                        </h1>
                        <p className="text-gray-500 text-[13px] font-medium uppercase tracking-[0.1em] ml-14">Manajemen dan pengumpulan laporan akhir pengabdian</p>
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

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Informasi Program</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul Pengabdian</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status Laporan</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Berkas</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <AlertCircle className="w-12 h-12 stroke-1" />
                                                <p className="italic text-sm">Tidak ada usulan pengabdian yang memerlukan laporan akhir.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((usulan, index) => (
                                        <motion.tr
                                            key={usulan.id}
                                            variants={itemVariants}
                                            className="hover:bg-blue-50/30 transition-colors group cursor-default"
                                        >
                                            <td className="px-6 py-8 text-sm text-gray-400 font-medium text-center">{index + 1}</td>
                                            <td className="px-6 py-8">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 w-fit uppercase border border-green-100">
                                                        {usulan.skema}
                                                    </span>
                                                    <p className="text-[12px] text-gray-900 font-bold leading-tight">Pengabdian Masyarakat</p>
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="text-[11px] font-medium">{formatAcademicYear(usulan.tahun_pertama)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-sm text-gray-800 font-semibold leading-relaxed max-w-lg group-hover:text-blue-700 transition-colors uppercase">
                                                        {usulan.judul}
                                                    </p>
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-100/50 w-fit">
                                                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                                                        DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui || 0)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8">
                                                <div className="flex justify-center">
                                                    {!usulan.report ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase border border-gray-200">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                            Belum Mengisi
                                                        </span>
                                                    ) : usulan.report.status === 'Draft' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase border border-amber-100 shadow-sm shadow-amber-500/10">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                            Draft
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase border border-emerald-100 shadow-sm shadow-emerald-500/10">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Submitted
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-8 text-center">
                                                {usulan.report?.file_laporan ? (
                                                    <a
                                                        href={`/storage/${usulan.report.file_laporan}`}
                                                        target="_blank"
                                                        className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-500/20 group/btn"
                                                        title="Unduh Laporan"
                                                    >
                                                        <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                    </a>
                                                ) : (
                                                    <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-200">
                                                        <FileText className="w-5 h-5 opacity-20" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-8 text-center">
                                                <Link
                                                    href={route('dosen.pengabdian.laporan-akhir.show', usulan.id)}
                                                    className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-500/30 group/edit"
                                                >
                                                    <Edit className="w-5 h-5 group-hover/edit:scale-110 transition-transform" />
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}
