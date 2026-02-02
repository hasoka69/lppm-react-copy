import React, { useState } from 'react';
import styles from '../../../../css/pengajuan.module.css';
import { Button } from "@/components/ui/button"
import { Search, Filter, FileText, Calendar, User, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { formatAcademicYear, getAcademicYearOptions } from '@/utils/academicYear'; // Added getAcademicYearOptions
import Select from 'react-select'; // Added Select

export interface Proposal {
    id: number;
    judul: string;
    ketua: string;
    prodi: string;
    skema: string;
    tanggal_pengajuan: string;
    tahun_pelaksanaan?: number;
    status: string;
    type?: 'penelitian' | 'pengabdian';
}

interface ReviewerPageUsulanProps {
    proposals: Proposal[];
    title?: string;
    type: 'penelitian' | 'pengabdian';
    selectedYear: { value: string; label: string } | null;
    onYearChange: (option: any) => void;
}

const ReviewerPageUsulan: React.FC<ReviewerPageUsulanProps> = ({
    proposals,
    title = "Daftar Usulan Masuk",
    type,
    selectedYear,
    onYearChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    // Removed local filterYear state

    // Filter Logic
    const filteredProposals = proposals.filter(p => {
        const matchesSearch = p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.ketua.toLowerCase().includes(searchTerm.toLowerCase());
        // Note: Year filter is tricky if API doesn't provide year in "tanggal_pengajuan" easily 
        // or if we rely on "tahun_pelaksanaan". 
        // For now, assume we just filter by search, strict year filtering might need parsing "tanggal_pengajuan" (YYYY-MM-DD)
        return matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        const statusMap: Record<string, { label: string; bg: string; color: string; dot: string; icon: any }> = {
            'submitted': { label: 'Baru Masuk', bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6', icon: Clock },
            'kaprodi_approved': { label: 'Disetujui Prodi', bg: '#ecfdf5', color: '#065f46', dot: '#10b981', icon: CheckCircle },
            'approved_prodi': { label: 'Disetujui Prodi', bg: '#ecfdf5', color: '#065f46', dot: '#10b981', icon: CheckCircle },
            'reviewer_assigned': { label: 'Penugasan Baru', bg: '#f0f9ff', color: '#0369a1', dot: '#0ea5e9', icon: User },
            'reviewer_review': { label: 'Sedang Direview', bg: '#fdf4ff', color: '#701a75', dot: '#d946ef', icon: FileText },
            'reviewed_approved': { label: 'Selesai (Disetujui)', bg: '#f0fdf4', color: '#166534', dot: '#22c55e', icon: CheckCircle },
            'reviewer_approved': { label: 'Selesai (Disetujui)', bg: '#f0fdf4', color: '#166534', dot: '#22c55e', icon: CheckCircle },
            'didanai': { label: 'Didanai', bg: '#f0fdf4', color: '#166534', dot: '#22c55e', icon: CheckCircle },
            'ditolak': { label: 'Ditolak', bg: '#fef2f2', color: '#991b1b', dot: '#ef4444', icon: XCircle },
            'needs_revision': { label: 'Perlu Revisi', bg: '#fffbeb', color: '#92400e', dot: '#f59e0b', icon: AlertCircle },
        };
        return statusMap[status] || { label: status, bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', icon: FileText };
    };

    return (
        <div className={styles.container}>
            {/* List Header with Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 className={styles.title} style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
                    <p className={styles.subtitle}>Daftar usulan yang ditugaskan untuk Anda review</p>
                </div>
            </div>

            {/* Content Card */}
            <div className={styles.formSection} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Table Filters (Visual Only) */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                    <div className="relative group min-w-[300px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari judul atau nama pengusul..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm w-48">
                        {/* <Filter size={14} className="text-blue-600" /> Removed icon from wrapper, put inside select if needed, or just standard Select */}
                        <div style={{ width: '100%' }}>
                            <Select
                                options={getAcademicYearOptions().map(opt => ({ value: opt.value.toString(), label: opt.label }))}
                                value={selectedYear}
                                onChange={onYearChange}
                                placeholder="Pilih Tahun..."
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        border: 'none',
                                        boxShadow: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem',
                                        color: '#9ca3af'
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableContainer} style={{ border: 'none', borderRadius: 0 }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px', paddingLeft: '1.5rem' }}>No</th>
                                <th>Informasi Usulan</th>
                                <th>Pengusul</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center', paddingRight: '1.5rem' }}>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProposals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "6rem 2rem" }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                                            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '50%' }}>
                                                <FileText size={64} strokeWidth={1} />
                                            </div>
                                            <div style={{ maxWidth: '300px' }}>
                                                <h3 style={{ color: '#475569', fontWeight: 700, margin: 0 }}>Tidak Ditemukan</h3>
                                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Tidak ada usulan yang cocok dengan pencarian Anda.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProposals.map((u, idx) => {
                                    const status = getStatusStyle(u.status);
                                    const StatusIcon = status.icon;

                                    return (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        >
                                            <td style={{ fontWeight: 700, color: '#94a3b8', paddingLeft: '1.5rem' }}>{idx + 1}</td>
                                            <td className={styles.judulCell} style={{ padding: '1.25rem 0.75rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                                        {u.skema || type}
                                                    </span>
                                                    <span style={{ fontWeight: 700, color: 'var(--secondary)', lineHeight: 1.4 }} title={u.judul}>
                                                        {u.judul}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.15rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Calendar size={12} /> {formatAcademicYear(u.tahun_pelaksanaan || parseInt(u.tanggal_pengajuan?.split('-')[0] || '2024'))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem' }}>{u.ketua}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.prodi}</span>
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
                                                        border: `1px solid ${status.bg === '#ffffff' ? '#eee' : 'transparent'}`,
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                                                <Link
                                                    href={type === 'penelitian'
                                                        ? `/reviewer/review/${u.id}`
                                                        : `/reviewer/review-pengabdian/${u.id}`}
                                                >
                                                    <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 shadow-sm hover:shadow">
                                                        Review
                                                    </Button>
                                                </Link>
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

export default ReviewerPageUsulan;
