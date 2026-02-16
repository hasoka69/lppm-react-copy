import React, { useState } from 'react';
declare var route: any;
import { Link, Head, router } from '@inertiajs/react';
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
    Layers,
    BookOpen,
    ChevronLeft,
    Users,
    Clock,
    CheckCircle,
    Download,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { formatAcademicYear } from '@/utils/academicYear';

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function AdminPenelitianDetail({ usulan, reviewers, initialScores = [], isReadOnly = false }: ProposalDetailProps) {
    const formatRupiah = (number: any, includeSymbol = true) => {
        const value = typeof number === 'string' ? parseFloat(number) : number;
        const formatted = new Intl.NumberFormat('id-ID', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);

        return includeSymbol ? `Rp ${formatted}` : formatted;
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
    const [contractDate, setContractDate] = useState('');
    const [contractStartDate, setContractStartDate] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const [processingDecision, setProcessingDecision] = useState(false);

    const handleDidanaiSubmit = () => {
        if (!contractNumber) {
            return;
        }
        setProcessingDecision(true);
        router.post(route('lppm.final_decision', { type: 'penelitian', id: usulan.id }), {
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
        <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title={`Admin Detail Penelitian - ${usulan.judul}`} />
            <Header />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Link href="/lppm/dashboard" className="hover:text-primary transition-colors flex items-center">
                                <Home className="w-3.5 h-3.5 mr-1" /> Dashboard
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-400" />
                            <Link href="/lppm/penelitian" className="hover:text-primary transition-colors">Daftar Penelitian</Link>
                            <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-400" />
                            <span className="font-medium text-gray-900">Detail Usulan</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tinjauan Usulan Penelitian</h1>
                        <p className="text-muted-foreground text-sm">Kelola dan tinjau detail usulan penelitian dosen.</p>
                    </div>

                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/lppm/penelitian">
                            <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: PRIMARY CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. IDENTITAS USULAN */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold text-gray-800">Identitas Usulan</CardTitle>
                                        <CardDescription>Informasi dasar mengenai usulan penelitian yang diajukan.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">ID: {usulan.id}</Badge>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px]">
                                            Mode: Administrator
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">{usulan.judul || 'Judul Tidak Ditemukan'}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                            {usulan.kelompok_skema || 'Skema Tidak Ada'}
                                        </Badge>
                                        <Badge variant="outline" className="text-gray-600">
                                            {formatAcademicYear(usulan.tahun_pertama)}
                                        </Badge>
                                        <Badge variant="outline" className="text-gray-600">
                                            {usulan.lama_kegiatan} Tahun
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">TKT Saat Ini & Target</span>
                                            <div className="flex items-center gap-2 font-medium">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">Saat Ini: {usulan.tkt_saat_ini || '-'}</span>
                                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                                <span className="bg-green-50 px-2 py-1 rounded text-green-700 border border-green-100">Target: {usulan.target_akhir_tkt || '-'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Ruang Lingkup</span>
                                            <p className="font-medium text-gray-800">{usulan.ruang_lingkup || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Bidang Fokus</span>
                                            <div className="flex items-center text-gray-800 font-medium">
                                                <Target className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                                {usulan.bidang_fokus || '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Kategori SBK</span>
                                            <p className="font-medium text-gray-800">{usulan.kategori_sbk || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Tema Penelitian</span>
                                            <p className="font-medium text-gray-800">{usulan.tema_penelitian || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Topik Penelitian</span>
                                            <p className="font-medium text-gray-800">{usulan.topik_penelitian || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center">
                                        <Layers className="w-3.5 h-3.5 mr-2" /> Rumpun Ilmu
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Level 1</p>
                                            <p className="text-xs font-medium text-slate-900">{usulan.rumpun_ilmu_1 || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Level 2</p>
                                            <p className="text-xs font-medium text-slate-900">{usulan.rumpun_ilmu_2 || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Level 3</p>
                                            <p className="text-xs font-medium text-slate-900">{usulan.rumpun_ilmu_3 || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. TIM PENELITI */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-bold text-gray-800">Tim Peneliti</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">Nama & Peran</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">NIDN / Identitas</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">Prodi & Tugas</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* Ketua */}
                                            <tr className="bg-blue-50/30">
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex items-start">
                                                        <Avatar className="h-9 w-9 mr-3 border-2 border-white shadow-sm mt-0.5">
                                                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                                                                {usulan.ketua?.name?.charAt(0) || 'K'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-bold text-gray-900 leading-snug">{usulan.ketua?.name}</div>
                                                            <div className="text-xs text-blue-600 font-medium mb-1">{usulan.ketua?.email}</div>
                                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 text-[10px] px-1.5 py-0.5 h-auto">Ketua Pengusul</Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 font-medium align-top pt-3.5">
                                                    {usulan.ketua?.dosen?.nidn || '-'}
                                                </td>
                                                <td className="px-4 py-3 align-top pt-3.5">
                                                    <div className="text-sm text-gray-900 font-medium">{usulan.ketua?.dosen?.prodi || '-'}</div>
                                                </td>
                                            </tr>

                                            {/* Anggota Dosen */}
                                            {(usulan.anggota_dosen || usulan.anggotaDosen)?.map((anggota: any, idx: number) => (
                                                <tr key={`dosen-${idx}`}>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-start">
                                                            <Avatar className="h-9 w-9 mr-3 border border-gray-100 mt-0.5">
                                                                <AvatarFallback className="bg-gray-100 text-gray-500 text-xs">
                                                                    {anggota.nama?.charAt(0) || 'D'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-gray-900 leading-snug">{anggota.nama || anggota.dosen?.nama}</div>
                                                                <Badge variant="outline" className="text-gray-600 border-gray-300 capitalize text-[10px] px-1.5 py-0.5 h-auto mt-1">
                                                                    {anggota.peran || 'Anggota'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 align-top pt-3.5">
                                                        {anggota.nidn || anggota.dosen?.nidn || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="text-sm text-gray-900 font-medium pt-0.5">{anggota.dosen?.prodi || anggota.prodi || '-'}</div>
                                                        {anggota.tugas && <div className="text-xs text-gray-500 mt-1 leading-relaxed">{anggota.tugas}</div>}
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* Anggota Mahasiswa */}
                                            {(usulan.anggota_non_dosen || usulan.anggotaNonDosen)?.map((mhs: any, idx: number) => (
                                                <tr key={`mhs-${idx}`}>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-start">
                                                            <Avatar className="h-9 w-9 mr-3 border border-gray-100 mt-0.5">
                                                                <AvatarFallback className="bg-orange-50 text-orange-600 text-xs">
                                                                    {mhs.nama?.charAt(0) || 'M'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-gray-900 leading-snug">{mhs.nama}</div>
                                                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 capitalize text-[10px] px-1.5 py-0.5 h-auto mt-1">
                                                                    {mhs.jenis_anggota || 'Mahasiswa'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 align-top pt-3.5">
                                                        {mhs.no_identitas || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="text-sm text-gray-900 font-medium pt-0.5">{mhs.jurusan || '-'}</div>
                                                        {mhs.tugas && <div className="text-xs text-gray-500 mt-1 leading-relaxed">{mhs.tugas}</div>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(!usulan.anggota_dosen?.length && !usulan.anggota_non_dosen?.length && !usulan.anggotaDosen?.length && !usulan.anggotaNonDosen?.length) && (
                                        <div className="p-4 text-center text-sm text-gray-500 italic">
                                            Hanya Ketua Pengusul, tidak ada anggota lain.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. SUBSTANSI & LUARAN */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-bold text-gray-800">Substansi & Luaran</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-blue-500" /> Dokumen Proposal
                                    </h3>
                                    {usulan.file_substansi ? (
                                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-red-50 p-2.5 rounded-lg text-red-600">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">File Substansi Usulan</p>
                                                    <p className="text-xs text-gray-500">PDF Document</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="gap-2">
                                                <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-3.5 h-3.5" /> Unduh
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>File Hilang</AlertTitle>
                                            <AlertDescription>
                                                Pengusul belum mengunggah file substansi proposal ini.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                        <Target className="w-4 h-4 mr-2 text-emerald-500" /> Target Luaran
                                    </h3>
                                    {(usulan.luaran_list || usulan.luaranList) && (usulan.luaran_list || usulan.luaranList).length > 0 ? (
                                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-gray-50 font-medium text-gray-500">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider">Kategori</th>
                                                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider">Rincian</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {(usulan.luaran_list || usulan.luaranList)?.map((item: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-3 text-gray-700 w-1/3">{item.kategori}</td>
                                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.deskripsi}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 text-center">Tidak ada target luaran.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. PENILAIAN REVIEWER (READ-ONLY) */}
                        {initialScores && initialScores.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Hasil Penilaian Reviewer</h2>
                                </div>
                                <ReviewScoringForm
                                    onChange={() => { }}
                                    maxFunding={Number(usulan?.dana_usulan_awal || usulan?.total_anggaran || 0)}
                                    initialScores={initialScores}
                                    isReadOnly={true}
                                    type="penelitian"
                                />
                            </div>
                        )}

                        {/* 4. RAB SUMMARY */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-bold text-gray-800">Rencana Anggaran Biaya</CardTitle>
                                    <div className="flex flex-col items-end gap-1">
                                        {usulan.dana_disetujui > 0 && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                Disetujui: {formatRupiah(usulan.dana_disetujui, false)}
                                            </Badge>
                                        )}
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                            Total: {formatRupiah(usulan.total_anggaran)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 px-0">
                                {(usulan.rab_items || usulan.rabItems) && (usulan.rab_items || usulan.rabItems).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Item Belanja</th>
                                                    <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Volume</th>
                                                    <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Harga Satuan</th>
                                                    <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {(usulan.rab_items || usulan.rabItems)?.map((item: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-3 font-medium text-gray-900">{item.item}</td>
                                                        <td className="px-6 py-3 text-right text-muted-foreground">{item.volume} {item.satuan}</td>
                                                        <td className="px-6 py-3 text-right text-muted-foreground">{formatRupiah(item.harga_satuan)}</td>
                                                        <td className="px-6 py-3 text-right font-bold text-gray-800">{formatRupiah(item.total)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <DollarSign className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada rincian anggaran.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>

                    {/* RIGHT COLUMN: ACTION PANEL */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 sticky top-24">
                            {/* Status Dashboard Overlay */}
                            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-900 overflow-hidden">
                                <div className="bg-gray-900 px-6 py-4">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-wide flex items-center">
                                        <Target className="w-3 h-3 mr-2 text-yellow-500" /> Tahapan Saat Ini
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className={`p-3 rounded-lg text-center font-bold text-sm shadow-sm border
                                        ${usulan.status === 'didanai' ? 'bg-green-100 text-green-900 border-green-300' :
                                            usulan.status.includes('reject') || usulan.status.includes('tolak') ? 'bg-red-100 text-red-900 border-red-300' :
                                                'bg-blue-100 text-blue-900 border-blue-300'
                                        }`}>
                                        {usulan.status.toUpperCase().replace(/_/g, ' ')}
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                                        <div className="bg-gray-50 p-2 rounded text-center border border-gray-100">
                                            RAB USULAN<br />
                                            <span className="text-gray-900 text-sm">{formatRupiah(usulan.dana_usulan_awal || usulan.total_anggaran)}</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center border border-gray-100">
                                            PAGU DISETUJUI<br />
                                            <span className="text-green-700 text-sm">{formatRupiah(usulan.dana_disetujui || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Status Card */}
                            <Card className="border-gray-200 shadow-md">
                                <CardHeader className="bg-gray-900 text-white rounded-t-lg py-4">
                                    <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider text-white">
                                        <Info className="w-4 h-4 mr-2 text-blue-400" /> Status Usulan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 text-center">
                                    <Badge variant={usulan.status === 'didanai' ? 'default' : usulan.status.includes('reject') || usulan.status.includes('tolak') ? 'destructive' : 'secondary'} className="text-sm py-1.5 px-4 uppercase tracking-wide mb-4">
                                        {usulan.status.replace(/_/g, ' ')}
                                    </Badge>

                                    <div className="text-left space-y-4 border-t pt-4">
                                        <div>
                                            <span className="text-xs text-muted-foreground block mb-0.5">Diajukan Tanggal</span>
                                            <p className="text-sm font-medium text-gray-900">{new Date(usulan.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block mb-0.5">Reviewer Terpilih</span>
                                            {usulan.reviewer ? (
                                                <div className="flex items-center mt-1">
                                                    <Avatar className="h-6 w-6 mr-2">
                                                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{usulan.reviewer.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-sm font-medium text-gray-900">{usulan.reviewer.name}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">Belum ditunjuk</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* HISTORY REVIEW */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="border-b border-gray-100 py-4">
                                    <CardTitle className="text-base font-bold text-gray-800">Riwayat & Log</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-6 pl-2">
                                        {((usulan.review_histories || usulan.reviewHistories) && (usulan.review_histories || usulan.reviewHistories).length > 0) ? (
                                            (usulan.review_histories || usulan.reviewHistories).map((h: any, i: number) => (
                                                <div key={i} className="relative pl-6 border-l border-gray-200 last:border-0">
                                                    <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 border-white ${h.action.includes('reject') ? 'bg-red-500' :
                                                        h.action.includes('approve') || h.action.includes('didanai') ? 'bg-green-500' :
                                                            'bg-blue-500'
                                                        }`}></div>
                                                    <div className="mb-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                                            {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                                                            {h.action.replace(/_/g, ' ')}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Oleh: <span className="font-semibold">{h.reviewer?.name || h.reviewer_type?.replace(/_/g, ' ')}</span>
                                                    </p>
                                                    {h.comments && (
                                                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100 italic">
                                                            <ExpandableText text={h.comments} limit={100} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-gray-400">
                                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-xs">Belum ada aktivitas.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ACTIONS */}
                            {/* 1. ASSIGN REVIEWER */}
                            {['approved_prodi', 'reviewer_assigned'].includes(usulan.status) && (
                                <Card className="border-blue-200 shadow-sm bg-blue-50/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-bold text-blue-800 flex items-center">
                                            <User className="w-4 h-4 mr-2" /> Tunjuk Reviewer
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const data = new FormData(e.currentTarget);
                                            router.post(route('lppm.assign_reviewer', { type: 'penelitian', id: usulan.id }), {
                                                reviewer_id: data.get('reviewer_id')
                                            });
                                        }}>
                                            <select name="reviewer_id" defaultValue={usulan.reviewer_id} className="w-full text-sm border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500">
                                                <option value="">-- Cari Reviewer --</option>
                                                {reviewers?.map((r: any) => (
                                                    <option key={r.id} value={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                            <Button type="submit" className="w-full">
                                                Tunjuk & Kirim Akses
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* 2. SET BUDGET (Admin Revision Request) */}
                            {usulan.status === 'under_revision_admin' && (
                                <Card className="border-emerald-200 shadow-sm bg-emerald-50/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-bold text-emerald-800 flex items-center">
                                            <DollarSign className="w-4 h-4 mr-2" /> Tentukan Pagu Dana
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const data = new FormData(e.currentTarget);
                                            router.post(route('lppm.set_budget', { type: 'penelitian', id: usulan.id }), {
                                                dana_disetujui: paguDisp.replace(/\./g, '')
                                            });
                                        }}>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-emerald-700 uppercase">Pagu Dana Disetujui (Rp)</label>
                                                    <div className="relative mt-1">
                                                        <span className="absolute left-3 top-1 text-gray-500 text-sm font-bold">Rp</span>
                                                        <input
                                                            type="text"
                                                            name="dana_disetujui"
                                                            value={paguDisp}
                                                            onChange={handlePaguChange}
                                                            className="w-full pl-10 text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 font-bold"
                                                            placeholder="Contoh: 10.000.000"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1 italic italic">
                                                        * Maksimal dana sesuai RAB: {formatRupiah(usulan.total_anggaran)}
                                                    </p>
                                                </div>
                                                <Button type="submit" variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                    Simpan & Minta Revisi
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* 3. FINAL DECISION */}
                            {['reviewed_approved', 'resubmitted_revision'].includes(usulan.status) && (
                                <Card className="border-purple-200 shadow-sm bg-white overflow-hidden ring-1 ring-purple-500">
                                    <CardHeader className="bg-purple-50 border-b border-purple-100 pb-3">
                                        <CardTitle className="text-sm font-bold text-purple-900 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" /> Keputusan Akhir LPPM
                                        </CardTitle>
                                        <CardDescription className="text-xs text-purple-700">
                                            {usulan.status === 'resubmitted_revision'
                                                ? 'Usulan telah direvisi. Tentukan status pendanaan.'
                                                : 'Reviewer telah menyetujui. Tentukan status pendanaan.'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4 grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={() => setIsContractModalOpen(true)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                        >
                                            DIDANAI
                                        </Button>
                                        <Button
                                            onClick={() => router.post(route('lppm.final_decision', { type: 'penelitian', id: usulan.id }), { decision: 'ditolak_akhir' })}
                                            variant="destructive"
                                            className="font-bold"
                                        >
                                            TOLAK
                                        </Button>
                                    </CardContent>
                                </Card>
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
                                <Label htmlFor="contract_number" className="text-right">
                                    No. Kontrak
                                </Label>
                                <Input
                                    id="contract_number"
                                    value={contractNumber}
                                    onChange={(e) => setContractNumber(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Nomor Kontrak..."
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contract_start_date" className="text-right">
                                    Tanggal Mulai
                                </Label>
                                <Input
                                    id="contract_start_date"
                                    type="date"
                                    value={contractStartDate}
                                    onChange={(e) => setContractStartDate(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contract_end_date" className="text-right">
                                    Tanggal Selesai
                                </Label>
                                <Input
                                    id="contract_end_date"
                                    type="date"
                                    value={contractEndDate}
                                    onChange={(e) => setContractEndDate(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsContractModalOpen(false)}>Batal</Button>
                            <Button type="button" onClick={handleDidanaiSubmit} disabled={!contractNumber || processingDecision}>
                                {processingDecision ? 'Menyimpan...' : 'Simpan & Danai'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main >
            <Footer />
        </div >
    );
}
