import { Head, router } from '@inertiajs/react';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';

interface Props {
    fundedUsulan: any[];
}

export default function Index({ fundedUsulan }: Props) {
    return (
        <div className={styles.masterContainer}>
            <Head title="Catatan Harian Penelitian" />
            <Header />

            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian')}>Daftar Penelitian</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.penelitian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.penelitian.catatan-harian.index'))}>Catatan Harian</button>
                    <button className={styles.tab} onClick={() => { }}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>

                <main className="flex-1 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">Catatan Harian penelitian</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-end">
                            <div className="relative w-64">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari judul atau skema..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">No</th>
                                        <th className="px-6 py-4">Skema</th>
                                        <th className="px-6 py-4">Tahun</th>
                                        <th className="px-6 py-4">Judul</th>
                                        <th className="px-6 py-4">Keterangan</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {fundedUsulan.length > 0 ? (
                                        fundedUsulan.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-6 text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-6">
                                                    <p className="text-sm font-bold text-gray-800 leading-tight">{item.skema}</p>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-gray-600">{item.tahun}</td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-900 font-medium leading-relaxed">{item.judul}</p>
                                                        <p className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block font-bold">
                                                            Dana Disetujui: Rp {new Intl.NumberFormat('id-ID').format(item.dana_disetujui)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-1 text-[11px] text-gray-600 font-medium">
                                                        <p>Jumlah Catatan: <span className="text-blue-600">{item.total_logs}</span></p>
                                                        <p>Persentase Capaian: <span className="text-green-600 font-bold">{item.last_percentage}%</span></p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <button
                                                        onClick={() => router.visit(route('dosen.penelitian.catatan-harian.show', item.id))}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100 group"
                                                        title="Buka Catatan Harian"
                                                    >
                                                        <svg className="w-4 h-4 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                Tidak ada data penelitian yang didanai.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
