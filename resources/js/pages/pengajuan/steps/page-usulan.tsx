import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import styles from '../../../../css/pengajuan.module.css';
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
  makro_riset: string;
  peran: string;
  status: string;
}

interface PageProps extends InertiaPageProps {
  usulanList: Usulan[];
}

interface PageUsulanProps {
  onTambahUsulan?: () => void;
  onEditUsulan?: (usulan: Usulan) => void;
  onDeleteUsulan?: (id: number) => void; // ✅ Added
  onViewUsulan?: (usulan: Usulan) => void; // ✅ Added
  usulanList?: Usulan[];
}

const PageUsulan: React.FC<PageUsulanProps> = ({
  onTambahUsulan,
  onEditUsulan,
  onDeleteUsulan,
  onViewUsulan,
  usulanList: propUsulanList
}) => {
  const { props } = usePage<PageProps>();
  // Use passed prop first, fallback to page props
  const usulanList = propUsulanList || props.usulanList || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usulan Penelitian</h1>
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
                <th>Makro Riset</th>
                <th>Peran</th>
                <th>Status</th>
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
                    <td>{u.makro_riset}</td>
                    <td>{u.peran}</td>
                    <td>
                      <span
                        className={
                          u.status === "draft"
                            ? styles.statusDraft
                            : styles.statusSubmitted
                        }
                      >
                        {u.status === 'draft' ? 'Draft' : 'Diajukan'}
                      </span>
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
