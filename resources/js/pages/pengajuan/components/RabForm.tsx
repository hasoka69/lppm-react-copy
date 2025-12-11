import React, { useState, useEffect } from 'react';
import { RabAPI, isValidationError, getValidationErrors, getErrorMessage } from '@/services/pengajuanAPI';

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

interface RabFormProps {
    usulanId: number;
    rabItem?: RabItem;
    onSubmitSuccess: () => void;
    onCancel: () => void;
}

interface FormData {
    tipe: 'bahan' | 'pengumpulan_data';
    kategori: string;
    item: string;
    satuan: string;
    volume: number;
    harga_satuan: number;
    keterangan: string;
}

interface FormErrors {
    [key: string]: string[];
}

export const RabForm: React.FC<RabFormProps> = ({
    usulanId,
    rabItem,
    onSubmitSuccess,
    onCancel,
}) => {
    const isEditMode = !!rabItem;

    const [formData, setFormData] = useState<FormData>({
        tipe: rabItem?.tipe || 'bahan',
        kategori: rabItem?.kategori || '',
        item: rabItem?.item || '',
        satuan: rabItem?.satuan || '',
        volume: rabItem?.volume || 0,
        harga_satuan: rabItem?.harga_satuan || 0,
        keterangan: rabItem?.keterangan || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [autoTotal, setAutoTotal] = useState(0);

    // Calculate auto total whenever volume or harga_satuan changes
    useEffect(() => {
        setAutoTotal(formData.volume * formData.harga_satuan);
    }, [formData.volume, formData.harga_satuan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'volume' || name === 'harga_satuan' ? parseInt(value) || 0 : value,
        }));

        // Clear error for this field when user starts editing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEditMode) {
                await RabAPI.update(rabItem.id, formData);
            } else {
                await RabAPI.create(usulanId, formData);
            }

            // Success
            onSubmitSuccess();
        } catch (error) {
            if (isValidationError(error)) {
                setErrors(getValidationErrors(error));
            } else {
                alert(getErrorMessage(error));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
                {isEditMode ? 'Edit Item RAB' : 'Tambah Item RAB'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipe <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="tipe"
                        value={formData.tipe}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipe ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="bahan">Bahan/Material</option>
                        <option value="pengumpulan_data">Pengumpulan Data</option>
                    </select>
                    {errors.tipe && <p className="text-red-500 text-sm mt-1">{errors.tipe[0]}</p>}
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kategori ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Contoh: Reagent, Peralatan, Gaji, dll"
                    />
                    {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori[0]}</p>}
                </div>

                {/* Item */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="item"
                        value={formData.item}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.item ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Nama item yang akan dibeli/digunakan"
                    />
                    {errors.item && <p className="text-red-500 text-sm mt-1">{errors.item[0]}</p>}
                </div>

                {/* Satuan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Satuan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="satuan"
                        value={formData.satuan}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.satuan ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Contoh: botol, kg, buah, orang.hari, dll"
                    />
                    {errors.satuan && <p className="text-red-500 text-sm mt-1">{errors.satuan[0]}</p>}
                </div>

                {/* Volume dan Harga Satuan */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Volume <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="volume"
                            value={formData.volume}
                            onChange={handleChange}
                            disabled={loading}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.volume ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.volume && <p className="text-red-500 text-sm mt-1">{errors.volume[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Harga Satuan (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="harga_satuan"
                            value={formData.harga_satuan}
                            onChange={handleChange}
                            disabled={loading}
                            min="0"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.harga_satuan ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.harga_satuan && (
                            <p className="text-red-500 text-sm mt-1">{errors.harga_satuan[0]}</p>
                        )}
                    </div>
                </div>

                {/* Auto-Total Display */}
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total (Auto-calculated)</p>
                    <p className="text-2xl font-bold text-blue-600">
                        Rp {autoTotal.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Keterangan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keterangan (Opsional)
                    </label>
                    <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        disabled={loading}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Catatan tambahan untuk item ini"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? 'Menyimpan...' : isEditMode ? 'Update' : 'Tambah'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:bg-gray-200 transition"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RabForm;
