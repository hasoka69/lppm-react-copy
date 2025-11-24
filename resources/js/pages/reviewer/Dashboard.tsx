import React from 'react';
import Header from '../../components/Header';
// FIX: Ubah import alias '@/' menjadi relative path '../../'
import StatCard from '../../components/Shared/StatCard';
import WelcomeHero from '../../components/Shared/WelcomeHero';

// --- ICONS (Inline SVG untuk kepraktisan) ---
const ClockIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClipboardIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CheckCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function DashboardReviewer() {

    const stats = [
        { title: "Menunggu Penilaian", value: 8, icon: ClockIcon, color: 'blue' as const },
        { title: "Dalam Review", value: 3, icon: ClipboardIcon, color: 'purple' as const },
        { title: "Disetujui", value: 24, icon: CheckCircleIcon, color: 'green' as const },
        { title: "Ditolak", value: 5, icon: XCircleIcon, color: 'red' as const },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <WelcomeHero
                    title="Selamat Datang, Reviewer"
                    subtitle="Lakukan evaluasi mendalam dan berikan persetujuan akhir terhadap usulan yang masuk."
                    buttonLabel="Lihat Usulan Siap Dinilai"
                    buttonLink="/reviewer/usulan"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* UBAH GRID DISINI:
               Sebelumnya: grid-cols-2 md:grid-cols-4 (4 berjejer)
               Sekarang: grid-cols-1 sm:grid-cols-2 (2 berjejer ke bawah/2 baris)
               Gap juga diperbesar sedikit menjadi gap-6 agar lebih lega.
            */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        <ReviewerUsulanTable />
                        <ReviewerActivities />
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <ReviewerProfileCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function ReviewerUsulanTable() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Usulan Siap Direview</h2>
                    <p className="text-sm text-gray-500">Evaluasi dan berikan persetujuan final.</p>
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="Cari usulan..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 border border-gray-200 flex items-center gap-1">
                        Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Judul Usulan</th>
                            <th className="px-4 py-3">Jenis</th>
                            <th className="px-4 py-3">Pengusul</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        <tr>
                            <td className="px-4 py-4 font-medium text-gray-800">
                                Implementasi Machine Learning untuk Prediksi Hasil Belajar<br />
                                <span className="text-xs text-gray-400 font-normal">ID: USL-2024-001</span>
                            </td>
                            <td className="px-4 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Penelitian</span></td>
                            <td className="px-4 py-4 text-gray-600">Dr. Budi Santoso</td>
                            <td className="px-4 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">Siap Dinilai</span></td>
                            <td className="px-4 py-4 text-right">
                                <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 shadow-sm transition">Review</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 font-medium text-gray-800">
                                Pengembangan Aplikasi Mobile untuk UMKM Lokal<br />
                                <span className="text-xs text-gray-400 font-normal">ID: USL-2024-002</span>
                            </td>
                            <td className="px-4 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Pengabdian</span></td>
                            <td className="px-4 py-4 text-gray-600">Dr. Rina Wati</td>
                            <td className="px-4 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">Siap Dinilai</span></td>
                            <td className="px-4 py-4 text-right">
                                <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 shadow-sm transition">Review</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ReviewerActivities() {
    const activities = [
        { title: "Proposal Disetujui", desc: 'Anda menyetujui proposal "Implementasi IoT" dengan skor 92/100', time: "2 jam lalu", type: "success" },
        { title: "Penilaian Diberikan", desc: 'Anda memberikan skor untuk proposal "E-Learning Platform"', time: "5 jam lalu", type: "info" },
        { title: "Proposal Ditolak", desc: 'Anda menolak proposal "Sistem Monitoring Cuaca"', time: "1 hari lalu", type: "danger" },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terbaru Reviewer</h2>
            <div className="space-y-6">
                {activities.map((act, i) => (
                    <div key={i} className="flex gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                            ${act.type === 'success' ? 'bg-green-100 text-green-600' :
                                act.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                    'bg-red-100 text-red-600'}`}>
                            {/* Simple Icons */}
                            <div className="w-4 h-4 bg-current rounded-full opacity-50"></div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{act.title}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{act.desc}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{act.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewerProfileCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mb-3 overflow-hidden p-1">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Reviewer" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Dr. Ahmad Reviewer</h3>
                <p className="text-xs text-gray-500 mt-1">Bidang Kepakaran:<br />Teknologi Informasi & Sistem Cerdas</p>
            </div>
            {/* Profile stats... */}
            <button className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 shadow-md transition">
                Lihat Riwayat Penilaian
            </button>
        </div>
    );
}