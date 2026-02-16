import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    ChevronLeft,
    FileText,
    User,
    Users,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Building,
    MapPin,
    Target,
    Layers,
    BookOpen,
    Clock,
    Download,
    GraduationCap
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import ReviewScoringForm from '@/components/ReviewScoringForm';
import { formatAcademicYear } from '@/utils/academicYear';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Dosen {
    id: number;
    nama: string;
    nidn: string;
    prodi: string;
    fakultas: string;
}

interface AnggotaDosen {
    id: number;
    nidn: string;
    nama: string;
    peran: string;
    tugas?: string;
    dosen?: Dosen;
}

interface AnggotaNonDosen {
    id: number;
    nama: string;
    no_identitas: string;
    jenis_anggota: string;
    tugas: string;
}

interface Mitra {
    id: number;
    nama_mitra: string;
    jenis_mitra: string;
    alamat_mitra: string;
    penanggung_jawab: string;
    jabatan_penanggung_jawab: string;
    no_telepon: string;
    email: string;
    nama_provinsi: string;
    nama_kota: string;
    jarak_mitra: number;
    file_surat_kesediaan: string;
    file_mitra: string;
    kelompok_mitra?: string;
    dana_pendamping?: number;
    pendanaan_tahun_1?: number;
}

interface RabItem {
    id: number;
    item: string;
    harga_satuan: number;
    volume: number;
    satuan: string;
    total: number;
    tipe: string;
    keterangan?: string;
}

interface Luaran {
    id: number;
    tahun: number;
    kategori: string;
    jenis: string;
    deskripsi: string;
    status: string;
    is_wajib?: boolean;
    keterangan?: string;
}

interface Proposal {
    id: number;
    judul: string;
    kelompok_skema: string;
    ruang_lingkup: string;
    tahun_pertama: number;
    tugas_ketua?: string;

    jenis_bidang_fokus?: string;
    bidang_fokus?: string;
    rumpun_ilmu_level1_label?: string;
    rumpun_ilmu_level2_label?: string;
    rumpun_ilmu_level3_label?: string;
    file_substansi: string;
    status: string;
    ketua: {
        dosen: Dosen
    };
    anggota_dosen: AnggotaDosen[];
    mitra?: Mitra[];
    rabItems?: RabItem[];
    dana_disetujui?: number;
    total_anggaran?: number;
    dana_usulan_awal?: number;
    luaranItems?: Luaran[];

    // Additional fields for display consistency if needed
    tema_pengabdian?: string; // Hypothetical
}

interface PageProps {
    proposal: Proposal;
    dosen: Dosen;
    mitra: Mitra[];
    anggotaNonDosen: AnggotaNonDosen[];
    rabItem: RabItem[];
    luaran: Luaran[];
    totalAnggaran: number;
    isReadOnly?: boolean;
    initialScores?: any[];
    [key: string]: unknown;
}

export default function ReviewPengabdian({
    proposal,
    dosen,
    mitra = [],
    anggotaNonDosen = [],
    rabItem = [],
    luaran = [],
    totalAnggaran = 0,
    isReadOnly = false,
    initialScores = []
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        comments: '',
        scores: [] as any[],
        dana_disetujui: 0,
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);
    const [recommendation, setRecommendation] = useState(0);

    const handleActionClick = (type: 'approve' | 'reject' | 'revise') => {
        if (type !== 'approve' && !data.comments) {
            toast.error('Harap berikan komentar/alasan terlebih dahulu.');
            return;
        }
        setActionType(type);
        setData('action', type);
        setIsConfirming(true);
    };

    const submitReview = () => {
        post(route('reviewer.usulan_pengabdian.review', proposal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirming(false);
                toast.success('Review berhasil dikirim');
            },
            onError: (err) => {
                setIsConfirming(false);
                toast.error('Gagal mengirim review.');
                console.error(err);
            }
        });
    };

    const handleScoringChange = (scores: any[], total: number, rec: number) => {
        setData(data => ({
            ...data,
            scores: scores,
            dana_disetujui: rec
        }));
        setRecommendation(rec);
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const items = rabItem.length > 0 ? rabItem : (proposal.rabItems || []);
    const rabGroups = {
        'Belanja Bahan': items.filter(i => i.tipe === 'bahan'),
        'Belanja Perjalanan': items.filter(i => i.tipe === 'perjalanan'),
        'Lain-lain / Publikasi': items.filter(i => !['bahan', 'perjalanan'].includes(i.tipe)),
    };
    const mitras = Array.isArray(mitra) ? mitra : (mitra ? [mitra] : []);

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            <Head title={`Review Pengabdian: ${proposal.judul}`} />
            <Header />
            <Toaster position="top-right" richColors />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link
                            href={isReadOnly ? route('reviewer.penilaian.index') : "/reviewer/usulan"}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke {isReadOnly ? 'Riwayat' : 'Daftar Usulan'}
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                            Review Usulan Pengabdian
                        </h1>
                        <p className="text-sm text-gray-500">
                            ID Usulan: <span className="font-mono text-gray-700">{proposal.id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-3 py-1 bg-white">
                            Tahun {formatAcademicYear(proposal.tahun_pertama)}
                        </Badge>
                        <Badge className={`${proposal.status === 'submitted' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            proposal.status === 'needs_revision' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                'bg-gray-100 text-gray-800'
                            } border-0`}>
                            {proposal.status === 'submitted' ? 'Menunggu Review' :
                                proposal.status === 'needs_revision' ? 'Sedang Revisi' : proposal.status.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: PROPOSAL CONTENT */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. MAIN IDENTITY CARD */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100">
                                <h2 className="text-lg font-bold text-blue-900 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    Identitas Proposal Lengkap
                                </h2>
                            </div>
                            <CardContent className="p-6 space-y-8">
                                {/* Judul & Skema */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Judul Pengabdian</label>
                                    <h3 className="text-xl font-bold text-gray-900 leading-relaxed">{proposal.judul}</h3>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                            {proposal.kelompok_skema}
                                        </Badge>
                                        <Badge variant="outline" className="text-gray-600">
                                            {proposal.ruang_lingkup}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Klasifikasi Riset */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-blue-500" /> Klasifikasi & Fokus
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Jenis Bidang Fokus</label>
                                                <p className="font-medium text-gray-800 capitalize">{proposal.jenis_bidang_fokus}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Bidang Fokus</label>
                                                <p className="font-medium text-gray-800">{proposal.bidang_fokus}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rumpun Ilmu */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-purple-500" /> Rumpun Ilmu
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Level 1</label>
                                            <p className="font-semibold text-gray-800 text-sm">{proposal.rumpun_ilmu_level1_label || '-'}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Level 2</label>
                                            <p className="font-semibold text-gray-800 text-sm">{proposal.rumpun_ilmu_level2_label || '-'}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Level 3</label>
                                            <p className="font-semibold text-gray-800 text-sm">{proposal.rumpun_ilmu_level3_label || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. TEAM MEMBERS CARD */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                                    Tim Pelaksana
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100">
                                    {/* Ketua */}
                                    <div className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 border border-blue-200">
                                            {dosen.nama.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{dosen.nama}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-[10px]">Ketua Pengusul</Badge>
                                                        <span className="text-xs text-gray-500">{dosen.prodi}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-mono text-gray-500">{dosen.nidn}</span>
                                                </div>
                                            </div>

                                            {proposal.tugas_ketua && (
                                                <div className="mt-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-xs">
                                                    <span className="font-bold text-blue-700 block mb-0.5">Tugas Ketua:</span>
                                                    <span className="text-gray-700 leading-relaxed">{proposal.tugas_ketua}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dosen Members */}
                                    {(proposal.anggota_dosen || []).map((anggota, idx) => (
                                        <div key={`dosen-${idx}`} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors pl-8">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-xs border border-gray-200">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{anggota.nama || anggota.dosen?.nama}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-500">Anggota Dosen</span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">{anggota.peran}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-mono text-gray-500">{anggota.nidn}</span>
                                                    </div>
                                                </div>
                                                {anggota.tugas && (
                                                    <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">
                                                        <span className="font-medium text-gray-500">Tugas:</span> {anggota.tugas}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Mahasiswa Members */}
                                    {(anggotaNonDosen || []).map((mhs, idx) => (
                                        <div key={`mhs-${idx}`} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors pl-8">
                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs border border-orange-100">
                                                M
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{mhs.nama}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-500">Mahasiswa</span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">{mhs.jenis_anggota}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-mono text-gray-500">{mhs.no_identitas}</span>
                                                    </div>
                                                </div>
                                                {mhs.tugas && (
                                                    <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">
                                                        <span className="font-medium text-gray-500">Tugas:</span> {mhs.tugas}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. MITRA SASARAN */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                    <Building className="w-5 h-5 mr-2 text-gray-500" />
                                    Mitra Sasaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {mitras.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6">
                                        {mitras.map((m, index) => (
                                            <div key={m.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 hover:border-blue-200 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                                            <Building className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm">{m.nama_mitra}</h4>
                                                            <p className="text-xs text-gray-500">{m.jenis_mitra}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-white">
                                                        {m.kelompok_mitra || 'Mitra Umum'}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase block">Lokasi</label>
                                                            <span className="text-gray-700">{m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase block">Penanggung Jawab</label>
                                                            <span className="text-gray-700">{m.penanggung_jawab} ({m.jabatan_penanggung_jawab})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block">Dana Pendamping</label>
                                                        <span className="text-sm font-bold text-emerald-600">
                                                            {formatRupiah(m.dana_pendamping || Number(m.pendanaan_tahun_1) || 0)}
                                                        </span>
                                                    </div>
                                                    {m.file_surat_kesediaan ? (
                                                        <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" rel="noreferrer">
                                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                                                                <FileText className="w-3 h-3" /> Surat Mitra
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-red-500 italic">* Tidak ada file surat</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <Building className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Tidak ada data mitra sasaran.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 4. TARGET LUARAN */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                    <Target className="w-5 h-5 mr-2 text-gray-500" />
                                    Target Luaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {(luaran || []).length > 0 ? (
                                        (luaran || []).map((item, idx) => (
                                            <div key={`luaran-${idx}`} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                                                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0">
                                                            Luaran #{idx + 1}
                                                        </Badge>
                                                        <span className="text-sm font-bold text-gray-700">{item.kategori}</span>
                                                    </div>
                                                    <Badge variant={item.is_wajib ? "default" : "secondary"} className={item.is_wajib ? "bg-blue-600" : ""}>
                                                        {item.is_wajib ? 'Wajib' : 'Tambahan'}
                                                    </Badge>
                                                </div>

                                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
                                                        <p className="font-medium text-gray-800">{item.status || 'Rencana'}</p>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Deskripsi Luaran</label>
                                                        <p className="font-medium text-gray-800 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                                            {item.deskripsi}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Tidak ada target luaran yang terdaftar.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. PDF VIEWER */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                                        Substansi Proposal
                                    </CardTitle>
                                    {proposal.file_substansi && (
                                        <a href={`/storage/${proposal.file_substansi}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                <Download className="w-3 h-3 mr-2" /> Download PDF
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {proposal.file_substansi ? (
                                    <div className="w-full bg-slate-100 flex flex-col items-center justify-center min-h-[600px]">
                                        <iframe
                                            src={`/storage/${proposal.file_substansi}#toolbar=0&navpanes=0&scrollbar=0`}
                                            className="w-full h-[800px] border-0"
                                            title="Dokumen Substansi"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>File substansi belum diunggah oleh pengusul.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 6. RAB SUMMARY */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                                        Ringkasan RAB
                                    </CardTitle>
                                    <div className="flex flex-col items-end gap-1">
                                        {(proposal?.dana_disetujui ?? 0) > 0 && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Pagu Admin: {formatRupiah(Number(proposal?.dana_disetujui ?? 0))}</span>}
                                        <Badge variant="secondary" className="text-sm font-bold bg-green-50 text-green-700 border-green-200">
                                            Total: {formatRupiah(totalAnggaran)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-8 p-6">
                                    {Object.entries(rabGroups).map(([group, filteredItems]) => {
                                        const groupItems = filteredItems as any[];
                                        if (groupItems.length === 0) return null;
                                        const groupTotal = groupItems.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

                                        return (
                                            <div key={group} className="space-y-3">
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">
                                                    {group}
                                                </h4>
                                                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-gray-50/50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left font-medium text-gray-500 text-xs">Item</th>
                                                                <th className="px-4 py-3 text-center font-medium text-gray-500 text-xs w-[100px]">Vol / Sat</th>
                                                                <th className="px-4 py-3 text-right font-medium text-gray-500 text-xs w-[140px]">Harga Satuan</th>
                                                                <th className="px-4 py-3 text-right font-medium text-gray-500 text-xs w-[140px]">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {groupItems.map((item, idx) => (
                                                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                                                    <td className="px-4 py-3 text-gray-800">
                                                                        {item.item}
                                                                        {item.keterangan && <div className="text-[10px] text-gray-400 mt-0.5">{item.keterangan}</div>}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center text-gray-600">
                                                                        {item.volume} {item.satuan}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-600 font-mono text-xs">
                                                                        {formatRupiah(item.harga_satuan)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right text-gray-800 font-bold font-mono text-xs">
                                                                        {formatRupiah(item.total)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-gray-50/50 font-bold text-gray-700">
                                                            <tr>
                                                                <td colSpan={3} className="px-4 py-2 text-right text-xs uppercase text-gray-500">Subtotal {group}</td>
                                                                <td className="px-4 py-2 text-right text-xs font-mono">{formatRupiah(groupTotal)}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: STICKY REVIEW FORM */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="mb-6">
                            <ReviewScoringForm
                                onChange={handleScoringChange}
                                maxFunding={Number(proposal?.dana_usulan_awal || proposal?.total_anggaran || 0)}
                                initialScores={initialScores}
                                isReadOnly={isReadOnly}
                                type="pengabdian"
                            />
                        </div>

                        {!isReadOnly && (
                            <Card className="border-gray-200 shadow-lg border-t-4 border-t-blue-600 overflow-hidden">
                                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                                    <CardTitle className="text-lg font-bold text-gray-900">Form Keputusan</CardTitle>
                                    <CardDescription>
                                        Berikan penilaian dan keputusan Anda terhadap usulan ini.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Catatan Reviewer</label>
                                        <Textarea
                                            placeholder="Tuliskan komentar substansial, masukan perbaikan, atau alasan penolakan..."
                                            className="min-h-[200px] text-sm resize-none focus-visible:ring-blue-500"
                                            value={data.comments}
                                            onChange={(e) => setData('comments', e.target.value)}
                                        />
                                        {errors.comments && <p className="text-xs text-red-500 font-medium mt-1">{errors.comments}</p>}
                                        <p className="text-[11px] text-gray-400">
                                            *Komentar wajib diisi jika ada perbaikan atau penolakan.
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        {/* Phase 2 Check: Only show Approve if status is resubmitted_revision OR user explicitly wants it? 
                                            Usually standard flow allows approval if passing score.
                                            Adjusting based on previous Review.tsx logic:
                                            Check if status allows approval straight away or if logic differs.
                                        */}

                                        {proposal.status === 'resubmitted_revision' && (
                                            <Button
                                                type="button"
                                                onClick={() => handleActionClick('approve')}
                                                disabled={processing}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Setujui Proposal
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            onClick={() => handleActionClick('revise')}
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Minta Revisi / Kirim Masukan
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => handleActionClick('reject')}
                                            disabled={processing}
                                            variant="destructive"
                                            className="w-full justify-start"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Tolak Permanen
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
                                    <p className="text-[10px] text-center w-full text-gray-400 leading-tight">
                                        Keputusan Anda bersifat final untuk tahap ini. Pastikan telah membaca seluruh dokumen.
                                    </p>
                                </CardFooter>
                            </Card>
                        )}
                    </div>
                </div>

                {/* MODAL KONFIRMASI (Custom Dialog) */}
                {isConfirming && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                            <div className={`p-6 ${actionType === 'approve' ? 'bg-green-50' :
                                actionType === 'revise' ? 'bg-blue-50' : 'bg-red-50'
                                }`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${actionType === 'approve' ? 'bg-green-100 text-green-600' :
                                    actionType === 'revise' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {actionType === 'approve' ? <CheckCircle className="w-6 h-6" /> :
                                        actionType === 'revise' ? <AlertCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {actionType === 'approve' ? 'Konfirmasi Persetujuan' :
                                        actionType === 'revise' ? 'Konfirmasi Kirim Masukan' : 'Konfirmasi Penolakan'}
                                </h3>
                                <p className="text-gray-600 mt-2 text-sm">
                                    {actionType === 'approve'
                                        ? `Anda yakin menyetujui proposal ini? Status akan berubah menjadi Disetujui.`
                                        : actionType === 'revise'
                                            ? 'Kirim masukan/permintaan revisi? Hasil review akan dikirim ke Admin LPPM untuk diproses selanjutnya.'
                                            : `Anda yakin menolak usulan ini? Tindakan ini tidak dapat dibatalkan.`}
                                </p>
                            </div>

                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Catatan Anda:</label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200 italic max-h-32 overflow-y-auto">
                                        "{data.comments || 'Tanpa catatan'}"
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setIsConfirming(false)}>
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={submitReview}
                                        disabled={processing}
                                        className={`${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                                            actionType === 'revise' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                                            } text-white`}
                                    >
                                        Ya, {actionType === 'approve' ? 'Setujui Proposal' :
                                            actionType === 'revise' ? 'Kirim Masukan' : 'Tolak Usulan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
