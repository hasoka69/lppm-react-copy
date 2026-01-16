import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/components/Header';
import StatCard from '@/components/Shared/StatCard';
import WelcomeHero from '@/components/Shared/WelcomeHero';
import StatusRing from '@/components/Shared/StatusRing'; // Reuse dari Admin
import ActivityItem from '@/components/Shared/ActivityItem'; // Reuse dari Admin

// --- ICONS (Inline SVG) ---
// FIX: PlusIcon telah dihapus untuk mengatasi error "unused var"
const ChartIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const BoxIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const ShieldIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 2.04l-2.001 8.835L3 21h18l-1.381-5.221-2.001-8.835z" /></svg>;
const BookIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;


export default function DashboardDosen() {

    // Data Dummy
    const stats = [
        { title: "Total Penelitian", value: 12, icon: ChartIcon, color: 'blue' as const },
        { title: "Total Pengabdian", value: 8, icon: BoxIcon, color: 'green' as const },
        { title: "HAKI", value: 3, icon: ShieldIcon, color: 'purple' as const },
        { title: "Buku", value: 5, icon: BookIcon, color: 'yellow' as const },
    ];

    const activities = [
        { id: 1, title: "Proposal Penelitian AI Education", desc: "15 Jan 2025", badge: "Disetujui" },
        { id: 2, title: "Pengabdian UMKM Digital", desc: "12 Jan 2025", badge: "Dalam Review" },
        { id: 3, title: "Publikasi Jurnal Internasional", desc: "10 Jan 2025", badge: "Published" }, // Badge custom string handled by ActivityItem fallback
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* 1. WELCOME HERO dengan Action Cards */}
                <WelcomeHero
                    title="Selamat Datang, Dr. Ahmad Wijaya"
                    subtitle="Kelola penelitian dan pengabdian masyarakat Anda dengan mudah melalui portal LPPM Asaindo"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ActionCard label="Submit proposal penelitian baru" href="/dosen/penelitian/Index" />
                        <ActionCard label="Submit proposal pengabdian masyarakat" href="/dosen/pengabdian/create" />
                        <ActionCard label="Submit Luaran Penelitian dan PKM" href="/dosen/luaran/create" />
                    </div>
                </WelcomeHero>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* KOLOM KIRI (2/3) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* STAT CARDS (Solid Variant) */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 text-lg">Statistik Penelitian & Pengabdian</h3>
                                <Link href="/dosen/statistik" className="text-sm text-blue-600 hover:underline">Lihat Detail →</Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    // Menggunakan variant="solid" agar sesuai desain Dosen
                                    <StatCard key={index} {...stat} variant="solid" />
                                ))}
                            </div>
                        </div>

                        {/* AKTIVITAS TERBARU */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 text-lg">Aktivitas Terbaru</h3>
                                <Link href="/dosen/aktivitas" className="text-sm text-blue-600 hover:underline">Lihat Semua →</Link>
                            </div>
                            <div className="space-y-2">
                                {activities.map(act => (
                                    // Reuse ActivityItem dari Admin
                                    <ActivityItem
                                        key={act.id}
                                        title={act.title}
                                        // Mengirim Tanggal ke 'time' karena layout ActivityItem Admin cocok
                                        time={act.desc}
                                        badge={act.badge}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (1/3) */}
                    <div className="space-y-8">

                        {/* STATUS USULAN TERAKHIR */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <h3 className="font-bold text-gray-800 text-lg mb-6 text-left">Status Usulan Terakhir</h3>

                            <div className="flex justify-center mb-4">
                                {/* Reuse StatusRing dengan custom size */}
                                <div className="relative">
                                    <StatusRing percent={100} size={140} color="#2563eb" />
                                    {/* Icon Check di tengah Ring */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-800 text-lg">Proposal Disetujui</h4>
                            <p className="text-sm text-gray-500 mt-1 mb-6">Penelitian AI Education telah disetujui untuk tahun 2025</p>

                            <Link href="/dosen/usulan/1" className="block w-full bg-[#1e3a8a] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition">
                                Lihat Detail
                            </Link>
                        </div>

                        {/* INFORMASI PROFIL */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Informasi Profil</h3>

                            <div className="space-y-4 text-sm">
                                <ProfileRow label="Nama Lengkap" value="Dr. Ahmad Wijaya, M.Kom" />
                                <ProfileRow label="NIDN" value="0123456789" />
                                <ProfileRow label="Institusi" value="Universitas Asaindo" />
                                <ProfileRow label="Program Studi" value="Teknik Informatika" />
                                <div className="pt-2">
                                    <p className="text-gray-500 text-xs mb-1">Email</p>
                                    <p className="font-medium text-gray-800">ahmad.wijaya@asaindo.ac.id</p>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-500">Status</span>
                                    <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-medium">Aktif</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                Edit Profil
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS (Lokal) ---

function ActionCard({ label, href }: { label: string, href: string }) {
    return (
        <Link href={href} className="bg-white p-5 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition duration-200 group h-24">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition">{label}</span>
        </Link>
    );
}

function ProfileRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-start">
            <span className="text-gray-500 w-1/3">{label}</span>
            <span className="text-gray-800 font-medium text-right w-2/3">{value}</span>
        </div>
    );
}