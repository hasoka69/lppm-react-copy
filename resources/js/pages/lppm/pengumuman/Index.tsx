import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react'; // Updated import source if needed, usually @inertiajs/react
import AppLayout from '@/layouts/app-layout'; // Updated import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Plus, Megaphone } from 'lucide-react';
import { toast } from 'sonner'; // Updated import

export default function PengumumanIndex({ pengumuman }: { pengumuman: any[] }) {
    // const { toast } = useToast(); // Removed legacy hook
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ content: '', is_active: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/lppm/pengumuman/${editingItem.id}`, formData, {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingItem(null);
                    resetForm();
                    toast.success('Berhasil', { description: 'Pengumuman diperbarui' });
                }
            });
        } else {
            router.post('/lppm/pengumuman', formData, {
                onSuccess: () => {
                    setIsOpen(false);
                    resetForm();
                    toast.success('Berhasil', { description: 'Pengumuman ditambahkan' });
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah anda yakin ingin menghapus pengumuman ini?')) {
            router.delete(`/lppm/pengumuman/${id}`, {
                onSuccess: () => toast.success('Berhasil', { description: 'Pengumuman dihapus' })
            });
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({ content: item.content, is_active: Boolean(item.is_active) });
        setIsOpen(true);
    };

    const resetForm = () => {
        setFormData({ content: '', is_active: true });
        setEditingItem(null);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/lppm/dashboard' },
        { title: 'Manajemen Pengumuman', href: '/lppm/pengumuman' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Manajemen Pengumuman">
            <Head title="Manajemen Pengumuman" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pengumuman</h1>
                        <p className="text-slate-500">Kelola pengumuman yang akan tampil di halaman depan.</p>
                    </div>

                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Tambah Pengumuman
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Isi Pengumuman</label>
                                    <Textarea
                                        placeholder="Tulis pengumuman disini..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="h-32"
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="active-mode"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                    <label htmlFor="active-mode" className="text-sm font-medium">Aktifkan Pengumuman</label>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-blue-600" /> Daftar Pengumuman
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">No</TableHead>
                                    <TableHead>Konten</TableHead>
                                    <TableHead className="w-[150px]">Tanggal</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[120px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengumuman.length > 0 ? (
                                    pengumuman.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="max-w-md truncate" title={item.content}>
                                                {item.content}
                                            </TableCell>
                                            <TableCell>{new Date(item.created_at).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                        <Pencil className="w-4 h-4 text-amber-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                            Belum ada data pengumuman.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
