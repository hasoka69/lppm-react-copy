import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function HeaderKaprodi() {
    const [dropdown, setDropdown] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const authUser = usePage().props.auth?.user;

    const fallbackAvatar = "https://awsimages.detik.net.id/community/media/visual/2015/04/01/6315fbb8-210a-482f-a995-e3d42884fa54_43.jpg?w=700&q=90";

    const user = {
        name: authUser?.name || "Dr. Ahmad Kaprodi",
        role: authUser?.role || "Kaprodi Informatika",
        avatar: authUser?.avatar || fallbackAvatar,
    };

    const currentUrl = usePage().url;

    const navItems = [
        { href: "/kaprodi/dashboard", label: "Dashboard" },
        { href: "/kaprodi/usulan", label: "Usulan Masuk" },
        { href: "/kaprodi/review-saya", label: "Review Saya" },
        { href: "/kaprodi/riwayat-review", label: "Riwayat Review" },
    ];

    return (
        <header className="w-full bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between sticky top-0 z-30">

            {/* LEFT LOGO */}
            <div className="flex items-center gap-4">
                <img
                    src="/image/logo-asaindo.png"
                    alt="Logo Kampus"
                    className="h-12 w-auto"
                />
                <div className="border-l pl-4">
                    <h1 className="font-semibold text-xl tracking-wide text-[#2D4261]">L P P M</h1>
                    <p className="text-xs text-gray-500 -mt-1">
                        LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT
                    </p>
                </div>
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-10 font-medium text-gray-600">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={
                            currentUrl.startsWith(item.href)
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                : "hover:text-blue-600"
                        }
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* RIGHT PROFILE */}
            <div className="flex items-center gap-6">
                {/* BELL */}
                <div className="relative hidden md:block">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>

                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                        3
                    </span>
                </div>

                {/* USER DROPDOWN */}
                <div className="relative">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setDropdown(!dropdown)}
                    >
                        <img
                            src={user.avatar}
                            className="h-10 w-10 rounded-full object-cover"
                        />

                        <div className="hidden md:block text-left">
                            <div className="font-semibold text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {user.role}
                            </div>
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>

                    {/* DROPDOWN MENU */}
                    {dropdown && (
                        <div className="absolute right-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-3 z-40">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                className="block px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-700"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* MOBILE MENU */}
            {mobileMenu && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-30 md:hidden py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                "block px-6 py-3 text-sm " +
                                (currentUrl.startsWith(item.href)
                                    ? "text-blue-600 font-semibold bg-blue-50"
                                    : "hover:bg-gray-100")
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
