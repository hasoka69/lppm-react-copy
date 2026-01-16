import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import styles from '../../../../../css/pengajuan.module.css';

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
    const [bahanItems, setBahanItems] = useState<RABItem[]>([]);
    const [perjalananItems, setPerjalananItems] = useState<RABItem[]>([]);
    const [publikasiItems, setPublikasiItems] = useState<RABItem[]>([]);
    const [pengumpulanItems, setPengumpulanItems] = useState<RABItem[]>([]);

    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const items = usulan?.rab_items || usulan?.rabItems;
        if (items) {
            setBahanItems(items.filter((i: any) => i.tipe === 'bahan'));
            setPerjalananItems(items.filter((i: any) => i.tipe === 'perjalanan'));
            setPublikasiItems(items.filter((i: any) => i.tipe === 'publikasi'));
            setPengumpulanItems(items.filter((i: any) => i.tipe === 'pengumpulan_data'));
        }
    }, [usulan]);

    const createEmptyItem = (tipe: string): RABItem => ({
        id: -Date.now(), // Temp ID
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
    const totalRAB = calculateTotal(bahanItems) + calculateTotal(perjalananItems) + calculateTotal(publikasiItems) + calculateTotal(pengumpulanItems);

    const handleSimpan = async () => {
        if (!usulanId) return;
        setIsSaving(true);
        try {
            // 1. Delete items
            await Promise.all(deletedIds.map(id => axios.delete(route('dosen.penelitian.rab.destroy', id))));

            // 2. Process lists
            const processList = async (list: RABItem[]) => {
                for (const item of list) {
                    const payload = { ...item, harga_satuan: item.harga_satuan }; // Map fields if needed
                    if (item.id < 0) {
                        // Create
                        if (!item.item) continue; // Skip empty
                        await axios.post(route('dosen.penelitian.rab.store', usulanId), payload);
                    } else {
                        // Update
                        await axios.put(route('dosen.penelitian.rab.update', item.id), payload);
                    }
                }
            };

            await processList(bahanItems);
            await processList(perjalananItems);
            await processList(publikasiItems);
            await processList(pengumpulanItems);

            // Refresh page data or proceed
            if (onSelanjutnya) onSelanjutnya();
            else router.reload({ only: ['usulan'] });

        } catch (error) {
            console.error('Save failed', error);
            alert('Gagal menyimpan RAB. Cek koneksi atau input.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderTable = (title: string, items: RABItem[], setter: React.Dispatch<React.SetStateAction<RABItem[]>>, tipe: string) => (
        <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.subTitle}>{title}</h3>
                <button className={styles.addButton} onClick={() => handleAddItem(tipe, setter)} disabled={!usulanId}>+ Tambah</button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Satuan</th>
                            <th>Volume</th>
                            <th>Harga Satuan</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td><input className={styles.inputSmall} value={item.item} onChange={e => handleUpdateItem(item.id, 'item', e.target.value, items, setter)} placeholder="Item" /></td>
                                <td><input className={styles.inputSmall} value={item.satuan} onChange={e => handleUpdateItem(item.id, 'satuan', e.target.value, items, setter)} placeholder="Satuan" /></td>
                                <td><input type="number" className={styles.inputSmall} value={item.volume} onChange={e => handleUpdateItem(item.id, 'volume', Number(e.target.value), items, setter)} /></td>
                                <td><input type="number" className={styles.inputSmall} value={item.harga_satuan} onChange={e => handleUpdateItem(item.id, 'harga_satuan', Number(e.target.value), items, setter)} /></td>
                                <td>Rp {item.total.toLocaleString('id-ID')}</td>
                                <td><button className={styles.deleteButton} onClick={() => handleDeleteItem(item.id, items, setter)}>🗑️</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Rencana Anggaran Belanja (Penelitian)</h2>
                <div className={styles.infoBox}>
                    Total RAB: <strong>Rp {totalRAB.toLocaleString('id-ID')}</strong>
                </div>
            </div>

            {renderTable('RAB Bahan', bahanItems, setBahanItems, 'bahan')}
            {renderTable('RAB Perjalanan', perjalananItems, setPerjalananItems, 'perjalanan')}
            {renderTable('RAB Publikasi', publikasiItems, setPublikasiItems, 'publikasi')}
            {renderTable('RAB Pengumpulan Data', pengumpulanItems, setPengumpulanItems, 'pengumpulan_data')}

            <div className={styles.actionContainer}>
                <button className={styles.secondaryButton} onClick={onKembali} disabled={isSaving}>&lt; Kembali</button>
                <button className={styles.primaryButton} onClick={handleSimpan} disabled={isSaving || !usulanId}>
                    {isSaving ? 'Menyimpan...' : 'Selanjutnya >'}
                </button>
            </div>
        </>
    );
};

export default PageRAB;
