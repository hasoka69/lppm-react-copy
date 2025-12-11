import React, { useState, useEffect } from 'react';
import { RabAPI, getErrorMessage } from '@/services/pengajuanAPI';

interface RabItem {
    id: number;
    usulan_id: number;
    tipe: 'bahan' | 'pengumpulan_data';
    kategori: string;
    item: string;
    satuan: string;
    volume: number;
    harga_satuan: number;
    total: number;
    keterangan?: string;
}

interface RabListProps {
    usulanId: number;
    onEdit: (rabItem: RabItem) => void;
    refreshTrigger?: number;
}

export const RabList: React.FC<RabListProps> = ({ usulanId, onEdit, refreshTrigger = 0 }) => {
    const [items, setItems] = useState<RabItem[]>([]);
    const [totalAnggaran, setTotalAnggaran] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Load RAB items
    const loadItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await RabAPI.getList(usulanId);
            setItems(response.data || []);
            setTotalAnggaran(response.total_anggaran || 0);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Load on mount and when refreshTrigger changes
    useEffect(() => {
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usulanId, refreshTrigger]);

    // Delete RAB item
    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            return;
        }

        setDeletingId(id);

        try {
            await RabAPI.delete(id);
            // Reload data after delete
            await loadItems();
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-40">
                <p className="text-gray-500">Memuat data RAB...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                    onClick={loadItems}
                    className="mt-3 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Total Anggaran Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <p className="text-sm opacity-90">Total Anggaran RAB</p>
                <p className="text-3xl font-bold">Rp {totalAnggaran.toLocaleString('id-ID')}</p>
            </div>

            {/* Items Table */}
            {items.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>Belum ada item RAB. Mulai dengan menambah item baru.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Tipe</th>
                                <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                                <th className="px-4 py-3 text-left font-semibold">Item</th>
                                <th className="px-4 py-3 text-center font-semibold">Vol</th>
                                <th className="px-4 py-3 text-right font-semibold">Harga/Unit</th>
                                <th className="px-4 py-3 text-right font-semibold">Total</th>
                                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {item.tipe === 'bahan' ? 'Bahan' : 'Pengumpulan Data'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{item.kategori}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{item.item}</div>
                                        <div className="text-xs text-gray-500">{item.satuan}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium">{item.volume}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        Rp {item.harga_satuan.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                                        Rp {item.total.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="text-red-600 hover:text-red-800 font-medium text-xs disabled:text-gray-400"
                                            >
                                                {deletingId === item.id ? 'Hapus...' : 'Hapus'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Summary */}
            {items.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
                    <span className="font-medium text-gray-700">Total {items.length} item</span>
                    <span className="font-semibold text-blue-600">
                        Rp {totalAnggaran.toLocaleString('id-ID')}
                    </span>
                </div>
            )}
        </div>
    );
};

export default RabList;
