import React, { useState } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { Home, ChevronRight, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewProps {
    usulan: any; // Type properly if possible
    pengusul: any;
    anggota: any[];
    anggotaNonDosen: any[];
    rabTotal: number;
}

export default function KaprodiUsulanReview({ usulan, pengusul, anggota, anggotaNonDosen, rabTotal }: ReviewProps) {
    const { data, setData, post, processing, errors } = useForm({
        decision: '',
        notes: '',
    });

    const [confirmModal, setConfirmModal] = useState<'approve' | 'reject' | null>(null);

    const handleSubmit = () => {
        post(route('kaprodi.usulan.review', usulan.id), {
            onSuccess: () => {
                setConfirmModal(null);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            <Head title={`Validasi Usulan: ${usulan.judul}`} />
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-8">
                    <Link href="/kaprodi/dashboard" className="hover:text-primary flex items-center transition-colors">
                        <Home className="w-4 h-4 mr-1" /> Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href="/kaprodi/usulan" className="hover:text-primary transition-colors">
                        Daftar Usulan
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-foreground">Validasi Usulan</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Proposal Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Identitas Usulan */}
                        <Card className="shadow-sm border border-gray-200 overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center justify-between text-gray-800">
                                    <span>Identitas Usulan</span>
                                    <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-300">
                                        ID: {usulan.id}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Judul Penelitian</label>
                                    <p className="text-lg font-medium text-gray-900 leading-snug">{usulan.judul}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Skema</label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="px-2 py-0.5 font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">{usulan.kelompok_skema}</Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Tahun Pelaksanaan</label>
                                        <p className="font-medium text-gray-800">{usulan.tahun_pertama} <span className="text-gray-500 text-sm font-normal">(Lama: {usulan.lama_kegiatan} tahun)</span></p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Total Anggaran</label>
                                        <p className="font-mono font-medium text-blue-600 text-lg">Rp {new Intl.NumberFormat('id-ID').format(rabTotal)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                                        <Badge variant={usulan.status === 'approved_prodi' ? 'default' : usulan.status === 'ditolak_akhir' ? 'destructive' : 'outline'} className="capitalize font-normal">
                                            {usulan.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Tim Peneliti */}
                        <Card className="shadow-sm border border-gray-200 overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-bold text-gray-800">Tim Peneliti</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* Ketua */}
                                <div className="relative pl-4 border-l-4 border-blue-500/20">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Ketua Pengusul</h3>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold ring-1 ring-blue-100">
                                                {pengusul.nama.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{pengusul.nama}</p>
                                                <p className="text-xs text-gray-500">NIDN: {pengusul.nidn}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500 pl-11">
                                            {pengusul.prodi} &bull; {pengusul.email}
                                        </div>
                                    </div>
                                </div>
                                <Separator className="bg-gray-100" />
                                {/* Anggota Dosen */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Anggota Dosen</h3>
                                    {anggota.length === 0 ? (
                                        <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-md text-center border border-dashed border-gray-300">Tidak ada anggota dosen.</div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {anggota.map((ang: any) => (
                                                <div key={ang.id} className="flex items-start justify-between bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{ang.nama}</p>
                                                        <p className="text-xs text-gray-500">NIDN: {ang.nidn ? ang.nidn : '-'} &bull; {ang.prodi}</p>
                                                        {ang.tugas && <p className="text-xs text-gray-500 mt-1"><span className="font-semibold">Tugas:</span> {ang.tugas}</p>}
                                                    </div>
                                                    <Badge variant="outline" className="text-xs font-normal text-gray-500 border-gray-200">{ang.peran}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Anggota Mahasiswa */}
                                {anggotaNonDosen && anggotaNonDosen.length > 0 && (
                                    <>
                                        <Separator className="bg-gray-100" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Anggota Mahasiswa / Non-Dosen</h3>
                                            <div className="grid gap-3">
                                                {anggotaNonDosen.map((mhs: any) => (
                                                    <div key={mhs.id} className="flex items-start justify-between bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{mhs.nama}</p>
                                                            <p className="text-xs text-gray-500">{mhs.no_identitas} &bull; {mhs.peran}</p>
                                                            {mhs.tugas && <p className="text-xs text-gray-500 mt-1"><span className="font-semibold">Tugas:</span> {mhs.tugas}</p>}
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs capitalize bg-gray-100 text-gray-600 border border-gray-200">{mhs.jenis_anggota}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. Berkas & Luaran */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg font-bold">Berkas & Dokumen</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-lg group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded shadow-sm text-blue-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-900 group-hover:text-blue-700">File Substansi Proposal</p>
                                                <p className="text-xs text-blue-600/80">Dokumen utama usulan penelitian</p>
                                            </div>
                                        </div>
                                        {usulan.file_substansi ? (
                                            <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                                                    Download
                                                </Button>
                                            </a>
                                        ) : (
                                            <Badge variant="destructive">Belum Upload</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Action & Review */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className={`shadow-lg border-t-4 ${usulan.status === 'approved_prodi' ? 'border-t-green-500' : usulan.status === 'ditolak_akhir' ? 'border-t-red-500' : 'border-t-primary'}`}>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold">Keputusan Kaprodi</CardTitle>
                                    {/* <CardDescription>Tinjau dan berikan keputusan</CardDescription> */}
                                </CardHeader>
                                <CardContent>
                                    {['approved_prodi', 'rejected_prodi', 'ditolak_akhir'].includes(usulan.status) ? (
                                        <div className={`p-6 rounded-lg text-center ${usulan.status === 'approved_prodi' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {usulan.status === 'approved_prodi' ? (
                                                <>
                                                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1">Usulan Disetujui</h3>
                                                    <p className="text-sm opacity-90">Usulan telah diteruskan ke reviewer.</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                                                        <XCircle className="w-8 h-8 text-red-600" />
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1">Usulan Ditolak</h3>
                                                    <p className="text-sm opacity-90">Pengusul telah diberitahu.</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm leading-relaxed border border-blue-100">
                                                <p className="font-medium mb-1">Instruksi Validasi:</p>
                                                Silakan tinjau kelengkapan berkas dan kesesuaian usulan dengan roadmap penelitian program studi sebelum memberikan persetujuan.
                                            </div>

                                            <div className="grid gap-3">
                                                <Button
                                                    onClick={() => { setData('decision', 'approve'); setConfirmModal('approve'); }}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:shadow-lg h-12 text-base"
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2" /> Setujui Usulan
                                                </Button>

                                                <Button
                                                    onClick={() => { setData('decision', 'reject'); setConfirmModal('reject'); }}
                                                    variant="destructive"
                                                    className="w-full bg-red-600 hover:bg-red-700 shadow-md transition-all hover:shadow-lg h-12 text-base"
                                                >
                                                    <XCircle className="w-5 h-5 mr-2" /> Tolak Usulan
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* CONFIRMATION MODAL */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setConfirmModal(null)} />

                    <Card className="w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <CardHeader className={`${confirmModal === 'approve' ? 'bg-green-50' : 'bg-red-50'} rounded-t-xl border-b pb-6`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${confirmModal === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {confirmModal === 'approve' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        {confirmModal === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {confirmModal === 'approve'
                                            ? 'Tindakan ini tidak dapat dibatalkan.'
                                            : 'Pengusul akan menerima notifikasi penolakan ini.'}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-gray-700">
                                {confirmModal === 'approve'
                                    ? 'Apakah Anda yakin ingin menyetujui usulan ini? Usulan akan diteruskan ke proses review selanjutnya.'
                                    : 'Apakah Anda yakin ingin menolak usulan ini? Mohon berikan alasan penolakan di bawah ini.'}
                            </p>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Catatan / Alasan {confirmModal === 'reject' && <span className="text-red-500">*</span>} (Opsional)
                                </label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Tuliskan catatan untuk pengusul..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end">
                                <Button variant="outline" onClick={() => setConfirmModal(null)} className="sm:w-auto w-full">
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className={`sm:w-auto w-full ${confirmModal === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {processing ? 'Memproses...' : (confirmModal === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

