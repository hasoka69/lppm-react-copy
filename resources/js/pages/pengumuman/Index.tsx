import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';

export default function PengumumanIndex({ pengumuman }: { pengumuman: any }) {
    const { data: items, links } = pengumuman;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Pengumuman | LPPM" />
            <Navbar />

            {/* HEADER SECTION */}
            <div className="pt-32 pb-12 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/image/grid-pattern.svg')] opacity-[0.03]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-wider mb-4 border border-blue-500/30">
                        INFORMASI TERKINI
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Pengumuman Terbaru</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Dapatkan informasi resmi dan terbaru seputar kegiatan penelitian dan pengabdian masyarakat.
                    </p>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.length > 0 ? (
                        items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">Admin LPPM</span>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Megaphone className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada pengumuman</h3>
                            <p className="text-slate-500">Silakan cek kembali di lain waktu.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {links && links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {links.map((link: any, key: number) => (
                            link.url === null ? (
                                <span key={key} className="px-4 py-2 text-sm text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
