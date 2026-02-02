import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Header from "@/components/Header";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Eye } from "lucide-react";
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
import { toast } from "sonner"; // Assuming sonner is used based on package.json

interface Berita {
    id: number;
    judul: string;
    slug: string;
    kategori?: string;
    status: 'draft' | 'published';
    created_at: string;
    published_at?: string;
    gambar?: string;
}

interface Props {
    berita: {
        data: Berita[];
        links: any[];
    };
    filters?: {
        search?: string;
    };
}

export default function BeritaIndex({ berita, filters }: Props) {
    const [search, setSearch] = React.useState(filters?.search || "");
    const [deleteId, setDeleteId] = React.useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('lppm.berita.index'), { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('lppm.berita.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success("Berita berhasil dihapus");
                },
                onError: () => {
                    toast.error("Gagal menghapus berita");
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Manajemen Berita" />
            <Header />

            <main className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
                        <p className="text-gray-500 text-sm">Kelola berita dan publikasi LPPM</p>
                    </div>
                    <Link href={route('lppm.berita.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Berita
                        </Button>
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Cari berita..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Cover</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal Publish</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {berita.data.length > 0 ? (
                                berita.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                {item.gambar ? (
                                                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FileTextIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900 line-clamp-2">{item.judul}</div>
                                            <div className="text-xs text-gray-500 mt-1">{item.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className={item.status === 'published' ? 'bg-green-600' : 'bg-gray-400'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            }) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <a href={route('berita.show', item.slug)} target="_blank" rel="noreferrer">
                                                    <Button variant="ghost" size="icon" title="Lihat">
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </a>
                                                <Link href={route('lppm.berita.edit', item.id)}>
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
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
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
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Berita akan dihapus secara permanen.
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

function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
