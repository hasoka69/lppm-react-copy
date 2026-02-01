import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    ChevronLeft,
    FileText,
    User,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Target,
    Layers,
    BookOpen,
    Clock,
    Download,
    Maximize2,
    DollarSign
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewerReviewProps {
    proposal: any;
    dosen: any;
}

const ReviewerReview: React.FC<ReviewerReviewProps> = ({ proposal, dosen }) => {
    const usulan = proposal || {};

    // Form State
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        comments: '',
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);

    // Helpers
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
        post(`/reviewer/review/${proposal.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirming(false);
                toast.success('Review berhasil disimpan');
            },
            onError: (err) => {
                setIsConfirming(false);
                toast.error('Gagal menyimpan review.');
            }
        });
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Data Processing
    const rabItems = usulan?.rab_items || usulan?.rabItems || [];
    const totalAnggaran = Array.isArray(rabItems)
        ? rabItems.reduce((acc: number, item: any) => acc + (Number(item?.total) || 0), 0)
        : 0;

    const rabGroups = {
        'Bahan Habis Pakai': rabItems.filter((i: any) => i.tipe === 'bahan'),
        'Perjalanan': rabItems.filter((i: any) => i.tipe === 'perjalanan'),
        'Publikasi': rabItems.filter((i: any) => i.tipe === 'publikasi'),
        'Pengumpulan Data': rabItems.filter((i: any) => i.tipe === 'pengumpulan_data'),
        'Sewa Peralatan': rabItems.filter((i: any) => i.tipe === 'sewa_peralatan'),
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            <Head title={`Review Penelitian: ${usulan.judul}`} />
            <Header />
            <Toaster position="top-right" richColors />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/reviewer/usulan" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                            Review Usulan Penelitian
                        </h1>
                        <p className="text-sm text-gray-500">
                            ID Usulan: <span className="font-mono text-gray-700">{usulan.id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-3 py-1 bg-white">
                            Tahun {usulan.tahun_pelaksanaan}
                        </Badge>
                        <Badge className={`${usulan.status === 'submitted' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            usulan.status === 'needs_revision' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                'bg-gray-100 text-gray-800'
                            } border-0`}>
                            {usulan.status === 'submitted' ? 'Menunggu Review' :
                                usulan.status === 'needs_revision' ? 'Sedang Revisi' : usulan.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: PROPOSAL CONTENT (Scrollable) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. MAIN IDENTITY CARD */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100">
                                <h2 className="text-lg font-bold text-blue-900 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    Identitas Proposal
                                </h2>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Penelitian</label>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1 leading-relaxed">{usulan.judul}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skema</label>
                                            <p className="font-medium text-gray-800">{usulan.skema}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rumpun Ilmu</label>
                                            <p className="font-medium text-gray-800">{usulan.rumpun_ilmu_1 || '-'}</p>
                                            <p className="text-sm text-gray-500">{usulan.rumpun_ilmu_2}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bidang Fokus</label>
                                            <p className="font-medium text-gray-800 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-blue-500" />
                                                {usulan.bidang_fokus}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lama Kegiatan</label>
                                            <p className="font-medium text-gray-800">{usulan.lama_kegiatan} Tahun (Mulai {usulan.tahun_pertama})</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">TKT Saat Ini</label>
                                        <div className="text-lg font-bold text-slate-700">{usulan.tkt_saat_ini || 0}</div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Target TKT</label>
                                        <div className="text-lg font-bold text-blue-600">{usulan.target_akhir_tkt || 0}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. TEAM MEMBERS CARD */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                                    Tim Peneliti
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100">
                                    {/* Ketua */}
                                    <div className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                            {usulan?.ketua?.name?.charAt(0) || 'K'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{usulan?.ketua?.name || usulan?.user?.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px]">Ketua Pengusul</Badge>
                                                <span className="text-xs text-gray-500">{usulan?.ketua?.dosen?.prodi || usulan?.user?.dosen?.prodi}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dosen Members */}
                                    {(usulan?.anggota_dosen || usulan?.anggotaDosen || []).map((anggota: any, idx: number) => (
                                        <div key={`dosen-${idx}`} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors pl-8">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{anggota.nama}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">Anggota Dosen</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">{anggota.nidn}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Mahasiswa Members */}
                                    {(usulan?.anggota_non_dosen || usulan?.anggotaNonDosen || []).map((mhs: any, idx: number) => (
                                        <div key={`mhs-${idx}`} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors pl-8">
                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold shrink-0 text-xs">
                                                M
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{mhs.nama}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">Mahasiswa</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">{mhs.no_identitas}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. PDF VIEWER & SUBSTANSI */}
                        <Card className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                                        Substansi Proposal
                                    </CardTitle>
                                    {usulan.file_substansi && (
                                        <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                <Download className="w-3 h-3 mr-2" /> Download PDF
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {usulan.file_substansi ? (
                                    <div className="w-full bg-slate-100 flex flex-col items-center justify-center min-h-[600px]">
                                        <iframe
                                            src={`/storage/${usulan.file_substansi}#toolbar=0&navpanes=0&scrollbar=0`}
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

                        {/* 4. RAB SUMMARY */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                                        Ringkasan RAB
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-sm font-bold bg-green-50 text-green-700 border-green-200">
                                        Total: {formatRupiah(totalAnggaran)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-8 p-6">
                                    {Object.entries(rabGroups).map(([group, items]) => {
                                        const groupItems = items as any[];
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
                                    <Button
                                        type="button"
                                        onClick={() => handleActionClick('approve')}
                                        disabled={processing}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Setujui Proposal
                                    </Button>

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
                                        ? 'Anda yakin menyetujui proposal ini? Status akan berubah menjadi Disetujui dan lanjut ke tahap berikutnya.'
                                        : actionType === 'revise'
                                            ? 'Kirim masukan/permintaan revisi? Hasil review akan dikirim ke Admin LPPM untuk diproses selanjutnya.'
                                            : 'Anda yakin menolak usulan ini? Tindakan ini tidak dapat dibatalkan.'}
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
};

export default ReviewerReview;
