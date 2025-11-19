import React from 'react';
import { Link } from '@inertiajs/react';
import StatCard from '@/components/StatCard';
import HeaderKaprodi from "@/components/Kaprodi/HeaderKaprodi";

export function KaprodiLayout({ children }) {
    return (
        <div className="min-h-screen">
            <HeaderKaprodi />
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}


// Dummy data built-in so you can paste this file directly
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
        {
            id: 1,
            title: 'Implementasi Machine Learning untuk Prediksi Cuaca',
            type: 'Penelitian',
            proposer: { name: 'Dr. Budi Santoso', prodi: 'Informatika', avatar: null },
            date: '15 Nov 2024',
            status: 'Menunggu Review'
        },
        {
            id: 2,
            title: 'Pengembangan Aplikasi Mobile untuk UMKM',
            type: 'Pengabdian',
            proposer: { name: 'Dr. Sari Dewi', prodi: 'Sistem Informasi', avatar: null },
            date: '14 Nov 2024',
            status: 'Menunggu Review'
        }
    ],
    activities: [
        { id: 1, title: 'Dosen Budi Santoso mengajukan proposal baru', subtitle: 'Penelitian tentang Machine Learning - 2 jam yang lalu', icon: 'doc' },
        { id: 2, title: 'Anda mengirim review untuk Penelitian IoT Smart Home', subtitle: 'Proposal disetujui dan diteruskan ke reviewer - 1 hari yang lalu', icon: 'check' },
        { id: 3, title: 'Proposal Pengabdian Desa Digital membutuhkan revisi', subtitle: 'Catatan telah dikirim ke dosen - 2 hari yang lalu', icon: 'alert' }
    ]
};

export default function Dashboard() {
    return (
        <KaprodiLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-8 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Selamat Datang, Kaprodi</h1>
                        <p className="mt-2 text-sm text-blue-100">Pantau dan review seluruh usulan penelitian & pengabdian dari dosen program studi Anda.</p>
                    </div>
                    <div>
                        <Link href="#" className="bg-white text-blue-600 px-4 py-3 rounded-lg shadow-md flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M9 8h6" /></svg>
                            <div className="text-left">
                                <div className="text-sm font-medium">Lihat Usulan</div>
                                <div className="text-xs text-slate-500">Menunggu Review</div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Stats + right card */}
                <div className="grid grid-cols-12 gap-6 mb-6">
                    <div className="col-span-9 grid grid-cols-3 gap-4">
                        <StatCard
                            title="Usulan Menunggu Review"
                            value={data.summary.waiting_review}
                            colorClass="bg-blue-500"
                            icon="/image/StatusMenunggu.png"
                        />
                        <StatCard
                            title="Usulan Ditolak Prodi"
                            value={data.summary.waiting_review}
                            colorClass="bg-red-500"
                            icon="/image/StatusDitolak.png"
                        /><StatCard
                            title="Usulan Diteruskan ke Reviewer"
                            value={data.summary.waiting_review}
                            colorClass="bg-green-500"
                            icon="/image/StatusDisetujui.png"
                        />
                    </div>
                    <div className="col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-blue-600 p-3 rounded-full text-white">
                                    <img src="/image/logoProdi.png" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Informasi Program Studi</div>
                                    <div className="font-semibold text-lg">{data.program.name}</div>
                                    <div className="text-sm text-slate-500">{data.program.faculty}</div>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4 space-y-2 text-center">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <div>
                                        <div className="text-2xl font-semibold">{data.program.lecturers_count}</div>
                                        <div className="text-xs">Jumlah Dosen</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-semibold">{data.program.proposals_2024}</div>
                                        <div className="text-xs">Proposal 2024</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg">Lihat Data Dosen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table proposals */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Usulan Menunggu Tinjauan Kaprodi</h2>
                    <div className="w-full overflow-hidden rounded-xl">
                        <table className="w-full">
                            <thead className="text-sm text-slate-500 border-b">
                                <tr>
                                    <th className="py-3 text-left">Judul Usulan</th>
                                    <th className="py-3 text-left">Jenis</th>
                                    <th className="py-3 text-left">Pengusul</th>
                                    <th className="py-3 text-left">Tanggal</th>
                                    <th className="py-3 text-left">Status</th>
                                    <th className="py-3 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data.proposals.map(p => (
                                    <tr key={p.id} className="border-b">
                                        <td className="py-4 pr-4">
                                            <div className="font-medium">{p.title}</div>
                                            <div className="text-xs text-slate-500 mt-1">Penelitian fundamental tentang AI...</div>
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={
                                                    "px-3 py-1 rounded-full text-xs font-medium " +
                                                    (p.type === "Penelitian"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-green-100 text-green-800")
                                                }
                                            >
                                                {p.type}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="font-medium">{p.proposer.name}</div>
                                            <div className="text-xs text-slate-500">{p.proposer.prodi}</div>
                                        </td>
                                        <td className="py-4">{p.date}</td>
                                        <td className="py-4"><span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">{p.status}</span></td>
                                        <td className="py-4">
                                            <Link href={'/proposals/' + p.id} className="bg-blue-600 text-white px-3 py-2 rounded-lg">Review</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru Kaprodi</h3>
                    <ul className="space-y-3">
                        {data.activities.map(a => (
                            <li key={a.id} className="flex items-start gap-3">
                                <div className="bg-slate-100 p-3 rounded-full">
                                    {a.icon === 'doc' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h8m-8 4h6" /></svg>}
                                    {a.icon === 'check' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                    {a.icon === 'alert' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
                                </div>
                                <div>
                                    <div className="font-medium">{a.title}</div>
                                    <div className="text-xs text-slate-500">{a.subtitle}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </KaprodiLayout>
    );
}
