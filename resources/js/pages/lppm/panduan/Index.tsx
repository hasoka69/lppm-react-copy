import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import Header from "@/components/Header";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Eye, Video, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Panduan {
    id: number;
    judul: string;
    type: 'video' | 'document';
    deskripsi?: string;
    video_url?: string;
    file_path?: string;
    thumbnail_path?: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    panduans: Panduan[];
}

export default function PanduanIndex({ panduans }: Props) {
    const [search, setSearch] = React.useState("");
    const [deleteId, setDeleteId] = React.useState<number | null>(null);

    const filteredPanduans = panduans.filter(item =>
        item.judul.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('lppm.panduan.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success("Panduan berhasil dihapus");
                },
                onError: () => {
                    toast.error("Gagal menghapus panduan");
                }
            });
        }
    };

    const handleToggleStatus = (id: number) => {
        router.post(route('lppm.panduan.toggle', id), {}, {
            onSuccess: () => toast.success("Status berhasil diubah"),
            onError: () => toast.error("Gagal mengubah status")
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Manajemen Panduan" />
            <Header />

            <main className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Panduan</h1>
                        <p className="text-gray-500 text-sm">Kelola video dan dokumen panduan aplikasi</p>
                    </div>
                    <Link href={route('lppm.panduan.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Panduan
                        </Button>
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center flex-wrap gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Cari panduan..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Cover/Icon</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Konten</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPanduans.length > 0 ? (
                                filteredPanduans.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-20 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden">
                                                {item.type === 'video' && item.thumbnail_path ? (
                                                    <img src={item.thumbnail_path} alt={item.judul} className="w-full h-full object-cover" />
                                                ) : item.type === 'video' ? (
                                                    <Video className="w-6 h-6 text-red-500" />
                                                ) : (
                                                    <FileText className="w-6 h-6 text-blue-500" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900 line-clamp-2">{item.judul}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{item.deskripsi || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={item.type === 'video' ? 'text-red-600 border-red-200 bg-red-50' : 'text-blue-600 border-blue-200 bg-blue-50'}>
                                                {item.type === 'video' ? (
                                                    <><Video className="w-3 h-3 mr-1" /> Video</>
                                                ) : (
                                                    <><FileText className="w-3 h-3 mr-1" /> Dokumen</>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] text-sm text-gray-500">
                                                {item.type === 'video' ? (
                                                    <a href={item.video_url} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-600 transition-colors truncate">
                                                        <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                                        {item.video_url}
                                                    </a>
                                                ) : (
                                                    <a href={`/storage/${item.file_path}`} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-600 transition-colors">
                                                        <FileText className="w-3 h-3 mr-1" /> Lihat PDF
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <button onClick={() => handleToggleStatus(item.id)}>
                                                <Badge variant={item.is_active ? 'default' : 'secondary'} className={`cursor-pointer ${item.is_active ? 'bg-green-600' : 'bg-gray-400'}`}>
                                                    {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <a href={route('panduan.public.show', item.id)} target="_blank" rel="noreferrer">
                                                    <Button variant="ghost" size="icon" title="Lihat Public">
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </a>
                                                <Link href={route('lppm.panduan.edit', item.id)}>
                                                    <Button variant="ghost" size="icon" title="Edit">
                                                        <Edit className="w-4 h-4 text-blue-600" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Hapus"
                                                    onClick={() => setDeleteId(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                        Data tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Panduan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. File terkait juga akan dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
