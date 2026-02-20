import React from 'react';
import { Head, Link, router } from '@inertiajs/react'; // Ensure valid imports
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
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight, // Added ChevronRight
    DollarSign,   // Added DollarSign
    Calendar      // Added Calendar
} from 'lucide-react';
import Select from 'react-select';
import Pagination from '@/components/Pagination'; // Added Pagination
import { PaginatedResponse } from '@/types'; // Added PaginatedResponse

// Interfaces
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
    fundedUsulan: PaginatedResponse<FundedUsulan>; // Updated to PaginatedResponse
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

    // Filter logic on current page items
    const filteredList = fundedUsulan.data.filter(u => {
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
        <>
            <Header />
            <Head title="Laporan Kemajuan Penelitian" />

            <div className={styles.container} style={{ minHeight: '80vh', paddingTop: '2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>

                    {/* Page Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
                        <h1 className={styles.title} style={{ fontSize: '2rem' }}>Laporan Kemajuan</h1>
                        <p className={styles.subtitle} style={{ fontSize: '1rem' }}>
                            Kelola dan laporkan perkembangan penelitian Anda yang sedang didanai
                        </p>
                    </div>

                    {/* Filters */}
                    <div style={{
                        background: 'white',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        marginBottom: '2rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        <div className="relative group w-full md:w-auto flex-1 md:max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari judul penelitian..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                            />
                        </div>
                        <div className="w-full md:w-[250px]">
                            <Select
                                options={yearOptions}
                                value={yearOptions.find(opt => opt.value === selectedYear)}
                                onChange={(option: any) => setSelectedYear(option ? option.value : null)}
                                styles={customSelectStyles}
                                placeholder="Tahun Pelaksanaan..."
                                isSearchable={false}
                            />
                        </div>
                    </div>

                    {/* List */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        {filteredList.length === 0 ? (
                            <motion.div
                                variants={itemVariants}
                                style={{
                                    background: 'white',
                                    borderRadius: '1rem',
                                    padding: '4rem 2rem',
                                    textAlign: 'center',
                                    border: '2px dashed #e2e8f0'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem auto'
                                }}>
                                    <FileText size={40} className="text-slate-400" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                    Belum Ada Penelitian
                                </h3>
                                <p style={{ color: '#64748b' }}>
                                    Tidak ada penelitian didanai yang ditemukan untuk kriteria pencarian Anda.
                                </p>
                            </motion.div>
                        ) : (
                            filteredList.map((usulan) => (
                                <motion.div
                                    key={usulan.id}
                                    variants={itemVariants}
                                    style={{
                                        background: 'white',
                                        borderRadius: '1rem',
                                        padding: '1.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                        border: '1px solid #f1f5f9',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: '#eff6ff',
                                                    color: '#3b82f6',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.375rem'
                                                }}>
                                                    {usulan.skema}
                                                </span>
                                                <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={14} /> {usulan.tahun_pertama}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                                                {usulan.judul}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                                <DollarSign size={14} />
                                                <span>Dana Disetujui: <span style={{ color: '#0f172a', fontWeight: 600 }}>Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui)}</span></span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            {!usulan.report ? (
                                                <span style={{
                                                    fontSize: '0.75rem', fontWeight: 600, color: '#64748b', bg: '#f1f5f9',
                                                    padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#f8fafc', border: '1px solid #e2e8f0'
                                                }}>
                                                    Belum Ada Laporan
                                                </span>
                                            ) : (
                                                <span style={{
                                                    fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                    padding: '0.25rem 0.75rem', borderRadius: '999px',
                                                    background: usulan.report.status === 'submitted' ? '#eff6ff' :
                                                        usulan.report.status === 'accepted' ? '#f0fdf4' :
                                                            usulan.report.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                                                    color: usulan.report.status === 'submitted' ? '#1d4ed8' :
                                                        usulan.report.status === 'accepted' ? '#15803d' :
                                                            usulan.report.status === 'rejected' ? '#b91c1c' : '#b45309',
                                                    border: `1px solid ${usulan.report.status === 'submitted' ? '#dbeafe' :
                                                            usulan.report.status === 'accepted' ? '#dcfce7' :
                                                                usulan.report.status === 'rejected' ? '#fee2e2' : '#fef3c7'
                                                        }`
                                                }}>
                                                    {usulan.report.status === 'submitted' ? <CheckCircle2 size={12} /> :
                                                        usulan.report.status === 'accepted' ? <CheckCircle2 size={12} /> :
                                                            usulan.report.status === 'rejected' ? <AlertCircle size={12} /> : <Clock size={12} />}
                                                    {usulan.report.status === 'submitted' ? 'Diajukan' :
                                                        usulan.report.status === 'accepted' ? 'Diterima' :
                                                            usulan.report.status === 'rejected' ? 'Revisi' : 'Draft'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Link
                                            href={route('dosen.penelitian.laporan-kemajuan.show', usulan.id)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: usulan.report ? '#0f172a' : '#2563eb',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                transition: 'all 0.2s'
                                            }}
                                            className="hover:opacity-90 active:scale-95"
                                        >
                                            {usulan.report ? <Edit size={14} /> : <FileText size={14} />}
                                            {usulan.report ? 'Edit Laporan' : 'Buat Laporan'}
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Pagination */}
                    <div className="mt-8">
                        <Pagination links={fundedUsulan.links} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
