import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import Header from "@/components/Header";
import Footer from "@/components/footer";
import PageIdentitas from './steps/page-identitas-1';
import PageUsulan from './steps/page-usulan';
import PageSubstansi from './steps/page-substansi-2';
import PageRAB from './steps/page-rab-3';
import PageStatus from './steps/page-status';
import PageTinjauan from './steps/page-tinjauan-4';
import styles from '../../../css/pengajuan.module.css';

export interface Usulan {
    no: number;
    id: number;
    skema: string;
    judul: string;
    tahun_pelaksanaan: number;
    makro_riset: string;
    peran: string;
    status: string;
}

export interface UsulanData extends Usulan {
    tkt_saat_ini: string;
    target_akhir_tkt: string;
    kelompok_skema: string;
    ruang_lingkup: string;
}

export type CurrentStep = 1 | 2 | 3 | 4;
type ActiveView = 'daftar' | 'pengajuan';

const PengajuanIndex = () => {
    const { props } = usePage();
    const usulanList: Usulan[] = (props.usulanList as Usulan[]) || [];
    const latestDraft = (props.latestDraft as Partial<UsulanData>) || null;
    const serverCurrentStep = props.currentStep ? Number(props.currentStep) : null;
    const serverUsulan = (props.usulan as Partial<UsulanData>) || null;

    // ✅ Determine initial view: if step > 1 or usulan exists (edit mode), show 'pengajuan'
    const initialView: ActiveView = (serverCurrentStep && serverCurrentStep > 1) || props.editMode ? 'pengajuan' : 'daftar';

    const [activeView, setActiveView] = useState<ActiveView>(initialView);
    const [activeTab, setActiveTab] = useState<'daftar' | 'pengajuan' | 'riwayat' | 'panduan'>('daftar');
    const [currentStep, setCurrentStep] = useState<CurrentStep>((serverCurrentStep as CurrentStep) || 1);
    const [editingUsulan, setEditingUsulan] = useState<Partial<UsulanData> | null>(serverUsulan || latestDraft);
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(serverUsulan?.id || (latestDraft?.id ?? null));

    // ✅ Sync state when props change (navigation)
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

    // ✅ Auto-resume draft only if NOT already editing (serverUsulan)
    useEffect(() => {
        if (!serverUsulan && latestDraft && latestDraft.id && !currentUsulanId) {
            console.log('🔄 Auto-resuming draft:', latestDraft.id);
            setCurrentUsulanId(latestDraft.id);
            setEditingUsulan(latestDraft);
        }
    }, [latestDraft, serverUsulan, currentUsulanId]);

    const defaultDraft: UsulanData = {
        // ... (keep existing defaultDraft)
        id: 0,
        no: 0,
        skema: '',
        judul: '',
        tahun_pelaksanaan: new Date().getFullYear(),
        makro_riset: '',
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
            const confirm = window.confirm(
                'Anda memiliki draft yang belum selesai. Ingin melanjutkan draft tersebut atau membuat baru?'
            );

            if (confirm) {
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
        router.visit(`/pengajuan/${usulan.id}/step/1`);
    };

    const handleKembaliKeDaftar = () => {
        setActiveView('daftar');
        setActiveTab('daftar');
        setCurrentStep(1);
    };

    const handleSelanjutnya = () => {
        const nextStep = currentStep + 1;
        if (nextStep <= 4) {
            if (currentUsulanId) {
                // ✅ Use router.visit to fetch next step data from server
                router.visit(`/pengajuan/${currentUsulanId}/step/${nextStep}`);
            } else {
                setCurrentStep((prev) => (prev + 1) as CurrentStep);
            }
        }
    };

    const handleKembali = () => {
        const prevStep = currentStep - 1;
        if (prevStep >= 1) {
            if (currentUsulanId) {
                // ✅ Use router.visit to fetch prev step data from server (optional but safer)
                router.visit(`/pengajuan/${currentUsulanId}/step/${prevStep}`);
            } else {
                setCurrentStep((prev) => (prev - 1) as CurrentStep);
            }
        }
    };

    const handleDraftCreated = (usulanId: number) => {
        console.log('✅ Draft created/updated with ID:', usulanId);

        if (!usulanId || usulanId <= 0) {
            console.error('❌ Invalid usulanId received:', usulanId);
            alert('Error: ID usulan tidak valid');
            return;
        }

        setCurrentUsulanId(usulanId);
        console.log('✅ State updated - currentUsulanId:', usulanId);
    };

    const renderStepContent = () => {
        console.log('🔍 Rendering Step:', currentStep, 'with usulanId:', currentUsulanId);

        switch (currentStep) {
            case 1:
                return (
                    <PageIdentitas
                        usulan={usulanToEdit}
                        usulanId={currentUsulanId ?? undefined}
                        onSelanjutnya={handleSelanjutnya}
                        onTutupForm={handleKembaliKeDaftar}
                        onDraftCreated={handleDraftCreated}
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
                    <PageTinjauan
                        onKembali={handleKembali}
                        onKonfirmasi={handleKembaliKeDaftar}
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
                    {/* ✅ TAMBAHAN: Banner Draft Notification */}
                    {latestDraft && latestDraft.id && (
                        <div style={{
                            backgroundColor: '#dbeafe',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong>📝 Draft Terakhir:</strong> {latestDraft.judul || 'Belum ada judul'} (ID: {latestDraft.id})
                            </div>
                            <button
                                onClick={() => {
                                    setEditingUsulan(latestDraft);
                                    setCurrentUsulanId(latestDraft.id!);
                                    setActiveView('pengajuan');
                                    setActiveTab('pengajuan');
                                }}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Lanjutkan Draft
                            </button>
                        </div>
                    )}

                    <PageUsulan
                        onTambahUsulan={handleTambahUsulan}
                        onEditUsulan={handleEditUsulan}
                        onDeleteUsulan={(id) => {
                            router.delete(`/pengajuan/${id}`, {
                                onSuccess: () => alert('Usulan berhasil dihapus'),
                                onError: () => alert('Gagal menghapus usulan')
                            });
                        }}
                        onViewUsulan={(usulan) => {
                            // View as Read-Only (using Page 4 Tinjauan)
                            // Fetch data needed for Page 4
                            if (usulan.id) {
                                router.visit(`/pengajuan/${usulan.id}/step/4`);
                            }
                        }}
                        usulanList={usulanList}
                    />
                </>
            );
        }
        return (
            <>
                <PageStatus
                    currentStep={currentStep}
                    title={getStepTitle(currentStep)}
                    infoText={getStepInfoText(currentStep)}
                />
                {renderStepContent()}
            </>
        );
    };

    const getStepTitle = (step: CurrentStep) => {
        switch (step) {
            case 1: return 'Identitas Usulan';
            case 2: return 'Substansi Usulan';
            case 3: return 'Rencana Anggaran Biaya (RAB)';
            case 4: return 'Tinjauan Usulan';
            default: return 'Usulan Penelitian';
        }
    };

    const getStepInfoText = (step: CurrentStep) => {
        switch (step) {
            case 1: return 'Isi form identitas usulan.';
            case 2: return 'Isi substansi usulan.';
            case 3: return 'Isi RAB.';
            case 4: return 'Tinjau dan konfirmasi.';
            default: return '';
        }
    };

    return (
        <div className={styles.masterContainer}>
            <Header />
            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${activeTab === 'daftar' ? styles.active : ''}`} onClick={() => { setActiveView('daftar'); setActiveTab('daftar'); }}>Daftar Usulan</button>
                    <button className={`${styles.tab} ${activeTab === 'pengajuan' ? styles.active : ''}`} onClick={() => { setActiveView('pengajuan'); setActiveTab('pengajuan'); }}>Pengajuan Baru</button>
                    <button className={`${styles.tab} ${activeTab === 'riwayat' ? styles.active : ''}`} onClick={() => setActiveTab('riwayat')}>Riwayat</button>
                    <button className={`${styles.tab} ${activeTab === 'panduan' ? styles.active : ''}`} onClick={() => setActiveTab('panduan')}>Panduan</button>
                </div>
            </div>
            <div className={styles.contentArea}>{renderContent()}</div>
            <Footer />
        </div>
    );
};

export default PengajuanIndex;