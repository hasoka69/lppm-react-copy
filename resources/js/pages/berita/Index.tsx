import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Berita {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string;
    kategori: string;
    gambar: string;
    published_at: string;
    featured: boolean;
}

interface Props {
    berita: {
        data: Berita[];
        links: any[]; // Laravel pagination links
        current_page: number;
        last_page: number;
    };
    featured?: Berita;
    filters?: {
        search?: string;
    };
}

export default function BeritaPublicIndex({ berita, featured, filters }: Props) {
    const [search, setSearch] = React.useState(filters?.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('berita.index'), { search }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title="Berita & Pengumuman" />
            <Navbar />

            {/* Header / Hero */}
            <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/image/grid-pattern.svg')] opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Berita & Informasi</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Dapatkan kabar terbaru seputar kegiatan penelitian, pengabdian, dan inovasi kampus.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-6 -mt-10 relative z-20 pb-20">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-lg max-w-2xl mx-auto mb-12 flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400 ml-2" />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            type="text"
                            placeholder="Cari berita atau pengumuman..."
                            className="w-full border-none focus:ring-0 text-gray-700 placeholder:text-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                {/* Featured News */}
                {featured && !search && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            <h2 className="text-2xl font-bold text-gray-800">Berita Utama</h2>
                        </div>
                        <Link href={route('berita.show', featured.slug)} className="group grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-2 hover:shadow-xl transition-all duration-300">
                            <div className="aspect-video md:aspect-auto rounded-2xl overflow-hidden relative">
                                {featured.gambar ? (
                                    <img src={featured.gambar} alt={featured.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                                )}
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{featured.kategori || 'Berita'}</div>
                            </div>
                            <div className="p-4 md:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(featured.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{featured.judul}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">{featured.ringkasan}</p>
                                <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                                    Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                {/* News Grid */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-8 bg-slate-900 rounded-full"></span>
                            <h2 className="text-2xl font-bold text-gray-800">Terkini</h2>
                        </div>
                    </div>

                    {berita.data.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {berita.data.filter(item => item.id !== featured?.id).map((item) => (
                                <Link key={item.id} href={route('berita.show', item.slug)} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                                        {item.gambar ? (
                                            <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <span className="text-sm">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-lg">
                                            {item.kategori || 'Umum'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {item.judul}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                            {item.ringkasan}
                                        </p>
                                        <span className="text-sm font-semibold text-blue-600 group-hover:underline">Baca berita</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Belum ada berita yang diterbitkan atau tidak ditemukan.</p>
                        </div>
                    )}

                    {/* Simple Pagination */}
                    {berita.links.length > 3 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {berita.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} px-4 py-2 rounded-lg text-sm font-medium border border-gray-100 transition-colors ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}