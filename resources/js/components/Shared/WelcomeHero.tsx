import React from 'react';
import { Link } from '@inertiajs/react';

interface WelcomeHeroProps {
    title: string;
    subtitle: string;
    buttonLabel?: string;
    buttonLink?: string;
    children?: React.ReactNode; // Prop baru untuk konten tambahan (seperti kartu aksi)
}

export default function WelcomeHero({ title, subtitle, buttonLabel, buttonLink, children }: WelcomeHeroProps) {
    return (
        <div className="bg-blue-600 p-8 md:p-10 rounded-xl shadow-lg text-white mb-8 relative overflow-hidden">
            {/* Background Pattern Decoration (Optional) */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                            {subtitle}
                        </p>
                    </div>
                    {buttonLabel && buttonLink && (
                        <Link
                            href={buttonLink}
                            className="bg-white text-blue-700 font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-blue-50 transition duration-150 whitespace-nowrap text-sm flex items-center gap-2"
                        >
                            {buttonLabel}
                        </Link>
                    )}
                </div>

                {/* Children Area (Untuk Kartu Aksi Dosen) */}
                {children && (
                    <div className="mt-8">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}