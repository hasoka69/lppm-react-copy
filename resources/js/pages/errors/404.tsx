import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Error404() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                <h1 className="text-6xl font-extrabold text-slate-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Halaman Tidak Ditemukan</h2>
                <p className="max-w-md text-muted-foreground mb-8">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin telah dihapus, dipindahkan, atau alamat yang Anda masukkan salah.
                </p>
                <Link href="/">
                    <Button size="lg">Kembali ke Beranda</Button>
                </Link>
            </div>
        </>
    );
}
