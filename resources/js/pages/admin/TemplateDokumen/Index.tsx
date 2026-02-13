import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Header from '@/components/Header'; // Use Header instead of AdminLayout
import Footer from '@/components/footer';
import {
    FileText,
    Upload,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Plus,
    Search,
    File,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
    id: number;
    nama: string;
    jenis: 'Penelitian' | 'Pengabdian';
    file_path: string;
    is_active: boolean;
    created_at: string;
}

export default function Index({ templates }: { templates: Template[] }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Form for Upload
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        jenis: 'Penelitian',
        file: null as File | null,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lppm.template-dokumen.store'), {
            onSuccess: () => {
                setIsUploadModalOpen(false);
                reset();
                toast.success('Template berhasil diupload');
            },
            onError: () => toast.error('Gagal upload template')
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
            router.delete(route('lppm.template-dokumen.destroy', id), {
                onSuccess: () => toast.success('Template dihapus'),
                onError: () => toast.error('Gagal menghapus template')
            });
        }
    };

    const handleToggle = (id: number) => {
        router.put(route('lppm.template-dokumen.toggle', id), {}, {
            onSuccess: () => toast.success('Status template diperbarui'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Manajemen Template Dokumen" />
            <Header />
            <Toaster position="top-center" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Template Dokumen</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola template surat kontrak dan dokumen lainnya.</p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Template Baru
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Template</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {templates.length > 0 ? (
                                    templates.map((template) => (
                                        <tr key={template.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{template.nama}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Uploaded: {new Date(template.created_at).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${template.jenis === 'Penelitian'
                                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                    : 'bg-orange-50 text-orange-600 border-orange-100'
                                                    }`}>
                                                    {template.jenis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggle(template.id)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${template.is_active
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {template.is_active ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-bold">Aktif</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-bold">Non-Aktif</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`/storage/${template.file_path}`}
                                                        target="_blank"
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Download Template"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(template.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Hapus Template"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                    <File className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-medium">Belum ada template dokumen.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Upload Template Baru</h3>
                                <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <ToggleLeft className="w-5 h-5 rotate-180" /> {/* Close icon substitute */}
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Template</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm"
                                        placeholder="Contoh: Kontrak Penelitian 2025"
                                        value={data.nama}
                                        onChange={e => setData('nama', e.target.value)}
                                        required
                                    />
                                    {errors.nama && <span className="text-xs text-red-500">{errors.nama}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Program</label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm"
                                        value={data.jenis}
                                        onChange={e => setData('jenis', e.target.value as 'Penelitian' | 'Pengabdian')}
                                    >
                                        <option value="Penelitian">Penelitian</option>
                                        <option value="Pengabdian">Pengabdian</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Template (.docx)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".docx"
                                            onChange={e => setData('file', e.target.files?.[0] || null)}
                                            required
                                        />
                                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                                            <Upload className="w-8 h-8 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-600">
                                                {data.file ? data.file.name : 'Klik untuk upload file Word'}
                                            </p>
                                            <p className="text-xs text-gray-400">Hanya file .docx (Max 10MB)</p>
                                        </div>
                                    </div>
                                    {errors.file && <span className="text-xs text-red-500">{errors.file}</span>}
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 disabled:opacity-50"
                                    >
                                        {processing ? 'Mengupload...' : 'Simpan Template'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
