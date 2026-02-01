import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    Calendar,
    ArrowLeft,
    Plus,
    FileText,
    History,
    CheckCircle2,
    CalendarDays,
    Upload,
    Paperclip,
    ExternalLink,
    AlertCircle,
    Info,
    Edit,
    Trash2,
    X,
    Save,
    ChevronLeft,
    ChevronRight,
    Search,
    Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

interface Props {
    usulan: any;
    logs: any[];
    months: string[];
    selectedMonth: string;
    isAdminView?: boolean;
}

export default function Show({ usulan, logs, months, selectedMonth, isAdminView = false }: Props) {
    const { flash }: any = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<any>(null);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleMonthChange = (month: string) => {
        router.visit(route('dosen.pengabdian.catatan-harian.show', {
            id: usulan.id,
            month: month
        }), { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            router.delete(route('dosen.pengabdian.catatan-harian.delete', id), {
                onSuccess: () => toast.success('Catatan berhasil dihapus')
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Head title={`Catatan Harian - ${usulan.judul}`} />
            <Header />

            {/* Professional Tab Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                            { label: 'Daftar Pengabdian', route: isAdminView ? route('lppm.pengabdian.index') : route('dosen.pengabdian.index') },
                            { label: 'Perbaikan Usulan', route: isAdminView ? route('lppm.pengabdian.perbaikan') : route('dosen.pengabdian.perbaikan') },
                            { label: 'Laporan Kemajuan', route: isAdminView ? route('lppm.pengabdian.laporan-kemajuan') : route('dosen.pengabdian.laporan-kemajuan.index') },
                            { label: 'Catatan Harian', active: true, route: isAdminView ? route('lppm.pengabdian.catatan-harian') : route('dosen.pengabdian.catatan-harian.index') },
                            { label: 'Laporan Akhir', route: isAdminView ? route('lppm.pengabdian.laporan-akhir') : route('dosen.pengabdian.laporan-akhir.index') },
                            { label: 'Pengkinian Capaian Luaran', route: isAdminView ? route('lppm.pengabdian.pengkinian-luaran') : route('dosen.pengabdian.pengkinian-luaran.index') }
                        ].map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => tab.route !== '#' && router.visit(tab.route)}
                                className={`px-5 py-4 text-[13px] font-semibold transition-all whitespace-nowrap relative ${tab.active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.label}
                                {tab.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <Link
                                href={isAdminView ? route('lppm.pengabdian.catatan-harian') : route('dosen.pengabdian.catatan-harian.index')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Catatan <span className="text-blue-600 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Harian</span>
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium">Log Aktivitas Pengabdian & Perkembangan Program</p>
                        </div>

                        {!isAdminView && (
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setEditingLog(null); setIsModalOpen(true); }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all border border-blue-500/10"
                            >
                                <Plus className="w-4 h-4" /> Tambah Aktivitas
                            </motion.button>
                        )}
                    </div>

                    {/* Proposal Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-md border border-amber-100">Pengabdian</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{usulan.kelompok_skema}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 leading-snug max-w-4xl">
                                {usulan.judul}
                            </h2>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Calendar className="w-3.5 h-3.5" />
                                TAHUN PELAKSANAAN: {usulan.tahun_pertama}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Filter Section */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Month Sidebar */}
                        <div className="w-full md:w-64 space-y-3">
                            <div className="flex items-center gap-2 px-2 text-gray-400 mb-4">
                                <History className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Periode Log</span>
                            </div>
                            <div className="space-y-1">
                                {months.map((month) => (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthChange(month)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-between group
                                            ${selectedMonth === month
                                                ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
                                                : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                                            }`}
                                    >
                                        <span>{month}</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedMonth === month ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Logs Table */}
                        <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Daftar Aktivitas {selectedMonth}
                                </h3>
                                <span className="text-[11px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    {logs.length} Catatan Ditemukan
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white">
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aktivitas & Perkembangan</th>
                                            <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">% Progress</th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-3 grayscale opacity-40">
                                                        <FileText className="w-12 h-12 text-gray-300" />
                                                        <p className="text-sm font-semibold text-gray-400">Belum ada aktivitas tercatat di bulan ini</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <motion.tr
                                                    key={log.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-blue-50/10 transition-colors group"
                                                >
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-900">{new Date(log.tanggal).getDate()}</span>
                                                            <span className="text-[11px] font-semibold text-gray-400 uppercase">{new Date(log.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="space-y-4 max-w-2xl">
                                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{log.uraian_kegiatan}</p>
                                                            {log.supporting_docs && log.supporting_docs.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 pt-2">
                                                                    {log.supporting_docs.map((doc: any, idx: number) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={`/storage/${doc.path}`}
                                                                            target="_blank"
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                                                                        >
                                                                            <Paperclip className="w-3 h-3" /> {doc.name.substring(0, 20)}...
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="text-[13px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                                {log.persentase_capaian}%
                                                            </div>
                                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${log.persentase_capaian}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top text-right">
                                                        {!isAdminView && (
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => { setEditingLog(log); setIsModalOpen(true); }}
                                                                    className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-blue-50"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(log.id)}
                                                                    className="p-2.5 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm border border-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Toaster />
                </motion.div>
            </main>

            <CatatanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                usulanId={usulan.id}
                log={editingLog}
            />

            <Footer />
        </div>
    );
}

function CatatanModal({ isOpen, onClose, usulanId, log }: { isOpen: boolean, onClose: () => void, usulanId: number, log?: any }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: log?.tanggal || new Date().toISOString().split('T')[0],
        uraian_kegiatan: log?.uraian_kegiatan || '',
        persentase_capaian: log?.persentase_capaian || 0,
        files: [] as File[],
        usulan_id: usulanId // Added to ensure valid submission
    });

    useEffect(() => {
        if (log) {
            setData({
                tanggal: log.tanggal,
                uraian_kegiatan: log.uraian_kegiatan,
                persentase_capaian: log.persentase_capaian,
                files: [],
                usulan_id: usulanId
            });
        } else {
            reset();
        }
    }, [log, isOpen, usulanId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = log
            ? route('dosen.pengabdian.catatan-harian.update', log.id)
            : route('dosen.pengabdian.catatan-harian.store', usulanId);

        post(url, {
            onSuccess: () => {
                onClose();
                reset();
                toast.success('Catatan harian pengabdian berhasil disimpan.');
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-gray-100 max-h-[90vh] flex flex-col"
                    >
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                    {log ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{log ? 'Edit Aktivitas' : 'Aktivitas Baru'}</h3>
                                    <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">Catatan Harian Pengabdian</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tanggal Kegiatan</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="date"
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                            value={data.tanggal}
                                            onChange={e => setData('tanggal', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Persentase Capaian</label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                            value={data.persentase_capaian}
                                            onChange={e => setData('persentase_capaian', e.target.value === '' ? '' : (parseInt(e.target.value) || 0))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Uraian Aktivitas & Hasil</label>
                                <textarea
                                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all min-h-[120px] leading-relaxed"
                                    placeholder="Jelaskan secara detail kemajuan pengabdian hari ini..."
                                    value={data.uraian_kegiatan}
                                    onChange={e => setData('uraian_kegiatan', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Dokumen Pendukung (PDF/Images)</label>
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:bg-white hover:border-blue-400 transition-all group/up">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover/up:text-blue-600 transition-colors">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-gray-700">Pilih berkas pendukung</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Multiple files allowed • Max 5MB per file</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        id="catatan-files"
                                        onChange={e => {
                                            const newFiles = Array.from(e.target.files || []);
                                            setData('files', [...data.files, ...newFiles]);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('catatan-files')?.click()}
                                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm"
                                    >
                                        Browse Files
                                    </button>
                                </div>

                                {data.files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {data.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100 shadow-sm">
                                                <Paperclip className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-[120px]">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('files', data.files.filter((_, i) => i !== idx))}
                                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-[13px] font-bold text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    Batalkan
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? '...' : <Save className="w-4 h-4" />}
                                    {log ? 'Update Log' : 'Simpan Log'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
