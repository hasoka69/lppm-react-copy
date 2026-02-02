import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming sonner

interface Berita {
    id?: number;
    judul: string;
    slug: string;
    kategori: string | null;
    ringkasan: string | null;
    konten: string;
    status: 'draft' | 'published';
    published_at: string | null;
    gambar: string | null;
}

interface Props {
    berita?: Berita;
}

export default function BeritaForm({ berita }: Props) {
    const isEdit = !!berita;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        judul: berita?.judul || "",
        kategori: berita?.kategori || "",
        ringkasan: berita?.ringkasan || "",
        konten: berita?.konten || "",
        status: berita?.status || "draft",
        gambar: null as File | null,
        _method: isEdit ? "PUT" : "POST",
    });

    const [imagePreview, setImagePreview] = React.useState<string | null>(berita?.gambar || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("gambar", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const routeName = isEdit ? 'lppm.berita.update' : 'lppm.berita.store';
        const action = isEdit ? post : post; // Use post for both because of file upload (method spoofing handled by _method)
        const url = isEdit ? route(routeName, berita.id) : route(routeName);

        action(url, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(isEdit ? "Berita berhasil diperbarui" : "Berita berhasil dibuat");
            },
            onError: () => {
                toast.error("Gagal menyimpan berita. Periksa kembali form.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={isEdit ? "Edit Berita" : "Buat Berita Baru"} />
            <Header />

            <main className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('lppm.berita.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Berita" : "Buat Berita Baru"}</h1>
                        <p className="text-gray-500 text-sm">Isi form berikut untuk mempublikasikan berita.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="judul">Judul Berita</Label>
                                    <Input
                                        id="judul"
                                        placeholder="Contoh: Pembukaan Hibah Penelitian 2026"
                                        value={data.judul}
                                        onChange={(e) => setData("judul", e.target.value)}
                                        required
                                    />
                                    {errors.judul && <p className="text-red-500 text-xs">{errors.judul}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ringkasan">Ringkasan (Opsional)</Label>
                                    <Textarea
                                        id="ringkasan"
                                        placeholder="Deskripsi singkat untuk ditampilkan di card..."
                                        className="h-20"
                                        value={data.ringkasan}
                                        onChange={(e) => setData("ringkasan", e.target.value)}
                                    />
                                    {errors.ringkasan && <p className="text-red-500 text-xs">{errors.ringkasan}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="konten">Konten</Label>
                                    <Textarea
                                        id="konten"
                                        placeholder="Tulis konten berita disini... (Mendukung Markdown sederhana)"
                                        className="min-h-[400px] font-mono text-sm leading-relaxed"
                                        value={data.konten}
                                        onChange={(e) => setData("konten", e.target.value)}
                                        required
                                    />
                                    <p className="text-gray-400 text-xs">Tips: Gunakan **bold** untuk tebal, *italic* untuk miring, - untuk list.</p>
                                    {errors.konten && <p className="text-red-500 text-xs">{errors.konten}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Status Publikasi</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val: 'draft' | 'published') => setData("status", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft (Disimpan)</SelectItem>
                                            <SelectItem value="published">Published (Tayang)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kategori">Kategori (Opsional)</Label>
                                    <Input
                                        id="kategori"
                                        placeholder="Misal: Penelitian, Pengumuman"
                                        value={data.kategori}
                                        onChange={(e) => setData("kategori", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Label>Gambar Utama</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer overflow-hidden group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={handleImageChange}
                                    />

                                    {imagePreview ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium">Klik untuk ganti</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Upload size={20} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">Upload Gambar</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                                        </div>
                                    )}
                                </div>
                                {errors.gambar && <p className="text-red-500 text-xs">{errors.gambar}</p>}
                            </CardContent>
                        </Card>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? "Menyimpan..." : "Simpan Berita"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
