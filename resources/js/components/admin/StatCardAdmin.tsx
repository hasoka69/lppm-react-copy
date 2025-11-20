import React from "react";

type Props = {
    title: string;
    value: string | number;
    percent?: string;
    // Props baru untuk ikon dan warna
    icon?: string; // Emoji atau SVG path
    color?: 'blue' | 'green' | 'yellow' | 'purple';
    note?: string;
};

// Fungsi helper untuk mendapatkan kelas warna Tailwind
const getColorClasses = (color: Props['color']) => {
    switch (color) {
        case 'blue':
            return { iconBg: 'bg-blue-100 text-blue-600' };
        case 'green':
            return { iconBg: 'bg-green-100 text-green-600' };
        case 'yellow':
            return { iconBg: 'bg-yellow-100 text-yellow-600' };
        case 'purple':
            return { iconBg: 'bg-purple-100 text-purple-600' };
        default:
            return { iconBg: 'bg-gray-100 text-gray-600' };
    }
};

export default function StatCardAdmin({ title, value, percent, icon, color, note }: Props) {
    // Hanya mengambil iconBg
    const { iconBg } = getColorClasses(color);

    // Ikon default (misalnya ikon kertas) jika tidak disediakan
    const DefaultIcon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-3.5a1.5 1.5 0 0 0-3 0h-3.5A1.5 1.5 0 0 0 5 4H3v16h18V4h-2zm-8.5 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zM19 18H5V6h2v2h10V6h2v12z" />
        </svg>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
            <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                {/* Ikon di pojok kanan atas */}
                <div className={`p-2 rounded-full ${iconBg}`}>
                    {/* Jika icon adalah emoji (1 karakter) atau SVG, kita tampilkan */}
                    {icon && icon.length < 3 ? <span className="text-xl leading-none">{icon}</span> : DefaultIcon}
                </div>
            </div>

            <h3 className="text-4xl font-extrabold text-gray-800">{value}</h3>

            <div className="mt-3 flex items-center justify-between">
                {/* Persentase kenaikan/penurunan selalu hijau (menggunakan hardcoded class) */}
                {percent && (
                    <span className={`text-sm font-semibold text-green-600 flex items-center`}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z" /></svg>
                        {percent}
                    </span>
                )}
                {/* Note/Keterangan Waktu */}
                {note && <p className="text-xs text-gray-400">{note}</p>}
            </div>
        </div>
    );
}