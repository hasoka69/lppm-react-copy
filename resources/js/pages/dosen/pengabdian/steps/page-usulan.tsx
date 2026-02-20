import React, { useState } from 'react';
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
import { MoreHorizontal, Edit, Trash, Eye, Plus, FileText, Calendar, User, Search, Filter, Download } from "lucide-react"
import { motion } from 'framer-motion';
import { formatAcademicYear, getCurrentAcademicYearCode, getAcademicYearOptions } from '@/utils/academicYear';
import Select from 'react-select';
import Pagination from '@/components/Pagination';
import { PaginatedResponse } from '@/types';

export interface Usulan {
    no: number;
    id: number;
    skema: string;
    judul: string;
    tahun_pelaksanaan: number;
    peran: string;
    status: string;
    nomor_kontrak?: string | null;
}

interface PageProps extends InertiaPageProps {
    usulanList: PaginatedResponse<Usulan>;
}

interface PageUsulanProps {
    onTambahUsulan?: () => void;
    onEditUsulan?: (usulan: Usulan) => void;
    onDeleteUsulan?: (id: number) => void;
    onViewUsulan?: (usulan: Usulan) => void;
    usulanList?: PaginatedResponse<Usulan>;
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
    const usulanList = propUsulanList || props.usulanList;

    const items = usulanList?.data || [];
    const links = usulanList?.links || [];

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

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const yearOptions = [
        { value: null, label: 'Semua Tahun Akademik' },
        ...getAcademicYearOptions().map(opt => ({ value: opt.value, label: opt.label }))
    ];

    const filteredUsulanList = items.filter(u => {
        const matchesYear = selectedYear ? u.tahun_pelaksanaan === selectedYear : true;
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
            cursor: 'pointer',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.875rem',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#94a3b8',
            fontSize: '0.875rem',
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 50
        })
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>Kelola dan monitor status pengajuan usulan Anda</p>
                </div>
                <div className={styles.headerAction}>
                    {!isPerbaikanView && onTambahUsulan && (
                        <Button onClick={onTambahUsulan} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm shadow-blue-200 px-6 py-6 rounded-xl font-bold">
                            <Plus size={18} />
                            Tambah Usulan
                        </Button>
                    )}
                </div>
            </div>

            <div className={styles.formSection} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="relative group min-w-[300px] flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        />
                    </div>

                    <div className="min-w-[200px]">
                        <Select
                            options={yearOptions}
                            value={yearOptions.find(opt => opt.value === selectedYear) || yearOptions[0]}
                            onChange={(option: any) => setSelectedYear(option?.value || null)}
                            styles={customSelectStyles}
                            isSearchable={false}
                        />
                    </div>
                </div>

                <div className={styles.tableContainer}>
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
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText size={48} className="text-gray-300" />
                                            <p>Belum ada usulan yang diajukan</p>
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
                                            <td style={{ fontWeight: 700, color: '#94a3b8', paddingLeft: '1.5rem' }}>
                                                {(usulanList.current_page - 1) * usulanList.per_page + idx + 1}
                                            </td>
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
                                                <span className={styles.badge} style={{
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    border: `1px solid ${status.bg === '#ffffff' ? '#e2e8f0' : 'transparent'}`
                                                }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.dot, marginRight: '6px' }}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="text-center px-4">
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
                                                                <DropdownMenuItem onClick={() => onViewUsulan && onViewUsulan(u)} className="rounded-md cursor-pointer">
                                                                    <Eye className="mr-3 h-4 w-4 text-slate-500" /> Lihat Detail Preview
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => onEditUsulan && onEditUsulan(u)}
                                                                    disabled={!['draft', 'revision_dosen', 'needs_revision'].includes(u.status)}
                                                                    className="rounded-md cursor-pointer"
                                                                >
                                                                    <Edit className="mr-3 h-4 w-4 text-slate-500" /> Lanjutkan Pengisian
                                                                </DropdownMenuItem>
                                                                {u.status === 'didanai' && u.nomor_kontrak && (
                                                                    <DropdownMenuItem asChild>
                                                                        <a
                                                                            href={route('lppm.kontrak.generate', { id: u.id, type: 'pengabdian' })}
                                                                            target="_blank"
                                                                            className="rounded-md cursor-pointer flex items-center w-full"
                                                                        >
                                                                            <Download className="mr-3 h-4 w-4 text-emerald-600" /> Download Kontrak
                                                                        </a>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        if (confirm('Apakah Anda yakin ingin menghapus usulan ini?')) {
                                                                            onDeleteUsulan && onDeleteUsulan(u.id);
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
                                                                <DropdownMenuItem onClick={() => onViewUsulan && onViewUsulan(u)} className="rounded-md cursor-pointer">
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

                <div className="mt-4">
                    <Pagination links={links} />
                </div>
            </div>
        </div>
    );
};

export default PageUsulan;
