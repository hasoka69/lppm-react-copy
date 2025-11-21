import React from "react";

type Props = {
    title: string;
    desc?: string;
    time?: string;
    badge?: string; // Menunggu, Disetujui, Dalam Proses
};

// Helper untuk mendapatkan kelas badge dan ikon berdasarkan status
const getStatusClasses = (badge?: string) => {
    switch (badge) {
        case 'Disetujui':
            return { badgeClass: 'bg-green-100 text-green-800', iconColor: 'text-green-500' };
        case 'Menunggu':
            return { badgeClass: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-500' };
        case 'Dalam Proses':
            return { badgeClass: 'bg-blue-100 text-blue-800', iconColor: 'text-blue-500' };
        default:
            return { badgeClass: 'bg-gray-100 text-gray-600', iconColor: 'text-gray-400' };
    }
};

export default function ActivityItem({ title, desc, time, badge }: Props) {
    const { badgeClass, iconColor } = getStatusClasses(badge);

    return (
        <div className="flex items-start py-4 border-b last:border-b-0 hover:bg-gray-50 transition duration-150 rounded-lg -mx-2 px-2">

            {/* Ikon Status/Marker */}
            <div className={`mt-1 mr-4 flex-shrink-0 w-3 h-3 rounded-full ${iconColor.replace('text-', 'bg-')}`} />

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 truncate">{title}</h4>
                        {desc && <p className="text-xs text-gray-500 mt-1 truncate">{desc}</p>}
                    </div>

                    {/* Badge Status */}
                    {badge && (
                        <div className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${badgeClass}`}>
                            {badge}
                        </div>
                    )}
                </div>

                {/* Waktu */}
                {time && <p className="text-xs text-blue-500 mt-2">{time}</p>}
            </div>

            {/* Ikon panah kanan */}
            <svg className="w-4 h-4 ml-4 mt-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>
    );
}