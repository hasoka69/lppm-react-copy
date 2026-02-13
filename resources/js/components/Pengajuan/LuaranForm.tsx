// resources/js/pages/pengajuan/components/LuaranForm.tsx

import React, { useState, useEffect } from 'react';
import { LuaranAPI, isValidationError, getValidationErrors, getErrorMessage } from '@/services/pengajuanAPI';
import { Users, Newspaper, Video, Globe, BookOpen, Plus } from 'lucide-react';

export interface Luaran {
    id: number;
    usulan_id: number;
    tahun: number;
    kategori: string;
    deskripsi: string;
    is_wajib: boolean;
    status: string;
    keterangan?: string;
    attribute?: any;
}

interface LuaranFormProps {
    usulanId: number;
    luaran?: Luaran;
    onSubmitSuccess: () => void;
    onCancel: () => void;
    isPengabdian?: boolean;
    initialKategori?: string;
    fixedKategori?: string;
    showStatus?: boolean;
}

interface FormData {
    kategori: string;
    deskripsi: string;
    is_wajib: boolean;
    status: string;
    keterangan: string;
    attribute: any;
}

interface FormErrors {
    [key: string]: string[];
}

export const LuaranForm: React.FC<LuaranFormProps> = ({
    usulanId,
    luaran,
    onSubmitSuccess,
    onCancel,
    isPengabdian = false,
    initialKategori = '',
    fixedKategori = '',
    showStatus = false
}) => {
    const apiPrefix = isPengabdian ? '/dosen/pengabdian' : '/dosen/penelitian';
    const isEditMode = !!luaran;

    // Parse attribute if it's a string, otherwise use as is or empty object
    const initialAttribute = luaran?.attribute
        ? (typeof luaran.attribute === 'string' ? JSON.parse(luaran.attribute) : luaran.attribute)
        : {};

    const [formData, setFormData] = useState<FormData>({
        kategori: luaran?.kategori || fixedKategori || initialKategori,
        deskripsi: luaran?.deskripsi || '',
        is_wajib: luaran?.is_wajib ?? true,
        status: 'Rencana',
        keterangan: luaran?.keterangan || '',
        attribute: initialAttribute,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Update formData when fixedKategori changes
    useEffect(() => {
        if (fixedKategori) {
            setFormData(prev => ({ ...prev, kategori: fixedKategori }));
        }
    }, [fixedKategori]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'is_wajib' ? value === 'true' : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: [] }));
        }
    };

    const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            attribute: {
                ...prev.attribute,
                [name]: value
            }
        }));
    };

    const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
        setFormData(prev => {
            const currentArray = prev.attribute[name] || [];
            let newArray;
            if (checked) {
                newArray = [...currentArray, value];
            } else {
                newArray = currentArray.filter((item: string) => item !== value);
            }
            return {
                ...prev,
                attribute: {
                    ...prev.attribute,
                    [name]: newArray
                }
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Construct description based on attributes if empty or generic
        let finalDeskripsi = formData.deskripsi;

        // Auto-generate description if needed based on category
        if (isPengabdian) {
            const attr = formData.attribute;
            if (formData.kategori.includes('Mitra')) {
                finalDeskripsi = `Peningkatan Mitra: ${attr.peningkatan?.join(', ') || '-'}. Sebelum: ${attr.mitra_sebelum || '-'}, Sesudah: ${attr.mitra_sesudah || '-'}`;
            } else if (formData.kategori.includes('Media')) {
                finalDeskripsi = `Publikasi di ${attr.nama_media || '-'} (${attr.jenis_liputan || '-'}). Terbit: ${attr.tanggal_terbit || '-'}`;
            } else if (formData.kategori.includes('Video')) {
                finalDeskripsi = `Video ${attr.jenis_konten || '-'} di ${attr.platform || '-'} (${attr.durasi || '-'})`;
            }
            // Update the formData with the generated description if user hasn't typed a custom one or just to ensure it's communicative
            // However, we strictly want to save the attributes. The deskripsi might be a summary.
            // Let's keep the user input deskripsi if provided, or use the summary. 
            // Better strategy: Always save attributes, let deskripsi be a summary or user input.
            // For now, let's just ensure attributes are sent.
        }

        const payload = {
            ...formData,
            deskripsi: finalDeskripsi || formData.deskripsi || '-', // Ensure not empty
        };

        try {
            if (isEditMode) {
                await LuaranAPI.update(luaran!.id, payload, apiPrefix);
            } else {
                await LuaranAPI.create(usulanId, payload, apiPrefix);
            }
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

    // Render specific fields based on category
    const renderSpecificFields = () => {
        if (!isPengabdian) return null;

        const { kategori } = formData;
        const attr = formData.attribute || {};

        if (kategori.includes('Mitra') || kategori === 'A') {
            return (
                <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-700">
                        <Users size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Detail Pemberdayaan Mitra</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kondisi Sebelum Program</label>
                            <textarea
                                name="mitra_sebelum"
                                value={attr.mitra_sebelum || ''}
                                onChange={handleAttributeChange}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Contoh: UMKM belum memiliki sistem pencatatan keuangan..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kondisi Sesudah Program</label>
                            <textarea
                                name="mitra_sesudah"
                                value={attr.mitra_sesudah || ''}
                                onChange={handleAttributeChange}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Contoh: Mitra sudah menggunakan aplikasi kasir sederhana..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Indikator Peningkatan</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Keterampilan / Pengetahuan', 'Pendapatan / Omzet', 'Efisiensi Produksi', 'Sistem Manajemen', 'Legalitas / Perizinan', 'Pemasaran / Branding'].map(item => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-gray-100 hover:border-blue-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={(attr.peningkatan || []).includes(item)}
                                            onChange={(e) => handleCheckboxChange('peningkatan', item, e.target.checked)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-medium text-gray-700">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (kategori.includes('Media') || kategori === 'C') {
            return (
                <div className="space-y-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-700">
                        <Newspaper size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Detail Publikasi Media</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Media / Website</label>
                            <input
                                type="text"
                                name="nama_media"
                                value={attr.nama_media || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="Contoh: Kompas.com, Radar Banyumas, Website Kampus..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jenis Liputan</label>
                            <select
                                name="jenis_liputan"
                                value={attr.jenis_liputan || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            >
                                <option value="">Pilih Jenis...</option>
                                <option value="Berita Online">Berita Online</option>
                                <option value="Berita Cetak">Berita Cetak</option>
                                <option value="Website Resmi">Website Resmi Kampus/Mitra</option>
                                <option value="Liputan TV/Radio">Liputan TV/Radio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tanggal Terbit</label>
                            <input
                                type="date"
                                name="tanggal_terbit"
                                value={attr.tanggal_terbit || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Link Berita (Jika ada)</label>
                            <input
                                type="url"
                                name="url_berita"
                                value={attr.url_berita || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (kategori.includes('Video') || kategori === 'D') {
            return (
                <div className="space-y-4 bg-red-50/50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2 text-red-700">
                        <Video size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wider">Detail Video Luaran</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Platform</label>
                            <select
                                name="platform"
                                value={attr.platform || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            >
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Google Drive">Google Drive</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Durasi</label>
                            <input
                                type="text"
                                name="durasi"
                                value={attr.durasi || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                placeholder="Contoh: 5 Menit"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Judul Video</label>
                            <input
                                type="text"
                                name="judul_video"
                                value={attr.judul_video || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                placeholder="Judul video..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Link Video</label>
                            <input
                                type="url"
                                name="link_video"
                                value={attr.link_video || ''}
                                onChange={handleAttributeChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return null; // Publikasi falls back to default/generic fields + specific handling if needed
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {isEditMode ? <BookOpen size={20} /> : <Plus size={20} />}
                </div>
                {isEditMode ? `Edit Target Luaran` : `Tambah Target Luaran`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Kategori & Wajib/Tambahan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Kategori Luaran <span className="text-red-500">*</span>
                        </label>
                        {fixedKategori ? (
                            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700">
                                {fixedKategori}
                                <input type="hidden" name="kategori" value={formData.kategori} />
                            </div>
                        ) : (
                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.kategori ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">Pilih Kategori Luaran</option>
                                {isPengabdian ? [
                                    'Jurnal Internasional Bereputasi Scopus',
                                    'Jurnal Internasional',
                                    'Jurnal Terakreditasi SINTA 1',
                                    'Jurnal Terakreditasi SINTA 2',
                                    'Jurnal Terakreditasi SINTA 3',
                                    'Lainnya'
                                ].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                )) : [
                                    'Jurnal Internasional Bereputasi Scopus',
                                    'Jurnal Internasional',
                                    'Jurnal Terakreditasi SINTA 1',
                                    'Jurnal Terakreditasi SINTA 2',
                                    'Jurnal Terakreditasi SINTA 3',
                                    'Jurnal Terakreditasi SINTA 4',
                                    'Jurnal Terakreditasi SINTA 5',
                                    'Jurnal Terakreditasi SINTA 6',
                                    'Prosiding Internasional',
                                    'Prosiding Nasional',
                                    'Buku',
                                    'HKI',
                                    'Lainnya'
                                ].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}
                        {errors.kategori && <p className="text-red-500 text-xs mt-1 font-medium">{errors.kategori[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Sifat Luaran <span className="text-red-500">*</span>
                        </label>
                        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, is_wajib: true }))}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${formData.is_wajib ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Wajib
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, is_wajib: false }))}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!formData.is_wajib ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Tambahan
                            </button>
                        </div>
                        <input type="hidden" name="is_wajib" value={formData.is_wajib.toString()} />
                    </div>
                </div>

                {/* 2. Specific Fields based on Category - REMOVED for unified view */}
                {/* {renderSpecificFields()} */}

                {/* 3. Deskripsi & Keterangan */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Deskripsi Luaran <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        disabled={loading}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.deskripsi ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Deskripsikan target luaran yang akan dicapai secara singkat..."
                    />
                    {errors.deskripsi && <p className="text-red-500 text-xs mt-1 font-medium">{errors.deskripsi[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Keterangan Tambahan (Opsional)
                    </label>
                    <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        disabled={loading}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        placeholder="Catatan tambahan..."
                    />
                </div>

                {/* Status Field - Only visible if showStatus is true */}
                {showStatus ? (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Status Luaran
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        >
                            <option value="Submit">Submit</option>
                            <option value="Under Review">Under Review</option>
                            <option value="LOA">LOA</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                ) : (
                    <input type="hidden" name="status" value="Rencana" />
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-white border border-gray-200 text-gray-600 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-gray-50 hover:text-gray-800 transition-all"
                    >
                        Batalkan
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-70 transition-all"
                    >
                        {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambahkan Target'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LuaranForm;