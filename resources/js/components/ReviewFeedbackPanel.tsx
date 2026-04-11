import React, { useState } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, ChevronRight, PenTool, Calculator, DollarSign, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { calculateTotalLuaranCost, LUARAN_COSTS } from '@/constants/luaran';

interface Reviewer {
    id: number;
    name: string;
    catatan?: string | null;
    selected_luaran?: string[]; // Added selected_luaran
}

const REVIEWER_LUARAN_MAP: Record<string, string> = {
    'scopus': 'Jurnal Internasional Bereputasi Scopus',
    'sinta12': 'Jurnal Terakreditasi SINTA 1 - 2',
    'internasional': 'Jurnal Internasional',
    'sinta3': 'Jurnal Nasional Terakreditasi SINTA 3',
};

interface ReviewFeedbackPanelProps {
    reviewers?: Reviewer[];
    danaAwal?: number | string;
    danaDisetujui?: number | string;
    status?: string;
    usulan?: any; // Added explicit usulan prop
}

const ReviewFeedbackPanel: React.FC<ReviewFeedbackPanelProps> = ({ reviewers, danaAwal, danaDisetujui, status, usulan: propUsulan }) => {
    const { props } = usePage<any>();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Get usulan from props or Inertia page props
    const activeUsulan = propUsulan || props?.usulan;
    const currentStatus = status || activeUsulan?.status;

    // Robustly extract data from usulan if not provided as direct props
    const activeReviewers = reviewers || activeUsulan?.reviewers || [];
    const activeDanaAwal = danaAwal !== undefined ? danaAwal : (activeUsulan?.dana_usulan_awal || activeUsulan?.total_anggaran);
    const activeDanaDisetujui = danaDisetujui !== undefined ? danaDisetujui : activeUsulan?.dana_disetujui;

    // Check if the current status is a revision status
    const isRevision = currentStatus && ['needs_revision', 'revision_dosen', 'under_revision_admin', 'revision_kaprodi', 'didanai'].includes(currentStatus);

    // Get luaran items from reviewers (reviewer recommended categories)
    const reviewerSelectedLuaranIds = (activeReviewers || []).flatMap((r: Reviewer) => r.selected_luaran || []);
    const totalBiayaLuaran = reviewerSelectedLuaranIds.reduce((total: number, id: string) => {
        return total + (LUARAN_COSTS[id] || 0);
    }, 0);

    const grandTotalAwal = Number(activeDanaAwal || 0) + totalBiayaLuaran;

    // If no reviewers or no notes, we don't necessarily show it, but usually, if status is revision, there's a note.
    const hasNotes = activeReviewers && activeReviewers.some((r: Reviewer) => r.catatan && r.catatan.trim() !== '');
    const hasFunding = activeDanaAwal !== undefined || activeDanaDisetujui !== undefined || totalBiayaLuaran > 0;

    if (!isRevision) return null;
    if (!hasNotes && !hasFunding) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed right-6 bottom-6 z-50 flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-5 py-4 rounded-full shadow-2xl shadow-amber-500/30 transition-all font-bold tracking-wide border-2 border-white group"
                    >
                        <div className="relative">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-2 -right-2 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                        </div>
                        <span className="text-sm">Catatan Reviewer</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Side Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed right-0 top-0 bottom-0 z-50 bg-white border-l border-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col ${isExpanded ? 'w-full md:w-[600px]' : 'w-full md:w-[400px]'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-amber-50 border-b border-amber-100/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-amber-900 leading-tight">Catatan Perbaikan</h3>
                                    <p className="text-xs font-semibold text-amber-600/80 uppercase tracking-widest mt-0.5">Dari Reviewer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors hidden md:block"
                                    title={isExpanded ? "Perkecil Panel" : "Perbesar Panel"}
                                >
                                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-amber-700 hover:bg-amber-200 hover:text-amber-900 rounded-lg transition-colors ml-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 font-medium">
                                <p>Silakan perhatikan catatan berikut saat memperbaiki proposal Anda. Panel ini dapat dibiarkan terbuka saat Anda mengisi form.</p>
                            </div>

                            {/* Simplified Funding Information */}
                            {hasFunding && (
                                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-sm text-emerald-900 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Calculator className="w-12 h-12 text-emerald-600" />
                                    </div>
                                    
                                    <h4 className="font-bold mb-5 flex items-center gap-2 text-emerald-800">
                                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        Hasil Review Pendanaan
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        {/* Row 1: Dana Usulan */}
                                        <div className="flex justify-between items-center group">
                                            <span className="text-emerald-700/80 font-semibold uppercase text-[10px] tracking-wider">Dana Usulan (RAB):</span>
                                            <span className="font-bold text-slate-600">
                                                {formatCurrency(Number(activeDanaAwal || 0))}
                                            </span>
                                        </div>

                                        {/* Row 2: Dana Disetujui (The Main Value) */}
                                        <div className="pt-4 border-t border-emerald-200/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-emerald-900 font-extrabold uppercase text-xs tracking-tight">DANA DISETUJUI:</span>
                                                <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-sm">
                                                    <span className="font-black text-lg">
                                                        {formatCurrency(Number(activeDanaDisetujui || 0))}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Breakdown Details */}
                                            {totalBiayaLuaran > 0 && (
                                                <div className="mt-3 bg-white/60 p-3 rounded-xl border border-emerald-200/50 space-y-2">
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="font-bold text-emerald-800">Termasuk Biaya Luaran:</span>
                                                        <span className="font-black text-emerald-700">+{formatCurrency(totalBiayaLuaran)}</span>
                                                    </div>
                                                    
                                                    <div>
                                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1.5">Kategori Luaran:</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {Array.from<string>(new Set(reviewerSelectedLuaranIds)).map((id: string) => (
                                                                <span key={id} className="text-[10px] bg-emerald-200/50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200/50 font-bold">
                                                                    {REVIEWER_LUARAN_MAP[id] || id}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-start gap-2 bg-emerald-100/30 p-3 rounded-xl border border-dotted border-emerald-300">
                                        <div className="mt-0.5">
                                            <Info className="w-3.5 h-3.5 text-emerald-600" />
                                        </div>
                                        <p className="text-[10px] text-emerald-700 leading-normal font-medium italic">
                                            * Harap sesuaikan rincian RAB di Step 3 dengan total dana yang disetujui (Nilai Pagu - Biaya Luaran).
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeReviewers?.map((reviewer: Reviewer, idx: number) => (
                                (reviewer.catatan || (reviewer.selected_luaran && reviewer.selected_luaran.length > 0)) ? (
                                    <div key={idx} className="bg-white border text-sm border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                            <span className="font-bold text-slate-700">Reviewer {idx + 1}</span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            {reviewer.selected_luaran && reviewer.selected_luaran.length > 0 && (
                                                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-2">Rekomendasi Target Luaran:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {reviewer.selected_luaran.map((id: string) => (
                                                            <div key={id} className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                                                                {REVIEWER_LUARAN_MAP[id] || id}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {reviewer.catatan && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 px-0.5">Catatan Perbaikan:</span>
                                                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                                        {reviewer.catatan}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ReviewFeedbackPanel;

