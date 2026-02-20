import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import Pagination from '@/components/Pagination';
import { PaginatedResponse } from '@/types';
import {
    Home, ChevronRight, Eye, Users, FileText, Search, Filter,
    BookOpen, AlertCircle, CheckCircle2, Clock, CheckCircle, Download
} from 'lucide-react';
import { formatAcademicYear, getAcademicYearOptions } from '@/utils/academicYear';
import { router, useForm } from '@inertiajs/react';
import Select from 'react-select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Usulan {
    id: number;
    judul: string;
    ketua: string;
    prodi: string;
    skema: string;
    tanggal: string;
    status: string;
    type: string;
    nomor_kontrak?: string | null;
    tanggal_kontrak?: string | null;
    tanggal_mulai_kontrak?: string | null;
    tanggal_selesai_kontrak?: string | null;
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
    proposals: PaginatedResponse<Usulan>;
    activeTab: string;
    filters?: {
        tahun_akademik?: string;
        search?: string;
    }
}

export default function AdminPengabdianIndex({ proposals, activeTab = 'daftar', filters = {} }: PageProps) {
    const tabs = [
        { id: 'daftar', label: 'Daftar Usulan', icon: FileText, href: route('lppm.pengabdian.index') },
        { id: 'perbaikan', label: 'Perbaikan Usulan', icon: AlertCircle, href: route('lppm.pengabdian.perbaikan') },
        { id: 'laporan-kemajuan', label: 'Laporan Kemajuan', icon: Clock, href: route('lppm.pengabdian.laporan-kemajuan') },
        { id: 'catatan-harian', label: 'Catatan Harian', icon: BookOpen, href: route('lppm.pengabdian.catatan-harian') },
        { id: 'laporan-akhir', label: 'Laporan Akhir', icon: CheckCircle2, href: route('lppm.pengabdian.laporan-akhir') },
        { id: 'pengkinian-capaian', label: 'Pengkinian Luaran', icon: CheckCircle, href: route('lppm.pengabdian.pengkinian-luaran') },
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
    };

    // Effect to trigger reload on filter change
    const handleFilterChange = (term: string, year: string | undefined) => {
        router.get(route(route().current() as string), {
            activeTab: activeTab === 'daftar' ? undefined : activeTab,
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

    const filteredProposals = proposals.data || [];

    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [selectedProposalForContract, setSelectedProposalForContract] = useState<Usulan | null>(null);

    const { data: contractData, setData: setContractData, put: submitContract, processing: contractProcessing, reset: resetContract } = useForm({
        nomor_kontrak: '',
        tanggal_mulai_kontrak: '',
        tanggal_selesai_kontrak: '',
    });

    const openContractModal = (item: Usulan) => {
        setSelectedProposalForContract(item);
        setContractData({
            nomor_kontrak: item.nomor_kontrak || '',
            tanggal_mulai_kontrak: item.tanggal_mulai_kontrak || new Date().toISOString().split('T')[0],
            tanggal_selesai_kontrak: item.tanggal_selesai_kontrak || '',
        });
        setIsContractModalOpen(true);
    };

    const handleContractSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProposalForContract) return;

        submitContract(route('lppm.kontrak.update', { id: selectedProposalForContract.id, type: 'pengabdian' }), {
            onSuccess: () => {
                setIsContractModalOpen(false);
                resetContract();
                toast.success('Data kontrak berhasil disimpan');
            },
            onError: () => toast.error('Gagal menyimpan data kontrak'),
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'laporan-kemajuan':
                return <LaporanKemajuanTable proposals={filteredProposals} currentPage={proposals.current_page} perPage={proposals.per_page} />;
            case 'catatan-harian':
                return <CatatanHarianTable proposals={filteredProposals} currentPage={proposals.current_page} perPage={proposals.per_page} />;
            case 'laporan-akhir':
                return <LaporanAkhirTable proposals={filteredProposals} currentPage={proposals.current_page} perPage={proposals.per_page} />;
            case 'pengkinian-capaian':
                return <PengkinianLuaranTable proposals={filteredProposals} currentPage={proposals.current_page} perPage={proposals.per_page} />;
            default:
                return (
                    <DaftarUsulanTable
                        proposals={filteredProposals}
                        activeTab={activeTab}
                        onContractClick={openContractModal}
                        currentPage={proposals.current_page}
                        perPage={proposals.per_page}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Admin LPPM - Monitoring Pengabdian" />
            <Header />

            {/* Simple Sub Navbar */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {tabs.find(t => t.id === activeTab)?.label || 'Monitoring Pengabdian'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitoring data usulan pengabdian.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full sm:w-56">
                            <Select
                                options={getAcademicYearOptions().map(opt => ({ value: opt.value.toString(), label: opt.label }))}
                                value={selectedYear}
                                onChange={handleYearChange}
                                placeholder="Filter Tahun..."
                                isClearable
                                className="react-select-premium"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '1rem',
                                        borderColor: '#f1f5f9',
                                        backgroundColor: '#f8fafc',
                                        padding: '0.2rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        minHeight: '48px',
                                        boxShadow: 'none',
                                        '&:hover': { borderColor: '#e2e8f0' }
                                    }),
                                    menu: (base) => ({ ...base, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' })
                                }}
                            />
                        </div>
                        <div className="relative group w-full sm:w-72">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari judul atau ketua..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="bg-slate-50 border border-slate-100 text-sm font-semibold rounded-2xl py-3.5 pl-12 pr-6 w-full focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 shadow-xs"
                            />
                        </div>
                    </div>
                </div>

                {renderContent()}

                <div className="mt-12 flex justify-center pb-12">
                    <Pagination links={proposals.links} />
                </div>
            </div>
            {/* Contract Modal */}
            <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Buat Kontrak Pengabdian</DialogTitle>
                        <DialogDescription>
                            Masukkan nomor dan tanggal kontrak untuk <b>{selectedProposalForContract?.judul}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContractSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nomor_kontrak" className="text-right">
                                    No. Kontrak
                                </Label>
                                <Input
                                    id="nomor_kontrak"
                                    value={contractData.nomor_kontrak}
                                    onChange={(e) => setContractData('nomor_kontrak', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Contoh: 123/LPPM/2026"
                                    required
                                />
                            </div>

                            {/* Divider for Duration */}
                            <div className="border-t border-gray-100 my-2"></div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Jangka Waktu Pelaksanaan</p>

                            {/* Tanggal Mulai */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tanggal_mulai_kontrak" className="text-right">
                                    Mulai
                                </Label>
                                <Input
                                    id="tanggal_mulai_kontrak"
                                    type="date"
                                    value={contractData.tanggal_mulai_kontrak}
                                    onChange={(e) => setContractData('tanggal_mulai_kontrak', e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {/* Tanggal Selesai */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tanggal_selesai_kontrak" className="text-right">
                                    Selesai
                                </Label>
                                <Input
                                    id="tanggal_selesai_kontrak"
                                    type="date"
                                    value={contractData.tanggal_selesai_kontrak}
                                    onChange={(e) => setContractData('tanggal_selesai_kontrak', e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={contractProcessing}>
                                {contractProcessing ? 'Menyimpan...' : 'Simpan Kontrak'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

// --- SUB COMPONENTS FOR TABLES ---

function DaftarUsulanTable({ proposals, activeTab, onContractClick, currentPage, perPage }: { proposals: Usulan[], activeTab: string, onContractClick: (item: Usulan) => void, currentPage: number, perPage: number }) {
    const startingIndex = (currentPage - 1) * perPage;
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usulan / Skema</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaksana</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                            <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                        {proposals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">Belum ada data yang sesuai.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            proposals.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-emerald-50/30 transition-all group"
                                >
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-300">{startingIndex + idx + 1}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-relaxed mb-2 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{item.judul}</div>
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                                            {item.skema}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-slate-700">{item.ketua}</div>
                                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{item.prodi}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-500">
                                        {formatAcademicYear(item.tahun_pertama || parseInt(item.tanggal.split('-')[0]))}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-center">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex flex-col items-end gap-2.5">
                                            <Link
                                                href={route('lppm.pengabdian.show', item.id)}
                                                className="h-9 px-4 inline-flex items-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all shadow-sm group-hover:shadow-md"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-2" /> Detail Usulan
                                            </Link>

                                            {item.status === 'didanai' && (
                                                <div className="flex items-center gap-2">
                                                    {item.nomor_kontrak ? (
                                                        <>
                                                            <a
                                                                href={route('lppm.kontrak.generate', { id: item.id, type: 'pengabdian' })}
                                                                target="_blank"
                                                                className="h-9 px-4 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-xs font-black transition-all border border-emerald-100 uppercase tracking-wider"
                                                            >
                                                                <Download className="w-3.5 h-3.5 mr-2" /> Kontrak
                                                            </a>
                                                            <button
                                                                onClick={() => onContractClick(item)}
                                                                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                                                title="Edit Nomor Kontrak"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => onContractClick(item)}
                                                            className="h-9 px-4 inline-flex items-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-black transition-all shadow-lg shadow-emerald-200 uppercase tracking-wider"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 mr-2" /> Buat Kontrak
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { bg: string, text: string, border: string }> = {
        submitted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        approved_prodi: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        reviewer_assigned: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
        resubmitted_revision: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
        reviewed_approved: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
        didanai: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        ditolak_akhir: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
        rejected_reviewer: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
    };

    const config = configs[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase ${config.bg} ${config.text} ${config.border} shadow-sm`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function LaporanKemajuanTable({ proposals, currentPage, perPage }: { proposals: Usulan[], currentPage: number, perPage: number }) {
    const startingIndex = (currentPage - 1) * perPage;
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">No</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaksana</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul Pengabdian</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status Laporan</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic font-bold">Tidak ada data.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr
                                key={usulan.id}
                                className="hover:bg-emerald-50/30 transition-colors group"
                            >
                                <td className="px-8 py-8 text-sm text-slate-300 font-bold text-center">{startingIndex + index + 1}</td>
                                <td className="px-8 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-slate-800">{usulan.ketua}</span>
                                        <span className="text-xs font-semibold text-slate-400 mt-1">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <p className="text-sm text-slate-700 font-bold leading-relaxed line-clamp-2 uppercase tracking-tight">{usulan.judul}</p>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 mt-2 inline-block leading-none">{usulan.skema}</span>
                                </td>
                                <td className="px-8 py-8 text-sm font-bold text-slate-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-8 py-8 text-center">
                                    {!usulan.report || usulan.report.status === 'Draft' ? (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 uppercase border border-amber-100 tracking-widest leading-none">
                                            BELUM SELESAI
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 uppercase border border-emerald-100 tracking-widest leading-none">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> SUBMITTED
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-8 text-center">
                                    <Link href={route('lppm.pengabdian.laporan-kemajuan.show', usulan.id)} className="h-9 px-5 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        <Eye className="w-3.5 h-3.5 mr-2" /> Detail
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

function LaporanAkhirTable({ proposals, currentPage, perPage }: { proposals: Usulan[], currentPage: number, perPage: number }) {
    const startingIndex = (currentPage - 1) * perPage;
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">No</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaksana</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul Pengabdian</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status Laporan</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic font-bold">Tidak ada data.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr
                                key={usulan.id}
                                className="hover:bg-emerald-50/30 transition-colors group"
                            >
                                <td className="px-8 py-8 text-sm text-slate-300 font-bold text-center">{startingIndex + index + 1}</td>
                                <td className="px-8 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-slate-800">{usulan.ketua}</span>
                                        <span className="text-xs font-semibold text-slate-400 mt-1">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <p className="text-sm text-slate-700 font-bold leading-relaxed line-clamp-2 uppercase tracking-tight">{usulan.judul}</p>
                                </td>
                                <td className="px-8 py-8 text-sm font-bold text-slate-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-8 py-8 text-center">
                                    {!usulan.report || usulan.report.status === 'Draft' ? (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 uppercase border border-amber-100 tracking-widest leading-none">
                                            BELUM SELESAI
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 uppercase border border-emerald-100 tracking-widest leading-none">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> SUBMITTED
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-8 text-center">
                                    <Link href={route('lppm.pengabdian.laporan-akhir.show', usulan.id)} className="h-9 px-5 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        <Eye className="w-3.5 h-3.5 mr-2" /> Detail
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

function CatatanHarianTable({ proposals, currentPage, perPage }: { proposals: Usulan[], currentPage: number, perPage: number }) {
    const startingIndex = (currentPage - 1) * perPage;
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">No</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaksana</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul & Anggaran</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Progress</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-400 italic font-bold">Tidak ada data.</td></tr>
                        ) : proposals.map((item, index) => (
                            <tr
                                key={item.id}
                                className="hover:bg-emerald-50/30 transition shadow-emerald-500/10 group"
                            >
                                <td className="px-8 py-8 text-sm text-slate-300 font-bold text-center">{startingIndex + index + 1}</td>
                                <td className="px-8 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-slate-800">{item.ketua}</span>
                                        <span className="text-xs font-semibold text-slate-400 mt-1">{item.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8 font-medium">
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-700 leading-snug line-clamp-2 font-bold uppercase tracking-tight">{item.judul}</p>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black tracking-widest border border-emerald-100 leading-none">
                                            ANGGARAN: Rp {new Intl.NumberFormat('id-ID').format(item.dana_disetujui || 0)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-8 text-sm font-bold text-slate-500">
                                    {formatAcademicYear(item.tahun_pertama)}
                                </td>
                                <td className="px-8 py-8">
                                    <div className="space-y-3 min-w-[180px]">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Total Entri</span>
                                            <span className="text-emerald-600 font-black">{item.total_logs || 0}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/20"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                            <span className="text-slate-400">Capaian</span>
                                            <span className="text-emerald-600 font-black text-xs">{item.last_percentage || 0}%</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-8 text-center text-center">
                                    <Link href={route('lppm.pengabdian.catatan-harian.show', item.id)} className="h-9 px-5 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        <Eye className="w-3.5 h-3.5 mr-2" /> Lihat Log
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

function PengkinianLuaranTable({ proposals, currentPage, perPage }: { proposals: Usulan[], currentPage: number, perPage: number }) {
    const startingIndex = (currentPage - 1) * perPage;
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">No</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaksana</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul Pengabdian</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {proposals.length === 0 ? (
                            <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 italic font-bold tracking-widest">TIDAK ADA DATA.</td></tr>
                        ) : proposals.map((usulan, index) => (
                            <tr
                                key={usulan.id}
                                className="hover:bg-emerald-50/30 transition-all duration-300 group"
                            >
                                <td className="px-8 py-8 text-sm text-slate-300 font-bold text-center">{startingIndex + index + 1}</td>
                                <td className="px-8 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-slate-800">{usulan.ketua}</span>
                                        <span className="text-xs font-semibold text-slate-400 mt-1">{usulan.prodi}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-700 font-bold line-clamp-2 uppercase tracking-tight leading-relaxed">{usulan.judul}</p>
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest rounded-lg border border-emerald-100 uppercase leading-none inline-block">
                                            {usulan.skema}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-8 text-sm font-bold text-slate-500">
                                    {formatAcademicYear(usulan.tahun_pertama)}
                                </td>
                                <td className="px-8 py-8 text-center text-center">
                                    <Link href={route('lppm.pengabdian.pengkinian-luaran.show', usulan.id)} className="h-9 px-5 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        <Eye className="w-3.5 h-3.5 mr-2" /> Detail Luaran
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
