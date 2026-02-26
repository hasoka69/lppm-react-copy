import React, { useState } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, ChevronRight, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reviewer {
    id: number;
    name: string;
    catatan?: string | null;
}

interface ReviewFeedbackPanelProps {
    reviewers?: Reviewer[];
    danaAwal?: number | string;
    danaDisetujui?: number | string;
    status?: string;
}

const ReviewFeedbackPanel: React.FC<ReviewFeedbackPanelProps> = ({ reviewers, danaAwal, danaDisetujui, status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // If no reviewers or no notes, we don't necessarily show it, but usually, if status is revision, there's a note.
    const hasNotes = reviewers && reviewers.some(r => r.catatan && r.catatan.trim() !== '');
    const hasFunding = danaAwal !== undefined || danaDisetujui !== undefined;

    if (status && status !== 'revision_dosen') return null;
    if (!hasNotes && !hasFunding) return null;

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

                            {/* Funding Information */}
                            {(danaAwal != null || danaDisetujui != null) && (
                                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-sm text-emerald-900 shadow-sm">
                                    <h4 className="font-bold mb-2 flex items-center gap-2">
                                        <PenTool className="w-4 h-4 text-emerald-600" /> Hasil Review Pendanaan
                                    </h4>
                                    <div className="flex flex-col gap-1.5">
                                        {danaAwal != null && (
                                            <div className="flex justify-between">
                                                <span className="text-emerald-700">Dana Usulan Awal:</span>
                                                <span className="font-semibold text-slate-700">Rp {Number(danaAwal).toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        {danaDisetujui != null && Number(danaDisetujui) > 0 && (
                                            <div className="flex justify-between border-t border-emerald-200/50 pt-1.5 mt-0.5">
                                                <span className="text-emerald-800 font-bold">Dana Disetujui:</span>
                                                <span className="font-bold text-emerald-700">Rp {Number(danaDisetujui).toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs text-emerald-600 italic">
                                        * Harap sesuaikan RAB Anda dengan dana yang disetujui.
                                    </p>
                                </div>
                            )}

                            {reviewers?.map((reviewer, idx) => (
                                reviewer.catatan ? (
                                    <div key={idx} className="bg-white border text-sm border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                            <span className="font-bold text-slate-700">Reviewer {idx + 1}</span>
                                        </div>
                                        <div className="p-5">
                                            <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                                {reviewer.catatan}
                                            </div>
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

