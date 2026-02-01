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
    Star,
    Layers,
    Share2,
    BookOpen
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
    mandatory_outputs: any[];
    additional_outputs: any[];
    isAdminView?: boolean;
}

export default function Detail({ usulan, mandatory_outputs = [], additional_outputs = [], isAdminView = false }: Props) {
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const [editingOutput, setEditingOutput] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Head title={`Pengkinian Luaran - ${usulan.judul}`} />
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
                            { label: 'Laporan Akhir', route: isAdminView ? route('lppm.pengabdian.laporan-akhir') : route('dosen.pengabdian.laporan-akhir.index') },
                            { label: 'Pengkinian Capaian Luaran', active: true, route: isAdminView ? route('lppm.pengabdian.pengkinian-luaran') : route('dosen.pengabdian.pengkinian-luaran.index') }
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
                    className="space-y-10"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <Link
                                href={isAdminView ? route('lppm.pengabdian.pengkinian-luaran') : route('dosen.pengabdian.pengkinian-luaran.index')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Pengkinian <span className="text-blue-600 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Luaran</span>
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium uppercase tracking-[0.05em]">Modul Pengabdian</p>
                        </div>

                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Luaran</span>
                                <span className="text-lg font-extrabold text-gray-900 leading-tight">{mandatory_outputs.length + additional_outputs.length} Item</span>
                            </div>
                            <div className="w-px h-8 bg-gray-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tahun</span>
                                <span className="text-lg font-extrabold text-blue-600 leading-tight">{usulan.tahun_pertama}</span>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative group overflow-hidden">
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
                                DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(usulan.dana_disetujui || 0)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-100 shadow-sm flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" />
                                VALIDASI CAPAIAN AKTIF
                            </div>
                        </div>
                    </div>

                    {/* Mandatory Outputs Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-100">
                                <Star className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Luaran <span className="text-blue-600">Terjanjikan</span></h3>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">No</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori & Target</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Realisasi & Dokumen</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-40 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {mandatory_outputs.map((output, idx) => (
                                            <OutputRow
                                                key={output.id}
                                                output={output}
                                                index={idx + 1}
                                                isReadOnly={isAdminView}
                                                type="pengabdian"
                                                onEdit={() => setEditingOutput(output)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Additional Outputs Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
                                <Plus className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Luaran <span className="text-indigo-600">Tambahan</span></h3>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">No</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori & Target</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Realisasi & Dokumen</th>
                                            <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-40 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {additional_outputs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40 grayscale">
                                                        <Layers className="w-10 h-10 text-gray-400" />
                                                        <p className="text-sm font-bold text-gray-500 italic">Belum ada luaran tambahan yang ditambahkan</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            additional_outputs.map((output, idx) => (
                                                <OutputRow
                                                    key={output.id}
                                                    output={output}
                                                    index={idx + 1}
                                                    isReadOnly={isAdminView}
                                                    type="pengabdian"
                                                    onEdit={() => setEditingOutput(output)}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </main>

            <EditOutputModal
                isOpen={!!editingOutput}
                onClose={() => setEditingOutput(null)}
                output={editingOutput}
                type="pengabdian"
            />

            <Footer />
            <Toaster />
        </div>
    );
}

function OutputRow({ output, index, isReadOnly, type, onEdit }: { output: any, index: number, isReadOnly: boolean, type: string, onEdit: () => void }) {
    return (
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
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${output.status === 'Published' || output.status === 'Accepted' || output.status === 'Granted' || output.status === 'Ready' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm'}`}>
                        {output.status}
                    </div>
                    {output.judul_realisasi && (
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl group-hover:bg-white transition-colors">
                            <p className="text-[12px] text-gray-700 font-bold leading-snug">{output.judul_realisasi}</p>
                            <div className="flex items-center gap-4 mt-3">
                                {output.file_bukti && (
                                    <a href={`/storage/${output.file_bukti}`} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Berkas Realisasi</span>
                                    </a>
                                )}
                                {output.url_artikel && (
                                    <a href={output.url_artikel} target="_blank" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Tautan Publikasi/Produk</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-8 py-8 text-center text-right">
                {!isReadOnly ? (
                    <button
                        onClick={onEdit}
                        className="bg-white border border-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                    >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                ) : (
                    <BadgeCheck className="w-6 h-6 text-blue-500 mx-auto" />
                )}
            </td>
        </motion.tr>
    );
}

function EditOutputModal({ isOpen, onClose, output, type }: { isOpen: boolean, onClose: () => void, output: any, type: string }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        judul_realisasi: '',
        status: 'Rencana',
        peran_penulis: '',
        nama_jurnal: '',
        issn: '',
        pengindek: '',
        tahun_realisasi: '',
        volume: '',
        nomor: '',
        halaman_awal: '',
        halaman_akhir: '',
        url_bukti: '',
        url_artikel: '',
        doi: '',
        keterangan: '',
        file_bukti: null as File | null,
    });

    useEffect(() => {
        if (output && isOpen) {
            setData({
                judul_realisasi: output.judul_realisasi || '',
                status: output.status || 'Rencana',
                peran_penulis: output.peran_penulis || '',
                nama_jurnal: output.nama_jurnal || '',
                issn: output.issn || '',
                pengindek: output.pengindek || '',
                tahun_realisasi: output.tahun_realisasi || '',
                volume: output.volume || '',
                nomor: output.nomor || '',
                halaman_awal: output.halaman_awal || '',
                halaman_akhir: output.halaman_akhir || '',
                url_bukti: output.url_bukti || '',
                url_artikel: output.url_artikel || '',
                doi: output.doi || '',
                keterangan: output.keterangan || '',
                file_bukti: null,
            });
        }
    }, [output, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(`dosen.${type}.pengkinian-luaran.luaran.update`, output.id), {
            onSuccess: () => {
                onClose();
                toast.success('Pengkinian luaran pengabdian berhasil diperbarui.');
            },
            forceFormData: true,
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                >
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
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 border border-gray-100"
                    >
                        <div className="px-10 py-6 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
                                    <Share2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Pengkinian Realisasi Luaran</h3>
                                    <p className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-0.5">Detail & Dokumentasi Bukti Pengabdian</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Realisasi / Artikel / Produk Lengkap</label>
                                    <textarea
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 py-4 px-6 text-sm font-medium min-h-[100px] transition-all"
                                        value={data.judul_realisasi}
                                        onChange={e => setData('judul_realisasi', e.target.value)}
                                        placeholder="Masukkan judul lengkap luaran yang dihasilkan..."
                                    />
                                    {errors.judul_realisasi && <div className="text-red-500 text-xs mt-1">{errors.judul_realisasi}</div>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status Capaian Sa'at Ini</label>
                                    <select className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.status} onChange={e => setData('status', e.target.value)}>
                                        <option value="Rencana">Rencana</option>
                                        <option value="Draft">Draft/In Preparation</option>
                                        <option value="Ready">Ready/Terlaksana</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Published">Published</option>
                                    </select>
                                    {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Peran Pelaksana / Ketua / Penulis</label>
                                    <select
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold"
                                        value={data.peran_penulis}
                                        onChange={e => setData('peran_penulis', e.target.value)}
                                    >
                                        <option value="">Pilih Peran...</option>
                                        <option value="Ketua Pelaksana">Ketua Pelaksana</option>
                                        <option value="Anggota Pelaksana">Anggota Pelaksana</option>
                                        <option value="Penulis Pertama">Penulis Pertama</option>
                                        <option value="Penulis Pendamping">Penulis Pendamping</option>
                                        <option value="Penulis Korespondensi">Penulis Korespondensi</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Jurnal / Lokasi / Media</label>
                                    <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.nama_jurnal} onChange={e => setData('nama_jurnal', e.target.value)} placeholder="Nama Media/Lembaga/Lokasi..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">ISSN / ISBN / No. Sertifikat</label>
                                    <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.issn} onChange={e => setData('issn', e.target.value)} placeholder="XXXX-XXXX" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lembaga Pengindek (Jika ada)</label>
                                    <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.pengindek} onChange={e => setData('pengindek', e.target.value)} placeholder="Contoh: Sinta 3, Scopus" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tahun Realisasi</label>
                                    <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.tahun_realisasi} onChange={e => setData('tahun_realisasi', e.target.value)} placeholder="2026" />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Volume</label>
                                        <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.volume} onChange={e => setData('volume', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor</label>
                                        <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-6 text-sm font-bold" value={data.nomor} onChange={e => setData('nomor', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Halaman</label>
                                        <div className="flex items-center gap-2">
                                            <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-4 text-sm font-bold" value={data.halaman_awal} onChange={e => setData('halaman_awal', e.target.value)} placeholder="Awal" />
                                            <span className="text-gray-300">-</span>
                                            <input type="text" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 px-4 text-sm font-bold" value={data.halaman_akhir} onChange={e => setData('halaman_akhir', e.target.value)} placeholder="Akhir" />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">URL Publikasi / Video / Produk (Jika ada)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input type="url" className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all" value={data.url_artikel} onChange={e => setData('url_artikel', e.target.value)} placeholder="https://..." />
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6 border-t border-gray-50">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-3">Unggah Berkas Bukti Luaran (PDF)</label>
                                    <div className="bg-gray-50/50 p-8 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4 hover:bg-white hover:border-blue-400 transition-all group/up">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover/up:text-blue-600 transition-colors">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[13px] font-bold text-gray-700">Pilih Berkas Bukti (PDF)</p>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Maksimal Ukuran: 10MB</p>
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={e => setData('file_bukti', e.target.files?.[0] || null)} accept=".pdf" />
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-8 py-2.5 bg-white border border-gray-900 text-gray-900 rounded-xl text-[11px] font-bold hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                                {data.file_bukti ? 'Ganti File ✓' : 'Pilih Berkas'}
                                            </button>
                                            {output.file_bukti && (
                                                <a href={`/storage/${output.file_bukti}`} target="_blank" className="px-8 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-all border border-blue-100 flex items-center gap-2">
                                                    <Search className="w-3.5 h-3.5" /> Lihat Terunggah
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6 flex justify-end gap-3">
                                    <button type="button" onClick={onClose} className="px-8 py-3 text-[13px] font-bold text-gray-400 hover:text-gray-700 transition-colors">Batalkan</button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="px-14 py-3 bg-blue-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                                    >
                                        {processing ? '...' : <Save className="w-4 h-4" />}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
