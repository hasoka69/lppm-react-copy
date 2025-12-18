import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Header from "@/components/Header";
import Footer from "@/components/footer";
import PageIdentitas from './steps/page-identitas-1';
import PageUsulan from './steps/page-usulan';
import PageSubstansi from './steps/page-substansi-2';
import PageRAB from './steps/page-rab-3';
import PageStatus from './steps/page-status';
import PageTinjauan from './steps/page-tinjauan-4';
import styles from '../../../css/pengajuan.module.css';

// Tipe dasar
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

// Tipe lengkap untuk PageIdentitas
export interface UsulanData extends Usulan {
    tkt_saat_ini: string;
    target_akhir_tkt: string;
    kelompok_skema: string;
    ruang_lingkup: string;
}

// Steps
export type CurrentStep = 1 | 2 | 3 | 4;
type ActiveView = 'daftar' | 'pengajuan';

const PengajuanIndex = () => {
    const { props } = usePage();
    const usulanList: Usulan[] = (props.usulanList as Usulan[]) || [];

    const [activeView, setActiveView] = useState<ActiveView>('daftar');
    const [activeTab, setActiveTab] = useState<'daftar' | 'pengajuan' | 'riwayat' | 'panduan'>('daftar');
    const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
    const [editingUsulan, setEditingUsulan] = useState<Partial<UsulanData> | null>(null);

    // PENTING: State untuk menyimpan usulanId yang aktif
    const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(null);

    // Draft dummy jika belum ada
    const defaultDraft: UsulanData = {
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

    // Event handlers
    const handleTambahUsulan = () => {
        setEditingUsulan(null);
        setCurrentUsulanId(null); // Reset ID
        setActiveView('pengajuan');
        setActiveTab('pengajuan');
        setCurrentStep(1);
    };

    const handleEditUsulan = (usulan: Usulan) => {
        setEditingUsulan({ ...defaultDraft, ...usulan });
        setCurrentUsulanId(usulan.id); // Set ID dari usulan yang diedit
        setActiveView('pengajuan');
        setActiveTab('pengajuan');
        setCurrentStep(1);
    };

    const handleKembaliKeDaftar = () => {
        setActiveView('daftar');
        setActiveTab('daftar');
        setCurrentStep(1);
        setCurrentUsulanId(null); // Reset ID
    };

    const handleSelanjutnya = () => {
        if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as CurrentStep);
    };

    const handleKembali = () => {
        if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as CurrentStep);
    };

    // Handler untuk update usulanId setelah draft dibuat
    const handleDraftCreated = (usulanId: number) => {
        console.log('Draft created with ID:', usulanId);
        setCurrentUsulanId(usulanId);
    };

    // Render steps
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PageIdentitas
                        usulan={usulanToEdit}
                        usulanId={currentUsulanId ?? undefined}
                        onSelanjutnya={handleSelanjutnya}
                        onTutupForm={handleKembaliKeDaftar}
                        onDraftCreated={handleDraftCreated} // Pass callback
                    />
                );
            case 2:
                return (
                    <PageSubstansi
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                        usulanId={currentUsulanId ?? undefined} // Pass usulanId
                    />
                );
            case 3:
                return (
                    <PageRAB
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                        usulanId={currentUsulanId ?? undefined} // Pass usulanId
                    />
                );
            case 4:
                return (
                    <PageTinjauan
                        onKembali={handleKembali}
                        onKonfirmasi={handleKembaliKeDaftar}
                        usulanId={currentUsulanId ?? undefined} // Pass usulanId
                    />
                );
            default:
                return null;
        }
    };

    // Render content
    const renderContent = () => {
        if (activeView === 'daftar') {
            return (
                <PageUsulan
                    onTambahUsulan={handleTambahUsulan}
                    onEditUsulan={handleEditUsulan}
                    usulanList={usulanList}
                />
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