// resources/js/pages/pengajuan/components/LuaranForm.tsx

import React, { useState } from 'react';
import { LuaranAPI, isValidationError, getValidationErrors, getErrorMessage } from '@/services/pengajuanAPI';

interface Luaran {
    id: number;
    usulan_id: number;
    tahun: number;
    kategori: string;
    deskripsi: string;
    status: string;
    keterangan?: string;
}

interface LuaranFormProps {
    usulanId: number;
    luaran?: Luaran;
    onSubmitSuccess: () => void;
    onCancel: () => void;
}

interface FormData {
    tahun: number;
    kategori: string;
    deskripsi: string;
    status: string;
    keterangan: string;
}

interface FormErrors {
    [key: string]: string[];
}

export const LuaranForm: React.FC<LuaranFormProps> = ({
    usulanId,
    luaran,
    onSubmitSuccess,
    onCancel,
}) => {
    const isEditMode = !!luaran;

    const [formData, setFormData] = useState<FormData>({
        tahun: luaran?.tahun || 1,
        kategori: luaran?.kategori || '',
        deskripsi: luaran?.deskripsi || '',
        status: luaran?.status || 'Rencana',
        keterangan: luaran?.keterangan || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'tahun' ? parseInt(value) || 1 : value,
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
                await LuaranAPI.update(luaran!.id, formData);
            } else {
                await LuaranAPI.create(usulanId, formData);
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
                {isEditMode ? 'Edit Luaran Penelitian' : 'Tambah Luaran Penelitian'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tahun */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tahun Penelitian <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tahun ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        {[1, 2, 3, 4, 5].map((year) => (
                            <option key={year} value={year}>
                                Tahun {year}
                            </option>
                        ))}
                    </select>
                    {errors.tahun && <p className="text-red-500 text-sm mt-1">{errors.tahun[0]}</p>}
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori Luaran <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kategori ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Contoh: Publikasi Jurnal, Seminar, Paten, dll"
                    />
                    {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori[0]}</p>}
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        disabled={loading}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Deskripsi detail luaran yang diharapkan (minimal 10 karakter)"
                    />
                    {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi[0]}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="Rencana">Rencana</option>
                        <option value="Dalam Proses">Dalam Proses</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
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
                        placeholder="Catatan tambahan atau detail penting"
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

export default LuaranForm;