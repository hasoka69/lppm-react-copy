import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Search, Video, FileText, PlayCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Panduan {
    id: number;
    judul: string;
    type: 'video' | 'document';
    deskripsi?: string;
    video_url?: string;
    file_path?: string;
    thumbnail_path?: string;
    created_at: string;
}

interface Props {
    panduans: Panduan[];
}

export default function PanduanIndex({ panduans }: Props) {
    const [search, setSearch] = useState("");

    const filteredPanduans = panduans.filter(item =>
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Panduan Aplikasi" />
            <Navbar />

            {/* HERO SECTION */}
            <section className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/image/grid-pattern.svg')] opacity-[0.05]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Panduan Penggunaan <span className="text-blue-400">Aplikasi</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                        Pelajari cara menggunakan sistem LPPM melalui video tutorial dan dokumen panduan yang telah kami sediakan.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            placeholder="Cari panduan..."
                            className="pl-12 py-6 rounded-full bg-white/10 border-white/10 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all font-medium text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    {filteredPanduans.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPanduans.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('panduan.public.show', item.id)}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col"
                                >
                                    {/* Thumbnail with Overlay */}
                                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                                        {item.type === 'video' && item.thumbnail_path ? (
                                            <>
                                                <img
                                                    src={item.thumbnail_path}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                {/* Play Button Overlay for Video */}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={cn(
                                                "w-full h-full flex flex-col items-center justify-center gap-3 transition-colors",
                                                item.type === 'video' ? "bg-slate-800" : "bg-blue-50 group-hover:bg-blue-100/50"
                                            )}>
                                                {item.type === 'video' ? (
                                                    <Video className="w-16 h-16 text-slate-600" />
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                            <FileText className="w-8 h-8 text-red-500" />
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600">Dokumen PDF</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {item.type === 'video' ? (
                                                <span className="px-2 py-1 rounded-md bg-red-500/90 backdrop-blur text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                                                    <Video className="w-3 h-3" /> Video
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-md bg-blue-500/90 backdrop-blur text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                                                    <FileText className="w-3 h-3" /> PDF
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.judul}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                                            {item.deskripsi || "Tidak ada deskripsi."}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                                {item.type === 'video' ? 'Tonton Video' : 'Baca Dokumen'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Tidak ditemukan</h3>
                            <p className="text-slate-500">
                                Maaf, panduan yang Anda cari tidak tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
