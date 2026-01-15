import React from 'react';
import styles from '../../../../../css/pengajuan.module.css';
import { CurrentStep } from '../Index';


interface PageStatusProps {
    currentStep: CurrentStep;
    title: string;
    infoText?: string;
}

const PageStatus: React.FC<PageStatusProps> = ({
    currentStep = 1,
    title = "Usulan Penelitian"
}) => {
    const steps = [
        { number: 1, label: 'Identitas Usulan' },
        { number: 2, label: 'Substansi Usulan' },
        { number: 3, label: 'RAB' },
        { number: 4, label: 'Konfirmasi Usulan' }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {/* Progress Steps */}
            <div className={styles.progressContainer}>
                {steps.map((step) => (
                    <div key={step.number} className={styles.progressStep}>
                        <div
                            className={`${styles.stepNumber} ${step.number === currentStep ? styles.active : ''
                                } ${step.number < currentStep ? styles.completed : ''
                                }`}
                        >
                            {step.number < currentStep ? '✓' : step.number}
                        </div>
                        <div
                            className={`${styles.stepLabel} ${step.number === currentStep ? styles.active : ''
                                } ${step.number < currentStep ? styles.completed : ''
                                }`}
                        >
                            {step.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Information Box */}
            <div className={styles.infoBox}>
                <div className={styles.infoIcon}>ℹ️</div>
                <div className={styles.infoText}>
                    Silahkan isi form dengan data yang benar dan sesuai, agar proses berjalan dengan lancar, Terimakasih.
                    Input dengan tanda * (Wajib diisi)
                </div>
            </div>
        </div>
    );
};

export default PageStatus;
