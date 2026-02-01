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

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile', href: '/profile' }]} title="Profile Saya" hideSidebar={true}>
            <Head title="Profile Saya" />

            <div className="container mx-auto py-8 max-w-4xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Photo */}
                    <Card className="md:col-span-1 shadow-md border-t-4 border-t-primary h-fit">
                        <CardHeader className="text-center pb-2">
                            <CardTitle>Foto Profil</CardTitle>
                            <CardDescription>
                                Perbarui foto profil anda disini
                            </CardDescription>
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
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                {data.photo && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-2">
                                            Klik simpan untuk menerapkan foto baru
                                        </p>
                                    </div>
                                )}

                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">
                                        Format: JPG, PNG, GIF (Max. 2MB)
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Right Column: Details */}
                    <Card className="md:col-span-2 shadow-md border-t-4 border-t-blue-500">
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Informasi Pribadi</CardTitle>
                                    <CardDescription>
                                        Data identitas diri dosen
                                    </CardDescription>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    Dosen
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid gap-6">
                                {displayData.map((item, index) => (
                                    <div key={index} className="group relative rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-2">
                                            <item.icon className="w-3.5 h-3.5" />
                                            {item.label}
                                        </Label>
                                        <div className="font-medium text-lg text-gray-900 group-hover:text-blue-900 break-words">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!dosen && (
                                <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Data Dosen Tidak Ditemukan</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>Akun anda belum terhubung dengan data dosen. Hubungi administrator jika anda adalah dosen namun melihat pesan ini.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
