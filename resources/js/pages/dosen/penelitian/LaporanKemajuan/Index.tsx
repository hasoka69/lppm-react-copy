import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';

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

export default function Index({ fundedUsulan }: Props) {
    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian')}>Daftar Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.penelitian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.penelitian.catatan-harian.index'))}>Catatan Harian</button>
                    <button className={styles.tab} onClick={() => { }}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>
            </div>
            <Head title="Laporan Kemajuan" />

            <main className={styles.contentArea}>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">LAPORAN KEMAJUAN</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-end">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded text-white">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                            </div>
                            <select className="border-gray-200 rounded text-sm py-1.5 focus:ring-blue-500">
                                <option>2026</option>
                                <option>2025</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16">No</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-32">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-24">Berkas</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {fundedUsulan.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                                            Tidak ada usulan penelitian yang sedang didanai atau memerlukan laporan kemajuan.
                                        </td>
                                    </tr>
                                ) : (
                                    fundedUsulan.map((usulan, index) => (
                                        <tr key={usulan.id} className="hover:bg-blue-50/20 transition group">
                                            <td className="px-6 py-6 text-sm text-gray-600 font-medium">{index + 1}</td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-green-600 leading-tight uppercase mb-1">{usulan.skema}</p>
                                                    <p className="text-[10px] text-gray-600 font-medium">Penelitian Kompetitf Nasional</p>
                                                    <p className="text-[10px] text-gray-800 font-bold">Tahun Pelaksanaan : {usulan.tahun_pertama}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-sm text-gray-800 leading-snug max-w-xl font-medium">{usulan.judul}</p>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                {!usulan.report ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                                                        Belum Mengisi
                                                    </span>
                                                ) : usulan.report.status === 'Draft' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">
                                                        Draft
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                                                        Submitted
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                {usulan.report?.file_laporan ? (
                                                    <a
                                                        href={`/storage/${usulan.report.file_laporan}`}
                                                        target="_blank"
                                                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-800 text-white rounded hover:bg-blue-900 transition shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <Link
                                                    href={route('dosen.penelitian.laporan-kemajuan.show', usulan.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 bg-white text-gray-600 rounded hover:bg-gray-50 transition shadow-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
