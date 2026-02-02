import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import {
    Home, ChevronRight, Eye, FileText, Search, Filter,
    BookOpen, AlertCircle, CheckCircle2, Clock, CheckCircle, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatAcademicYear, getAcademicYearOptions } from '@/utils/academicYear';
import { router } from '@inertiajs/react';
import Select from 'react-select';

interface Usulan {
    id: number;
    judul: string;
    ketua: string;
    prodi: string;
    skema: string;
    tanggal: string;
    status: string;
    type: string;
    report?: {
        id: number;
        status: string;
        file_laporan: string | null;
        supporting_documents?: any[];
    };
    progress?: number;
    dana_disetujui?: number;
    tahun_pertama?: number;
    total_logs?: number;
    last_percentage?: number;
}

interface PageProps {
    proposals: Usulan[];
    activeTab: string;
    filters?: {
        tahun_akademik?: string;
        search?: string;
    }
}

export default function AdminPenelitianIndex({ proposals = [], activeTab = 'daftar', filters = {} }: PageProps) {
    const tabs = [
        { id: 'daftar', label: 'Daftar Usulan', href: route('lppm.penelitian.index') },
        { id: 'perbaikan', label: 'Perbaikan Usulan', href: route('lppm.penelitian.perbaikan') },
        { id: 'laporan-kemajuan', label: 'Laporan Kemajuan', href: route('lppm.penelitian.laporan-kemajuan') },
        { id: 'catatan-harian', label: 'Catatan Harian', href: route('lppm.penelitian.catatan-harian') },
        { id: 'laporan-akhir', label: 'Laporan Akhir', href: route('lppm.penelitian.laporan-akhir') },
        { id: 'pengkinian-capaian', label: 'Pengkinian Capaian Luaran', href: route('lppm.penelitian.pengkinian-luaran') },
    ];



    // -- FILTER STATE --
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedYear, setSelectedYear] = useState<{ value: string, label: string } | null>(
        filters.tahun_akademik ? {
            value: filters.tahun_akademik,
            label: formatAcademicYear(filters.tahun_akademik)
        } : null
    );

    // Debounce search
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Implement debouncing if needed, or trigger filter on enter/blur
    };

    // Effect to trigger reload on filter change (simplified)
    const handleFilterChange = (term: string, year: string | undefined) => {
        router.get(route(route().current() as string), {
            activeTab: activeTab === 'daftar' ? undefined : activeTab, // maintain tab unless it's default
            search: term,
            tahun_akademik: year
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Trigger on Search Enter
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFilterChange(searchQuery, selectedYear?.value);
        }
    }

    const handleYearChange = (option: any) => {
        setSelectedYear(option);
        handleFilterChange(searchQuery, option?.value);
    };

    // Client-side filtering is NOT sufficient if we are paginating or filtering server-side
    // But since current implementation passes ALL proposals (filtered by server), we just accept proposals as is.
    // The previous code had client-side filtering logic:
    // const filteredProposals = proposals.filter...
    // If we move to server-side filtering (which we did in controller), proposals are ALREADY filtered.
    // So we assume 'proposals' prop is the result.
    const filteredProposals = proposals;

    const renderContent = () => {
        switch (activeTab) {
            case 'laporan-kemajuan':
                return <LaporanKemajuanTable proposals={filteredProposals} />;
            case 'catatan-harian':
                return <CatatanHarianTable proposals={filteredProposals} />;
            case 'laporan-akhir':
                return <LaporanAkhirTable proposals={filteredProposals} />;
            case 'pengkinian-capaian':
                return <PengkinianLuaranTable proposals={filteredProposals} />;
            default:
                return <DaftarUsulanTable proposals={filteredProposals} activeTab={activeTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Admin LPPM - Monitoring Penelitian" />
            <Header />

            {/* Sub Navbar / Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            <FileText className="w-6 h-6 text-blue-600" />
                            {tabs.find(t => t.id === activeTab)?.label || 'Monitoring Penelitian'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitoring data usulan penelitian secara real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-48">
                            <Select
                                options={getAcademicYearOptions().map(opt => ({ value: opt.value.toString(), label: opt.label }))}
                                value={selectedYear}
                                onChange={handleYearChange}
                                placeholder="Pilih Tahun..."
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        borderColor: '#e5e7eb',
                                        padding: '0.1rem',
                                        fontSize: '0.875rem',
                                        minHeight: '42px'
                                    })
                                }}
                            />
                        </div>
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari judul atau ketua..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="bg-white border text-sm border-gray-200 rounded-xl py-2 pl-10 pr-4 w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {renderContent()}
            </div>
            <Footer />
        </div>
    );
}

// --- SUB COMPONENTS FOR TABLES ---

function DaftarUsulanTable({ proposals, activeTab }: { proposals: Usulan[], activeTab: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul / Skema</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua / Prodi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {proposals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data usulan penelitian.
                                </td>
                            </tr>
                        ) : (
                            proposals.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.judul}</div>
                                        <div className="text-xs text-blue-600 mt-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-50">
                                            {item.skema}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{item.ketua}</div>
                                        <div className="text-xs text-gray-500">{item.prodi}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatAcademicYear(item.tahun_pertama || parseInt(item.tanggal.split('-')[0]))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest border
                                            ${item.status === 'submitted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                ['approved_prodi', 'reviewer_assigned', 'revision_dosen', 'resubmitted_revision'].includes(item.status) ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    item.status === 'reviewed_approved' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        item.status === 'didanai' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            item.status === 'ditolak_akhir' || item.status === 'rejected_reviewer' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {item.status.toUpperCase().replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={route('lppm.penelitian.show', item.id)} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                                            <Eye className="w-4 h-4 mr-1" /> Lihat Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function LaporanKemajuanTable({ proposals }: { proposals: Usulan[] }) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ketua Peneliti</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul Penelitian</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status Laporan</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Tidak ada data.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr key={usulan.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-6 text-sm text-gray-400 font-medium text-center">{index + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{usulan.ketua}</span>
                                        <span className="text-xs text-gray-500">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <p className="text-sm text-gray-800 font-semibold leading-relaxed line-clamp-2">{usulan.judul}</p>
                                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 mt-1 inline-block">{usulan.skema}</span>
                                </td>
                                <td className="px-6 py-6 text-sm text-gray-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    {!usulan.report || usulan.report.status === 'Draft' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase border border-amber-100">
                                            Draft / Belum
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase border border-emerald-100">
                                            <CheckCircle2 className="w-3 h-3" /> Submitted
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <Link href={route('lppm.penelitian.laporan-kemajuan.show', usulan.id)} className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center">
                                        <Eye className="w-3 h-3 mr-1" /> Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function LaporanAkhirTable({ proposals }: { proposals: Usulan[] }) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ketua Peneliti</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul Penelitian</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status Laporan</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Tidak ada data.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr key={usulan.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-6 text-sm text-gray-400 font-medium text-center">{index + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{usulan.ketua}</span>
                                        <span className="text-xs text-gray-500">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <p className="text-sm text-gray-800 font-semibold leading-relaxed line-clamp-2">{usulan.judul}</p>
                                </td>
                                <td className="px-6 py-6 text-sm text-gray-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    {!usulan.report || usulan.report.status === 'Draft' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase border border-amber-100">
                                            Draft / Belum
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase border border-emerald-100">
                                            <CheckCircle2 className="w-3 h-3" /> Submitted
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <Link href={route('lppm.penelitian.laporan-akhir.show', usulan.id)} className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center">
                                        <Eye className="w-3 h-3 mr-1" /> Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CatatanHarianTable({ proposals }: { proposals: Usulan[] }) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ketua Peneliti</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul & Anggaran</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Progress</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Tidak ada data.</td></tr>
                        ) : proposals.map((item, index) => (
                            <tr key={item.id} className="hover:bg-blue-50/20 transition">
                                <td className="px-6 py-6 text-sm text-gray-400 font-bold text-center">{index + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{item.ketua}</span>
                                        <span className="text-xs text-gray-500">{item.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-medium">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 leading-snug line-clamp-2 font-semibold uppercase">{item.judul}</p>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-100/50">
                                            DANA DISETUJUI: Rp {new Intl.NumberFormat('id-ID').format(item.dana_disetujui || 0)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-sm text-gray-500">
                                    {formatAcademicYear(item.tahun_pertama)}
                                </td>
                                <td className="px-6 py-6">
                                    <div className="space-y-3 min-w-[150px]">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-gray-400">Total Log</span>
                                            <span className="text-blue-600">{item.total_logs || 0} ENTRI</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.last_percentage || 0}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
                                            <span className="text-gray-400">Capaian</span>
                                            <span className="text-emerald-600 font-extrabold">{item.last_percentage || 0}%</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <Link href={route('lppm.penelitian.catatan-harian.show', item.id)} className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center">
                                        <Eye className="w-3 h-3 mr-1" /> Log
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PengkinianLuaranTable({ proposals }: { proposals: Usulan[] }) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ketua Peneliti</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Judul Penelitian</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Tidak ada data.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr key={usulan.id} className="hover:bg-blue-50/30 transition-all duration-300">
                                <td className="px-6 py-6 text-sm text-gray-400 font-bold text-center">{index + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{usulan.ketua}</span>
                                        <span className="text-xs text-gray-500">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 font-bold line-clamp-2">{usulan.judul}</p>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100 uppercase">
                                            {usulan.skema}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-sm text-gray-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <Link href={route('lppm.penelitian.pengkinian-luaran.show', usulan.id)} className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center">
                                        <Eye className="w-3 h-3 mr-1" /> Lihat Luaran
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
