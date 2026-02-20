import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ArrowLeft, Download, FileText, Share2, Calendar, Video } from 'lucide-react';
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
    panduan: Panduan;
}

export default function PanduanShow({ panduan }: Props) {

    // Helper to get embed URL from YouTube link
    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        let embedUrl = url;
        // Handle common YouTube formats
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        return embedUrl;
    };

    const embedUrl = panduan.video_url ? getEmbedUrl(panduan.video_url) : null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title={`${panduan.judul} | Panduan LPPM`} />
            <Navbar />

            <div className="bg-slate-900 pt-28 pb-12">
                <div className="container mx-auto px-6">
                    <Link href={route('panduan.public.index')} className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Panduan
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        {panduan.type === 'video' ? (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5" /> Video Tutorial
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Dokumen PDF
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(panduan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight max-w-4xl">
                        {panduan.judul}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-10 pb-20">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

                    {/* VIDEO SECTION */}
                    {panduan.type === 'video' && embedUrl && (
                        <div className="w-full aspect-video bg-black">
                            <iframe
                                src={embedUrl}
                                title={panduan.judul}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    <div className="p-8 md:p-10">
                        {/* DESCRIPTION */}
                        {panduan.deskripsi && (
                            <div className="prose prose-slate max-w-none mb-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Deskripsi</h3>
                                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {panduan.deskripsi}
                                </p>
                            </div>
                        )}

                        {/* PDF VIEWER SECTION */}
                        {panduan.type === 'document' && panduan.file_path && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-red-500" />
                                        Dokumen Panduan
                                    </h3>

                                    <a href={`/storage/${panduan.file_path}`} download target="_blank" rel="noreferrer">
                                        <Button variant="outline" className="gap-2">
                                            <Download className="w-4 h-4" /> Download PDF
                                        </Button>
                                    </a>
                                </div>

                                <div className="w-full h-[800px] border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                                    <iframe
                                        src={`/storage/${panduan.file_path}`}
                                        className="w-full h-full"
                                        title="PDF Viewer"
                                    >
                                        <p className="text-center py-20 text-slate-500">
                                            Browser Anda tidak mendukung preview PDF. Silakan <a href={`/storage/${panduan.file_path}`} className="text-blue-600 underline">download file</a>.
                                        </p>
                                    </iframe>
                                </div>
                            </div>
                        )}

                        {/* Fallback for Document without file path (should not happen normally) */}
                        {panduan.type === 'document' && !panduan.file_path && (
                            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
                                File dokumen tidak ditemukan.
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
