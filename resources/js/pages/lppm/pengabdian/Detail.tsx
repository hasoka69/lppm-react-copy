import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
declare var route: any;
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { Toaster, toast } from 'sonner';
import ReviewScoringForm from '@/components/ReviewScoringForm';
import {
    Home,
    ChevronRight,
    FileText,
    User,
    Info,
    DollarSign,
    Target,
    Building,
    Users,
    CheckCircle,
    MapPin,
    Layers,
    Clock,
    ChevronLeft,
    AlertCircle
} from 'lucide-react';
import { formatAcademicYear } from '@/utils/academicYear';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ProposalDetailProps {
    usulan: any;
    reviewers: any[];
    initialScores?: any[];
    isReadOnly?: boolean;
}

function AdminActionCard({ title, icon, description, children }: { title: string, icon: any, description: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">{icon}</div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center mb-1">
                <span className="mr-2">{icon}</span> {title}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{description}</p>
            {children}
        </div>
    );
}

function ExpandableText({ text, limit = 150 }: { text: string, limit?: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return <span>-</span>;
    if (text.length <= limit) return <span>{text}</span>;

    return (
        <span>
            {isExpanded ? text : `${text.substring(0, limit)}... `}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-1 focus:outline-none"
            >
                {isExpanded ? 'Lihat Sedikit' : 'Baca Selengkapnya'}
            </button>
        </span>
    );
}

export default function AdminPengabdianDetail({ usulan, reviewers, initialScores = [], isReadOnly = false }: ProposalDetailProps) {
    const formatRupiah = (number: any, withPrefix = true) => {
        const value = typeof number === 'string' ? parseFloat(number) : number;
        const formatted = new Intl.NumberFormat('id-ID', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);

        return withPrefix ? `Rp ${formatted}` : formatted;
    };

    // State for budget input formatting
    const [paguDisp, setPaguDisp] = useState(formatRupiah(usulan.dana_disetujui || usulan.total_anggaran, false));

    const handlePaguChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) {
            const formatted = new Intl.NumberFormat('id-ID').format(parseInt(val));
            setPaguDisp(formatted);
        } else {
            setPaguDisp('');
        }
    };

    // [NEW] Contract Modal State
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractNumber, setContractNumber] = useState('');
    const [contractStartDate, setContractStartDate] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const [processingDecision, setProcessingDecision] = useState(false);

    const handleDidanaiSubmit = () => {
        if (!contractNumber) {
            return;
        }
        setProcessingDecision(true);
        router.post(route('lppm.final_decision', { type: 'pengabdian', id: usulan.id }), {
            decision: 'didanai',
            nomor_kontrak: contractNumber,
            tanggal_mulai_kontrak: contractStartDate,
            tanggal_selesai_kontrak: contractEndDate
        }, {
            onFinish: () => {
                setProcessingDecision(false);
                setIsContractModalOpen(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Admin Detail Pengabdian - ${usulan.judul}`} />
            <Header />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Back */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/lppm/dashboard" className="hover:text-blue-600 flex items-center">
                            <Home className="w-4 h-4 mr-1" /> Dashboard
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/lppm/pengabdian" className="hover:text-blue-600">Daftar Pengabdian</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-semibold text-gray-700 truncate max-w-xs">{usulan.judul}</span>
                    </div>
                    <Link href="/lppm/pengabdian" className="inline-flex items-center text-sm text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke List
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: PRIMARY CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. IDENTITAS USULAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">1</span>
                                Identitas Usulan
                            </h2>
                            <h1 className="text-xl font-bold text-gray-800 leading-relaxed mb-6">
                                {usulan.judul || 'Judul Tidak Ditemukan'}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs font-medium mb-1">Kelompok Skema</span>
                                    <span className="font-semibold text-gray-800">{usulan.kelompok_skema || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs font-medium mb-1">Ruang Lingkup</span>
                                    <span className="font-semibold text-gray-800">{usulan.ruang_lingkup || '-'}</span>
                                </div>

                                <div>
                                    <span className="block text-gray-500 text-xs font-medium mb-1">Jenis Bidang Fokus</span>
                                    <span className="font-semibold text-gray-800">{usulan.jenis_bidang_fokus || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs font-medium mb-1">Bidang Fokus Pengabdian</span>
                                    <span className="font-semibold text-gray-800 flex items-center">
                                        <Target className="w-4 h-4 mr-2 text-blue-500" />
                                        {usulan.bidang_fokus ? usulan.bidang_fokus.replace(/^\d+\.\s*/, '') : '-'}
                                    </span>
                                </div>

                                <div className="md:col-span-2 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                                        <Layers className="w-4 h-4 mr-2" /> Rumpun Ilmu
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <span className="block text-gray-500 text-xs font-medium mb-1">Level 1</span>
                                            <span className="font-medium text-gray-800 text-sm block">
                                                {usulan.rumpun_ilmu_level1_label ? usulan.rumpun_ilmu_level1_label.replace(/^\d+\.\s*/, '') : '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs font-medium mb-1">Level 2</span>
                                            <span className="font-medium text-gray-800 text-sm block">
                                                {usulan.rumpun_ilmu_level2_label ? usulan.rumpun_ilmu_level2_label.replace(/^\d+\.\s*/, '') : '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs font-medium mb-1">Level 3</span>
                                            <span className="font-medium text-gray-800 text-sm block">
                                                {usulan.rumpun_ilmu_level3_label ? usulan.rumpun_ilmu_level3_label.replace(/^\d+\.\s*/, '') : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <span className="block text-gray-500 text-xs font-medium mb-1">Tahun Pengajuan</span>
                                            <span className="font-bold text-gray-900">{formatAcademicYear(usulan.tahun_pertama)}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                        {/* 2. ANGGOTA TIM */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">2</span>
                                Anggota Tim
                            </h2>
                            {/* Ketua */}
                            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 mb-4 shadow-sm">
                                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold mr-3">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{usulan.ketua?.name} <span className="text-xs font-semibold text-indigo-600 ml-1 border border-indigo-200 px-1.5 py-0.5 rounded bg-white">Ketua</span></p>
                                    <p className="text-xs text-indigo-600 font-medium">{usulan.ketua?.dosen?.prodi || '-'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 border-l-4 border-gray-200 pl-2">Anggota Dosen</h3>
                                    {usulan.anggota_dosen && usulan.anggota_dosen.length > 0 ? (
                                        <div className="space-y-2">
                                            {usulan.anggota_dosen.map((anggota: any, idx: number) => (
                                                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                                                    <div className="w-6 h-6 bg-white border border-gray-200 rounded flex items-center justify-center mr-3 font-semibold text-gray-500 text-xs">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 line-clamp-1">{anggota.nama || anggota.dosen?.nama}</p>
                                                        <p className="text-xs text-gray-500">{anggota.dosen?.prodi || 'Anggota'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Tidak ada anggota dosen tambahan.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 border-l-4 border-gray-200 pl-2">Mahasiswa / Non-Dosen</h3>
                                    {usulan.anggota_non_dosen && usulan.anggota_non_dosen.length > 0 ? (
                                        <div className="space-y-2">
                                            {usulan.anggota_non_dosen.map((mhs: any, idx: number) => (
                                                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className="font-semibold text-gray-900">{mhs.nama}</p>
                                                        <span className="text-xs bg-white border border-gray-300 px-1.5 rounded font-medium text-gray-500">{mhs.jenis_anggota}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{mhs.no_identitas}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Tidak ada anggota mahasiswa (Step 3).</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 3. MITRA SASARAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">3</span>
                                Mitra Sasaran & Lokasi
                            </h2>
                            {usulan.mitra && usulan.mitra.length > 0 ? (
                                <div className="space-y-4">
                                    {usulan.mitra.map((m: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-gray-900 flex items-center text-sm">
                                                    <Building className="w-4 h-4 mr-2 text-gray-400" /> {m.nama_mitra}
                                                </h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{m.jenis_mitra}</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                <div className="flex items-start">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-gray-700">{m.nama_kota}, {m.nama_provinsi}</p>
                                                        <p className="text-gray-500 line-clamp-1">{m.alamat_mitra}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <User className="w-3.5 h-3.5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-gray-700">{m.penanggung_jawab || m.pimpinan_mitra}</p>
                                                        <p className="text-gray-500">{m.no_telepon || m.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {m.file_surat_kesediaan && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                                                    <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" className="text-xs font-semibold text-blue-600 flex items-center hover:underline">
                                                        <FileText className="w-3 h-3 mr-1" /> Lihat Surat Kesediaan Mitra
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center">
                                    <MapPin className="w-10 h-10 text-red-200 mb-2" />
                                    <p className="text-sm font-semibold text-red-700">Data Mitra Belum Ada</p>
                                </div>
                            )}
                        </section>

                        {/* 4. SUBSTANSI & LUARAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">4</span>
                                Substansi & Target
                            </h2>

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Dokumen Usulan
                            </h3>
                            {usulan.file_substansi ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 border-l-4 border-l-red-500">
                                    <div className="flex items-center">
                                        <div className="bg-red-50 p-2 rounded text-red-600 mr-3">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">File Substansi Pengabdian</p>
                                            <p className="text-xs text-gray-500">PDF • Klik tombol lihat untuk membaca</p>
                                        </div>
                                    </div>
                                    <a href={`/storage/${usulan.file_substansi}`} target="_blank" className="bg-white border text-xs font-semibold px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all">
                                        Lihat File
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-center mb-6">
                                    <Info className="w-5 h-5 mr-2" />
                                    File substansi belum diunggah oleh pengusul.
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-gray-500" /> Rincian Luaran (Step 4)
                            </h3>
                            {(usulan.luaran_items || usulan.luaranItems) && (usulan.luaran_items || usulan.luaranItems).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-inner">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Kategori</th>
                                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 border-l border-gray-100">Rincian Deskripsi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {(usulan.luaran_items || usulan.luaranItems).map((item: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-3 font-medium text-blue-700">{item.kategori}</td>
                                                    <td className="px-3 py-3 text-gray-600 text-xs italic border-l border-gray-50">{item.deskripsi}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-400">Data Luaran Belum Ada</p>
                                </div>
                            )}
                        </section>

                        {/* 5. RAB SUMMARY */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">5</span>
                                Rencana Anggaran (RAB)
                            </h2>
                            {(usulan.rab_items || usulan.rabItems) && (usulan.rab_items || usulan.rabItems).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-inner">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500">Item / Kategori</th>
                                                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 border-l border-gray-100">Volume</th>
                                                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 border-l border-gray-100">Satuan</th>
                                                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 border-l border-gray-100">Harga Satuan</th>
                                                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 border-l border-gray-100">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {(usulan.rab_items || usulan.rabItems).map((item: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-3">
                                                        <p className="font-semibold text-gray-900">{item.item}</p>
                                                        <p className="text-xs text-blue-600 font-medium">{item.kategori}</p>
                                                    </td>
                                                    <td className="px-3 py-3 text-right font-medium text-gray-600 border-l border-gray-50">{item.volume}</td>
                                                    <td className="px-3 py-3 text-right font-medium text-gray-600 border-l border-gray-50">{item.satuan}</td>
                                                    <td className="px-3 py-3 text-right font-medium text-gray-600 border-l border-gray-50">{formatRupiah(item.harga_satuan)}</td>
                                                    <td className="px-3 py-3 text-right font-semibold text-gray-900 border-l border-gray-50 bg-gray-50/50">{formatRupiah(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-400">Data RAB Tidak Ditemukan</p>
                                </div>
                            )}
                        </section>

                        {/* 5. PENILAIAN REVIEWER (READ-ONLY) */}
                        {initialScores && initialScores.length > 0 && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Hasil Penilaian Reviewer
                                </h2>
                                <ReviewScoringForm
                                    onChange={() => { }}
                                    maxFunding={Number(usulan?.dana_usulan_awal || usulan?.total_anggaran || 0)}
                                    initialScores={initialScores}
                                    isReadOnly={true}
                                    type="pengabdian"
                                />
                            </section>
                        )}

                        {/* 6. HISTORY */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">6</span>
                                Riwayat Transaksi & Keputusan
                            </h2>
                            <div className="space-y-6">
                                {usulan.review_histories && usulan.review_histories.length > 0 ? (
                                    usulan.review_histories.map((h: any, i: number) => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${h.action.includes('reject') ? 'bg-red-50 text-red-600' :
                                                    h.action.includes('approve') || h.action.includes('didanai') ? 'bg-green-50 text-green-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                {i < usulan.review_histories.length - 1 && <div className="w-px h-full bg-gray-100 my-1"></div>}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">
                                                            {h.action.replace(/_/g, ' ')}
                                                        </h4>
                                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">{h.reviewer_type?.replace(/_/g, ' ')}</span>
                                                        {h.reviewer && <span className="text-xs text-gray-500 ml-2 font-medium">({h.reviewer.name})</span>}
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium tabular-nums">
                                                        {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {h.comments && (
                                                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2 shadow-inner leading-relaxed border-l-4 border-l-blue-200">
                                                        <ExpandableText text={h.comments} limit={250} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-50">
                                        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm font-semibold text-gray-500">Aktivitas Kosong</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ACTIONS */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 sticky top-24">

                            {/* STATUS OVERLAY */}
                            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-800 overflow-hidden">
                                <div className="bg-gray-900 px-6 py-4">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-wide flex items-center">
                                        <Target className="w-3 h-3 mr-2 text-yellow-500" /> Tahapan Saat Ini
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className={`p-3 rounded-lg text-center font-bold text-sm shadow-sm border
                                        ${usulan.status === 'didanai' ? 'bg-green-100 text-green-900 border-green-300' :
                                            usulan.status.includes('reject') ? 'bg-red-100 text-red-900 border-red-300' :
                                                'bg-blue-100 text-blue-900 border-blue-300'
                                        }`}>
                                        {usulan.status.toUpperCase().replace(/_/g, ' ')}
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                                        <div className="bg-gray-50 p-2 rounded text-center border border-gray-100">
                                            RAB USULAN<br />
                                            <span className="text-gray-900 text-sm">
                                                {formatRupiah(
                                                    usulan.dana_usulan_awal ||
                                                    usulan.total_anggaran ||
                                                    (usulan.rabItems || usulan.rab_items || []).reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0)
                                                )}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center border border-gray-100">
                                            PAGU DISETUJUI<br />
                                            <span className="text-green-700 text-sm">{formatRupiah(usulan.dana_disetujui || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 1. ASSIGN REVIEWER */}
                            {['approved_prodi', 'reviewer_assigned'].includes(usulan.status) && (
                                <AdminActionCard
                                    title="Tunjuk Reviewer"
                                    icon={<User className="w-5 h-5 text-blue-600" />}
                                    description="Reviewer ini akan bertugas menilai kelayakan substansi dan teknis pengabdian."
                                >
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = new FormData(e.currentTarget);
                                        router.post(route('lppm.assign_reviewer', { type: 'pengabdian', id: usulan.id }), {
                                            reviewer_id: data.get('reviewer_id')
                                        });
                                    }}>
                                        <select name="reviewer_id" defaultValue={usulan.reviewer_id} className="w-full text-sm font-medium border-gray-200 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                                            <option value="">-- PILIH NAMA REVIEWER --</option>
                                            {reviewers?.map((r: any) => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transform active:scale-95 transition-all">
                                            ASSIGN & NOTIFIKASI
                                        </button>
                                    </form>
                                </AdminActionCard>
                            )}

                            {/* 2. SET BUDGET (Admin Revision Request) */}
                            {usulan.status === 'under_revision_admin' && (
                                <AdminActionCard
                                    title="Evaluasi & Pagu Dana"
                                    icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                                    description="Tetapkan pagu dana maksimal yang disetujui untuk dikerjakan ulang oleh dosen."
                                >
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = new FormData(e.currentTarget);
                                        router.post(route('lppm.set_budget', { type: 'pengabdian', id: usulan.id }), {
                                            dana_disetujui: paguDisp.replace(/\./g, '')
                                        });
                                    }}>
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Pagu Dana Disetujui</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1 text-sm font-bold text-emerald-600">Rp</div>
                                                <input
                                                    type="text"
                                                    name="dana_disetujui"
                                                    value={paguDisp}
                                                    onChange={handlePaguChange}
                                                    className="w-full pl-10 text-sm font-bold border-gray-200 rounded-lg focus:ring-emerald-500 bg-emerald-50/20"
                                                    placeholder="Contoh: 10.000.000"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 italic">
                                                * Maksimal dana sesuai RAB: {formatRupiah(usulan.total_anggaran)}
                                            </p>
                                        </div>
                                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md">
                                            REQUEST REVISI DOSEN
                                        </button>
                                    </form>
                                </AdminActionCard>
                            )}

                            {/* 3. FINAL DECISION */}
                            {['reviewed_approved', 'resubmitted_revision'].includes(usulan.status) && (
                                <AdminActionCard
                                    title="Persetujuan LPPM"
                                    icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
                                    description={usulan.status === 'resubmitted_revision'
                                        ? 'Usulan telah direvisi. Tentukan status pendanaan.'
                                        : 'Reviewer telah menyetujui. Tentukan status pendanaan.'}
                                >
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => setIsContractModalOpen(true)}
                                            className="bg-green-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md transition-all"
                                        >
                                            SETUJUI & DANAI SEKARANG
                                        </button>
                                        <button
                                            onClick={() => router.post(route('lppm.final_decision', { type: 'pengabdian', id: usulan.id }), { decision: 'ditolak_akhir' })}
                                            className="bg-white text-red-600 py-3 rounded-lg text-sm font-bold hover:bg-red-50 border border-red-200 shadow-sm"
                                        >
                                            TOLAK PENDANAAN
                                        </button>
                                    </div>
                                </AdminActionCard>
                            )}

                        </div>
                    </div>
                </div>

                {/* Contract Modal */}
                <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Terbitkan Kontrak</DialogTitle>
                            <DialogDescription>
                                Masukkan detail kontrak untuk usulan yang didanai ini.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contract_number" className="text-right text-xs">
                                    No. Kontrak
                                </Label>
                                <Input
                                    id="contract_number"
                                    value={contractNumber}
                                    onChange={(e) => setContractNumber(e.target.value)}
                                    className="col-span-3 h-9 text-sm"
                                    placeholder="Nomor Kontrak..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contract_start_date" className="text-right text-xs">
                                    Tanggal Mulai
                                </Label>
                                <Input
                                    id="contract_start_date"
                                    type="date"
                                    value={contractStartDate}
                                    onChange={(e) => setContractStartDate(e.target.value)}
                                    className="col-span-3 h-9 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contract_end_date" className="text-right text-xs">
                                    Tanggal Selesai
                                </Label>
                                <Input
                                    id="contract_end_date"
                                    type="date"
                                    value={contractEndDate}
                                    onChange={(e) => setContractEndDate(e.target.value)}
                                    className="col-span-3 h-9 text-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50" onClick={() => setIsContractModalOpen(false)}>Batal</button>
                            <button
                                type="button"
                                onClick={handleDidanaiSubmit}
                                disabled={!contractNumber || processingDecision}
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                            >
                                {processingDecision ? 'Menyimpan...' : 'Simpan & Danai'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div >
    );
}
