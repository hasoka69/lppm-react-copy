// resources/js/pages/pengajuan/components/LuaranList.tsx

import React, { useState, useEffect } from 'react';
import { LuaranAPI, getErrorMessage } from '@/services/pengajuanAPI';

interface Luaran {
    id: number;
    usulan_id: number;
    tahun: number;
    kategori: string;
    deskripsi: string;
    status: string;
    keterangan?: string;
}

interface LuaranListProps {
    usulanId: number;
    onEdit: (luaran: Luaran) => void;
    refreshTrigger?: number;
}

export const LuaranList: React.FC<LuaranListProps> = ({ usulanId, onEdit, refreshTrigger = 0 }) => {
    const [items, setItems] = useState<Luaran[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Load Luaran items
    const loadItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await LuaranAPI.getList(usulanId);
            setItems(response.data || []);
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

    // Delete Luaran item
    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus luaran ini?')) {
            return;
        }

        setDeletingId(id);

        try {
            await LuaranAPI.delete(id);
            // Reload data after delete
            await loadItems();
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setDeletingId(null);
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Rencana':
                return 'bg-yellow-100 text-yellow-800';
            case 'Dalam Proses':
                return 'bg-blue-100 text-blue-800';
            case 'Selesai':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-40">
                <p className="text-gray-500">Memuat data luaran...</p>
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
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <p className="text-sm opacity-90">Total Luaran Penelitian</p>
                <p className="text-3xl font-bold">{items.length}</p>
            </div>

            {/* Items List */}
            {items.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>Belum ada luaran penelitian. Mulai dengan menambah luaran baru.</p>
                </div>
            ) : (
                <div className="divide-y">
                    {items.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900">{item.kategori}</h3>
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{item.deskripsi}</p>
                                    {item.keterangan && (
                                        <p className="text-sm text-gray-500 italic">
                                            Keterangan: {item.keterangan}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-sm text-gray-500 mb-3">Tahun {item.tahun}</div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deletingId === item.id}
                                            className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 disabled:bg-gray-400 transition"
                                        >
                                            {deletingId === item.id ? 'Hapus...' : 'Hapus'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {items.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t text-right">
                    <span className="font-semibold text-gray-700">Total {items.length} luaran</span>
                </div>
            )}
        </div>
    );
};

export default LuaranList;