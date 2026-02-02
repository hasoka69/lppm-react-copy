import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Error500() {
    return (
        <>
            <Head title="500 - Terjadi Kesalahan Server" />
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                <h1 className="text-6xl font-extrabold text-red-600 mb-4">500</h1>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Terjadi Kesalahan Server</h2>
                <p className="max-w-md text-muted-foreground mb-8">
                    Maaf, terjadi kesalahan internal pada server kami. Silakan coba beberapa saat lagi atau hubungi administrator jika masalah berlanjut.
                </p>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="outline">Kembali ke Beranda</Button>
                    </Link>
                    <Button onClick={() => window.location.reload()}>Refresh Halaman</Button>
                </div>
            </div>
        </>
    );
}
