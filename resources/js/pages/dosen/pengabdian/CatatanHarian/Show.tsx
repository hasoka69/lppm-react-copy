import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';

interface Props {
    usulan: any;
    logs: any[];
}

export default function Show({ usulan, logs }: Props) {
    const { flash }: any = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<any>(null);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        if (flash.success) alert(flash.success);
        if (flash.error) alert(flash.error);
    }, [flash]);

    const filteredLogs = selectedMonth
        ? logs.filter(log => log.tanggal.startsWith(selectedMonth))
        : logs;

    const openCreateModal = () => {
        setEditingLog(null);
        setIsModalOpen(true);
    };

    const openEditModal = (log: any) => {
        setEditingLog(log);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.masterContainer}>
            <Head title={`Catatan Harian - ${usulan.judul}`} />
            <Header />

            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian')}>Daftar Pengabdian</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.pengabdian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.pengabdian.catatan-harian.index'))}>Catatan Harian</button>
                    <button className={styles.tab} onClick={() => { }}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>

                <main className="flex-1 p-6 space-y-6">
                    {/* Header Info */}
                    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm space-y-3">
                        <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase tracking-tight">
                            {usulan.judul}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase">{usulan.kelompok_skema}</span>
                            <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded font-bold uppercase">Tahun Pelaksanaan {usulan.tahun_pertama}</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.visit(route('dosen.pengabdian.catatan-harian.index'))}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Kembali
                            </button>
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition flex items-center gap-2 shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Tambah
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden px-3 shadow-sm">
                                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                <input
                                    type="month"
                                    className="border-none text-xs text-gray-700 py-2 focus:ring-0"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">No</th>
                                        <th className="px-6 py-4 w-32">Tanggal</th>
                                        <th className="px-6 py-4">Kegiatan</th>
                                        <th className="px-6 py-4 w-24 text-center">Persentase</th>
                                        <th className="px-6 py-4 w-28 text-center">Total Berkas</th>
                                        <th className="px-6 py-4 w-32 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map((log, index) => (
                                            <tr key={log.id} className="hover:bg-emerald-50/30 transition group align-top">
                                                <td className="px-6 py-5 text-xs text-gray-500 font-medium text-center">{index + 1}</td>
                                                <td className="px-6 py-5 text-xs text-emerald-700 font-bold">
                                                    {new Date(log.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                                                        {log.kegiatan}
                                                    </p>
                                                    {log.files && log.files.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {log.files.map((f: any) => (
                                                                <a
                                                                    key={f.id}
                                                                    href={`/storage/${f.file_path}`}
                                                                    target="_blank"
                                                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[9px] font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition truncate max-w-[150px]"
                                                                    title={f.file_name}
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                    {f.file_name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-black text-gray-900">{log.persentase}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold ml-1">%</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                                                        {log.files ? log.files.length : 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(log)}
                                                            className="p-1.5 bg-white border border-gray-200 text-amber-500 rounded hover:bg-amber-50 hover:border-amber-200 transition shadow-sm"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12.000 21H8v-4l9.586-9.586z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Hapus catatan ini?')) {
                                                                    router.delete(route('dosen.pengabdian.catatan-harian.destroy', log.id));
                                                                }
                                                            }}
                                                            className="p-1.5 bg-white border border-gray-200 text-red-500 rounded hover:bg-red-50 hover:border-red-200 transition shadow-sm"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic text-sm">
                                                Belum ada catatan harian untuk {selectedMonth ? 'bulan ini' : 'proyek ini'}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <CatatanModal
                    usulanId={usulan.id}
                    log={editingLog}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <Footer />
        </div>
    );
}

function CatatanModal({ usulanId, log, onClose }: { usulanId: number, log?: any, onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        usulan_id: usulanId,
        tanggal: log?.tanggal || new Date().toISOString().split('T')[0],
        kegiatan: log?.kegiatan || '',
        persentase: log?.persentase || 0,
        files: [] as File[],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (log) {
            post(route('dosen.pengabdian.catatan-harian.update', log.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true
            });
        } else {
            post(route('dosen.pengabdian.catatan-harian.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('files', Array.from(e.target.files));
        }
    };

    const deleteFile = (fileId: number) => {
        if (confirm('Hapus file ini?')) {
            router.delete(route('dosen.pengabdian.catatan-harian.file.destroy', fileId), {
                preserveScroll: true
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-tight">
                        Catatan Harian - Form
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal</label>
                            <input
                                type="date"
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                                value={data.tanggal}
                                onChange={e => setData('tanggal', e.target.value)}
                                required
                            />
                            {errors.tanggal && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.tanggal}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Persentase (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0" max="100"
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm pr-10 text-right font-black"
                                    value={data.persentase}
                                    onChange={e => setData('persentase', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <span className="absolute right-3 inset-y-0 flex items-center text-gray-400 font-bold text-xs">%</span>
                            </div>
                            {errors.persentase && <p className="text-red-500 text-[10px] mt-1 font-bold text-right">{errors.persentase}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Uraian Kegiatan</label>
                        <textarea
                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm min-h-[120px]"
                            placeholder="Deskripsikan kegiatan yang telah dilakukan..."
                            value={data.kegiatan}
                            onChange={e => setData('kegiatan', e.target.value)}
                            required
                        />
                        {errors.kegiatan && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.kegiatan}</p>}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Unggah Dokumen</label>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-emerald-600 hover:text-emerald-800 transition"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                multiple
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Existing Files for Edit */}
                        {log?.files && log.files.length > 0 && (
                            <div className="space-y-2 mb-3">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Berkas Tersimpan:</p>
                                {log.files.map((f: any) => (
                                    <div key={f.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100 group">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <span className="text-[11px] text-gray-600 truncate font-medium">{f.file_name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => deleteFile(f.id)}
                                            className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Newly Selected Files */}
                        {data.files.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Berkas Baru:</p>
                                {data.files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414l1.293-1.293V13H5.5z" /><path d="M9 13h2v5a1 1 0 11-2 0v-5z" /></svg>
                                            <span className="text-[11px] text-emerald-700 truncate font-black">{file.name}</span>
                                            <span className="text-[9px] text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('files', data.files.filter((_, idx) => idx !== i))}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.files.length === 0 && (!log?.files || log.files.length === 0) && (
                            <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                                <p className="text-[11px] text-gray-400 font-medium">Belum ada berkas pendamping terpilih</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-400 text-white rounded-lg text-sm font-bold hover:bg-gray-500 transition shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-10 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
