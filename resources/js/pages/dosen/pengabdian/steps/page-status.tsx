import React from 'react';
import styles from '../../../../../css/pengajuan.module.css';
import { CurrentStep } from '../Index';
import { FileText, ClipboardList, PieChart, Users, CheckCircle } from 'lucide-react';

interface PageStatusProps {
    currentStep: CurrentStep;
    title: string;
    infoText?: string;
}

const PageStatus: React.FC<PageStatusProps> = ({
    currentStep = 1,
    title = "Usulan Pengabdian",
    infoText = "Silahkan isi form dengan data yang benar dan sesuai, agar proses berjalan dengan lancar. Terimakasih."
}) => {
    const isPengabdian = title.toLowerCase().includes('pengabdian');
    const steps = isPengabdian ? [
        { number: 1, label: 'Identitas', icon: FileText },
        { number: 2, label: 'Substansi', icon: ClipboardList },
        { number: 3, label: 'RAB', icon: PieChart },
        { number: 4, label: 'Mitra', icon: Users },
        { number: 5, label: 'Konfirmasi', icon: CheckCircle }
    ] : [
        { number: 1, label: 'Identitas', icon: FileText },
        { number: 2, label: 'Substansi', icon: ClipboardList },
        { number: 3, label: 'RAB & Luaran', icon: PieChart },
        { number: 4, label: 'Tinjauan', icon: CheckCircle }
    ];

    return (
        <div className={styles.container} style={{ marginBottom: '2rem' }}>
            <div className={styles.header} style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                    <h1 className={styles.title} style={{ fontSize: '1.5rem', fontWeight: 800 }}>{title}</h1>
                    <p className={styles.subtitle} style={{ fontSize: '0.875rem' }}>{infoText}</p>
                </div>
            </div>

            {/* Premium Stepper */}
            <div style={{ background: 'white', padding: '2rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '1.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                    {/* Progress Background Line */}
                    <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

                    {steps.map((step) => {
                        const isActive = step.number === currentStep;
                        const isCompleted = step.number < currentStep;

                        return (
                            <div key={step.number} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: isCompleted ? 'var(--primary)' : isActive ? 'white' : 'white',
                                    border: `2px solid ${isCompleted || isActive ? 'var(--primary)' : '#e2e8f0'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isCompleted ? 'white' : isActive ? 'var(--primary)' : '#94a3b8',
                                    boxShadow: isActive ? '0 0 0 4px var(--primary-light)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {isCompleted ? <CheckCircle size={20} /> : <step.icon size={20} />}
                                </div>
                                <div style={{
                                    marginTop: '10px',
                                    fontSize: '0.75rem',
                                    fontWeight: isActive ? 800 : 500,
                                    color: isActive ? 'var(--secondary)' : '#64748b',
                                    textAlign: 'center'
                                }}>
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PageStatus;
