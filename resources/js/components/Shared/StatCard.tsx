import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    percent?: string;
    note?: string;
    icon?: React.ReactNode | string;
    color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
    variant?: 'outline' | 'solid'; // Prop baru untuk gaya kartu
}

// Helper untuk varian Outline (Default/Admin)
const getOutlineClasses = (color: string) => {
    switch (color) {
        case 'blue': return { card: 'bg-white border-gray-100', iconBg: 'bg-blue-100 text-blue-600' };
        case 'green': return { card: 'bg-white border-gray-100', iconBg: 'bg-green-100 text-green-600' };
        case 'yellow': return { card: 'bg-white border-gray-100', iconBg: 'bg-yellow-100 text-yellow-600' };
        case 'purple': return { card: 'bg-white border-gray-100', iconBg: 'bg-purple-100 text-purple-600' };
        case 'red': return { card: 'bg-white border-gray-100', iconBg: 'bg-red-100 text-red-600' };
        default: return { card: 'bg-white border-gray-100', iconBg: 'bg-gray-100 text-gray-600' };
    }
};

// Helper untuk varian Solid (Dosen)
const getSolidClasses = (color: string) => {
    switch (color) {
        case 'blue': return { card: 'bg-blue-600 text-white', iconBg: 'bg-white text-blue-600' };
        case 'green': return { card: 'bg-green-500 text-white', iconBg: 'bg-white text-green-600' };
        case 'yellow': return { card: 'bg-amber-500 text-white', iconBg: 'bg-white text-amber-600' }; // Amber biasanya lebih kontras untuk teks putih
        case 'purple': return { card: 'bg-purple-600 text-white', iconBg: 'bg-white text-purple-600' };
        case 'red': return { card: 'bg-red-600 text-white', iconBg: 'bg-white text-red-600' };
        default: return { card: 'bg-gray-600 text-white', iconBg: 'bg-white text-gray-600' };
    }
};

export default function StatCard({ title, value, percent, icon, color = 'blue', note, variant = 'outline' }: StatCardProps) {
    // Pilih style berdasarkan varian
    const classes = variant === 'solid' ? getSolidClasses(color) : getOutlineClasses(color);

    // Ikon default
    const DefaultIcon = (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-3.5a1.5 1.5 0 0 0-3 0h-3.5A1.5 1.5 0 0 0 5 4H3v16h18V4h-2zm-8.5 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zM19 18H5V6h2v2h10V6h2v12z" /></svg>
    );

    const renderIcon = () => {
        if (!icon) return DefaultIcon;
        if (typeof icon === 'string') {
            if (icon.length < 5) return <span className="text-xl leading-none">{icon}</span>;
            return DefaultIcon;
        }
        return icon;
    };

    return (
        <div className={`${classes.card} p-6 rounded-xl shadow-sm border transition duration-300 hover:shadow-md flex flex-col justify-between h-full relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2 z-10 relative">
                <p className={`text-sm font-medium ${variant === 'solid' ? 'text-white/90' : 'text-gray-500'}`}>{title}</p>

                {/* Icon Container */}
                <div className={`p-3 rounded-lg ${classes.iconBg} flex items-center justify-center shadow-sm`}>
                    {renderIcon()}
                </div>
            </div>

            <h3 className="text-3xl font-bold mt-2 z-10 relative">{value}</h3>

            {(percent || note) && (
                <div className="mt-4 flex items-center justify-between z-10 relative">
                    {percent && (
                        <span className={`text-sm font-semibold flex items-center ${variant === 'solid' ? 'text-white' : 'text-green-600'}`}>
                            {percent}
                        </span>
                    )}
                    {note && <p className={`text-xs ${variant === 'solid' ? 'text-white/80' : 'text-gray-400'}`}>{note}</p>}
                </div>
            )}
        </div>
    );
}