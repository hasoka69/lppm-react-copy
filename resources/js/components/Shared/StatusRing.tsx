import React from "react";

type Props = {
    percent: number; // 0-100
    size?: number; // px
    color?: string; // hex or tailwind color
};

// Pure CSS conic-gradient donut, no libs
export default function StatusRing({ percent, size = 110, color = "#2563eb" }: Props) {
    const pct = Math.max(0, Math.min(100, percent));

    // Style untuk outer ring (progress bar)
    const wrapperStyle: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: "9999px",
        display: "grid",
        placeItems: "center",
        // conic-gradient untuk membuat efek progress
        background: `conic-gradient(${color} ${pct}%, #e6eef7 ${pct}%)`,
    };

    // Ukuran inner ring (di tengah)
    const innerSize = Math.floor((size * 80) / 100);

    return (
        // Menghapus wrapper flex gap-4 agar komponennya hanya ring saja, sesuai gambar
        <div style={wrapperStyle} className="rounded-full shadow-inner">
            <div
                style={{
                    width: innerSize,
                    height: innerSize,
                    borderRadius: "9999px",
                }}
                className="bg-white flex items-center justify-center border-4 border-white"
            >
                {/* Menampilkan persentase di tengah ring */}
                <div className="text-xl font-bold text-gray-800">{pct}%</div>
            </div>
        </div>
    );
}