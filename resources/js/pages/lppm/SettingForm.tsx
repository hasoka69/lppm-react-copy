import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/components/Header';
import {
    Settings, Save, Plus, Trash2, Edit2, GripVertical,
    FileText, CheckCircle2, ChevronRight, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface FieldConfig {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'date';
    required: boolean;
    placeholder?: string;
    options?: (string | number)[];
}

interface FormTemplate {
    id: number;
    category: string;
    step: number;
    version: number;
    fields: FieldConfig[];
}

interface PageProps {
    templates: FormTemplate[];
    title: string;
}

export default function SettingForm({ templates: initialTemplates, title }: PageProps) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [activeTemplateId, setActiveTemplateId] = useState<number | null>(
        initialTemplates.length > 0 ? initialTemplates[0].id : null
    );
    const [isDirty, setIsDirty] = useState(false);

    // Active Template Logic
    const activeTemplate = templates.find(t => t.id === activeTemplateId);

    // Local state for editing fields before saving
    const [fields, setFields] = useState<FieldConfig[]>([]);

    useEffect(() => {
        if (activeTemplate) {
            setFields(activeTemplate.fields || []);
            setIsDirty(false);
        }
    }, [activeTemplateId]);

    // Handlers
    const handleFieldChange = (index: number, key: keyof FieldConfig, value: any) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [key]: value };
        setFields(newFields);
        setIsDirty(true);
    };

    const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => {
        const newFields = [...fields];
        const options = [...(newFields[fieldIndex].options || [])];
        options[optionIndex] = value;
        newFields[fieldIndex].options = options;
        setFields(newFields);
        setIsDirty(true);
    };

    const addOption = (fieldIndex: number) => {
        const newFields = [...fields];
        const options = [...(newFields[fieldIndex].options || [])];
        options.push('New Option');
        newFields[fieldIndex].options = options;
        setFields(newFields);
        setIsDirty(true);
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const newFields = [...fields];
        const options = newFields[fieldIndex].options?.filter((_, i) => i !== optionIndex);
        newFields[fieldIndex].options = options;
        setFields(newFields);
        setIsDirty(true);
    };

    const addField = () => {
        setFields([
            ...fields,
            {
                id: `field_${Date.now()}`,
                label: 'New Field',
                type: 'text',
                required: false,
                placeholder: ''
            }
        ]);
        setIsDirty(true);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
        setIsDirty(true);
    };

    const saveChanges = () => {
        if (!activeTemplateId) return;

        router.put(route('setting-form.update', activeTemplateId), {
            fields: fields
        }, {
            onSuccess: () => {
                setIsDirty(false);
                // Update local templates list with saved data
                setTemplates(templates.map(t =>
                    t.id === activeTemplateId ? { ...t, fields: fields, version: t.version + 1 } : t
                ));
            }
        });
    };

    // Group templates by category
    const groupedTemplates = {
        penelitian: templates.filter(t => t.category === 'penelitian'),
        pengabdian: templates.filter(t => t.category === 'pengabdian')
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title="Manajemen Form" />
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-start gap-8">

                {/* Sidebar Navigation */}
                <div className="w-64 flex-shrink-0 space-y-8 sticky top-24">
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Data Penelitian</h2>
                        <div className="space-y-1">
                            {groupedTemplates.penelitian.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTemplateId(t.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTemplateId === t.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                        }`}
                                >
                                    <span>Step {t.step}</span>
                                    {activeTemplateId === t.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Data Pengabdian</h2>
                        <div className="space-y-1">
                            {groupedTemplates.pengabdian.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTemplateId(t.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTemplateId === t.id
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                        }`}
                                >
                                    <span>Step {t.step}</span>
                                    {activeTemplateId === t.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {activeTemplate ? (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 capitalize">
                                        Form {activeTemplate.category} - Step {activeTemplate.step}
                                    </h1>
                                    <p className="text-sm text-slate-500">Versi {activeTemplate.version} • {fields.length} Fields Konfigurasi</p>
                                </div>
                                <button
                                    onClick={saveChanges}
                                    disabled={!isDirty}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isDirty
                                            ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Save size={18} />
                                    Simpan Perubahan
                                </button>
                            </div>

                            {/* Field Editor List */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {fields.map((field, idx) => (
                                        <motion.div
                                            key={idx} // Using index as key for simplicity in reordering later
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="pt-3 text-slate-300 cursor-move">
                                                    <GripVertical size={20} />
                                                </div>

                                                <div className="flex-1 grid grid-cols-12 gap-4">
                                                    {/* Basic Info */}
                                                    <div className="col-span-12 md:col-span-8 space-y-3">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Label Input</label>
                                                            <input
                                                                type="text"
                                                                value={field.label}
                                                                onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                                                                className="w-full mt-1 px-3 py-2 bg-slate-50 border-none rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <div className="flex-1">
                                                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ID Field (Database)</label>
                                                                <input
                                                                    type="text"
                                                                    value={field.id}
                                                                    onChange={(e) => handleFieldChange(idx, 'id', e.target.value)}
                                                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border-none rounded-lg font-mono text-xs text-slate-600 focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Placeholder</label>
                                                                <input
                                                                    type="text"
                                                                    value={field.placeholder || ''}
                                                                    onChange={(e) => handleFieldChange(idx, 'placeholder', e.target.value)}
                                                                    className="w-full mt-1 px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Type Config */}
                                                    <div className="col-span-12 md:col-span-4 bg-slate-50 rounded-xl p-4 space-y-3">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tipe Input</label>
                                                            <select
                                                                value={field.type}
                                                                onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                                                                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                                                            >
                                                                <option value="text">Short Text</option>
                                                                <option value="textarea">Long Text</option>
                                                                <option value="number">Number</option>
                                                                <option value="select">Dropdown</option>
                                                                <option value="date">Date Picker</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                                                                id={`req-${idx}`}
                                                                className="rounded text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <label htmlFor={`req-${idx}`} className="text-sm font-medium text-slate-600">Wajib Diisi</label>
                                                        </div>
                                                    </div>

                                                    {/* Options for Select */}
                                                    {field.type === 'select' && (
                                                        <div className="col-span-12 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Opsi Dropdown</label>
                                                                <button onClick={() => addOption(idx)} className="text-xs text-blue-600 font-bold hover:underline">+ Tambah Opsi</button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {field.options?.map((opt, optIdx) => (
                                                                    <div key={optIdx} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-sm">
                                                                        <input
                                                                            type="text"
                                                                            value={opt}
                                                                            onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                                                                            className="border-none p-0 text-xs font-medium text-blue-800 w-24 focus:ring-0 bg-transparent"
                                                                        />
                                                                        <button onClick={() => removeOption(idx, optIdx)} className="text-blue-300 hover:text-red-500">
                                                                            <X size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => removeField(idx)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={addField}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Plus size={20} />
                                Tambah Field Baru
                            </button>
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                            <Layout size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Pilih template form di sebelah kiri untuk mengedit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Icon Helper for removed imports
const X = ({ size = 24, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
