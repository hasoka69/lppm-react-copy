import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import Header from "@/components/Header";
import Footer from "@/components/footer";
import PageIdentitas from '././steps/page-identitas-1';
import PageUsulan from '././steps/page-usulan';
import PageSubstansi from '././steps/page-substansi-2';
import PageRAB from '././steps/page-rab-3';
import PageMitra from '././steps/page-mitra-4';
import PageKonfirmasi from '././steps/page-konfirmasi-5';
import PageStatus from '././steps/page-status';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../../css/pengajuan.module.css';

export interface Usulan {
    no: number;
    id: number;
    skema: string;
    judul: string;
    tahun_pelaksanaan: number;
    peran: string;
    status: string;
    nomor_kontrak?: any;
}

export interface UsulanData extends Usulan {
    tkt_saat_ini: string;
    target_akhir_tkt: string;
    kelompok_skema: string;
    ruang_lingkup: string;
}

export type CurrentStep = 1 | 2 | 3 | 4 | 5;
type ActiveView = 'daftar' | 'pengajuan';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const PengabdianIndex = () => {
    const { props } = usePage<{
        usulanList: Usulan[];
        latestDraft?: Partial<UsulanData>;
        currentStep?: string | number;
        usulan?: Partial<UsulanData>;
        editMode?: boolean;
        isPerbaikanView?: boolean;
        title?: string;
        provinsiList?: any[];
    }>();
    const usulanList = props.usulanList || [];
    const latestDraft = props.latestDraft || null;
    const serverCurrentStep = props.currentStep ? Number(props.currentStep) : null;
    const serverUsulan = props.usulan || null;
    const { isPerbaikanView, title: pageTitle } = props;

    const initialView: ActiveView = (serverCurrentStep && serverCurrentStep > 1) || props.editMode ? 'pengajuan' : 'daftar';

    const [activeView, setActiveView] = useState<ActiveView>(initialView);
    const [activeTab, setActiveTab] = useState<'daftar' | 'pengajuan' | 'riwayat' | 'panduan' | 'perbaikan' | 'laporan-kemajuan' | 'catatan-harian' | 'laporan-akhir' | 'pengkinian-capaian'>(isPerbaikanView ? 'perbaikan' : 'daftar');
    const [currentStep, setCurrentStep] = useState<CurrentStep>((serverCurrentStep as CurrentStep) || 1);
    const [editingUsulan, setEditingUsulan] = useState<Partial<UsulanData> | null>(serverUsulan || latestDraft);
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(serverUsulan?.id || (latestDraft?.id ?? null));

    useEffect(() => {
        if (serverCurrentStep) {
            setActiveView('pengajuan');
            setCurrentStep(serverCurrentStep as CurrentStep);
        }
        if (serverUsulan) {
            setEditingUsulan(serverUsulan);
            setCurrentUsulanId(serverUsulan.id!);
        }
    }, [serverCurrentStep, serverUsulan]);

    useEffect(() => {
        if (!serverUsulan && latestDraft && latestDraft.id && !currentUsulanId) {
            console.log('🔄 Auto-resuming draft pengabdian:', latestDraft.id);
            setCurrentUsulanId(latestDraft.id);
            setEditingUsulan(latestDraft);
        }
    }, [latestDraft, serverUsulan, currentUsulanId]);

    const defaultDraft: UsulanData = {
        id: 0,
        no: 0,
        skema: '',
        judul: '',
        tahun_pelaksanaan: new Date().getFullYear(),
        peran: '',
        status: 'draft',
        tkt_saat_ini: '',
        target_akhir_tkt: '',
        kelompok_skema: '',
        ruang_lingkup: '',
    };

    const usulanToEdit: Partial<UsulanData> = editingUsulan || defaultDraft;

    const handleTambahUsulan = () => {
        if (currentUsulanId && latestDraft) {
            if (window.confirm('Anda memiliki draft pengabdian yang belum selesai. Ingin melanjutkan draft tersebut atau membuat baru?')) {
                setEditingUsulan(latestDraft);
            } else {
                setEditingUsulan(null);
                setCurrentUsulanId(null);
            }
        } else {
            setEditingUsulan(null);
            setCurrentUsulanId(null);
        }
        setActiveView('pengajuan');
        setActiveTab('pengajuan');
        setCurrentStep(1);
    };

    const handleEditUsulan = (usulan: Usulan) => {
        router.visit(`/dosen/pengabdian/${usulan.id}/step/1`);
    };

    const handleKembaliKeDaftar = () => {
        setActiveView('daftar');
        setActiveTab('daftar');
        setCurrentStep(1);
    };

    const handleSelanjutnya = () => {
        const nextStep = currentStep + 1;
        if (nextStep <= 5) {
            if (currentUsulanId) {
                router.visit(`/dosen/pengabdian/${currentUsulanId}/step/${nextStep}`);
            } else {
                setCurrentStep((prev) => (prev + 1) as CurrentStep);
            }
        }
    };

    const handleKembali = () => {
        const prevStep = currentStep - 1;
        if (prevStep >= 1) {
            if (currentUsulanId) {
                router.visit(`/dosen/pengabdian/${currentUsulanId}/step/${prevStep}`);
            } else {
                setCurrentStep((prev) => (prev - 1) as CurrentStep);
            }
        }
    };

    const handleDraftCreated = (usulanId: number) => {
        if (!usulanId || usulanId <= 0) return;
        setCurrentUsulanId(usulanId);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PageIdentitas
                        usulan={usulanToEdit}
                        usulanId={currentUsulanId ?? undefined}
                        onSelanjutnya={handleSelanjutnya}
                        onTutupForm={handleKembaliKeDaftar}
                        onDraftCreated={handleDraftCreated}
                        isPengabdian={true}
                        {...props} // Pass master props (rumpun ilmu types, etc)
                    />
                );
            case 2:
                return (
                    <PageSubstansi
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                        usulanId={currentUsulanId ?? undefined}
                    />
                );
            case 3:
                return (
                    <PageRAB
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                        usulanId={currentUsulanId ?? undefined}
                    />
                );
            case 4:
                return (
                    <PageMitra
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                        usulanId={currentUsulanId ?? undefined}
                        provinsiList={props.provinsiList} // Assuming passed from controller if eager loaded, or will fetch
                    />
                );
            case 5:
                return (
                    <PageKonfirmasi
                        onKembali={handleKembali}
                        onKonfirmasi={handleKembaliKeDaftar}
                        onTutupForm={handleKembaliKeDaftar}
                        usulanId={currentUsulanId ?? undefined}
                    />
                );
            default:
                return null;
        }
    };

    const renderContent = () => {
        if (activeView === 'daftar') {
            return (
                <>
                    {latestDraft && latestDraft.id && (
                        <div style={{ backgroundColor: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>📝 Draft Terakhir Pengabdian:</strong> {latestDraft.judul || 'Belum ada judul'} (ID: {latestDraft.id})
                            </div>
                            <button onClick={() => { setEditingUsulan(latestDraft); setCurrentUsulanId(latestDraft.id!); setActiveView('pengajuan'); setActiveTab('pengajuan'); }} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                Lanjutkan
                            </button>
                        </div>
                    )}
                    <PageUsulan
                        onTambahUsulan={handleTambahUsulan}
                        onEditUsulan={handleEditUsulan}
                        onDeleteUsulan={(id: number) => {
                            router.delete(`/dosen/pengabdian/${id}`, {
                                onSuccess: () => alert('Usulan berhasil dihapus'),
                                onError: () => alert('Gagal menghapus usulan')
                            });
                        }}
                        onViewUsulan={(usulan: Usulan) => {
                            if (usulan.id) router.visit(`/dosen/pengabdian/${usulan.id}/step/5?mode=view`);
                        }}
                        usulanList={usulanList}
                        title={pageTitle}
                        isPerbaikanView={isPerbaikanView}
                    />
                </>
            );
        }

        if (activeTab === 'laporan-kemajuan') {
            return <div className="p-8 text-center bg-white rounded-lg shadow">Halaman Laporan Kemajuan (Segera Hadir)</div>;
        }
        if (activeTab === 'catatan-harian') {
            return <div className="p-8 text-center bg-white rounded-lg shadow">Halaman Catatan Harian (Segera Hadir)</div>;
        }
        if (activeTab === 'laporan-akhir') {
            return <div className="p-8 text-center bg-white rounded-lg shadow">Halaman Laporan Akhir (Segera Hadir)</div>;
        }
        if (activeTab === 'pengkinian-capaian') {
            return <div className="p-8 text-center bg-white rounded-lg shadow">Halaman Pengkinian Capaian Luaran (Segera Hadir)</div>;
        }

        return (
            <>
                <PageStatus currentStep={currentStep} title={getStepTitle(currentStep)} infoText={getStepInfoText(currentStep)} />
                {renderStepContent()}
            </>
        );
    };

    const getStepTitle = (step: CurrentStep) => {
        switch (step) {
            case 1: return 'Identitas Usulan';
            case 2: return 'Substansi & Luaran';
            case 3: return 'RAB';
            case 4: return 'Mitra & Dokumen';
            case 5: return 'Konfirmasi';
            default: return 'Usulan Pengabdian';
        }
    };

    const getStepInfoText = (step: CurrentStep) => {
        switch (step) {
            case 1: return 'Informasi dasar, Rumpun Ilmu, dan Tim.';
            case 2: return 'Dokumen substansi dan target luaran.';
            case 3: return 'Rencana Anggaran Biaya.';
            case 4: return 'Data Mitra dan dokumen pendukung.';
            case 5: return 'Tinjau dan kirim usulan.';
            default: return '';
        }
    };

    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                            { label: 'Daftar Pengabdian', active: activeTab === 'daftar', route: route('dosen.pengabdian.index') },
                            { label: 'Perbaikan Usulan', active: activeTab === 'perbaikan', route: route('dosen.pengabdian.perbaikan') },
                            { label: 'Laporan Kemajuan', route: route('dosen.pengabdian.laporan-kemajuan.index') },
                            { label: 'Catatan Harian', route: route('dosen.pengabdian.catatan-harian.index') },
                            { label: 'Laporan Akhir', route: route('dosen.pengabdian.laporan-akhir.index') },
                            { label: 'Pengkinian Capaian Luaran', route: route('dosen.pengabdian.pengkinian-luaran.index') }
                        ].map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (tab.active) return;
                                    if (tab.label === 'Daftar Pengabdian' && !isPerbaikanView) {
                                        setActiveView('daftar');
                                        setActiveTab('daftar');
                                    } else {
                                        router.visit(tab.route);
                                    }
                                }}
                                className={`px-5 py-4 text-[13px] font-semibold transition-all whitespace-nowrap relative ${tab.active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.label}
                                {tab.active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.contentArea}
            >
                {renderContent()}
            </motion.div>
            <Footer />
        </div>
    );
};

export default PengabdianIndex;
