import React from "react";

// Definisikan tipe untuk setiap item data di dalam daftar
type ManagementItem = {
    label: string;
    value: string | number;
    colorClass: string;
};

// Definisikan tipe Props untuk komponen ManagementRow
type ManagementRowProps = ManagementItem;

// Komponen Baris yang mereplikasi tampilan list (label kiri, value kanan, badge berwarna).
function ManagementRow({ label, value, colorClass }: ManagementRowProps) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-700">{label}</span>
            <span
                // Kelas untuk badge berwarna, diterapkan melalui prop colorClass
                className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
            >
                {value}
            </span>
        </div>
    );
}

// Definisikan tipe Props untuk komponen ManagementBox
type ManagementBoxProps = {
    usulanData: ManagementItem[];
    luaranData: ManagementItem[];
};

/**
 * Komponen ManagementBox
 * Menerima props 'usulanData' dan 'luaranData' dari komponen induk.
 */
export default function ManagementBox({ usulanData, luaranData }: ManagementBoxProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Manajemen Usulan */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                    {/* Ikon Usulan (Biru) */}
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg">Manajemen Usulan</h3>
                </div>

                <div className="space-y-1">
                    {usulanData.map((item, index) => (
                        <ManagementRow
                            key={index}
                            label={item.label}
                            value={item.value}
                            colorClass={item.colorClass}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Manajemen Luaran */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                    {/* Ikon Luaran (Ungu) */}
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mr-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 13v-2h-2V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6H4v2h2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4h2zM8 5h8v6H8V5zm8 14H8v-4h8v4z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg">Manajemen Luaran</h3>
                </div>

                <div className="space-y-1">
                    {luaranData.map((item, index) => (
                        <ManagementRow
                            key={index}
                            label={item.label}
                            value={item.value}
                            colorClass={item.colorClass}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}