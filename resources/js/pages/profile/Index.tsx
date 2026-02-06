import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, User, BookOpen, GraduationCap, Loader2, Save } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface DosenData {
    nama: string;
    nidn: string;
    email: string;
    prodi: string;
    no_hp?: string;
    scopus_id?: string;
    sinta_id?: string;
    google_scholar_id?: string;
}

interface ProfileIndexProps {
    auth: {
        user: {
            name: string;
            email: string;
            avatar?: string;
            initials?: string;
        };
        dosen?: DosenData;
    };
    dosen_data?: DosenData;
}

export default function ProfileIndex({ auth, dosen_data }: ProfileIndexProps) {
    const user = auth.user;
    // Prefer dosen_data if available, otherwise fallback (though fields like NIDN won't exist)
    const dosen = dosen_data || auth.dosen;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{ photo: File | null }>({
        photo: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.photo.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Foto profil berhasil diperbarui');
                setPreviewUrl(null);
                reset();
            },
            onError: () => {
                toast.error('Gagal memperbarui foto profil');
            },
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const displayData = [
        {
            label: 'Nama Lengkap',
            value: dosen?.nama || user.name,
            icon: User,
        },
        {
            label: 'NIDN',
            value: dosen?.nidn || '-',
            icon: BookOpen,
        },
        {
            label: 'Email',
            value: dosen?.email || user.email,
            icon: Mail,
        },
        {
            label: 'Program Studi',
            value: dosen?.prodi || '-',
            icon: GraduationCap,
        },
    ];

    // Use useForm to handle all editable fields
    const { data: formData, setData: setFormData, put, processing: formProcessing, errors: formErrors } = useForm({
        name: user.name,
        password: '',
        password_confirmation: '', // Optional logic
        scopus_id: dosen?.scopus_id || '',
        sinta_id: dosen?.sinta_id || '',
        google_scholar_id: dosen?.google_scholar_id || '',
    });

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('profile.update'), {
            onSuccess: () => toast.success('Profil berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui profil'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile', href: '/profile' }]} title="Profile Saya" hideSidebar={true}>
            <Head title="Profile Saya" />

            <div className="container mx-auto py-8 max-w-5xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Photo */}
                    <Card className="md:col-span-1 shadow-md border-t-4 border-t-primary h-fit">
                        <CardHeader className="text-center pb-2">
                            <CardTitle>Foto Profil</CardTitle>
                            <CardDescription>Perbarui foto profil anda disini</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6 pt-6">
                            <div className="relative group">
                                <Avatar className="h-40 w-40 border-4 border-white shadow-xl ring-2 ring-gray-100">
                                    <AvatarImage src={previewUrl || user.avatar} alt={user.name} className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {user.initials || user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={triggerFileInput}
                                    type="button"
                                    className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    title="Ganti Foto"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpload} className="w-full space-y-4">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                {data.photo && (
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Simpan Foto
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Right Column: Edit Details */}
                    <Card className="md:col-span-2 shadow-md border-t-4 border-t-blue-500">
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Edit Profil</CardTitle>
                                    <CardDescription>Perbarui informasi akun dan identitas dosen anda</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                {/* Account Info */}
                                <div className="space-y-4 border-b pb-6">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" /> Informasi Akun
                                    </h3>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData('name', e.target.value)}
                                            />
                                            {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email (Tidak dapat diubah)</Label>
                                            <Input id="email" value={user.email} disabled className="bg-slate-100" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password Baru (Opsional)</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Biarkan kosong jika tidak ingin mengubah"
                                                value={formData.password}
                                                onChange={(e) => setFormData('password', e.target.value)}
                                            />
                                            {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Info */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary" /> Identitas Akademik
                                    </h3>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>NIDN</Label>
                                                <Input value={dosen?.nidn || '-'} disabled className="bg-slate-100" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Prodi</Label>
                                                <Input value={dosen?.prodi || '-'} disabled className="bg-slate-100" />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="scopus_id">Scopus ID</Label>
                                            <Input
                                                id="scopus_id"
                                                placeholder="Contoh: 57200000000"
                                                value={formData.scopus_id}
                                                onChange={(e) => setFormData('scopus_id', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sinta_id">Sinta ID</Label>
                                            <Input
                                                id="sinta_id"
                                                placeholder="Contoh: 6000000"
                                                value={formData.sinta_id}
                                                onChange={(e) => setFormData('sinta_id', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="google_scholar_id">Google Scholar ID</Label>
                                            <Input
                                                id="google_scholar_id"
                                                placeholder="Contoh: xxxxxxxAAAAJ"
                                                value={formData.google_scholar_id}
                                                onChange={(e) => setFormData('google_scholar_id', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={formProcessing}>
                                        {formProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
