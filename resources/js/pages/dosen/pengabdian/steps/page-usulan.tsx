import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import styles from '../../../../../css/pengajuan.module.css';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Eye, Plus, FileText, Calendar, User, Search, Filter } from "lucide-react"
import { motion } from 'framer-motion';
import { formatAcademicYear, getCurrentAcademicYearCode, getAcademicYearOptions } from '@/utils/academicYear';

export interface Usulan {
    no: number;
    id: number;
    skema: string;
    judul: string;
    tahun_pelaksanaan: number;
    peran: string;
    status: string;
}

interface PageProps extends InertiaPageProps {
    usulanList: Usulan[];
}

interface PageUsulanProps {
    onTambahUsulan?: () => void;
    onEditUsulan?: (usulan: Usulan) => void;
    onDeleteUsulan?: (id: number) => void;
    onViewUsulan?: (usulan: Usulan) => void;
    usulanList?: Usulan[];
    title?: string;
    isPerbaikanView?: boolean;
}

const PageUsulan: React.FC<PageUsulanProps> = ({
    onTambahUsulan,
    onEditUsulan,
    onDeleteUsulan,
    onViewUsulan,
    usulanList: propUsulanList,
    title = "Usulan Pengabdian",
    isPerbaikanView = false
}) => {
    const { props } = usePage<PageProps>();
    const usulanList = propUsulanList || props.usulanList || [];

    const getStatusStyle = (status: string) => {
        const statusMap: Record<string, { label: string; bg: string; color: string; dot: string }> = {
            'draft': { label: 'Draft', bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
            'submitted': { label: 'Diajukan', bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
            'approved_prodi': { label: 'Disetujui Prodi', bg: '#ecfdf5', color: '#065f46', dot: '#10b981' },
            'rejected_prodi': { label: 'Ditolak Prodi', bg: '#fef2f2', color: '#991b1b', dot: '#ef4444' },
            'reviewer_review': { label: 'Proses Review', bg: '#fdf4ff', color: '#701a75', dot: '#d946ef' },
            'needs_revision': { label: 'Perlu Revisi', bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
            'revision_dosen': { label: 'Revisi Dosen', bg: '#fff7ed', color: '#9a3412', dot: '#f97316' },
            'didanai': { label: 'Lolos / Didanai', bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
            'ditolak': { label: 'Tidak Didanai', bg: '#450a0a', color: '#ffffff', dot: '#ef4444' },
        };
        return statusMap[status] || { label: status, bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
    };

    const [selectedYear, setSelectedYear] = React.useState<number>(getCurrentAcademicYearCode());
    const yearOptions = getAcademicYearOptions();

    const filteredUsulanList = usulanList.filter(u => u.tahun_pelaksanaan === selectedYear);

    return (
        <div className={styles.container}>
            {/* List Header with Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 className={styles.title} style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
                    <p className={styles.subtitle}>Kelola dan monitor status pengajuan usulan Anda</p>
                </div>
                {!isPerbaikanView && (
                    <button className={styles.primaryButton} onClick={onTambahUsulan} style={{ padding: '0.75rem 1.5rem' }}>
                        <Plus size={18} /> Tambah Usulan Baru
                    </button>
                )}
            </div>

            {/* Content Card */}
            <div className={styles.formSection} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Table Filters (Visual Only) */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                    <div className="relative group min-w-[300px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <Filter size={14} className="text-blue-600" />
                        <select
                            className="bg-transparent border-none text-[13px] font-bold text-gray-700 pr-8 focus:ring-0 cursor-pointer outline-none min-w-[200px]"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {yearOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.tableContainer} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px', paddingLeft: '1.5rem' }}>No</th>
                                <th>Informasi Usulan</th>
                                <th>Tahun Akademik</th>
                                <th>Status Usulan</th>
                                <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsulanList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "6rem 2rem" }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                                            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '50%' }}>
                                                <FileText size={64} strokeWidth={1} />
                                            </div>
                                            <div style={{ maxWidth: '300px' }}>
                                                <h3 style={{ color: '#475569', fontWeight: 700, margin: 0 }}>Belum Ada Usulan</h3>
                                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Mulai pengabdian Anda dengan mengklik tombol tambah di atas.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsulanList.map((u, idx) => {
                                    const status = getStatusStyle(u.status);
                                    return (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        >
                                            <td style={{ fontWeight: 700, color: '#94a3b8', paddingLeft: '1.5rem' }}>{u.no || idx + 1}</td>
                                            <td className={styles.judulCell} style={{ padding: '1.25rem 0.75rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                                        {u.skema}
                                                    </span>
                                                    <span style={{ fontWeight: 700, color: 'var(--secondary)', lineHeight: 1.4 }}>
                                                        {u.judul || '(Judul Belum Diisi)'}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.15rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <User size={12} /> {u.peran}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {formatAcademicYear(u.tahun_pelaksanaan)}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.badge}
                                                    style={{
                                                        background: status.bg,
                                                        color: status.color,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        border: `1px solid ${status.bg === '#ffffff' ? '#eee' : 'transparent'}`
                                                    }}
                                                >
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot }}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-slate-100 rounded-full">
                                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-1">
                                                        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold px-3 py-2">Navigasi Usulan</DropdownMenuLabel>
                                                        {u.peran === 'Ketua' ? (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onViewUsulan?.(u)} className="rounded-md cursor-pointer">
                                                                    <Eye className="mr-3 h-4 w-4 text-slate-500" /> Lihat Detail Preview
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => onEditUsulan?.(u)}
                                                                    disabled={!['draft', 'revision_dosen', 'needs_revision'].includes(u.status)}
                                                                    className="rounded-md cursor-pointer"
                                                                >
                                                                    <Edit className="mr-3 h-4 w-4 text-slate-500" /> Lanjutkan Pengisian
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        if (confirm('Apakah Anda yakin ingin menghapus usulan ini?')) {
                                                                            onDeleteUsulan?.(u.id);
                                                                        }
                                                                    }}
                                                                    disabled={u.status !== 'draft'}
                                                                    className="text-red-600 focus:text-red-700 focus:bg-red-50 rounded-md cursor-pointer"
                                                                >
                                                                    <Trash className="mr-3 h-4 w-4" /> Batalkan & Hapus
                                                                </DropdownMenuItem>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DropdownMenuItem className="rounded-md cursor-default flex items-center justify-between">
                                                                    <span className="flex items-center">
                                                                        <Eye className="mr-3 h-4 w-4 text-slate-500" /> Lihat Detail
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                                        Anggota
                                                                    </span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => onViewUsulan?.(u)}
                                                                    className="rounded-md cursor-pointer"
                                                                >
                                                                    <Eye className="mr-3 h-4 w-4 text-slate-500" /> Lihat Detail (Read Only)
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PageUsulan;
