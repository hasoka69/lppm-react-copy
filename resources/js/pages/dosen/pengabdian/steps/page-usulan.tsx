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
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react"

export interface Usulan {
    no: number;
    id: number;
    skema: string;
    judul: string;
    tahun_pelaksanaan: number;
    peran: string;
    status: string;
    catatan?: string | null;
    reviewer_action?: string | null;
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
}

const PageUsulan: React.FC<PageUsulanProps> = ({
    onTambahUsulan,
    onEditUsulan,
    onDeleteUsulan,
    onViewUsulan,
    usulanList: propUsulanList,
    title = "Usulan Pengabdian"
}) => {
    const { props } = usePage<PageProps>();
    const usulanList = propUsulanList || props.usulanList || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            <div className={styles.actionHeader}>
                <button className={styles.addButton} onClick={onTambahUsulan}>
                    Tambah Usulan Baru
                </button>
            </div>

            <div className={styles.tableSection}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Skema</th>
                                <th>Judul</th>
                                <th>Tahun</th>
                                <th>Peran</th>
                                <th>Status</th>
                                <th>Catatan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usulanList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                                        Belum ada usulan.
                                    </td>
                                </tr>
                            ) : (
                                usulanList.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.no}.</td>
                                        <td>{u.skema}</td>
                                        <td className={styles.judulCell}>{u.judul || '(Tanpa Judul)'}</td>
                                        <td>{u.tahun_pelaksanaan}</td>
                                        <td>{u.peran}</td>
                                        <td>
                                            {(() => {
                                                const statusMap: Record<string, { label: string; className: string }> = {
                                                    'draft': { label: 'Draft', className: styles.statusDraft },
                                                    'submitted': { label: 'Diajukan', className: styles.statusSubmitted },
                                                    'approved_prodi': { label: 'Disetujui Prodi', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' },
                                                    'rejected_prodi': { label: 'Ditolak Prodi', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800' },
                                                    'reviewer_review': { label: 'Review Reviewer', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800' },
                                                    'needs_revision': { label: 'Perlu Revisi', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800' },
                                                    'didanai': { label: 'Didanai', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' },
                                                    'ditolak': { label: 'Ditolak', className: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800' },
                                                };
                                                const statusInfo = statusMap[u.status] || { label: u.status, className: styles.statusSubmitted };
                                                return <span className={statusInfo.className}>{statusInfo.label}</span>;
                                            })()}
                                        </td>
                                        <td>
                                            {u.catatan ? (
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-700 truncate" title={u.catatan}>
                                                        {u.catatan}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => onViewUsulan?.(u)}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" /> Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onEditUsulan?.(u)}
                                                        disabled={u.status === 'rejected_prodi' || u.status === 'ditolak' || u.status === 'didanai'}
                                                        className={u.status === 'rejected_prodi' || u.status === 'ditolak' || u.status === 'didanai' ? 'opacity-50 cursor-not-allowed' : ''}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus usulan ini?')) {
                                                                onDeleteUsulan?.(u.id);
                                                            }
                                                        }}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PageUsulan;
