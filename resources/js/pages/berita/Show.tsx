import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Calendar, ChevronLeft, User, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Berita {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string;
    konten: string; // Markdown or HTML
    kategori: string;
    gambar: string;
    published_at: string;
    user?: {
        name: string;
    };
}

interface Props {
    berita: Berita;
    related: Berita[];
}

export default function BeritaShow({ berita, related }: Props) {

    // Function to preserve line breaks and basic formatting if plain text
    // If you used a markdown editor, you'd use a markdown renderer here (e.g., react-markdown)
    // For now, whitespace-pre-wrap handles basic paragraphs.

    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title={berita.judul} />
            <Navbar />

            <div className="pt-24 pb-12">
                {/* Breadcrumb / Back */}
                <div className="container mx-auto px-6 mb-8">
                    <Link href={route('berita.index')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali ke Berita
                    </Link>
                </div>

                <article className="container mx-auto px-6 max-w-4xl">
                    {/* Header Info */}
                    <div className="mb-8 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-500 mb-4">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                                {berita.kategori || 'Berita'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(berita.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(berita.published_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            {berita.judul}
                        </h1>
                        {berita.ringkasan && (
                            <p className="text-xl text-gray-600 leading-relaxed font-light">
                                {berita.ringkasan}
                            </p>
                        )}
                    </div>

                    {/* Featured Image */}
                    {berita.gambar && (
                        <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 border border-stale-100">
                            <img src={berita.gambar} alt={berita.judul} className="w-full h-auto object-cover max-h-[600px]" />
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="prose prose-lg prose-slate mx-auto md:mx-0 max-w-none mb-16">
                        {/* 
                            Handling newlines manually since we used a textarea. 
                            Ideally, use a Markdown parser like 'react-markdown'.
                            For now, this CSS helper class 'whitespace-pre-wrap' does the job for simple text.
                        */}
                        <div className="whitespace-pre-wrap font-serif text-gray-800 leading-loose">
                            {berita.konten}
                        </div>
                    </div>

                    {/* Share / Tags section (Placeholder) */}
                    <div className="border-t border-b border-gray-100 py-6 mb-16 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Bagikan artikel ini:</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                </article>

                {/* Related News */}
                {related.length > 0 && (
                    <div className="bg-slate-50 py-16">
                        <div className="container mx-auto px-6 max-w-6xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terkait</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {related.map((item) => (
                                    <Link key={item.id} href={route('berita.show', item.slug)} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform">
                                        <div className="aspect-[3/2] overflow-hidden relative">
                                            {item.gambar ? (
                                                <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200" />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(item.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
