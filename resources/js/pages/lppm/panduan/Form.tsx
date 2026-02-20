import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileText, Video } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Panduan {
    id: number;
    judul: string;
    type: 'video' | 'document';
    deskripsi?: string;
    video_url?: string;
    file_path: string;
}

interface Props {
    panduan?: Panduan;
}

export default function PanduanForm({ panduan }: Props) {
    const isEdit = !!panduan;

    const { data, setData, post, processing, errors } = useForm({
        judul: panduan?.judul || "",
        type: panduan?.type || "video",
        deskripsi: panduan?.deskripsi || "",
        video_url: panduan?.video_url || "",
        file_path: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const [filePreview, setFilePreview] = React.useState<string | null>(panduan?.file_path ? `/storage/${panduan.file_path}` : null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const routeName = isEdit ? 'lppm.panduan.update' : 'lppm.panduan.store';
        const routeParams = isEdit ? panduan.id : undefined;

        post(route(routeName, routeParams), {
            onSuccess: () => {
                toast.success(`Panduan berhasil ${isEdit ? 'diperbarui' : 'dibuat'}`);
            },
            onError: () => {
                toast.error("Gagal menyimpan panduan. Periksa input Anda.");
            },
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("file_path", file);
            setFilePreview(file.name);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={isEdit ? "Edit Panduan" : "Buat Panduan Baru"} />
            <Header />

            <main className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('lppm.panduan.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? "Edit Panduan" : "Buat Panduan Baru"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Isi formulir berikut untuk {isEdit ? "memperbarui" : "membuat"} panduan aplikasi.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-6 space-y-6">

                            <div className="space-y-3">
                                <Label>Tipe Panduan</Label>
                                <RadioGroup
                                    defaultValue={data.type}
                                    onValueChange={(val) => setData("type", val as 'video' | 'document')}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors w-full md:w-auto">
                                        <RadioGroupItem value="video" id="video" />
                                        <Label htmlFor="video" className="cursor-pointer flex items-center gap-2">
                                            <Video className="w-4 h-4 text-red-500" /> Video Tutorial
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors w-full md:w-auto">
                                        <RadioGroupItem value="document" id="document" />
                                        <Label htmlFor="document" className="cursor-pointer flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" /> Dokumen PDF
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="judul">Judul Panduan <span className="text-red-500">*</span></Label>
                                <Input
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) => setData("judul", e.target.value)}
                                    placeholder="Contoh: Tata Cara Pengajuan Proposal"
                                    required
                                />
                                {errors.judul && <p className="text-sm text-red-500">{errors.judul}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData("deskripsi", e.target.value)}
                                    placeholder="Jelaskan secara singkat isi panduan ini..."
                                    rows={4}
                                />
                                {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
                            </div>

                            {data.type === 'video' ? (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="video_url">URL Video YouTube <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="video_url"
                                            className="pl-9"
                                            value={data.video_url}
                                            onChange={(e) => setData("video_url", e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Thumbnail akan diambil otomatis dari YouTube.</p>
                                    {errors.video_url && <p className="text-sm text-red-500">{errors.video_url}</p>}
                                </div>
                            ) : (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="file_path">File PDF Panduan <span className="text-red-500">*</span></Label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer relative">
                                        <input
                                            type="file"
                                            id="file_path"
                                            accept="application/pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            required={!isEdit || (isEdit && data.type !== panduan?.type)}
                                        />
                                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600 font-medium">
                                            {data.file_path ? data.file_path.name : "Klik untuk upload PDF"}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">Maksimal 10MB</span>
                                    </div>
                                    {filePreview && isEdit && !data.file_path && data.type === panduan?.type && (
                                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                            <FileText className="w-3 h-3" /> File saat ini: {filePreview.split('/').pop()}
                                        </div>
                                    )}
                                    {errors.file_path && <p className="text-sm text-red-500">{errors.file_path}</p>}
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                                    {processing ? (
                                        "Menyimpan..."
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Panduan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </main>
        </div>
    );
}
