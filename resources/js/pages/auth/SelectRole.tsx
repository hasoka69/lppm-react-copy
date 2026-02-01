import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, BookOpen, Layers } from 'lucide-react';

interface Role {
    name: string;
    label: string; // Human readable, e.g. "Admin LPPM"
    url: string;
    icon?: any;
    description: string;
}

const SelectRole = () => {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Manual mapping of roles to metadata
    // In a real app, this might come from backend, but for UI, we hardcode styles/icons
    const getRoleMeta = (roleName: string): Role => {
        switch (roleName) {
            case 'Admin':
            case 'super-admin':
                return { name: roleName, label: 'Administrator', url: '/admin/dashboard', icon: Shield, description: 'Akses penuh ke sistem' };
            case 'Admin LPPM':
                return { name: roleName, label: 'Admin LPPM', url: '/lppm/dashboard', icon: Layers, description: 'Kelola data penelitian & pengabdian' };
            case 'Reviewer':
                return { name: roleName, label: 'Reviewer', url: '/reviewer/dashboard', icon: BookOpen, description: 'Review usulan proposal' };
            case 'Kaprodi':
                return { name: roleName, label: 'Kaprodi', url: '/kaprodi/dashboard', icon: User, description: 'Approval usulan tingkat prodi' };
            case 'Dosen':
                return { name: roleName, label: 'Dosen', url: '/dosen/dashboard', icon: User, description: 'Ajukan usulan & laporan' };
            default:
                return { name: roleName, label: roleName, url: '/dashboard', icon: User, description: 'Akses dashboard user' };
        }
    };

    // Filter roles the user actually has
    // We assume 'user.roles' is available. If not, we might need to pass it from controller specific prop.
    // For now, let's assume the controller passes `availableRoles`
    const { availableRoles } = usePage().props as any;

    const roles: Role[] = (availableRoles || []).map((r: string) => getRoleMeta(r));

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Head title="Pilih Peran" />

            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Selamat Datang, {user.name}</h1>
                    <p className="text-slate-600 mt-2">Akun Anda memiliki beberapa peran. Silakan pilih peran untuk melanjutkan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <Card
                                key={role.name}
                                className="hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-blue-400 group"
                                onClick={() => window.location.href = role.url}
                            >
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-2 group-hover:bg-blue-50 transition-colors">
                                        <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                                    </div>
                                    <CardTitle className="group-hover:text-blue-700 transition-colors">{role.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{role.description}</CardDescription>
                                    <Button className="w-full mt-4 bg-slate-900 group-hover:bg-blue-600 transition-colors">
                                        Masuk sebagai {role.label}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-400">Anda dapat berpindah peran nanti melalui menu profil.</p>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
