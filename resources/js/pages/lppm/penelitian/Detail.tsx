import React, { useState } from 'react';
declare var route: any;
import { Link, Head, router } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
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
    CheckCircle
} from 'lucide-react';

interface ProposalDetailProps {
    usulan: any;
    reviewers: any[];
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

export default function AdminPenelitianDetail({ usulan, reviewers }: ProposalDetailProps) {
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Admin Detail Penelitian - ${usulan.judul}`} />
            <Header />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Back */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/lppm/dashboard" className="hover:text-blue-600 flex items-center">
                            <Home className="w-4 h-4 mr-1" /> Dashboard
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/lppm/penelitian" className="hover:text-blue-600">Daftar Penelitian</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-semibold text-gray-700 truncate max-w-xs">{usulan.judul}</span>
                    </div>
                    <Link href="/lppm/penelitian" className="inline-flex items-center text-sm text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke List
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: PRIMARY CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. IDENTITAS USULAN (Comprehensive 15 Fields) */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">1</span>
                                Identitas Usulan
                            </h2>
                            <h1 className="text-xl font-bold text-gray-800 leading-relaxed mb-6">
                                {usulan.judul || 'Judul Tidak Ditemukan'}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
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

                        {/* 2. TIM PENELITI */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">2</span>
                                Anggota Tim
                            </h2>
                            {/* Ketua */}
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4 shadow-sm">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{usulan.ketua?.name} <span className="text-xs font-normal text-gray-500">(Ketua)</span></p>
                                    <p className="text-xs text-gray-600">{usulan.ketua?.dosen?.prodi || '-'}</p>
                                </div>
                            </div>

                            {/* Dosen Members */}
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Dosen</h3>
                            {usulan.anggota_dosen && usulan.anggota_dosen.length > 0 ? (
                                <div className="space-y-2 mb-4">
                                    {usulan.anggota_dosen.map((anggota: any, idx: number) => (
                                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-3 text-xs">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{anggota.nama || anggota.dosen?.nama}</p>
                                                <p className="text-xs text-gray-600">{(anggota.dosen?.prodi) || 'Peran: ' + (anggota.peran || '-')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic px-2 mb-4">Tidak ada anggota dosen tambahan.</p>
                            )}

                            {/* Mahasiswa Members */}
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Mahasiswa / Non-Dosen</h3>
                            {usulan.anggota_non_dosen && usulan.anggota_non_dosen.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">NIM/ID</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Peran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {usulan.anggota_non_dosen.map((mhs: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-2">{mhs.nama}</td>
                                                    <td className="px-3 py-2">{mhs.no_identitas}</td>
                                                    <td className="px-3 py-2 capitalize">{mhs.jenis_anggota}</td>
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
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">3</span>
                                Substansi & Luaran
                            </h2>

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Dokumen Proposal
                            </h3>
                            {usulan.file_substansi ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 group hover:border-blue-300 transition-colors">
                                    <div className="flex items-center">
                                        <div className="bg-red-100 p-2 rounded text-red-600 mr-3">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">File Substansi</p>
                                            <p className="text-xs text-gray-500">Format PDF</p>
                                        </div>
                                    </div>
                                    <a href={`/storage/${usulan.file_substansi}`} target="_blank" rel="noopener noreferrer" className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                        Lihat File
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-center mb-6 border border-yellow-100">
                                    <Info className="w-5 h-5 mr-2" />
                                    Dosen belum mengunggah file substansi.
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-gray-500" /> Target Luaran
                            </h3>
                            {(usulan.luaran_list || usulan.luaranList) && (usulan.luaran_list || usulan.luaranList).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm font-sans">
                                        <thead className="bg-gray-50 font-bold">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Tahun</th>
                                                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Kategori</th>
                                                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Rincian</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {(usulan.luaran_list || usulan.luaranList)?.map((item: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50/50">
                                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 border-r border-gray-50">Tahun {item.tahun}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-700">{item.kategori}</td>
                                                    <td className="px-4 py-3 text-gray-600 text-xs italic">{item.deskripsi}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Tidak ada data luaran yang diisi.</p>
                            )}
                        </section>

                        {/* 4. RAB SUMMARY */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">4</span>
                                    Rencana Anggaran
                                </h2>
                                <div className="flex flex-col items-end gap-1">
                                    {usulan.dana_disetujui > 0 && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                                            Pagu Admin: {formatRupiah(usulan.dana_disetujui)}
                                        </span>
                                    )}
                                    <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-1.5 rounded-full border border-green-200 shadow-sm">
                                        Total Usulan: {formatRupiah(usulan.total_anggaran)}
                                    </span>
                                </div>
                            </div>

                            {(usulan.rab_items || usulan.rabItems) && (usulan.rab_items || usulan.rabItems).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Volume</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {(usulan.rab_items || usulan.rabItems)?.map((item: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3 text-gray-800 font-medium">{item.item}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">{item.volume} {item.satuan}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(item.harga_satuan)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatRupiah(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400">Rincian anggaran belum tersedia.</p>
                                </div>
                            )}
                        </section>

                        {/* 5. HISTORY REVIEW */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2 flex items-center">
                                <span className="bg-blue-100 text-blue-700 text-xs w-6 h-6 flex items-center justify-center rounded-full mr-2 font-bold">5</span>
                                Riwayat Transaksi & Keputusan
                            </h2>
                            <div className="space-y-6">
                                {((usulan.review_histories || usulan.reviewHistories) && (usulan.review_histories || usulan.reviewHistories).length > 0) ? (
                                    (usulan.review_histories || usulan.reviewHistories).map((h: any, i: number) => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${h.action.includes('reject') ? 'bg-red-50 text-red-600' :
                                                        h.action.includes('approve') || h.action.includes('didanai') ? 'bg-green-50 text-green-600' :
                                                            'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                {i < (usulan.review_histories || usulan.reviewHistories).length - 1 && <div className="w-px h-full bg-gray-100 my-1"></div>}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                                                            {h.action.replace(/_/g, ' ')}
                                                        </h4>
                                                        <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-black border border-blue-200 uppercase tracking-widest">{h.reviewer_type?.replace(/_/g, ' ')}</span>
                                                        {h.reviewer && <span className="text-[11px] text-gray-400 ml-2 font-medium">({h.reviewer.name})</span>}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-black tabular-nums">
                                                        {new Date(h.reviewed_at || h.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {h.comments && (
                                                    <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2 shadow-inner leading-relaxed italic border-l-4 border-l-blue-200">
                                                        <ExpandableText text={h.comments} limit={250} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30">
                                        <Clock className="w-12 h-12 mx-auto mb-2" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Aktivitas Kosong</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ADMIN ACTIONS (STICKY) */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 sticky top-24">

                            {/* STATUS CARD */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-800 px-6 py-4">
                                    <h3 className="text-white font-bold flex items-center">
                                        <Info className="w-4 h-4 mr-2 text-blue-400" /> STATUS SAAT INI
                                    </h3>
                                </div>
                                <div className="p-6 text-center">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black tracking-widest w-full justify-center shadow-sm border-2
                                        ${usulan.status === 'didanai' ? 'bg-green-50 text-green-700 border-green-200' :
                                            usulan.status.includes('reject') ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {usulan.status.toUpperCase().replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* 1. ASSIGN REVIEWER */}
                            {['approved_prodi', 'reviewer_assigned'].includes(usulan.status) && (
                                <AdminActionCard
                                    title="Tunjuk Reviewer"
                                    icon={<User className="w-5 h-5 text-blue-600" />}
                                    description="Reviewer terpilih akan dikirimi notifikasi untuk segera melakukan penilaian substansi."
                                >
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = new FormData(e.currentTarget);
                                        router.post(route('lppm.assign_reviewer', { type: 'penelitian', id: usulan.id }), {
                                            reviewer_id: data.get('reviewer_id')
                                        });
                                    }}>
                                        <select name="reviewer_id" defaultValue={usulan.reviewer_id} className="w-full text-sm border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">-- Cari Reviewer --</option>
                                            {reviewers?.map((r: any) => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transform active:scale-95 transition-all">
                                            Tunjuk & Kirim Akses
                                        </button>
                                    </form>
                                </AdminActionCard>
                            )}

                            {/* 2. SET BUDGET (Admin Revision Request) */}
                            {usulan.status === 'under_revision_admin' && (
                                <AdminActionCard
                                    title="Tentukan Pagu Dana"
                                    icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                                    description="Tetapkan pagu dana disetujui. Usulan akan dikembalikan ke dosen untuk revisi RAB/Substansi."
                                >
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = new FormData(e.currentTarget);
                                        router.post(route('lppm.set_budget', { type: 'penelitian', id: usulan.id }), {
                                            dana_disetujui: data.get('dana_disetujui'),
                                            notes: data.get('notes')
                                        });
                                    }}>
                                        <div className="mb-4">
                                            <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Input Pagu Dana (Rp)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1 text-gray-400 text-sm font-bold">Rp</span>
                                                <input type="number" name="dana_disetujui" defaultValue={usulan.total_anggaran} className="w-full pl-10 text-sm border-gray-300 rounded-lg focus:ring-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Catatan Untuk Pengusul</label>
                                            <textarea name="notes" className="w-full text-sm border-gray-300 rounded-lg h-24 placeholder:text-gray-300" placeholder="Contoh: Kurangi biaya publikasi, lampirkan bukti mitra..."></textarea>
                                        </div>
                                        <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md">
                                            Submit & Minta Revisi
                                        </button>
                                    </form>
                                </AdminActionCard>
                            )}

                            {/* 3. FINAL DECISION */}
                            {usulan.status === 'reviewed_approved' && (
                                <AdminActionCard
                                    title="Keputusan Akhir (LPPM)"
                                    icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
                                    description="Reviewer telah menyetujui substansi. LPPM harus menentukan apakah usulan ini berhak didanai."
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => router.post(route('lppm.final_decision', { type: 'penelitian', id: usulan.id }), { decision: 'didanai' })}
                                            className="bg-green-600 text-white py-3 rounded-lg text-xs font-black hover:bg-green-700 shadow-lg"
                                        >
                                            DIDANAI
                                        </button>
                                        <button
                                            onClick={() => router.post(route('lppm.final_decision', { type: 'penelitian', id: usulan.id }), { decision: 'ditolak_akhir' })}
                                            className="bg-red-600 text-white py-3 rounded-lg text-xs font-black hover:bg-red-700 shadow-lg"
                                        >
                                            TOLAK
                                        </button>
                                    </div>
                                </AdminActionCard>
                            )}

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                                    <Info className="w-3 h-3 inline mr-1 mb-0.5" />
                                    Sebagai Admin LPPM, anda memiliki kendali penuh atas workflow usulan. Perubahan status akan tercatat secara otomatis pada riwayat usulan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
