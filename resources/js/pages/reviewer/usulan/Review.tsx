import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/components/Header';
import {
    ChevronLeft,
    FileText,
    User,
    Users,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Target,
    Layers,
    BookOpen
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface ReviewerReviewProps {
    proposal: any;
    dosen: any;
}

const ReviewerReview: React.FC<ReviewerReviewProps> = ({ proposal, dosen }) => {
    const usulan = proposal || {};

    const { data, setData, post, processing, errors } = useForm({
        action: '',
        comments: '',
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);

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
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Review Penelitian: ${usulan.judul}`} />
            <Header />
            <Toaster position="top-right" />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back */}
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
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold text-sm">1</span>
                                Identitas Usulan
                            </h2>
                            <h1 className="text-xl font-bold text-gray-800 leading-relaxed mb-4">
                                {usulan.judul || 'Judul Tidak Ditemukan'}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                                {/* 1. Judul is already displayed above as H1 */}

                                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex flex-col gap-4 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-semibold">2. TKT Saat Ini</span>
                                            <span className="font-bold text-blue-900">{usulan.tkt_saat_ini || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-semibold text-blue-700">3. Target Akhir TKT</span>
                                            <span className="font-bold text-blue-900">{usulan.target_akhir_tkt || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">4. Kelompok Skema</span>
                                    <span className="font-semibold text-gray-800">{usulan.kelompok_skema || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">5. Ruang Lingkup</span>
                                    <span className="font-semibold text-gray-800">{usulan.ruang_lingkup || '-'}</span>
                                </div>

                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">6. Kategori SBK</span>
                                    <span className="font-semibold text-gray-800">{usulan.kategori_sbk || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">7. Bidang Fokus Penelitian</span>
                                    <span className="font-semibold text-gray-800 flex items-center">
                                        <Target className="w-4 h-4 mr-2 text-blue-500" />
                                        {usulan.bidang_fokus || '-'}
                                    </span>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">8. Tema Penelitian</span>
                                        <span className="font-semibold text-gray-800">{usulan.tema_penelitian || '-'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1 font-medium">9. Topik Penelitian</span>
                                        <span className="font-semibold text-gray-800">{usulan.topik_penelitian || '-'}</span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-3 flex items-center">
                                        <Layers className="w-3 h-3 mr-2" /> Rumpun Ilmu
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <span className="block text-gray-500 text-[10px] uppercase tracking-wide mb-1">10. Level 1</span>
                                            <span className="font-medium text-gray-800 text-xs leading-tight block">{usulan.rumpun_ilmu_1 || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-[10px] uppercase tracking-wide mb-1">11. Level 2</span>
                                            <span className="font-medium text-gray-800 text-xs leading-tight block">{usulan.rumpun_ilmu_2 || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-[10px] uppercase tracking-wide mb-1">12. Level 3</span>
                                            <span className="font-medium text-gray-800 text-xs leading-tight block">{usulan.rumpun_ilmu_3 || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">13. Prioritas Riset</span>
                                        <span className="font-bold text-gray-900">{usulan.prioritas_riset || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">14. Tahun Pertama</span>
                                        <span className="font-bold text-gray-900">{usulan.tahun_pertama || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">15. Lama Kegiatan</span>
                                        <span className="font-bold text-gray-900">{usulan.lama_kegiatan || 0} Tahun</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. ANGGOTA TIM */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold text-sm">2</span>
                                Tim Peneliti
                            </h2>

                            {/* Ketua */}
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4 shadow-sm">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                                    K
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {usulan?.user?.name || usulan?.ketua?.name || '-'}
                                        <span className="text-xs font-normal text-gray-500 ml-1">(Ketua)</span>
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {usulan?.user?.dosen?.prodi || usulan?.ketua?.dosen?.prodi || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Dosen Members */}
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Dosen</h3>
                            <div className="space-y-2 mb-4">
                                {(usulan?.anggota_dosen || usulan?.anggotaDosen || []).length > 0 ? (
                                    (usulan?.anggota_dosen || usulan?.anggotaDosen || []).map((anggota: any, idx: number) => (
                                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-3 text-xs">
                                                A
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{anggota.nama || '-'}</p>
                                                <p className="text-xs text-gray-600">NIDN: {anggota.nidn || '-'} • {anggota.peran || '-'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic px-2">Tidak ada anggota dosen tambahan.</p>
                                )}
                            </div>

                            {/* Non-Dosen Members */}
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Mahasiswa / Non-Dosen</h3>
                            {(usulan?.anggota_non_dosen || usulan?.anggotaNonDosen || []).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">NIM/ID</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Peran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {(usulan?.anggota_non_dosen || usulan?.anggotaNonDosen || []).map((anggota: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-2">{anggota.nama || '-'}</td>
                                                    <td className="px-3 py-2">{anggota.no_identitas || '-'}</td>
                                                    <td className="px-3 py-2 capitalize">{anggota.jenis_anggota || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic px-2">Tidak ada anggota mahasiswa.</p>
                            )}
                        </section>

                        {/* 3. SUBSTANSI & LUARAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold text-sm">3</span>
                                Substansi & Luaran
                            </h2>

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Dokumen Proposal
                            </h3>
                            {usulan.file_substansi ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 group font-bold text-sm">
                                    <div className="flex items-center">
                                        <div className="bg-red-100 p-2 rounded text-red-600 mr-3">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">File Substansi Penelitian</p>
                                            <p className="text-xs text-gray-500">Format PDF</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`/storage/${usulan.file_substansi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Unduh
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-center mb-6 font-bold text-sm">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    File substansi belum diunggah.
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-gray-500" /> Target Luaran
                            </h3>
                            {(usulan?.luaran_list || usulan?.luaranList || []).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 rounded-lg font-bold text-sm">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm font-bold text-sm">
                                        <thead className="bg-gray-50 font-bold text-sm">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 font-bold text-sm">
                                            {(usulan?.luaran_list || usulan?.luaranList || []).map((luaran: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 whitespace-nowrap">Tahun {luaran?.tahun || '-'}</td>
                                                    <td className="px-4 py-2">{luaran?.kategori || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-600">{luaran?.deskripsi || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Tidak ada data luaran.</p>
                            )}
                        </section>

                        {/* 4. RAB */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2 font-bold text-sm">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold text-sm">4</span>
                                    Rencana Anggaran Biaya
                                </h2>
                                <div className="flex flex-col items-end gap-1">
                                    {usulan?.dana_disetujui > 0 && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                            Pagu Admin: {formatRupiah(Number(usulan.dana_disetujui))}
                                        </span>
                                    )}
                                    <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                                        Total Usulan: {formatRupiah(totalAnggaran)}
                                    </span>
                                </div>
                            </div>

                            {rabItems.length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(rabGroups).map(([group, groupItems]) => (
                                        (groupItems as any[]).length > 0 && (
                                            <div key={group}>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide border-l-4 border-blue-500 pl-2 bg-gray-50 py-1 font-bold text-sm">
                                                    {group}
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 text-sm font-bold text-sm">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Vol</th>
                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Satuan</th>
                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Harga</th>
                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {(groupItems as any[]).map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="px-3 py-2">{item.item}</td>
                                                                    <td className="px-3 py-2 text-right">{item.volume}</td>
                                                                    <td className="px-3 py-2 text-right">{item.satuan}</td>
                                                                    <td className="px-3 py-2 text-right">{formatRupiah(item.harga_satuan || item.hargaSatuan)}</td>
                                                                    <td className="px-3 py-2 text-right font-medium">{formatRupiah(item.total)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500 font-bold text-sm">
                                    Tidak ada rincian RAB.
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ACTION FORM */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24 font-bold text-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center font-bold text-sm">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold text-sm">5</span>
                                Keputusan Reviewer
                            </h3>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Komentar / Masukan</label>
                                    <textarea
                                        rows={8}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-bold text-sm"
                                        placeholder="Berikan masukan substansial, alasan penolakan, atau catatan revisi..."
                                        value={data.comments}
                                        onChange={(e) => setData('comments', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.comments && <p className="text-red-500 text-xs mt-1">{errors.comments}</p>}
                                </div>

                                <div className="space-y-3 font-bold text-sm">
                                    {usulan.status === 'resubmitted_revision' && (
                                        <button
                                            type="button"
                                            onClick={() => handleActionClick('approve')}
                                            disabled={processing}
                                            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all font-bold text-sm"
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2 font-bold text-sm" />
                                            Setujui (Lulus Review)
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleActionClick('revise')}
                                        disabled={processing}
                                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all font-bold text-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 mr-2 font-bold text-sm" />
                                        Minta Revisi
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleActionClick('reject')}
                                        disabled={processing}
                                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all font-bold text-sm"
                                    >
                                        <XCircle className="w-5 h-5 mr-2 font-bold text-sm" />
                                        Tolak Permanen
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-center text-gray-500 leading-relaxed">
                                    Dengan menekan tombol keputusan, anda menyatakan bahwa telah memeriksa usulan ini dengan seksama dan objektif.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL KONFIRMASI */}
                {isConfirming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl transform transition-all animate-in fade-in zoom-in-95">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Konfirmasi {actionType === 'approve' ? 'Persetujuan' : actionType === 'revise' ? 'Permintaan Revisi' : 'Penolakan'}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                {actionType === 'approve'
                                    ? 'Anda yakin ingin MENYETUJUI usulan ini? Usulan akan ditandai sebagai "Lulus Review" dan proses review selesai.'
                                    : actionType === 'revise'
                                        ? 'Anda yakin ingin MEMINTA REVISI? Pengusul akan menerima notifikasi untuk memperbaiki usulan sesuai catatan anda.'
                                        : 'Anda yakin ingin MENOLAK usulan ini secara permanen? Keputusan ini tidak dapat dibatalkan.'}
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md mb-6 text-sm text-gray-700 italic border-l-4 border-blue-400">
                                "{data.comments || '(Tidak ada catatan)'}"
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitReview}
                                    className={`px-4 py-2 rounded-md text-white font-bold transition-colors ${actionType === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : actionType === 'revise'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Ya, {actionType === 'approve' ? 'Kirim Keputusan' : actionType === 'revise' ? 'Minta Revisi' : 'Tolak Usulan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ReviewerReview;
