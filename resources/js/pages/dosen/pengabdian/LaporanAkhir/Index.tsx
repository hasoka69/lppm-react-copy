import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';
import { motion } from 'framer-motion';
import {
    FileText,
    Edit,
    Download,
    Filter,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';

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
    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian')}>Daftar Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.pengabdian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.pengabdian.catatan-harian.index'))}>Catatan Harian</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.pengabdian.laporan-akhir.index'))}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>
            </div>
            <Head title="Laporan Akhir Pengabdian" />

            <motion.main
                className={styles.contentArea}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            LAPORAN AKHIR PENGABDIAN
                        </h1>
                        <p className="text-gray-500 mt-1 ml-11">Manajemen dan pengumpulan laporan akhir hasil pengabdian masyarakat</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-500/5 border border-white/20 overflow-hidden ring-1 ring-black/5">
                    <div className="p-5 bg-gradient-to-r from-gray-50/50 to-white/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">Tahun Pelaksanaan</span>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-blue-300">
                                <select className="bg-transparent border-none text-sm font-bold text-blue-700 focus:ring-0 cursor-pointer outline-none">
                                    <option>2026</option>
                                    <option>2025</option>
                                </select>
                                <Filter className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/30 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100/50">
                                    <th className="px-6 py-4 w-16 text-center">No</th>
                                    <th className="px-6 py-4">Informasi Program</th>
                                    <th className="px-6 py-4">Judul Pengabdian</th>
                                    <th className="px-6 py-4 text-center">Status Laporan</th>
                                    <th className="px-6 py-4 text-center">Berkas</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {fundedUsulan.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <AlertCircle className="w-12 h-12 stroke-1" />
                                                <p className="italic text-sm">Tidak ada usulan pengabdian yang memerlukan laporan akhir.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    fundedUsulan.map((usulan, index) => (
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
                                                        <span className="text-[11px] font-medium">Tahun {usulan.tahun_pertama}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8">
                                                <p className="text-sm text-gray-800 font-semibold leading-relaxed max-w-lg group-hover:text-blue-700 transition-colors">
                                                    {usulan.judul}
                                                </p>
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
