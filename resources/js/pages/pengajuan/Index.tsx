import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/footer";
import PageUser from './page-user';
import PageSelectProgram from './page-selectprogram';
import PageIdentitas from './page-identitas';
import PageUsulan from './page-usulan';
import PageSubstansi from './page-substansi';
import PageRAB from './page-rab';
import PageStatus from './page-status';
import PageTinjauan from './page-tinjauan';
import styles from '../../../css/pengajuan.module.css';

type ActiveView = 'daftar' | 'pengajuan';
type CurrentStep = 1 | 2 | 3 | 4;

const PengajuanIndex = () => {
    const [activeView, setActiveView] = useState<ActiveView>('daftar');
    const [activeTab, setActiveTab] = useState<'daftar' | 'pengajuan' | 'riwayat' | 'panduan'>('daftar');
    const [currentStep, setCurrentStep] = useState<CurrentStep>(1);

    // Handler untuk tombol Tambah Usulan Baru
    const handleTambahUsulan = () => {
        setActiveView('pengajuan');
        setActiveTab('pengajuan');
        setCurrentStep(1);
    };

    // Handler untuk kembali ke daftar usulan
    const handleKembaliKeDaftar = () => {
        setActiveView('daftar');
        setActiveTab('daftar');
        setCurrentStep(1);
    };

    // Handler navigasi steps
    const handleSelanjutnya = () => {
        console.log('Current step sebelum:', currentStep);
        if (currentStep < 4) {
            setCurrentStep((prev) => {
                const nextStep = (prev + 1) as CurrentStep;
                console.log('Current step sesudah:', nextStep);
                return nextStep;
            });
        }
    };

    const handleKembali = () => {
        console.log('Kembali dari step:', currentStep);
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as CurrentStep);
        }
    };

    // Render content berdasarkan currentStep
    const renderStepContent = () => {
        console.log('Rendering step:', currentStep);

        switch (currentStep) {
            case 1:
                return (
                    <>
                        {/* Tampilkan ketiga komponen secara berurutan di Step 1 */}
                        <PageUser />
                        <PageSelectProgram />
                        <PageIdentitas
                            onSelanjutnya={handleSelanjutnya}
                            onTutupForm={handleKembaliKeDaftar}
                        />
                    </>
                );
            case 2:
                return (
                    <PageSubstansi
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                    />
                );
            case 3:
                return (
                    <PageRAB
                        onKembali={handleKembali}
                        onSelanjutnya={handleSelanjutnya}
                    />
                );
            case 4:
                return (
                    <PageTinjauan
                        onKembali={handleKembali}
                        onKonfirmasi={handleKembaliKeDaftar}
                    />
                );
            default:
                return (
                    <>
                        <PageUser />
                        <PageSelectProgram />
                        <PageIdentitas
                            onSelanjutnya={handleSelanjutnya}
                            onTutupForm={handleKembaliKeDaftar}
                        />
                    </>
                );
        }
    };

    // Render content berdasarkan activeView
    const renderContent = () => {
        if (activeView === 'daftar') {
            return (
                <div className={styles.pageSection}>
                    <PageUsulan onTambahUsulan={handleTambahUsulan} />
                </div>
            );
        }

        // View pengajuan baru - menampilkan form berdasarkan currentStep
        return (
            <div className={styles.pageSection}>
                <PageStatus
                    currentStep={currentStep}
                    title={getStepTitle(currentStep)}
                    infoText={getStepInfoText(currentStep)}
                />
                {renderStepContent()}
            </div>
        );
    };

    // Helper functions untuk title dan info text
    const getStepTitle = (step: CurrentStep): string => {
        switch (step) {
            case 1: return 'Identitas Usulan';
            case 2: return 'Substansi Usulan';
            case 3: return 'Rencana Anggaran Biaya (RAB)';
            case 4: return 'Tinjauan Usulan';
            default: return 'Usulan Penelitian';
        }
    };

    const getStepInfoText = (step: CurrentStep): string => {
        switch (step) {
            case 1: return 'Silahkan isi form dengan data yang benar dan sesuai, agar proses berjalan dengan lancar, Terimakasih. Input dengan tanda * (Wajib diisi)';
            case 2: return 'Silahkan isi form dengan data yang benar dan sesuai, agar proses berjalan dengan lancar, Terimakasih. Input dengan tanda * (Wajib diisi)';
            case 3: return 'Silahkan isi form Rencana Anggaran Biaya dengan data yang benar dan sesuai. Input dengan tanda * (Wajib diisi)';
            case 4: return 'Silahkan tinjau dan konfirmasi data usulan penelitian Anda sebelum mengirimkan. Pastikan semua data sudah benar.';
            default: return 'Silahkan isi form dengan data yang benar dan sesuai.';
        }
    };

    return (
        <div className={styles.masterContainer}>
            <Header />

            {/* Main Navigation Tabs */}
            <div className={styles.tabContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'daftar' ? styles.active : ''}`}
                        onClick={() => {
                            setActiveView('daftar');
                            setActiveTab('daftar');
                        }}
                    >
                        Daftar Usulan
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'pengajuan' ? styles.active : ''}`}
                        onClick={() => {
                            setActiveView('pengajuan');
                            setActiveTab('pengajuan');
                        }}
                    >
                        Pengajuan Baru
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'riwayat' ? styles.active : ''}`}
                        onClick={() => setActiveTab('riwayat')}
                    >
                        Riwayat
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'panduan' ? styles.active : ''}`}
                        onClick={() => setActiveTab('panduan')}
                    >
                        Panduan
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {renderContent()}
            </div>

            <Footer />
        </div>
    );
};

export default PengajuanIndex;