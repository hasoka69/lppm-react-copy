import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Upload,
    Download,
    CheckCircle2,
    AlertCircle,
    Layout,
    Video,
    History,
    ChevronRight,
    ArrowLeft,
    Plus,
    Edit,
    Youtube,
    ExternalLink,
    Paperclip,
    Check
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const stepVariants = {
    active: { scale: 1.1, backgroundColor: '#2563eb', color: '#fff' },
    inactive: { scale: 1, backgroundColor: '#fff', color: '#94a3b8' },
    completed: { scale: 1, backgroundColor: '#10b981', color: '#fff' }
};

interface Props {
    usulan: any;
    report: any;
    outputs: any[];
}

export default function Detail({ usulan, report, outputs }: Props) {
    const { flash }: any = usePage().props;
    const [activeStep, setActiveStep] = useState(1);
    const sptbInputRef = useRef<HTMLInputElement>(null);
    const reportInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (flash.success) {
            alert(flash.success);
        }
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    const mandatoryOutputs = outputs.filter(o => o.is_wajib);
    const additionalOutputs = outputs.filter(o => !o.is_wajib);

    const { data: reportData, setData: setReportData, post: postReport, processing: reportProcessing } = useForm({
        ringkasan: report.ringkasan || '',
        keyword: report.keyword || '',
        url_video: report.url_video || '',
        file_laporan: null as File | null,
        file_poster: null as File | null,
        file_sptb: null as File | null,
    });

    useEffect(() => {
        setReportData(d => ({
            ...d,
            ringkasan: report.ringkasan || '',
            keyword: report.keyword || '',
            url_video: report.url_video || '',
        }));
    }, [report.ringkasan, report.keyword, report.url_video]);

    const handleSaveReportMetadata = (e: React.FormEvent) => {
        e.preventDefault();
        postReport(route('dosen.penelitian.laporan-akhir.update', report.id), {
            forceFormData: true,
            onSuccess: () => alert('Data laporan akhir berhasil disimpan.'),
        });
    };

    const handleSaveSPTB = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportData.file_sptb) {
            alert('Silakan pilih file SPTB terlebih dahulu.');
            return;
        }
        postReport(route('dosen.penelitian.laporan-akhir.sptb.update', report.id), {
            forceFormData: true,
            onSuccess: () => {
                setReportData('file_sptb', null);
                alert('File SPTB berhasil disimpan.');
            },
        });
    };

    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian')}>Daftar Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/penelitian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.penelitian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={styles.tab} onClick={() => router.visit(route('dosen.penelitian.catatan-harian.index'))}>Catatan Harian</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.penelitian.laporan-akhir.index'))}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>
            </div>
            <Head title="Laporan Akhir Penelitian" />

            <main className={styles.contentArea}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <Layout className="w-8 h-8 text-blue-600" />
                            LAPORAN AKHIR
                        </h1>
                        <p className="text-gray-500 mt-1">Formulir pengisian hasil akhir kegiatan penelitian</p>
                    </div>
                </motion.div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-12 relative">
                    <div className="absolute top-[20px] left-[15%] right-[15%] h-px bg-gray-200 -z-0">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: activeStep === 2 ? '100%' : '50%' }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between w-full max-w-2xl px-4 relative z-10">
                        {[
                            { id: 1, label: 'Laporan Akhir', icon: FileText },
                            { id: 2, label: 'SPTB', icon: History }
                        ].map((step) => (
                            <div
                                key={step.id}
                                className="flex flex-col items-center gap-3 cursor-pointer"
                                onClick={() => setActiveStep(step.id)}
                            >
                                <motion.div
                                    variants={stepVariants}
                                    animate={activeStep === step.id ? 'active' : (activeStep > step.id ? 'completed' : 'inactive')}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 border-white"
                                >
                                    {activeStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </motion.div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${activeStep === step.id ? 'text-blue-700' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proposal Info Header Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-8 mb-10 shadow-xl shadow-blue-500/5 ring-1 ring-black/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 flex gap-3">
                        {report.file_laporan && report.file_sptb ? (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase border border-emerald-100 shadow-sm shadow-emerald-500/10">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Lengkap
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase border border-amber-100 shadow-sm shadow-amber-500/10">
                                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                                Menunggu Berkas
                            </div>
                        )}
                        <div className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1.5 rounded-full font-bold border border-blue-100 italic">
                            Update: {new Date(report.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </div>

                    <div className="space-y-4 max-w-4xl">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <p className="text-blue-700 text-[11px] font-bold uppercase tracking-widest">Penelitian Kompetitif Nasional</p>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                            {usulan.judul}
                        </h2>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <span className="bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest">{usulan.kelompok_skema}</span>
                            <span className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest">Tahun {usulan.tahun_pertama}</span>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeStep === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-10"
                        >
                            {/* Ringkasan & Keyword Form */}
                            <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden ring-1 ring-black/5">
                                <div className="p-1 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
                                    <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] py-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Data Laporan Akhir
                                    </h3>
                                    {report.status === 'Draft' && (
                                        <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] text-white font-bold backdrop-blur-sm border border-white/10 uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            Mode Edit
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2 uppercase tracking-tight">
                                                    Ringkasan Penelitian
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative group">
                                                    <textarea
                                                        className="w-full bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 min-h-[220px] text-sm leading-relaxed transition-all group-hover:bg-white resize-none"
                                                        value={reportData.ringkasan}
                                                        onChange={e => setReportData('ringkasan', e.target.value)}
                                                        placeholder="Tuliskan secara ringkas latar belakang, tujuan, metode, luaran, dan hasil..."
                                                        disabled={report.status !== 'Draft'}
                                                    />
                                                    <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium">
                                                        {reportData.ringkasan.length} Karakter
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2 uppercase tracking-tight">
                                                    Kata Kunci (Keywords)
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-sm transition-all"
                                                        value={reportData.keyword}
                                                        onChange={e => setReportData('keyword', e.target.value)}
                                                        placeholder="Contoh: Energi Terbarukan; Panel Surya; Efisiensi"
                                                        disabled={report.status !== 'Draft'}
                                                    />
                                                    <p className="mt-1.5 text-[10px] text-gray-400 font-medium ml-1">Gunakan titik koma (;) sebagai pemisah antar kata kunci</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col justify-center items-center text-center space-y-4 border-dashed relative">
                                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Berkas Substansi Laporan</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Format PDF, maksimal 10MB</p>
                                                </div>

                                                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                                                    {report.file_laporan && (
                                                        <a
                                                            href={`/storage/${report.file_laporan}`}
                                                            target="_blank"
                                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-lg shadow-black/10"
                                                        >
                                                            <Download className="w-4 h-4" /> Unduh Laporan
                                                        </a>
                                                    )}
                                                    {report.status === 'Draft' && (
                                                        <div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                ref={reportInputRef}
                                                                onChange={e => setReportData('file_laporan', e.target.files?.[0] || null)}
                                                                accept=".pdf"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => reportInputRef.current?.click()}
                                                                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border-2 ${reportData.file_laporan ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                                                            >
                                                                {reportData.file_laporan ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                                {reportData.file_laporan ? 'Berhasil Dipilih' : 'Pilih Laporan Baru'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                        {report.status === 'Draft' && (
                                            <button
                                                type="button"
                                                onClick={handleSaveReportMetadata}
                                                disabled={reportProcessing}
                                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                            >
                                                {reportProcessing ? 'Menyimpan...' : 'Simpan Data Laporan'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Luaran Wajib Section */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                        Luaran Wajib
                                    </h3>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        Total: {mandatoryOutputs.length} Item
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden ring-1 ring-black/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
                                                <th className="px-8 py-5 w-16">No</th>
                                                <th className="px-8 py-5">Deskripsi Target</th>
                                                <th className="px-8 py-5">Realisasi & Bukti</th>
                                                <th className="px-8 py-5 text-center w-32">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {mandatoryOutputs.map((output, idx) => (
                                                <OutputRow key={output.id} output={output} index={idx + 1} isReadOnly={report.status !== 'Draft'} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Poster Section (Wajib) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 p-8 ring-1 ring-black/5">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                                        <Layout className="w-5 h-5 text-blue-600" />
                                        Poster Program
                                    </h3>
                                    <div className="space-y-6">
                                        <p className="text-sm text-gray-500 leading-relaxed italic">Wajib mengunggah poster hasil program dalam format PNG/JPG/PDF maksimal 10MB.</p>

                                        <div className="flex flex-col gap-4">
                                            {report.file_poster && (
                                                <a
                                                    href={`/storage/${report.file_poster}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition group"
                                                >
                                                    <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                    Lihat Poster Terunggah
                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                                                </a>
                                            )}

                                            {report.status === 'Draft' && (
                                                <div className="flex gap-3">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={posterInputRef}
                                                        onChange={e => setReportData('file_poster', e.target.files?.[0] || null)}
                                                        accept=".png,.jpg,.jpeg,.pdf"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => posterInputRef.current?.click()}
                                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition border-2 border-dashed ${reportData.file_poster ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'}`}
                                                    >
                                                        {reportData.file_poster ? '✓ Siap Simpan' : 'Pilih Berkas Poster'}
                                                    </button>
                                                    {reportData.file_poster && (
                                                        <button
                                                            type="button"
                                                            onClick={handleSaveReportMetadata}
                                                            className="bg-blue-600 text-white px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 p-8 ring-1 ring-black/5">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                                        <Video className="w-5 h-5 text-blue-600" />
                                        Video Profil
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tautan YouTube / Video</label>
                                            <div className="flex gap-3">
                                                <div className="relative flex-1 group">
                                                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                                    <input
                                                        type="url"
                                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-sm transition-all"
                                                        value={reportData.url_video}
                                                        onChange={e => setReportData('url_video', e.target.value)}
                                                        placeholder="https://youtu.be/..."
                                                        disabled={report.status !== 'Draft'}
                                                    />
                                                </div>
                                                {report.status === 'Draft' && (
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveReportMetadata}
                                                        disabled={reportProcessing}
                                                        className="bg-gray-900 text-white px-5 rounded-xl hover:bg-black transition disabled:opacity-50"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {reportData.url_video && (
                                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center gap-4 animate-fadeIn">
                                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                                    <Youtube className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-none mb-1">Preview Tersedia</p>
                                                    <p className="text-xs text-blue-900 truncate font-semibold">{reportData.url_video}</p>
                                                </div>
                                                <a href={reportData.url_video} target="_blank" className="p-2 hover:bg-blue-100 rounded-lg transition">
                                                    <ExternalLink className="w-4 h-4 text-blue-600" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Bottom Controls */}
                            <div className="flex justify-between items-center pt-10 border-t border-gray-100">
                                <button
                                    className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-red-500 transition-colors bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm"
                                    onClick={() => router.visit(route('dosen.penelitian.laporan-akhir.index'))}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Tutup Formulir
                                </button>
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (report.status === 'Draft' && (reportData.ringkasan || reportData.keyword || reportData.file_laporan)) {
                                                handleSaveReportMetadata(new Event('submit') as any);
                                            }
                                            setActiveStep(2);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition flex items-center gap-3 shadow-xl shadow-blue-500/20"
                                    >
                                        Selanjutnya (SPTB)
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeStep === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-8"
                        >
                            <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden ring-1 ring-black/5">
                                <div className="p-1 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
                                    <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] py-3 flex items-center gap-2">
                                        <History className="w-4 h-4" />
                                        Surat Pernyataan Tanggung Jawab Belanja (SPTB)
                                    </h3>
                                </div>

                                <div className="p-10 space-y-10">
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Panduan Mengunggah SPTB</h4>
                                            <p className="text-sm text-blue-700 mt-1 leading-relaxed italic">Silakan isi dan tandatangani form SPTB terlebih dahulu sesuai format yang ditentukan (PDF), kemudian unggah melalui tombol di bawah.</p>
                                        </div>
                                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 whitespace-nowrap">
                                            Unduh Format SPTB
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                                <Paperclip className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight">Berkas SPTB Laporan Akhir</h5>
                                                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest leading-none">Format PDF • Maks 10MB</p>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-4 w-full">
                                                {report.file_sptb && (
                                                    <a
                                                        href={`/storage/${report.file_sptb}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-lg shadow-black/10"
                                                    >
                                                        <Download className="w-4 h-4" /> Unduh SPTB Saat Ini
                                                    </a>
                                                )}
                                                {report.status === 'Draft' && (
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="file"
                                                            ref={sptbInputRef}
                                                            className="hidden"
                                                            onChange={e => setReportData('file_sptb', e.target.files?.[0] || null)}
                                                            accept=".pdf"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => sptbInputRef.current?.click()}
                                                            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold transition border-2 border-dashed ${reportData.file_sptb ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                                                        >
                                                            {reportData.file_sptb ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                            {reportData.file_sptb ? 'Siap Diunggah' : 'Pilih File SPTB'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-gray-50">
                                        {report.status === 'Draft' && reportData.file_sptb && (
                                            <button
                                                onClick={handleSaveSPTB}
                                                disabled={reportProcessing}
                                                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {reportProcessing ? 'Mengunggah...' : 'Simpan File SPTB'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-10 border-t border-gray-100">
                                <button
                                    onClick={() => setActiveStep(1)}
                                    className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors bg-white px-6 py-3 rounded-xl border border-blue-200 shadow-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali
                                </button>

                                <div className="flex gap-4">
                                    {report.status === 'Draft' ? (
                                        <button
                                            onClick={() => {
                                                if (!report.file_poster) {
                                                    alert("Dokumen Poster (Wajib) harus diunggah.");
                                                    setActiveStep(1);
                                                    return;
                                                }
                                                const missingMandatory = mandatoryOutputs.find(o => !o.judul_realisasi_akhir);
                                                if (missingMandatory) {
                                                    alert(`Luaran Wajib "${missingMandatory.kategori}" harus diisi realisasi akhirnya.`);
                                                    setActiveStep(1);
                                                    return;
                                                }

                                                if (confirm('Kirim laporan akhir sekarang? Data tidak dapat diubah setelah disubmit.')) {
                                                    router.post(route('dosen.penelitian.laporan-akhir.submit', usulan.id));
                                                }
                                            }}
                                            disabled={reportProcessing}
                                            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition flex items-center gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            SUBMIT LAPORAN AKHIR
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.visit(route('dosen.penelitian.laporan-akhir.index'))}
                                            className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-800 transition shadow-xl"
                                        >
                                            SELESAI →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

function OutputRow({ output, index, isReadOnly }: { output: any, index: number, isReadOnly: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const buktiInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        judul_realisasi_akhir: output.judul_realisasi_akhir || '',
        status_akhir: output.status_akhir || 'Draft',
        peran_penulis: output.peran_penulis || '',
        nama_jurnal: output.nama_jurnal || '',
        issn: output.issn || '',
        pengindek: output.pengindek || '',
        url_bukti_akhir: output.url_bukti_akhir || '',
        file_bukti_akhir: null as File | null,
        keterangan_akhir: output.keterangan_akhir || '',
    });

    useEffect(() => {
        setData(d => ({
            ...d,
            judul_realisasi_akhir: output.judul_realisasi_akhir || '',
            status_akhir: output.status_akhir || 'Draft',
            peran_penulis: output.peran_penulis || '',
            nama_jurnal: output.nama_jurnal || '',
            issn: output.issn || '',
            pengindek: output.pengindek || '',
            url_bukti_akhir: output.url_bukti_akhir || '',
            keterangan_akhir: output.keterangan_akhir || '',
        }));
    }, [output]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.penelitian.laporan-akhir.luaran.update', output.id), {
            onSuccess: () => {
                setIsEditing(false);
                alert('Realisasi luaran akhir berhasil disimpan.');
            },
            onError: (err) => {
                const firstError = Object.values(err)[0];
                alert('Gagal menyimpan: ' + (firstError as string));
            },
            forceFormData: true,
        });
    };

    return (
        <>
            <tr className="hover:bg-blue-50/20 transition group">
                <td className="px-8 py-6 text-sm text-gray-400 font-bold">{index}</td>
                <td className="px-8 py-6 max-w-xs">
                    <div className="space-y-2">
                        <p className="text-sm font-black text-gray-900 leading-snug uppercase tracking-tight">{output.kategori}</p>
                        <div className="flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 font-bold uppercase tracking-widest italic w-fit">
                            Target: {output.deskripsi}
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="space-y-3">
                        {output.judul_realisasi_akhir ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-800 font-bold leading-relaxed">{output.judul_realisasi_akhir}</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest shadow-sm">
                                        {output.status_akhir}
                                    </span>
                                    {output.nama_jurnal && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100 italic">{output.nama_jurnal}</span>}
                                    {output.url_bukti_akhir && (
                                        <a href={output.url_bukti_akhir} target="_blank" className="text-blue-600 hover:text-blue-800">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-300 italic text-[11px] font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Menunggu Pengisian Realisasi
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-8 py-6 text-center">
                    {!isReadOnly && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-500/20 group/edit"
                        >
                            <Edit className="w-5 h-5 group-hover/edit:scale-110 transition-transform" />
                        </button>
                    )}
                </td>
            </tr>

            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 border border-white/20"
                        >
                            <div className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-white/70 uppercase tracking-[0.2em] leading-none mb-1">Update Realisasi Akhir</h3>
                                        <p className="text-sm font-black text-white uppercase tracking-tight truncate max-w-sm">{output.kategori}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-xl transition backdrop-blur-md">
                                    <Plus className="w-6 h-6 rotate-45" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Publikasi Akhir</label>
                                        <select
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                                            value={data.status_akhir}
                                            onChange={e => setData('status_akhir', e.target.value)}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Submitted">Submitted</option>
                                            <option value="Review">Review</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Published">Published</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Peran Penulis</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            value={data.peran_penulis}
                                            onChange={e => setData('peran_penulis', e.target.value)}
                                            placeholder="Contoh: First Author / Corresponding Author"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Jurnal / Seminar / Media</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        value={data.nama_jurnal}
                                        onChange={e => setData('nama_jurnal', e.target.value)}
                                        placeholder="Ketik nama platform publikasi..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Judul Artikel / Realisasi Lengkap</label>
                                    <textarea
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px] resize-none"
                                        value={data.judul_realisasi_akhir}
                                        onChange={e => setData('judul_realisasi_akhir', e.target.value)}
                                        placeholder="Tuliskan judul lengkap capaian akhir anda..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tautan Bukti (URL)</label>
                                        <input
                                            type="url"
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            value={data.url_bukti_akhir}
                                            onChange={e => setData('url_bukti_akhir', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Berkas Bukti (PDF)</label>
                                        <div className="flex gap-2">
                                            <input type="file" ref={buktiInputRef} className="hidden" onChange={e => setData('file_bukti_akhir', e.target.files?.[0] || null)} />
                                            <button
                                                type="button"
                                                onClick={() => buktiInputRef.current?.click()}
                                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition border-2 border-dashed ${data.file_bukti_akhir ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                            >
                                                {data.file_bukti_akhir ? '✓ Berhasil Dipilih' : '+ Pilih File'}
                                            </button>
                                            {output.file_bukti_akhir && (
                                                <a href={`/storage/${output.file_bukti_akhir}`} target="_blank" className="w-12 bg-blue-50 border border-blue-100 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 transition">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-gray-50/50 border-t flex justify-between gap-4">
                                <p className="text-[11px] text-gray-400 font-medium max-w-[200px] leading-snug">Pastikan semua data yang diisi telah sesuai dengan capaian nyata hasil penelitian.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm">Batal</button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="px-10 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Realisasi'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
