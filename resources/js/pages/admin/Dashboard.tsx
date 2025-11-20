import React from "react";
// Menggunakan path relatif untuk menghindari error
import Header from "@/components/Header";
import StatCardAdmin from "@/components/admin/StatCardAdmin";
import ActivityItem from "@/components/admin/ActivityItem";
import StatusRing from "@/components/admin/StatusRing";
import ManagementBox from "@/components/admin/ManagementBox";

// --- Type Definitions for Data Structure ---

type KpiData = {
    penelitian: number;
    pengabdian: number;
    dosen: number;
    luaran: number;
};

type Activity = {
    id: number;
    title: string;
    desc: string;
    time: string;
    badge?: 'Disetujui' | 'Menunggu' | 'Dalam Proses';
};

type StatusData = {
    percent: number;
    waiting: number;
    processing: number;
    approved: number;
};

type ManagementItem = {
    label: string;
    value: string;
    colorClass: string;
};

type ManagementData = {
    usulan: ManagementItem[];
    luaran: ManagementItem[];
};

interface DashboardData {
    kpi: KpiData;
    activities: Activity[];
    status: StatusData;
    management: ManagementData;
}

// --- Component ---

export default function DashboardAdmin() {
    // Data dummy dengan tipe yang jelas
    const data: DashboardData = {
        kpi: {
            penelitian: 247,
            pengabdian: 189,
            dosen: 524,
            luaran: 1342,
        },
        activities: [
            { id: 1, title: "Usulan Penelitian Baru Diajukan", desc: "Dr. Ahmad Fauzi mengajukan penelitian tentang AI dalam Pendidikan", time: "15 menit lalu", badge: "Disetujui" },
            { id: 2, title: "Pengabdian Menunggu Review", desc: "Prof. Siti Nurhaliza - Program Pemberdayaan Masyarakat Desa", time: "1 jam lalu", badge: "Menunggu" },
            { id: 3, title: "HKI Baru Ditambahkan", desc: "Dr. Budi Santoso mendaftarkan HKI untuk sistem monitoring kesehatan", time: "3 jam lalu", badge: "Dalam Proses" },
            { id: 4, title: "Dosen Baru Terdaftar", desc: "Dr. Maria Wijaya bergabung dari Fakultas Teknik Informatika", time: "5 jam lalu" },
            { id: 5, title: "Buku Baru Dipublikasikan", desc: "Prof. Hendro Wibowo - 'Machine Learning untuk Pemula'", time: "1 hari lalu" },
        ],
        status: {
            percent: 75,
            waiting: 28,
            processing: 49,
            approved: 188,
        },
        management: {
            usulan: [
                { label: "Penelitian", value: "247", colorClass: "text-blue-600 bg-blue-100" },
                { label: "Pengabdian", value: "189", colorClass: "text-green-600 bg-green-100" },
                { label: "Perbaikan", value: "32", colorClass: "text-yellow-600 bg-yellow-100" },
                { label: "Review", value: "58", "colorClass": "text-orange-600 bg-orange-100" },
                { label: "Penetapan Pemenang", value: "15", colorClass: "text-purple-600 bg-purple-100" },
            ],
            luaran: [
                { label: "Buku", value: "342", colorClass: "text-purple-600 bg-purple-100" },
                { label: "HKI", value: "156", colorClass: "text-pink-600 bg-pink-100" },
            ],
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="p-4 md:p-6 max-w-7xl mx-auto">

                {/* Welcome banner */}
                <div className="bg-blue-600 text-white rounded-xl p-8 mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold">Selamat Datang, Admin LPPM Asaindo</h1>
                    <p className="mt-2 text-blue-100 text-sm">
                        Kelola seluruh data penelitian, pengabdian, user dosen, serta luaran melalui dashboard ini.
                    </p>

                    {/* Quick Action Cards - Diperbarui sesuai gambar */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Kartu Kelola Usulan (Penelitian) - LOGO DIPERBARUI */}
                        <a href="#" className="flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-150 group">
                            {/* Perbaikan: className yang benar dan warna latar biru tua */}
                            <div className={`p-4 rounded-xl bg-blue-600 text-white mr-4 flex-shrink-0`}>
                                {/* Ikon Teks / Dokumen */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-3.5 8h-2v-2h2v2zm0-4h-2v-2h2v2zm-3-4h6V7H6v4zm9 8h-6v-2h6v2z" /></svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">Kelola Usulan</h3>
                                <p className="text-sm text-gray-500 mt-1">Penelitian</p>
                            </div>
                        </a>

                        {/* Kartu Kelola Usulan (Pengabdian) - Disesuaikan dengan layout baru */}
                        <a href="#" className="flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-150 group">
                            <div className={`p-4 rounded-xl bg-green-600 text-white mr-4 flex-shrink-0`}>
                                {/* Ikon Tangan / Sosial */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">Kelola Usulan</h3>
                                <p className="text-sm text-gray-500 mt-1">Pengabdian</p>
                            </div>
                        </a>

                        {/* Kartu Kelola Luaran - Disesuaikan dengan layout baru */}
                        <a href="#" className="flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-150 group">
                            <div className={`p-4 rounded-xl bg-purple-600 text-white mr-4 flex-shrink-0`}>
                                {/* Ikon HKI / Buku */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 13v-2h-2V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6H4v2h2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4h2zM8 5h8v6H8V5zm8 14H8v-4h8v4z" /></svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">Kelola Luaran</h3>
                                <p className="text-sm text-gray-500 mt-1">PKM, Buku, Jurnal, HKI</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* KPI grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Menggunakan props icon dan color yang baru */}
                    <StatCardAdmin
                        title="Total Penelitian Masuk"
                        value={data.kpi.penelitian}
                        percent="+12%"
                        note="Dari bulan lalu"
                        icon="📄"
                        color="blue"
                    />
                    <StatCardAdmin
                        title="Total Pengabdian Masuk"
                        value={data.kpi.pengabdian}
                        percent="+8%"
                        note="Dari bulan lalu"
                        icon="🌱"
                        color="green"
                    />
                    <StatCardAdmin
                        title="Total Dosen Terdaftar"
                        value={data.kpi.dosen}
                        percent="+5%"
                        note="Dari bulan lalu"
                        icon="🧑‍🏫"
                        color="yellow"
                    />
                    <StatCardAdmin
                        title="Total Luaran"
                        value={data.kpi.luaran}
                        percent="+18%"
                        note="Dari bulan lalu"
                        icon="📚"
                        color="purple"
                    />
                </div>

                {/* Main columns: activities (7) and status (5) */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Aktivitas Terbaru */}
                    <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-xl text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M13 1.01L6 3v18l7 3 7-3V3l-7-1.99zm0 18.02l-5-2V5.45l5-1.55v15.13zm5-2l-5 2V3.45l5 1.55v15.13z" /></svg>
                                Aktivitas Terbaru
                            </h2>
                            <a className="text-blue-600 text-sm hover:underline font-medium">Lihat Semua</a>
                        </div>

                        <div className="space-y-1">
                            {data.activities.map(a => (
                                <ActivityItem key={a.id} title={a.title} desc={a.desc} time={a.time} badge={a.badge} />
                            ))}
                        </div>
                    </div>

                    {/* Status Usulan & Manajemen Dosen */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">

                        {/* Status Usulan Terbaru Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h2 className="font-semibold text-xl mb-6 text-gray-800">Status Usulan Terbaru</h2>

                            <div className="flex items-center gap-6">
                                {/* Status Ring */}
                                <div className="flex-shrink-0">
                                    <StatusRing percent={data.status.percent} color="#2563eb" />
                                </div>

                                {/* Detail Status List */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div> Menunggu Review
                                        </div>
                                        <span className="font-bold text-gray-800">{data.status.waiting}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> Dalam Proses
                                        </div>
                                        <span className="font-bold text-gray-800">{data.status.processing}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Disetujui
                                        </div>
                                        <span className="font-bold text-gray-800">{data.status.approved}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a className="block w-full text-center px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-150 shadow-md">Lihat Detail Usulan</a>
                            </div>
                        </div>


                        {/* Manajemen Dosen Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="font-bold mb-4 flex items-center text-lg text-gray-800">
                                <svg className="w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                Manajemen Dosen
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <a className="flex justify-between items-center p-3 rounded-lg border bg-gray-50 text-gray-700 hover:bg-gray-100 transition duration-150">
                                    <span>Kelola Data Dosen</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </a>
                                <a className="flex justify-between items-center p-3 rounded-lg border bg-gray-50 text-gray-700 hover:bg-gray-100 transition duration-150">
                                    <span>Tambah Dosen Baru</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </a>
                                <a className="flex justify-between items-center p-3 rounded-lg border bg-gray-50 text-gray-700 hover:bg-gray-100 transition duration-150">
                                    <span>Sinkronisasi SINTA</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Tools / Management Box */}
                <div className="mt-8">
                    <h2 className="font-bold text-xl mb-4 text-gray-800">Admin Tools</h2>
                    <ManagementBox
                        usulanData={data.management.usulan}
                        luaranData={data.management.luaran}
                    />
                </div>

            </div>
        </div>
    );
}