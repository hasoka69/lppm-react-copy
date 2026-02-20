import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    FileText,
    Upload,
    Download,
    CheckCircle2,
    Layout,
    History,
    ArrowLeft,
    Plus,
    Edit,
    ExternalLink,
    Paperclip,
    Calendar,
    BadgeCheck,
    Info,
    X,
    Save,
    ArrowRight,
    Search,
    AlertCircle,
    Globe,
    FileSearch,
    FileCheck,
    Video,
    Image as ImageIcon,
    Smartphone,
    Eye
} from 'lucide-react';
import { formatAcademicYear } from '@/utils/academicYear';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { createPortal } from 'react-dom';

const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.3 }
    }
};

interface Props {
    usulan: any;
    laporan_akhir: any;
    outputs: any[];
    isAdminView?: boolean;
}

export default function Detail({ usulan, laporan_akhir, outputs, isAdminView = false }: Props) {
    const { flash }: any = usePage().props;
    const fileLaporanRef = useRef<HTMLInputElement>(null);
    const filePosterRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        ringkasan: laporan_akhir?.ringkasan || '',
        keyword: laporan_akhir?.keyword || '',
        url_video: laporan_akhir?.url_video || '',
        file_laporan: null as File | null,
        file_poster: null as File | null,
    });

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.pengabdian.laporan-akhir.submit', usulan.id), {
            onSuccess: () => toast.success('Draft laporan akhir pengabdian berhasil disimpan.'),
            forceFormData: true,
        });
    };

    const handleFinalisasi = () => {
        if (confirm('Review kembali semua data dan dokumen. Setelah finalisasi, laporan akhir pengabdian tidak dapat diubah kembali. Lanjutkan?')) {
            router.post(route('dosen.pengabdian.laporan-akhir.submit', usulan.id), {
                _method: 'POST',
                is_final: true
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Head title={`Laporan Akhir - ${usulan.judul}`} />
            <Header />

            {/* Professional Tab Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                            { label: 'Daftar Pengabdian', route: isAdminView ? route('lppm.pengabdian.index') : '/dosen/pengabdian' },
                            { label: 'Perbaikan Usulan', route: isAdminView ? route('lppm.pengabdian.perbaikan') : '/dosen/pengabdian/perbaikan' },
                            { label: 'Laporan Kemajuan', route: isAdminView ? route('lppm.pengabdian.laporan-kemajuan') : route('dosen.pengabdian.laporan-kemajuan.index') },
                            { label: 'Catatan Harian', route: isAdminView ? route('lppm.pengabdian.catatan-harian') : route('dosen.pengabdian.catatan-harian.index') },
                            { label: 'Laporan Akhir', active: true, route: isAdminView ? route('lppm.pengabdian.laporan-akhir') : route('dosen.pengabdian.laporan-akhir.index') },
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
                    <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                            <Link
                                href={isAdminView ? route('lppm.pengabdian.laporan-akhir') : route('dosen.pengabdian.laporan-akhir.index')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Laporan <span className="text-blue-600 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Akhir</span>
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium uppercase tracking-[0.05em]">Modul Pengabdian</p>
                        </div>

                        {/* Proposal Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative group overflow-hidden w-full">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-md border border-amber-100">Pengabdian</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-400 text-[11px] font-medium tracking-wide uppercase">{usulan.kelompok_skema}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                                    {usulan.judul}
                                </h2>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui || usulan.total_anggaran || 0)}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${laporan_akhir?.status === 'Submitted' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                    Status: {laporan_akhir?.status === 'Submitted' ? 'Sudah Final' : 'Draft / Belum Final'}
                                </div>
                                <div className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </div>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                {/* Section 1: Metadata */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 font-bold text-gray-700 text-sm flex items-center gap-2">
                                        <FileSearch className="w-4 h-4 text-blue-600" />
                                        Ringkasan & Berkas Laporan Akhir
                                    </div>
                                    <div className="p-10 space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ringkasan Pengabdian (Laporan Akhir)</label>
                                            <textarea
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 py-4 px-6 text-sm font-medium min-h-[200px] transition-all leading-relaxed"
                                                value={data.ringkasan}
                                                onChange={e => setData('ringkasan', e.target.value)}
                                                placeholder="Berikan ringkasan komprehensif mengenai hasil akhir pelaksanaan pengabdian..."
                                                required
                                                readOnly={isAdminView}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Kunci Akhir</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 py-3.5 px-6 text-sm font-semibold transition-all"
                                                    value={data.keyword}
                                                    onChange={e => setData('keyword', e.target.value)}
                                                    placeholder="Contoh: Pemberdayaan, Implementasi, Hasil"
                                                    required
                                                    readOnly={isAdminView}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unggah Laporan Akhir (PDF)</label>
                                                <div className="flex gap-2">
                                                    <input type="file" ref={fileLaporanRef} className="hidden" onChange={e => setData('file_laporan', e.target.files?.[0] || null)} accept=".pdf" />
                                                    <button type="button" onClick={() => !isAdminView && fileLaporanRef.current?.click()} className={`flex-1 bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-600 transition-all text-left flex items-center justify-between ${isAdminView ? 'cursor-not-allowed' : 'hover:bg-white hover:border-blue-500 hover:text-blue-600'}`}>
                                                        <span className="truncate">{data.file_laporan ? data.file_laporan.name : 'Pilih Laporan Akhir (PDF)'}</span>
                                                        <Upload className="w-4 h-4 opacity-40" />
                                                    </button>
                                                    {laporan_akhir?.file_laporan && (
                                                        <a href={`/storage/${laporan_akhir.file_laporan}`} target="_blank" className="bg-blue-50 text-blue-600 px-4 py-3.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all flex items-center">
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Luaran Akhir */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-6 bg-blue-600 rounded-full" />
                                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Realisasi Luaran <span className="text-blue-600">Wajib Akhir</span></h3>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-gray-50">
                                                        <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">No</th>
                                                        <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Capaian</th>
                                                        <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status & Dokumen</th>
                                                        <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-40 text-center">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {outputs.map((output, idx) => (
                                                        <OutputRow key={output.id} output={output} index={idx + 1} isAdminView={isAdminView} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: Poster & Video */}
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Poster Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-indigo-500" />
                                                Poster Diseminasi
                                            </h3>
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                            {laporan_akhir?.file_poster ? (
                                                <div className="relative group/poster">
                                                    <div className="w-48 h-64 bg-gray-50 rounded-xl overflow-hidden shadow-md border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                                                        <img src={`/storage/${laporan_akhir.file_poster}`} className="w-full h-full object-cover" alt="Poster" />
                                                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                            <a href={`/storage/${laporan_akhir.file_poster}`} target="_blank" className="p-3 bg-white text-gray-900 rounded-xl shadow-lg hover:scale-110 transition-transform">
                                                                <Eye className="w-5 h-5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-200">
                                                    <ImageIcon className="w-12 h-12" />
                                                </div>
                                            )}

                                            <div className="space-y-4 w-full">
                                                <div className="text-center">
                                                    <p className="text-[13px] font-bold text-gray-700">Unggah Poster Pengabdian</p>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Image format (JPG/PNG) • Max 5MB</p>
                                                </div>
                                                <input type="file" ref={filePosterRef} className="hidden" onChange={e => setData('file_poster', e.target.files?.[0] || null)} accept="image/*" />
                                                <button
                                                    type="button"
                                                    onClick={() => !isAdminView && filePosterRef.current?.click()}
                                                    className={`w-full py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all shadow-sm ${isAdminView ? 'cursor-not-allowed' : 'hover:bg-indigo-600 hover:text-white'}`}
                                                >
                                                    {data.file_poster ? 'File Dipilih ✓' : 'Pilih File Gambar'}
                                                </button>
                                                {data.file_poster && <p className="text-[10px] text-indigo-500 font-bold">{data.file_poster.name}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Video className="w-4 h-4 text-rose-500" />
                                                Tautan Video Kegiatan
                                            </h3>
                                        </div>
                                        <div className="p-8 flex-1 space-y-8 flex flex-col justify-center">
                                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex items-start gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <p className="text-[12px] text-rose-700 font-medium leading-relaxed">
                                                    Sertakan tautan video (YouTube/Google Drive) yang mendemonstrasikan pelaksanaan atau hasil dari kegiatan pengabdian masyarakat.
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">URL Video Kegiatan</label>
                                                <div className="relative">
                                                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                    <input
                                                        type="url"
                                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-rose-500/5 transition-all"
                                                        value={data.url_video}
                                                        onChange={e => setData('url_video', e.target.value)}
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        readOnly={isAdminView}
                                                    />
                                                </div>
                                                {laporan_akhir?.url_video && (
                                                    <a href={laporan_akhir.url_video} target="_blank" className="inline-flex items-center gap-2 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                                                        <Eye className="w-3.5 h-3.5" /> Lihat Video Terpasang
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    {!isAdminView && (
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all"
                                            >
                                                {processing ? '...' : 'Simpan Draft'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleFinalisasi}
                                                className="px-14 py-4 bg-blue-600 text-white rounded-xl text-sm font-extrabold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3"
                                            >
                                                Finalisasi Laporan
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </form>
                        <Toaster />
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div >
    );
}

function OutputRow({ output, index, isAdminView = false }: { output: any, index: number, isAdminView?: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const isReadOnly = isAdminView;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        judul_realisasi: output.judul_realisasi || '',
        status: output.status || 'Rencana',
        peran_penulis: output.peran_penulis || '',
        nama_jurnal: output.nama_jurnal || '',
        issn: output.issn || '',
        // pengindek: output.pengindek || '', // Removed
        // tahun_realisasi: output.tahun_realisasi || '', // Removed
        volume: output.volume || '',
        nomor: output.nomor || '',
        halaman_awal: output.halaman_awal || '',
        halaman_akhir: output.halaman_akhir || '',
        url_bukti: output.url_bukti || '',
        url_artikel: output.url_artikel || '',
        doi: output.doi || '',
        keterangan: output.keterangan || '',
        // file_bukti: null as File | null, // Removed
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.pengabdian.laporan-akhir.luaran.update', output.id), {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Capaian luaran wajib pengabdian berhasil diperbarui.');
            },
            forceFormData: true,
        });
    };

    return (
        <>

            <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-blue-50/20 transition-all align-top group"
            >
                <td className="px-8 py-8 text-sm text-gray-400 font-bold text-center opacity-40">{index.toString().padStart(2, '0')}</td>
                <td className="px-8 py-8">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                            {output.kategori}
                        </span>
                        <p className="text-[13px] font-bold text-gray-800 leading-relaxed italic line-clamp-2">
                            {output.deskripsi}
                        </p>
                    </div>
                </td>
                <td className="px-8 py-8">
                    <div className="space-y-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${output.status === 'Published' || output.status === 'LOA' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {output.status}
                        </div>
                        {output.judul_realisasi && (
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl group-hover:bg-white transition-colors">
                                <p className="text-[12px] text-gray-700 font-bold leading-snug">{output.judul_realisasi}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    {output.file_bukti && (
                                        <a href={`/storage/${output.file_bukti}`} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Dokumen Bukti</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-8 py-8 text-center">
                    {!isReadOnly ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                        >
                            <Edit className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group/view"
                        >
                            <Eye className="w-4 h-4 text-gray-400 group-hover/view:text-white" />
                        </button>
                    )}
                </td>
            </motion.tr>

            {createPortal(
                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditing(false)}
                                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 border border-gray-100"
                            >
                                <div className="px-10 py-6 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
                                            <BadgeCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">Capaian Akhir Luaran</h3>
                                            <p className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-0.5">Dokumentasi Luaran Wajib Pengabdian</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Artikel</label>
                                            <textarea
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 py-4 px-6 text-sm font-medium min-h-[100px] transition-all"
                                                value={data.judul_realisasi}
                                                onChange={e => setData('judul_realisasi', e.target.value)}
                                                placeholder="Masukkan judul artikel..."
                                                readOnly={isAdminView}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status Capaian Akhir</label>
                                            <select
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                disabled={isAdminView}
                                            >
                                                <option value="Submit">Submit</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="LOA">LOA</option>
                                                <option value="Published">Published</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Peran Penulis</label>
                                            <select
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold"
                                                value={data.peran_penulis}
                                                onChange={e => setData('peran_penulis', e.target.value)}
                                                disabled={isAdminView}
                                            >
                                                <option value="">-- Pilih Peran --</option>
                                                <option value="Penulis Pertama">Penulis Pertama</option>
                                                <option value="Penulis Pendamping">Penulis Pendamping</option>
                                                <option value="Penulis Korespondensi">Penulis Korespondensi</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Jurnal</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold"
                                                value={data.nama_jurnal}
                                                onChange={e => setData('nama_jurnal', e.target.value)}
                                                placeholder="Nama Jurnal..."
                                                readOnly={isAdminView}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">ISSN / ISBN / No. Sertifikat</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold"
                                                value={data.issn}
                                                onChange={e => setData('issn', e.target.value)}
                                                placeholder="XXXX-XXXX"
                                                readOnly={isAdminView}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kategori Luaran</label>
                                            <div className="w-full bg-gray-100 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold text-gray-500 cursor-not-allowed">
                                                {output.kategori}
                                            </div>
                                        </div>

                                        {/* Removed Tahun Realisasi and Bukti Unggah where applicable */}

                                        <div className="md:col-span-2 pt-6 flex justify-end gap-3">
                                            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 text-[13px] font-bold text-gray-400 hover:text-gray-700 transition-colors">
                                                {isAdminView ? 'Tutup' : 'Batalkan'}
                                            </button>
                                            {!isAdminView && (
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={processing}
                                                    className="px-14 py-3 bg-blue-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                                                >
                                                    {processing ? '...' : <Save className="w-4 h-4" />}
                                                    Simpan Capaian Luaran
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );

}
