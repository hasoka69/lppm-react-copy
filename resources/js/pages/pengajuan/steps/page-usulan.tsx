import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import styles from '../../../../css/pengajuan.module.css';

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
  usulanList?: Usulan[]; // Optional - reads from usePage if not provided
}

const PageUsulan: React.FC<PageUsulanProps> = ({ onTambahUsulan, onEditUsulan }) => {
  const { props } = usePage<PageProps>();
  const usulanList = props.usulanList || [];

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
                <th>Tahun Pelaksanaan</th>
                <th>Makro Riset</th>
                <th>Peran</th>
                <th>Status Usulan</th>
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
                    <td className={styles.judulCell}>{u.judul}</td>
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
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.actionButton}
                          title="Edit"
                          onClick={() => onEditUsulan?.(u)}
                        >
                          ✏️
                        </button>
                        <button className={styles.actionButton} title="Hapus">🗑️</button>
                        <button className={styles.actionButton} title="Lihat">👁️</button>
                      </div>
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
