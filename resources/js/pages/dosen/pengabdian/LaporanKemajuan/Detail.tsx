import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import styles from '../../../../../css/pengajuan.module.css';

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
        file_laporan: null as File | null,
        file_sptb: null as File | null,
    });

    useEffect(() => {
        setReportData(d => ({
            ...d,
            ringkasan: report.ringkasan || '',
            keyword: report.keyword || '',
        }));
    }, [report.ringkasan, report.keyword]);

    const handleSaveReportMetadata = (e: React.FormEvent) => {
        e.preventDefault();
        postReport(route('dosen.pengabdian.laporan-kemajuan.update', report.id), {
            forceFormData: true,
            onSuccess: () => alert('Data laporan pengabdian berhasil disimpan.'),
        });
    };

    const handleSaveSPTB = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportData.file_sptb) {
            alert('Silakan pilih file SPTB terlebih dahulu.');
            return;
        }
        postReport(route('dosen.pengabdian.laporan-kemajuan.sptb.update', report.id), {
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
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian')}>Daftar Pengabdian</button>
                    <button className={styles.tab} onClick={() => router.visit('/dosen/pengabdian/perbaikan')}>Perbaikan Usulan</button>
                    <button className={`${styles.tab} ${styles.active}`} onClick={() => router.visit(route('dosen.pengabdian.laporan-kemajuan.index'))}>Laporan Kemajuan</button>
                    <button className={styles.tab} onClick={() => { }}>Catatan Harian</button>
                    <button className={styles.tab} onClick={() => { }}>Laporan Akhir</button>
                    <button className={styles.tab} onClick={() => { }}>Pengkinian Capaian Luaran</button>
                </div>
            </div>
            <Head title="Laporan Kemajuan Pengabdian" />

            <main className={styles.contentArea}>
                {/* BIMA Breadcrumb/Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">LAPORAN KEMAJUAN PENGABDIAN</h1>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-10 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                    <div className="flex justify-between w-full max-w-2xl px-4 bg-white">
                        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setActiveStep(1)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition ${activeStep === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400 group-hover:border-blue-400'}`}>1</div>
                            <span className={`text-sm font-semibold transition ${activeStep === 1 ? 'text-blue-600' : 'text-gray-600'}`}>Laporan Kemajuan</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setActiveStep(2)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition ${activeStep === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400 group-hover:border-blue-400'}`}>2</div>
                            <span className={`text-sm font-semibold transition ${activeStep === 2 ? 'text-blue-600' : 'text-gray-600'}`}>SPTB</span>
                        </div>
                    </div>
                </div>

                {/* Proposal Info Header Box */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                        {report.file_laporan && report.file_sptb ? (
                            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Sudah Unggah ✓</span>
                        ) : (
                            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Belum Unggah</span>
                        )}
                        <span className="bg-blue-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">Tgl Update: {new Date(report.updated_at).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-blue-700 text-sm font-medium">Pengabdian | Tahun Pelaksanaan {usulan.tahun_pertama}</p>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{usulan.judul}</h2>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">{usulan.kelompok_skema}</span>
                            <span className="bg-orange-400 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">Tahun ke 1 dari 1</span>
                        </div>
                    </div>
                </div>

                {activeStep === 1 && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Ringkasan & Keyword Form */}
                        <form onSubmit={handleSaveReportMetadata} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan</label>
                                    <p className="text-xs text-gray-500 mb-2 italic">Tuliskan secara ringkas latar belakang pengabdian, tujuan dan tahapan metode, luaran yang ditargetkan, dan hasil yang diperoleh sesuai dengan tahun pelaksanaan</p>
                                    <textarea
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[150px] text-sm"
                                        value={reportData.ringkasan}
                                        onChange={e => setReportData('ringkasan', e.target.value)}
                                        placeholder="Ketik ringkasan di sini..."
                                        disabled={report.status !== 'Draft'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Keyword</label>
                                    <p className="text-xs text-gray-500 mb-2 italic">Maksimal 5 kata kunci. Gunakan tanda baca titik koma (;) sebagai pemisah</p>
                                    <input
                                        type="text"
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={reportData.keyword}
                                        onChange={e => setReportData('keyword', e.target.value)}
                                        placeholder="Contoh: Pengabdian; Masyarakat; Desa Binaan"
                                        disabled={report.status !== 'Draft'}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Substansi Laporan</label>
                                        <div className="flex flex-wrap gap-2">
                                            {report.file_laporan && (
                                                <a
                                                    href={`/storage/${report.file_laporan}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded text-xs font-bold hover:bg-blue-800 transition"
                                                >
                                                    ⬇ Download
                                                </a>
                                            )}
                                            {report.status === 'Draft' && (
                                                <div className="relative">
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
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded text-xs font-bold hover:bg-red-50 cursor-pointer transition"
                                                    >
                                                        {reportData.file_laporan ? '✓ Terpilih' : '↑ Unggah Ulang'}
                                                    </button>
                                                </div>
                                            )}
                                            <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded text-xs font-bold hover:bg-blue-800 transition">
                                                ⎙ Unduh Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        {report.status === 'Draft' && (
                                            <button
                                                type="submit"
                                                disabled={reportProcessing}
                                                className="bg-blue-700 text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-800 transition shadow-sm disabled:opacity-50"
                                            >
                                                {reportProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Luaran Wajib Section */}
                        <section className="mt-12">
                            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-tight">LUARAN WAJIB</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">No</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Target Luaran</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Realisasi & Bukti</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase">Aksi</th>
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

                        {/* Luaran Tambahan Section */}
                        {additionalOutputs.length > 0 && (
                            <section className="mt-12">
                                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-tight">LUARAN TAMBAHAN</h3>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">No</th>
                                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Judul</th>
                                                <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {additionalOutputs.map((output, idx) => (
                                                <OutputRow key={output.id} output={output} index={idx + 1} isReadOnly={report.status !== 'Draft'} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Bottom Controls */}
                        <div className="flex justify-between items-center pt-8">
                            <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-xs font-bold hover:bg-red-50 transition">
                                Tutup form
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (report.status === 'Draft' && (reportData.ringkasan || reportData.keyword || reportData.file_laporan)) {
                                            handleSaveReportMetadata(new Event('submit') as any);
                                        }
                                        setActiveStep(2);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="bg-blue-700 text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-800 transition flex items-center gap-2"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 space-y-10">
                                {/* Instruction Box */}
                                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-5">
                                    <h4 className="text-sm font-bold text-cyan-900 mb-1">Panduan Mengunggah SPTB</h4>
                                    <p className="text-sm text-cyan-800">Silakan isi form SPTB terlebih dahulu untuk mengunggah file</p>
                                </div>

                                {/* File Upload/Download Area */}
                                <div className="space-y-4">
                                    <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wider">SPTB</h5>
                                    <div className="flex flex-col gap-4">
                                        {report.file_sptb && (
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-blue-600 font-medium italic underline">{report.file_sptb.split('/').pop()}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-4">
                                            {report.file_sptb && (
                                                <a
                                                    href={`/storage/${report.file_sptb}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 px-10 py-2.5 bg-blue-700 text-white rounded text-xs font-bold hover:bg-blue-800 transition shadow-sm"
                                                >
                                                    ⬇ Download
                                                </a>
                                            )}
                                            {report.status === 'Draft' && (
                                                <div className="flex items-center gap-4">
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
                                                        className="inline-flex items-center gap-2 px-10 py-2.5 bg-white border border-red-200 text-red-600 rounded text-xs font-bold hover:bg-red-50 cursor-pointer transition shadow-sm"
                                                    >
                                                        {reportData.file_sptb ? '✓ Terpilih' : (report.file_sptb ? 'Ganti File' : 'Pilih File SPTB')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Buttons */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                                    <button
                                        type="button"
                                        className="bg-blue-800 text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-900 transition flex items-center gap-2"
                                    >
                                        Form SPTB
                                    </button>
                                    {report.status === 'Draft' && (
                                        <button
                                            onClick={handleSaveSPTB}
                                            disabled={reportProcessing}
                                            className="bg-blue-800 text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-900 transition flex items-center gap-2"
                                        >
                                            {reportProcessing ? '...' : 'Simpan File'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="flex justify-between items-center pt-8">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveStep(1)}
                                    className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded text-sm font-bold hover:bg-blue-50 transition flex items-center gap-2"
                                >
                                    ← Kembali
                                </button>
                                <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-xs font-bold hover:bg-red-50 transition">
                                    Tutup form
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {report.status === 'Draft' ? (
                                    <button
                                        onClick={() => {
                                            // Check for Rencana status in mandatory outputs
                                            const missingMandatory = mandatoryOutputs.find(o => o.status === 'Rencana' || !o.judul_realisasi);
                                            if (missingMandatory) {
                                                alert(`Luaran Wajib "${missingMandatory.kategori}" harus diisi realisasinya dan statusnya tidak boleh "Rencana".`);
                                                setActiveStep(1);
                                                return;
                                            }

                                            if (confirm('Kirim laporan kemajuan sekarang? Data tidak dapat diubah setelah disubmit.')) {
                                                router.post(route('dosen.pengabdian.laporan-kemajuan.submit', usulan.id));
                                            }
                                        }}
                                        disabled={reportProcessing}
                                        className="bg-green-600 text-white px-8 py-2 rounded text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    >
                                        {reportProcessing ? 'Memproses...' : 'Kirim Laporan ✓'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.visit(route('dosen.pengabdian.laporan-kemajuan.index'))}
                                        className="bg-blue-700 text-white px-8 py-2 rounded text-sm font-bold hover:bg-blue-800 transition flex items-center gap-2"
                                    >
                                        Selesai →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

function OutputRow({ output, index, isReadOnly }: { output: any, index: number, isReadOnly: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const buktiInputRef = useRef<HTMLInputElement>(null);
    const submitInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        judul_realisasi: output.judul_realisasi || '',
        status: output.status || 'Rencana',
        peran_penulis: output.peran_penulis || '',
        nama_jurnal: output.nama_jurnal || '',
        issn: output.issn || '',
        pengindek: output.pengindek || '',
        url_bukti: output.url_bukti || '',
        file_bukti: null as File | null,
        file_bukti_submit: null as File | null,
        keterangan: output.keterangan || '',
    });

    useEffect(() => {
        setData(d => ({
            ...d,
            judul_realisasi: output.judul_realisasi || '',
            status: output.status || 'Rencana',
            peran_penulis: output.peran_penulis || '',
            nama_jurnal: output.nama_jurnal || '',
            issn: output.issn || '',
            pengindek: output.pengindek || '',
            url_bukti: output.url_bukti || '',
            keterangan: output.keterangan || '',
        }));
    }, [output]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.pengabdian.laporan-kemajuan.luaran.update', output.id), {
            onSuccess: () => {
                setIsEditing(false);
                alert('Realisasi luaran berhasil disimpan.');
            },
            onError: (err) => {
                const firstError = Object.values(err)[0];
                alert('Gagal menyimpan: ' + firstError);
            },
            forceFormData: true,
        });
    };

    return (
        <>
            <tr className="hover:bg-gray-50/50 transition align-top">
                <td className="px-6 py-6 text-sm text-gray-500 font-medium">{index}</td>
                <td className="px-6 py-6 border-r border-gray-50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-800 leading-snug">{output.kategori}</p>
                            <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Publikasi_jurnal</span>
                        </div>
                        <p className="text-[11px] text-gray-500 bg-gray-50/80 p-2 rounded border border-gray-100 mt-2 italic leading-relaxed">
                            Target: {output.deskripsi}
                        </p>
                    </div>
                </td>
                <td className="px-6 py-6">
                    <div className="space-y-3">
                        {output.judul_realisasi ? (
                            <div className="space-y-1">
                                <p className="text-sm text-gray-900 font-bold leading-tight">{output.judul_realisasi}</p>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest shadow-sm ${output.status === 'Accepted' || output.status === 'Published'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-600 text-white'
                                        }`}>
                                        {output.status}
                                    </span>
                                    {output.nama_jurnal && <span className="text-[10px] text-gray-500 font-medium italic">| {output.nama_jurnal}</span>}
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Belum ada realisasi</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-6 text-center">
                    {!isReadOnly && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-gray-200 p-2.5 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition shadow-sm group"
                        >
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                    )}
                    {isReadOnly && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Locked</span>}
                </td>
            </tr>

            {/* MODAL FORM */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col scale-in">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-tight leading-tight pr-8">
                                {output.kategori}: {output.deskripsi.substring(0, 100)}{output.deskripsi.length > 100 ? '...' : ''}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Status Artikel */}
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status Artikel</label>
                                                <select
                                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                    value={data.status}
                                                    onChange={e => setData('status', e.target.value)}
                                                >
                                                    <option value="Rencana">Rencana</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Submitted">Submitted</option>
                                                    <option value="Review">Review</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Published">Published</option>
                                                </select>
                                            </div>

                                            {/* Status Penulis */}
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status Penulis</label>
                                                <select
                                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                    value={data.peran_penulis}
                                                    onChange={e => setData('peran_penulis', e.target.value)}
                                                >
                                                    <option value="">Pilih Status Penulis</option>
                                                    <option value="First Author">First Author</option>
                                                    <option value="Corresponding Author">Corresponding Author</option>
                                                    <option value="Co-Author">Co-Author</option>
                                                    <option value="Single Author">Single Author</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Nama Jurnal */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Jurnal</label>
                                            <input
                                                type="text"
                                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                value={data.nama_jurnal}
                                                onChange={e => setData('nama_jurnal', e.target.value)}
                                                placeholder="Contoh: Journal of Information Systems and Informatics (JISI)"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* ISSN/EISSN */}
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">ISSN/EISSN</label>
                                                <input
                                                    type="text"
                                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                    value={data.issn}
                                                    onChange={e => setData('issn', e.target.value)}
                                                    placeholder="Contoh: 2656-5935 / 2656-4882"
                                                />
                                            </div>

                                            {/* Lembaga Pengindek */}
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lembaga Pengindek</label>
                                                <input
                                                    type="text"
                                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                    value={data.pengindek}
                                                    onChange={e => setData('pengindek', e.target.value)}
                                                    placeholder="Contoh: Sinta, Scopus, dll"
                                                />
                                            </div>
                                        </div>

                                        {/* URL Jurnal */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">URL Jurnal</label>
                                            <input
                                                type="url"
                                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5"
                                                value={data.url_bukti}
                                                onChange={e => setData('url_bukti', e.target.value)}
                                                placeholder="https://journal-isi.org/index.php/jisi"
                                            />
                                        </div>

                                        {/* Judul Artikel */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul Artikel</label>
                                            <textarea
                                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2.5 min-h-[80px]"
                                                value={data.judul_realisasi}
                                                onChange={e => setData('judul_realisasi', e.target.value)}
                                                placeholder="Ketik judul artikel lengkap di sini..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Unggah Dokumen */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-800">Unggah Dokumen</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Naskah Artikel */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold text-gray-600 tracking-wide">Naskah artikel</label>
                                            <div className="p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                                {output.file_bukti && (
                                                    <div className="mb-3">
                                                        <p className="text-[11px] text-blue-600 font-medium truncate mb-2">{output.file_bukti.split('/').pop()}</p>
                                                        <a href={`/storage/${output.file_bukti}`} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded shadow-sm text-[10px] font-bold hover:bg-blue-800 transition">
                                                            ⬇ Download
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="relative">
                                                    <input type="file" ref={buktiInputRef} className="hidden" onChange={e => setData('file_bukti', e.target.files?.[0] || null)} />
                                                    <button
                                                        type="button"
                                                        onClick={() => buktiInputRef.current?.click()}
                                                        className="block w-full text-center py-2 px-3 bg-white border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-50 cursor-pointer transition"
                                                    >
                                                        {data.file_bukti ? '✓ Terpilih' : (output.file_bukti ? 'Unggah Ulang' : 'Pilih File')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bukti Submit */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold text-gray-600 tracking-wide">Bukti submit</label>
                                            <div className="p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                                {output.file_bukti_submit && (
                                                    <div className="mb-3">
                                                        <p className="text-[11px] text-blue-600 font-medium truncate mb-2">{output.file_bukti_submit.split('/').pop()}</p>
                                                        <a href={`/storage/${output.file_bukti_submit}`} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded shadow-sm text-[10px] font-bold hover:bg-blue-800 transition">
                                                            ⬇ Download
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="relative">
                                                    <input type="file" ref={submitInputRef} className="hidden" onChange={e => setData('file_bukti_submit', e.target.files?.[0] || null)} />
                                                    <button
                                                        type="button"
                                                        onClick={() => submitInputRef.current?.click()}
                                                        className="block w-full text-center py-2 px-3 bg-white border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-50 cursor-pointer transition"
                                                    >
                                                        {data.file_bukti_submit ? '✓ Terpilih' : (output.file_bukti_submit ? 'Unggah Ulang' : 'Pilih File')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-gray-400 text-white rounded-lg text-sm font-bold hover:bg-gray-500 transition shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-8 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
