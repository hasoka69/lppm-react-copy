import React from 'react';
import { Link } from '@inertiajs/react';
import Header from '@/components/Header';
import StatCard from '@/components/Shared/StatCard';
import WelcomeHero from '@/components/Shared/WelcomeHero';
import ActivityItem from '@/components/Shared/ActivityItem';

// --- ICONS (Inline SVG) ---
const ClockIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- TYPES ---
// Mendefinisikan tipe data untuk struktur program studi
interface ProgramData {
    name: string;
    faculty: string;
    lecturers_count: number;
    proposals_2024: number;
}

// Mendefinisikan tipe data untuk struktur proposal
interface ProposalData {
    id: number;
    title: string;
    type: string;
    proposer: {
        name: string;
        prodi: string;
    };
    date: string;
    status: string;
}

export default function DashboardKaprodi() {

    // Data Dummy (Simulasi dari Backend)
    const data = {
        summary: {
            waiting_review: 12,
            rejected_prodi: 3,
            forwarded_to_reviewer: 28
        },
        program: {
            name: 'Teknik Informatika',
            faculty: 'Fakultas Teknik',
            lecturers_count: 24,
            proposals_2024: 43
        },
        proposals: [
            { id: 1, title: 'Implementasi Machine Learning untuk Prediksi Cuaca', type: 'Penelitian', proposer: { name: 'Dr. Budi Santoso', prodi: 'Informatika' }, date: '15 Nov 2024', status: 'Menunggu Review' },
            { id: 2, title: 'Pengembangan Aplikasi Mobile untuk UMKM', type: 'Pengabdian', proposer: { name: 'Dr. Sari Dewi', prodi: 'Sistem Informasi' }, date: '14 Nov 2024', status: 'Menunggu Review' }
        ],
        activities: [
            { id: 1, title: 'Dosen Budi Santoso mengajukan proposal baru', subtitle: '2 jam yang lalu', badge: 'Baru' },
            { id: 2, title: 'Anda mengirim review untuk Penelitian IoT', subtitle: '1 hari yang lalu', badge: 'Disetujui' },
            { id: 3, title: 'Proposal Pengabdian Desa Digital butuh revisi', subtitle: '2 hari yang lalu', badge: 'Menunggu' }
        ]
    };

    // Config untuk StatCards
    const stats = [
        { title: "Usulan Menunggu Review", value: data.summary.waiting_review, icon: ClockIcon, color: 'blue' as const },
        { title: "Usulan Ditolak Prodi", value: data.summary.rejected_prodi, icon: XCircleIcon, color: 'red' as const },
        { title: "Diteruskan ke Reviewer", value: data.summary.forwarded_to_reviewer, icon: CheckCircleIcon, color: 'green' as const },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* 1. WELCOME HERO (Reusable) */}
                <WelcomeHero
                    title="Selamat Datang, Kaprodi"
                    subtitle="Pantau dan review seluruh usulan penelitian & pengabdian dari dosen program studi Anda."
                    buttonLabel="Lihat Usulan Masuk"
                    buttonLink="/kaprodi/usulan"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                    {/* KOLOM KIRI: Stats (9 cols) */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>
                    </div>

                    {/* KOLOM KANAN: Info Prodi (3 cols) */}
                    <div className="lg:col-span-3">
                        <ProdiInfoCard program={data.program} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* TABEL USULAN */}
                    <div className="lg:col-span-8">
                        <KaprodiUsulanTable proposals={data.proposals} />
                    </div>

                    {/* AKTIVITAS */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Aktivitas Terbaru</h3>
                            <div className="space-y-2">
                                {data.activities.map(act => (
                                    <ActivityItem
                                        key={act.id}
                                        title={act.title}
                                        time={act.subtitle}
                                        badge={act.badge}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

// FIX: Mengganti 'any' dengan interface ProgramData
function ProdiInfoCard({ program }: { program: ProgramData }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-600 p-3 rounded-lg text-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Program Studi</div>
                        <div className="font-bold text-gray-800 text-lg leading-tight">{program.name}</div>
                        <div className="text-sm text-gray-500">{program.faculty}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{program.lecturers_count}</div>
                        <div className="text-xs text-gray-500 font-medium">Dosen Aktif</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{program.proposals_2024}</div>
                        <div className="text-xs text-gray-500 font-medium">Proposal 2024</div>
                    </div>
                </div>
            </div>

            <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition duration-150">
                Lihat Data Dosen
            </button>
        </div>
    );
}

// FIX: Mengganti 'any[]' dengan interface ProposalData[]
function KaprodiUsulanTable({ proposals }: { proposals: ProposalData[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Usulan Menunggu Tinjauan</h2>
                <Link href="/kaprodi/usulan" className="text-sm text-blue-600 hover:underline font-medium">Lihat Semua</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3">Judul Usulan</th>
                            <th className="px-4 py-3">Jenis</th>
                            <th className="px-4 py-3">Pengusul</th>
                            <th className="px-4 py-3">Tanggal</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {proposals.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-700 line-clamp-1">{p.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">Topik: Artificial Intelligence...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${p.type === 'Penelitian' ? 'text-blue-700 bg-blue-100' : 'text-green-700 bg-green-100'}`}>
                                        {p.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    <div className="font-medium">{p.proposer.name}</div>
                                    <div className="text-xs text-gray-400">{p.proposer.prodi}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                    {p.date}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={`/kaprodi/review/${p.id}`} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 shadow-sm transition">
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}