import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/components/Header';
import { ChevronLeft, FileText, User, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Building, MapPin, Target, Layers } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import ReviewScoringForm from '@/components/ReviewScoringForm';

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
}

interface Luaran {
    id: number;
    tahun: number;
    kategori: string;
    jenis: string;
    deskripsi: string;
    status: string;
}

interface Proposal {
    id: number;
    judul: string;
    kelompok_skema: string;
    ruang_lingkup: string;
    tahun_pertama: number;
    lama_kegiatan: number;
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
    luaranItems?: Luaran[];
}

interface PageProps {
    proposal: Proposal;
    dosen: Dosen;
    mitra: Mitra[];
    anggotaNonDosen: AnggotaNonDosen[];
    rabItem: RabItem[];
    luaran: Luaran[];
    totalAnggaran: number;
    [key: string]: unknown;
}

export default function ReviewPengabdian({ proposal, dosen, mitra = [], anggotaNonDosen = [], rabItem = [], luaran = [], totalAnggaran = 0 }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        comments: '',
        scores: [] as any[],
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);
    const [recommendation, setRecommendation] = useState(0);

    const handleActionClick = (type: 'approve' | 'reject' | 'revise') => {
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
        setData('scores', scores);
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
        <div className="min-h-screen bg-gray-50 font-sans relative">
            <Head title={`Review Pengabdian: ${proposal.judul}`} />
            <Header />
            <Toaster position="top-right" />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/reviewer/usulan" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali ke Daftar Usulan
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: PROPOSAL CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. IDENTITAS */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">1</span>
                                Identitas Usulan
                            </h2>
                            <h1 className="text-xl font-bold text-gray-800 leading-relaxed mb-4">{proposal.judul}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Kelompok Skema</span>
                                    <span className="font-medium text-gray-800">{proposal.kelompok_skema}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Ruang Lingkup</span>
                                    <span className="font-medium text-gray-800">{proposal.ruang_lingkup}</span>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Bidang Fokus</span>
                                        <span className="font-medium text-gray-800 flex items-center">
                                            <Target className="w-3 h-3 mr-1 text-blue-500" />
                                            {proposal.jenis_bidang_fokus} - {proposal.bidang_fokus}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Rumpun Ilmu</span>
                                        <Layers className="w-3 h-3 mr-1 text-purple-500" />
                                        <div className="flex flex-col text-xs leading-tight">
                                            <span>{proposal.rumpun_ilmu_level1_label}</span>
                                            {proposal.rumpun_ilmu_level2_label && <span>↳ {proposal.rumpun_ilmu_level2_label}</span>}
                                            {proposal.rumpun_ilmu_level3_label && <span>↳ {proposal.rumpun_ilmu_level3_label}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Tahun Pelaksanaan</span>
                                    <span className="font-medium text-gray-800">{proposal.tahun_pertama} (Lama: {proposal.lama_kegiatan} Tahun)</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                        ${proposal.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                            proposal.status === 'didanai' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {proposal.status}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 2. ANGGOTA TIM */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">2</span>
                                Anggota Tim
                            </h2>
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4 shadow-sm">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">K</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{dosen.nama} <span className="text-xs font-normal text-gray-500">(Ketua)</span></p>
                                    <p className="text-xs text-gray-600">{dosen.prodi} - {dosen.fakultas}</p>
                                </div>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Dosen</h3>
                            {proposal.anggota_dosen && proposal.anggota_dosen.length > 0 ? (
                                <div className="space-y-2 mb-4">
                                    {proposal.anggota_dosen.map((anggota) => (
                                        <div key={anggota.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-3 text-xs">A</div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{anggota.nama || anggota.dosen?.nama}</p>
                                                <p className="text-xs text-gray-600">{(anggota.dosen?.prodi) || 'NIDN: ' + (anggota.nidn || anggota.dosen?.nidn)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<p className="text-sm text-gray-500 italic px-2 mb-4">Tidak ada anggota dosen tambahan.</p>)}

                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Mahasiswa</h3>
                            {anggotaNonDosen && anggotaNonDosen.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">No Identitas</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Peran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {anggotaNonDosen.map((mhs) => (
                                                <tr key={mhs.id}>
                                                    <td className="px-3 py-2">{mhs.nama}</td>
                                                    <td className="px-3 py-2">{mhs.no_identitas}</td>
                                                    <td className="px-3 py-2 capitalize">{mhs.jenis_anggota}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (<p className="text-sm text-gray-500 italic px-2">Tidak ada anggota mahasiswa.</p>)}
                        </section>

                        {/* 3. SUBSTANSI & LUARAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">3</span>
                                Substansi & Luaran
                            </h2>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Dokumen Proposal
                            </h3>
                            {proposal.file_substansi ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                                    <div className="flex items-center">
                                        <div className="bg-red-100 p-2 rounded text-red-600 mr-3"><FileText className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">File Substansi</p>
                                            <p className="text-xs text-gray-500">Format PDF</p>
                                        </div>
                                    </div>
                                    <a href={`/storage/${proposal.file_substansi}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">Unduh</a>
                                </div>
                            ) : (<div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-center mb-6"><AlertCircle className="w-5 h-5 mr-2" />File substansi belum diunggah.</div>)}

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-gray-500" /> Target Luaran
                            </h3>
                            {luaran.length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {luaran.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 whitespace-nowrap">Tahun {item.tahun}</td>
                                                    <td className="px-4 py-2">{item.kategori}</td>
                                                    <td className="px-4 py-2 text-gray-600">{item.deskripsi}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (<p className="text-sm text-gray-500 italic">Tidak ada data luaran.</p>)}
                        </section>

                        {/* 4. RAB */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">4</span>
                                    Rencana Anggaran Biaya
                                </h2>
                                <div className="flex flex-col items-end gap-1">
                                    {(proposal?.dana_disetujui ?? 0) > 0 && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Pagu Admin: {formatRupiah(Number(proposal?.dana_disetujui ?? 0))}</span>}
                                    <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">Total Usulan: {formatRupiah(totalAnggaran)}</span>
                                </div>
                            </div>
                            {items.length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(rabGroups).map(([group, groupItems]) => (
                                        groupItems.length > 0 && (
                                            <div key={group}>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide border-l-4 border-blue-500 pl-2 bg-gray-50 py-1">{group}</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                        <thead><tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-right">Vol</th><th className="px-3 py-2 text-right">Satuan</th><th className="px-3 py-2 text-right">Harga</th><th className="px-3 py-2 text-right">Total</th></tr></thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {groupItems.map((item, idx) => (
                                                                <tr key={idx}><td className="px-3 py-2">{item.item}</td><td className="px-3 py-2 text-right">{item.volume}</td><td className="px-3 py-2 text-right">{item.satuan}</td><td className="px-3 py-2 text-right">{formatRupiah(item.harga_satuan)}</td><td className="px-3 py-2 text-right font-medium">{formatRupiah(item.total)}</td></tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (<div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">Tidak ada rincian RAB.</div>)}
                        </section>

                        {/* 5. MITRA */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">5</span>
                                Mitra Sasaran
                            </h2>
                            {mitras.length > 0 ? (
                                <div className="space-y-6">
                                    {mitras.map((m, index) => (
                                        <div key={m.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1 flex items-center justify-between">
                                                <span>Mitra #{index + 1}</span>
                                                <div className="flex gap-2">
                                                    <span className="text-xs font-normal bg-blue-100 px-2 py-0.5 rounded text-blue-700">{m.kelompok_mitra || 'Umum'}</span>
                                                    <span className="text-xs font-normal bg-gray-200 px-2 py-0.5 rounded text-gray-600">{m.jenis_mitra}</span>
                                                </div>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><p className="text-xs text-gray-500 uppercase">Nama Mitra</p><p className="font-semibold text-gray-800">{m.nama_mitra}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Lokasi</p><p className="text-sm text-gray-700">{m.alamat_mitra}, {m.nama_kota}, {m.nama_provinsi}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Penanggung Jawab</p><p className="font-medium text-gray-800">{m.penanggung_jawab}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Kontak</p><p className="text-sm text-gray-700">{m.no_telepon} / {m.email}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Dana Pendamping</p><p className="text-sm font-bold text-emerald-600">{formatRupiah(m.dana_pendamping || Number(m.pendanaan_tahun_1) || 0)}</p></div>
                                            </div>
                                            {m.file_surat_kesediaan ? (
                                                <div className="mt-4 flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /><span className="text-sm text-blue-900">Surat Kesediaan Mitra.pdf</span></div>
                                                    <a href={`/storage/${m.file_surat_kesediaan}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Dokumen</a>
                                                </div>
                                            ) : (<p className="mt-3 text-xs text-red-500 italic">* Tidak ada file surat mitra.</p>)}
                                        </div>
                                    ))}
                                </div>
                            ) : (<div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm flex items-center"><XCircle className="w-5 h-5 mr-2" />Data Mitra Sasaran belum diisi.</div>)}
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ACTION FORM */}
                    <div className="lg:col-span-1 space-y-6">
                        <ReviewScoringForm
                            onChange={handleScoringChange}
                            maxFunding={7000000}
                        />

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2">6</span>
                                Keputusan Reviewer
                            </h3>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Komentar Global / Kesimpulan</label>
                                    <textarea
                                        rows={6}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        placeholder="Berikan masukan substansial, alasan penolakan, atau kesimpulan..."
                                        value={data.comments}
                                        onChange={(e) => setData('comments', e.target.value)}
                                    ></textarea>
                                    {errors.comments && <p className="text-red-500 text-xs mt-1">{errors.comments}</p>}
                                </div>
                                <div className="space-y-3">
                                    {proposal.status === 'resubmitted_revision' && (
                                        <button type="button" onClick={() => handleActionClick('approve')} disabled={processing} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all">
                                            <CheckCircle className="w-5 h-5 mr-2" /> Setujui Proposal
                                        </button>
                                    )}
                                    <button type="button" onClick={() => handleActionClick('revise')} disabled={processing} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-all">
                                        <AlertCircle className="w-5 h-5 mr-2" /> Minta Revisi
                                    </button>
                                    <button type="button" onClick={() => handleActionClick('reject')} disabled={processing} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all">
                                        <XCircle className="w-5 h-5 mr-2" /> Tolak Permanen
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-xs text-center text-gray-500">Dengan mengirimkan keputusan, Anda menyatakan telah mereview dengan objektif.</p>
                        </div>
                    </div>
                </div>

                {isConfirming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi {actionType === 'approve' ? 'Persetujuan' : actionType === 'revise' ? 'Permintaan Revisi' : 'Penolakan'}</h3>
                            <p className="text-gray-600 mb-6 text-sm">{actionType === 'approve' ? 'Yakin setujui?' : actionType === 'revise' ? 'Yakin minta revisi?' : 'Yakin tolak?'}</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsConfirming(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
                                <button onClick={submitReview} className={`px-4 py-2 rounded-md text-white font-bold ${actionType === 'approve' ? 'bg-green-600' : actionType === 'revise' ? 'bg-orange-500' : 'bg-red-600'}`}>Ya, Lanjutkan</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
