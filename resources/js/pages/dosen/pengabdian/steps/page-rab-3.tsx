import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';
import {
    Wallet,
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    ChevronRight,
    Info,
    Users,
    Coffee,
    Truck,
    Hammer
} from 'lucide-react';

interface RABItem {
    id: number;
    usulan_id?: number;
    tipe: string;
    kategori: string;
    item: string;
    satuan: string;
    volume: number;
    harga_satuan: number;
    total: number;
}

interface PageRABProps {
    onKembali?: () => void;
    onSelanjutnya?: () => void;
    usulanId?: number;
}

const PageRAB: React.FC<PageRABProps> = ({ onKembali, onSelanjutnya, usulanId: propUsulanId }) => {
    const { props } = usePage<{ usulan?: any }>();
    const usulan = props.usulan;
    const usulanId = propUsulanId ?? usulan?.id;

    // Categories
    const [pelatihanItems, setPelatihanItems] = useState<RABItem[]>([]);
    const [konsumsiItems, setKonsumsiItems] = useState<RABItem[]>([]);
    const [transportItems, setTransportItems] = useState<RABItem[]>([]);
    const [alatBahanItems, setAlatBahanItems] = useState<RABItem[]>([]);

    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const items = usulan?.rab_items || usulan?.rabItems;
        if (items) {
            setPelatihanItems(items.filter((i: any) => i.tipe === 'pelatihan'));
            setKonsumsiItems(items.filter((i: any) => i.tipe === 'konsumsi'));
            setTransportItems(items.filter((i: any) => i.tipe === 'transport_mitra'));
            setAlatBahanItems(items.filter((i: any) => i.tipe === 'alat_bahan'));
        }
    }, [usulan]);

    const createEmptyItem = (tipe: string): RABItem => ({
        id: -Date.now(),
        tipe,
        kategori: 'Umum',
        item: '',
        satuan: '',
        volume: 1,
        harga_satuan: 0,
        total: 0
    });

    const handleAddItem = (tipe: string, setter: React.Dispatch<React.SetStateAction<RABItem[]>>) => {
        setter(prev => [...prev, createEmptyItem(tipe)]);
    };

    const handleUpdateItem = (id: number, field: keyof RABItem, value: any, list: RABItem[], setter: React.Dispatch<React.SetStateAction<RABItem[]>>) => {
        setter(list.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'volume' || field === 'harga_satuan') {
                    updated.total = updated.volume * updated.harga_satuan;
                }
                return updated;
            }
            return item;
        }));
    };

    const handleDeleteItem = (id: number, list: RABItem[], setter: React.Dispatch<React.SetStateAction<RABItem[]>>) => {
        if (id > 0) {
            setDeletedIds(prev => [...prev, id]);
        }
        setter(list.filter(item => item.id !== id));
    };

    const calculateTotal = (list: RABItem[]) => list.reduce((sum, i) => sum + i.total, 0);
    const totalRAB = calculateTotal(pelatihanItems) + calculateTotal(konsumsiItems) + calculateTotal(transportItems) + calculateTotal(alatBahanItems);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleSimpan = async () => {
        if (!usulanId) return;
        setIsSaving(true);
        // Validation: Cek Pagu Dana (Admin Revision Mode)
        if (usulan?.dana_disetujui > 0 && totalRAB > Number(usulan.dana_disetujui)) {
            alert(`Gagal Menyimpan: Total RAB (Rp ${formatCurrency(totalRAB)}) melebihi pagu dana yang disetujui (Rp ${formatCurrency(usulan.dana_disetujui)}). Silakan sesuaikan kembali.`);
            setIsSaving(false);
            return;
        }

        try {
            await Promise.all(deletedIds.map(id => axios.delete(route('dosen.pengabdian.rab.destroy', id))));

            const processList = async (list: RABItem[]) => {
                for (const item of list) {
                    const payload = { ...item };
                    if (item.id < 0) {
                        if (!item.item) continue;
                        await axios.post(route('dosen.pengabdian.rab.store', usulanId), payload);
                    } else {
                        await axios.put(route('dosen.pengabdian.rab.update', item.id), payload);
                    }
                }
            };

            await processList(pelatihanItems);
            await processList(konsumsiItems);
            await processList(transportItems);
            await processList(alatBahanItems);

            if (onSelanjutnya) onSelanjutnya();
            else router.reload({ only: ['usulan'] });
            alert('RAB Pengabdian berhasil disimpan.');
        } catch (error) {
            console.error('Save failed', error);
            alert('Gagal menyimpan RAB Pengabdian. Periksa kelengkapan data.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderTable = (title: string, icon: React.ReactNode, items: RABItem[], setter: React.Dispatch<React.SetStateAction<RABItem[]>>, tipe: string) => (
        <div className={styles.pageSection} style={{ marginTop: '1.5rem' }}>
            <div className={styles.formSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ color: 'var(--primary)' }}>{icon}</div>
                        <h3 className={styles.subTitle} style={{ margin: 0 }}>{title}</h3>
                    </div>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => handleAddItem(tipe, setter)}
                        disabled={!usulanId}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                    >
                        <Plus size={16} /> Tambah Item
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className={styles.table}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Nama Item / Deskripsi</th>
                                <th style={{ width: '120px' }}>Satuan</th>
                                <th style={{ width: '100px' }}>Volume</th>
                                <th style={{ width: '180px' }}>Harga Satuan</th>
                                <th style={{ width: '180px', textAlign: 'right' }}>Total</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        Belum ada item untuk kategori ini.
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                className={styles.input}
                                                style={{ border: 'none', background: 'transparent', width: '100%' }}
                                                value={item.item}
                                                onChange={e => handleUpdateItem(item.id, 'item', e.target.value, items, setter)}
                                                placeholder="Nama Barang/Jasa"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={styles.input}
                                                style={{ border: 'none', background: 'transparent', textAlign: 'center' }}
                                                value={item.satuan}
                                                onChange={e => handleUpdateItem(item.id, 'satuan', e.target.value, items, setter)}
                                                placeholder="Set/Hari/Pkt"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className={styles.input}
                                                style={{ border: 'none', background: 'transparent', textAlign: 'center' }}
                                                value={item.volume}
                                                onChange={e => handleUpdateItem(item.id, 'volume', e.target.value === '' ? '' : (Number(e.target.value) || 0), items, setter)}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rp</span>
                                                <input
                                                    type="number"
                                                    className={styles.input}
                                                    style={{ border: 'none', background: 'transparent' }}
                                                    value={item.harga_satuan}
                                                    onChange={e => handleUpdateItem(item.id, 'harga_satuan', e.target.value === '' ? '' : (Number(e.target.value) || 0), items, setter)}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--secondary)' }}>
                                            {formatCurrency(item.total)}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteItem(item.id, items, setter)}
                                                style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {items.length > 0 && (
                            <tfoot>
                                <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                                    <td colSpan={4} style={{ textAlign: 'right', padding: '12px' }}>Subtotal:</td>
                                    <td style={{ textAlign: 'right', padding: '12px', color: 'var(--primary)' }}>
                                        {formatCurrency(calculateTotal(items))}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header RAB Summary Card */}
            <div className={styles.pageSection}>
                <div className={styles.formSection} style={{ background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
                                <Wallet size={20} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rencana Anggaran Belanja</span>
                            </div>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>Usulan Pengabdian</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Total Anggaran</p>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: '#fbbf24' }}>{formatCurrency(totalRAB)}</h2>
                        </div>
                    </div>
                </div>

                {usulan?.dana_disetujui > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', borderLeft: '4px solid #fbbf24', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Info size={20} />
                        <div>
                            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Anggaran Disetujui Admin:</span>
                            <strong style={{ marginLeft: '8px', color: '#fbbf24' }}>{formatCurrency(Number(usulan.dana_disetujui))}</strong>
                        </div>
                    </div>
                )}
            </div>


            {renderTable('RAB Pelatihan', <Users size={22} />, pelatihanItems, setPelatihanItems, 'pelatihan')}
            {renderTable('RAB Konsumsi', <Coffee size={22} />, konsumsiItems, setKonsumsiItems, 'konsumsi')}
            {renderTable('RAB Transport Mitra', <Truck size={22} />, transportItems, setTransportItems, 'transport_mitra')}
            {renderTable('RAB Alat & Bahan', <Hammer size={22} />, alatBahanItems, setAlatBahanItems, 'alat_bahan')}

            {/* Action Buttons */}
            <div className={styles.actionContainer}>
                <button type="button" className={styles.secondaryButton} onClick={onKembali} disabled={isSaving}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Kembali
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={handleSimpan}
                        disabled={isSaving || !usulanId}
                    >
                        <Save size={18} style={{ marginRight: '8px' }} /> Simpan Draft
                    </button>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleSimpan}
                        disabled={isSaving || !usulanId}
                    >
                        {isSaving ? 'Menyimpan...' : (
                            <>
                                Selanjutnya <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PageRAB;
