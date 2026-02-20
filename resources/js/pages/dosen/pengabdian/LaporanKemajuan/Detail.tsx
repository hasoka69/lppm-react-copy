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
    ChevronDown,
    ChevronUp,
    Briefcase,
    Globe,
    FileSearch,
    FileCheck,
    Eye
} from 'lucide-react';
import { formatAcademicYear } from '@/utils/academicYear';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
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
    laporan_kemajuan: any;
    outputs: any[];
    isAdminView?: boolean;
}

export default function Detail({ usulan, laporan_kemajuan, outputs, isAdminView = false }: Props) {
    const { flash }: any = usePage().props;
    const fileLaporanRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        ringkasan: laporan_kemajuan?.ringkasan || '',
        keyword: laporan_kemajuan?.keyword || '',
        file_laporan: null as File | null,
    });

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.pengabdian.laporan-kemajuan.update', usulan.id), {
            onSuccess: () => toast.success('Draft laporan kemajuan pengabdian berhasil disimpan.'),
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Head title={`Laporan Kemajuan - ${usulan.judul}`} />
            <Header />

            {/* Professional Tab Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                            { label: 'Daftar Pengabdian', route: isAdminView ? route('lppm.pengabdian.index') : '/dosen/pengabdian' },
                            { label: 'Perbaikan Usulan', route: isAdminView ? route('lppm.pengabdian.perbaikan') : '/dosen/pengabdian/perbaikan' },
                            { label: 'Laporan Kemajuan', active: true, route: isAdminView ? route('lppm.pengabdian.laporan-kemajuan') : route('dosen.pengabdian.laporan-kemajuan.index') },
                            { label: 'Catatan Harian', route: isAdminView ? route('lppm.pengabdian.catatan-harian') : route('dosen.pengabdian.catatan-harian.index') },
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
                    <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                            <Link
                                href={isAdminView ? route('lppm.pengabdian.laporan-kemajuan') : route('dosen.pengabdian.laporan-kemajuan.index')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Laporan <span className="text-blue-600 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Kemajuan</span>
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
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${laporan_kemajuan?.status === 'Submitted' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                    Status: {laporan_kemajuan?.status === 'Submitted' ? 'Sudah Final' : 'Draft / Belum Final'}
                                </div>
                                <div className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    Tahun: {formatAcademicYear(usulan.tahun_pertama)}
                                </div>
                            </div>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Metadata Section */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <FileSearch className="w-4 h-4 text-blue-500" />
                                        Data Laporan & Ringkasan
                                    </h3>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ringkasan Pengabdian (Laporan Kemajuan)</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 py-4 px-6 text-sm font-medium min-h-[180px] transition-all leading-relaxed"
                                                value={data.ringkasan}
                                                onChange={e => setData('ringkasan', e.target.value)}
                                                placeholder="Tuliskan ringkasan hasil pengabdian selama periode ini..."
                                                required
                                                readOnly={isAdminView}
                                            />
                                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-300">
                                                {data.ringkasan.length} Karakter
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Kunci (Pisahkan dengan koma)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 py-3.5 px-6 text-sm font-semibold transition-all"
                                                value={data.keyword}
                                                onChange={e => setData('keyword', e.target.value)}
                                                placeholder="Contoh: Pemberdayaan, Desa, Lingkungan"
                                                required
                                                readOnly={isAdminView}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unggah Berkas Laporan (PDF)</label>
                                            <div className="flex gap-2">
                                                <input type="file" ref={fileLaporanRef} className="hidden" onChange={e => setData('file_laporan', e.target.files?.[0] || null)} accept=".pdf" />
                                                <button type="button" onClick={() => !isAdminView && fileLaporanRef.current?.click()} className={`flex-1 bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-600 transition-all text-left flex items-center justify-between ${isAdminView ? 'cursor-not-allowed' : 'hover:bg-white hover:border-blue-500 hover:text-blue-600'}`}>
                                                    <span className="truncate">{data.file_laporan ? data.file_laporan.name : 'Pilih Berkas PDF'}</span>
                                                    <Upload className="w-4 h-4 opacity-40" />
                                                </button>
                                                {laporan_kemajuan?.file_laporan && (
                                                    <a href={`/storage/${laporan_kemajuan.file_laporan}`} target="_blank" className="bg-blue-50 text-blue-600 px-4 py-3.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all flex items-center">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Luaran Section */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 bg-blue-600 rounded-full" />
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Capaian Luaran <span className="text-blue-600">Terjanjikan</span></h3>
                                    </div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                        Total: {outputs.length} Item
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-50">
                                                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">No</th>
                                                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori Luaran</th>
                                                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target & Deskripsi</th>
                                                    <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-40 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {outputs.map((output, idx) => (
                                                    <OutputRow
                                                        key={output.id}
                                                        output={output}
                                                        index={idx + 1}
                                                        isAdminView={isAdminView}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            <div className="flex gap-4 justify-end pt-6">
                                {!isAdminView && (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-sm"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Draft'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm('Review kembali semua data. Setelah finalisasi, data tidak dapat diubah. Lanjutkan?')) {
                                                    post(route('dosen.pengabdian.laporan-kemajuan.submit', usulan.id));
                                                }
                                            }}
                                            className="px-12 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3"
                                        >
                                            Finalisasi Laporan
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </form>
                    <Toaster />
                </motion.div>
            </main>

            <Footer />
        </div>
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
        post(route('dosen.pengabdian.laporan-kemajuan.luaran.update', output.id), {
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
                <td className="px-8 py-7 text-sm text-gray-400 font-bold text-center opacity-50">{index.toString().padStart(2, '0')}</td>
                <td className="px-8 py-7">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                            {output.kategori}
                        </span>
                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${output.status === 'Published' || output.status === 'LOA' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {output.status}
                        </div>
                    </div>
                </td>
                <td className="px-8 py-7">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed line-clamp-2 italic">
                            {output.deskripsi}
                        </p>
                        {output.judul_realisasi && (
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl group-hover:bg-white transition-colors">
                                <p className="text-[13px] text-gray-700 font-bold leading-snug">{output.judul_realisasi}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    {output.file_bukti && (
                                        <a href={`/storage/${output.file_bukti}`} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Berkas Bukti</span>
                                        </a>
                                    )}
                                    {output.url_bukti && (
                                        <a href={output.url_bukti} target="_blank" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors">
                                            <Globe className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Tautan</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-8 py-7 text-center">
                    {!isReadOnly ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm shadow-blue-900/5 group"
                        >
                            <Edit className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-white border border-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group/view">
                            <Eye className="w-4 h-4 text-gray-400 group-hover/view:text-white" />
                        </button>
                    )}
                </td>
            </motion.tr>

            <AnimatePresence>
                {isEditing && (
                    <tr>
                        <td>
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
                                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                                <FileCheck className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">Realisasi Capaian</h3>
                                                <p className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-0.5">Laporan Kemajuan Pengabdian</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 text-white rounded-xl transition-all">
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
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status Capaian</label>
                                                <select
                                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5"
                                                    value={data.status}
                                                    onChange={e => setData('status', e.target.value)}
                                                    disabled={isAdminView}
                                                >
                                                    <option value="Rencana">Rencana</option>
                                                    <option value="Submit">Submit</option>
                                                    <option value="Under Review">Under Review</option>
                                                    <option value="LOA">LOA</option>
                                                    <option value="Published">Published</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Peran Penulis</label>
                                                <select
                                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5"
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
                                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5"
                                                    value={data.nama_jurnal}
                                                    onChange={e => setData('nama_jurnal', e.target.value)}
                                                    placeholder="Nama Jurnal..."
                                                    readOnly={isAdminView}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">ISSN / ISBN</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/5"
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
                                                        className="px-12 py-3 bg-blue-600 text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                                    >
                                                        {processing ? '...' : <Save className="w-4 h-4" />}
                                                        Simpan Capaian
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
}
