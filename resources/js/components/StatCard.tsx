import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    colorClass?: string;
    icon?: string;
}

export default function StatCard({ title, value, colorClass, icon }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
                <div className="text-sm text-slate-500">{title}</div>
                <div className="text-2xl font-semibold mt-2">{value}</div>
            </div>
            <div
                className={
                    "p-3 rounded-lg flex items-center justify-center " +
                    (colorClass || "bg-slate-100")
                }
            >
                {icon && (
                    <img
                        src={icon}
                        alt="icon"
                        className="w-6 h-6 object-contain"
                    />
                )}
            </div>
        </div>
    );
}
