import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

// ----------------------
// TYPE DEFINITIONS
// ----------------------
interface AuthUser {
    name: string;
    role: string;
    avatar?: string;
}

interface PageProps {
    auth?: {
        user?: AuthUser;
    };
    // FIX: Mengganti 'any' dengan 'unknown' untuk mematuhi aturan ESLint/TypeScript.
    [key: string]: unknown;
}

// ----------------------
// MENU BY ROLE
// ----------------------
// Definisikan tipe untuk item menu, yang sekarang bisa berupa Link atau Dropdown
type NavItem = {
    href?: string; // Link item
    label: string;
    items?: { href: string; label: string }[]; // Dropdown items
};

const ROLE_MENU: Record<string, NavItem[]> = {
    "admin lppm": [
        { href: "/lppm/dashboard", label: "Dashboard" },
        { href: "/lppm/penelitian", label: "Penelitian" },
        { href: "/lppm/pengabdian", label: "Pengabdian" },
        {
            label: "Manajemen",
            items: [
                { href: "/lppm/users", label: "Manajemen Pengguna" },
                { href: "/lppm/data", label: "Master Data" },
                { href: "/lppm/periods", label: "Periode Kegiatan" },
                { href: "/lppm/reviewers", label: "Plotting Reviewer" },
                { href: "/lppm/setting-form", label: "Manajemen Form" },
            ]
        },
        {
            label: "System",
            items: [
                { href: "/audit-logs", label: "Audit Logs" },
                { href: "/lppm/settings", label: "Pengaturan" },
            ]
        },
    ],

    // Super Admin / Admin Menu
    admin: [
        { href: "/admin/dashboard", label: "Command Center" },
        { href: "/lppm/dashboard", label: "LPPM Dashboard" },
        {
            label: "System Control",
            items: [
                { href: "/lppm/users", label: "User Management" },
                { href: "/lppm/data", label: "Master Data" },
                { href: "/audit-logs", label: "System Logs" },
                { href: "/lppm/settings", label: "Settings" },
            ]
        },
    ],

    "super-admin": [
        { href: "/admin/dashboard", label: "Command Center" },
        { href: "/lppm/dashboard", label: "LPPM Dashboard" },
        {
            label: "System Control",
            items: [
                { href: "/lppm/users", label: "User Management" },
                { href: "/lppm/data", label: "Master Data" },
                { href: "/audit-logs", label: "System Logs" },
                { href: "/lppm/settings", label: "Settings" },
            ]
        },
    ],

    dosen: [
        { href: "/dosen/dashboard", label: "Dashboard" },
        { href: "/dosen/penelitian", label: "Penelitian" },
        { href: "/dosen/pengabdian", label: "Pengabdian" },
    ],

    reviewer: [
        { href: "/reviewer/dashboard", label: "Dashboard" },
        { href: "/reviewer/usulan", label: "Usulan Untuk Direview" },
        { href: "/reviewer/penilaian", label: "Penilaian Saya" },
        { href: "/reviewer/arsip", label: "Arsip" },
    ],

    kaprodi: [
        { href: "/kaprodi/dashboard", label: "Dashboard" },
        { href: "/kaprodi/usulan", label: "Usulan Masuk" },
        { href: "/kaprodi/review-saya", label: "Review Saya" },
        { href: "/kaprodi/riwayat-review", label: "Riwayat Review" },
    ],
};

// ----------------------
// HELPER FUNCTIONS
// ----------------------
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Mengubah role key (lowercase) menjadi string yang lebih mudah dibaca untuk tampilan.
 * @param roleKey - Role key yang sudah dipastikan ada ('admin', 'dosen', 'kaprodi', dll.)
 * @returns String format display.
 */
const getDisplayRole = (roleKey: string): string => {
    switch (roleKey) {
        case 'kaprodi':
            return 'Kaprodi Informatika';
        case 'admin':
            return 'Administrator LPPM';
        case 'super-admin':
            return 'Super Administrator';
        case 'admin lppm':
            return 'Admin LPPM';
        default:
            return capitalize(roleKey); // 'dosen' -> 'Dosen', 'reviewer' -> 'Reviewer'
    }
};

/**
 * Mendapatkan role key dari segmen URL (e.g., '/admin/dashboard' -> 'admin').
 * Digunakan sebagai fallback jika data role dari server kosong.
 * @param url - URL saat ini dari Inertia.
 * @returns Role key (lowercase) atau null.
 */
const getRoleFromUrl = (url: string): string | null => {
    // Hanya mencoba mencocokkan segmen yang merupakan role yang valid
    const match = url.match(/^\/(admin|dosen|reviewer|kaprodi|lppm)\//i);
    if (match) {
        const role = match[1].toLowerCase();
        // Map 'lppm' URL segment to 'admin lppm' role key
        return role === 'lppm' ? 'admin lppm' : role;
    }
    return null;
};

export default function Header() {
    const [userDropdown, setUserDropdown] = useState(false); // Ganti nama state agar lebih jelas
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // State baru untuk handling multiple dropdowns

    // SAFE TYPED PAGE PROPS
    const page = usePage<PageProps>();
    const authUser = page.props.auth?.user;

    // --- ROLE DETERMINATION LOGIC ---

    // 1. Coba tebak dari URL saat ini (Priority utama agar menu sesuai konteks halaman)
    let roleKey: string | undefined = getRoleFromUrl(page.url) ?? undefined;

    // 2. Jika tidak ada di URL (misal di halaman profile atau home), gunakan data otentikasi
    if (!roleKey) {
        roleKey = authUser?.role?.toLowerCase();
    }

    // 3. Fallback terakhir ke 'kaprodi' jika masih undefined.
    const role: string = roleKey ?? "user";

    // MENU SESUAI ROLE
    const navItems = ROLE_MENU[role] ?? [];

    // USER (FALLBACK & DISPLAY)
    const user: AuthUser = {
        name: authUser?.name ?? "User Default",
        role: getDisplayRole(role) || authUser?.role || "User",
        avatar:
            authUser?.avatar ||
            "https://i.pravatar.cc/150?img=32",
    };

    const currentUrl = page.url;

    // Cek apakah salah satu sub-item dropdown sedang aktif
    const isDropdownActive = (items: { href: string }[]) =>
        items.some(subItem => currentUrl.startsWith(subItem.href));

    return (
        <header className="w-full bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50">

            {/* LEFT - LOGO */}
            <Link href="/" className="flex items-center gap-5 group">
                <img
                    src="/image/logo-asaindo.png"
                    alt="Logo Kampus"
                    className="h-11 w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                />

                {/* Divider */}
                <div className="h-9 w-[2px] bg-gradient-to-b from-gray-100 via-gray-300 to-gray-100 rounded-full"></div>

                <div className="flex flex-col">
                    <span className="text-xl font-medium text-gray-500 leading-none">
                        LPPM
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal mt-0.5">
                        Lembaga Penelitian Dan Pengabdian Masyarakat
                    </span>
                </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-10 font-medium text-gray-600">
                {navItems.map((item, index) => {
                    // Cek jika item adalah link biasa
                    if (item.href) {
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={
                                    currentUrl.startsWith(item.href)
                                        ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                        : "hover:text-blue-600"
                                }
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    // Jika item adalah dropdown
                    if (item.items) {
                        const isOpen = activeDropdown === item.label;
                        const isActive = isDropdownActive(item.items);

                        return (
                            <div key={index} className="relative">
                                <button
                                    onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                                    className={`flex items-center gap-1 focus:outline-none pb-1 transition duration-150 
                                        ${isOpen || isActive
                                            ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                            : "hover:text-blue-600"
                                        }`}
                                >
                                    {item.label}
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isOpen && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-52 bg-white shadow-xl rounded-lg py-2 mt-4 z-50 border border-gray-100 animate-fadeIn">
                                        {item.items.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${currentUrl.startsWith(subItem.href) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null; // Safety fallback
                })}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">

                {/* NOTIFICATION ICON */}
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
                        onClick={() => setUserDropdown(!userDropdown)} // Ganti state
                    >
                        <img
                            src={user.avatar}
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="hidden md:block text-left">
                            <div className="font-semibold text-gray-800">{user.name}</div>
                            {/* Ukuran font kustom 11px untuk mengurangi kepadatan (sudah benar dari sebelumnya) */}
                            <div className="text-[11px] text-gray-500">{user.role}</div>
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {userDropdown && (
                        <div className="absolute right-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-3 z-50 border border-gray-100">
                            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">
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

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* MOBILE MENU */}
            {mobileMenu && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-30 md:hidden py-4">
                    {navItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {/* Jika item adalah link biasa */}
                            {item.href && (
                                <Link
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
                            )}

                            {/* Jika item adalah dropdown (di mobile, tampilkan sebagai list) */}
                            {item.items && (
                                <>
                                    <p className="block px-6 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                    {item.items.map((subItem, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={subItem.href}
                                            className={
                                                "block pl-10 pr-6 py-2 text-sm border-l-2 ml-6 " +
                                                (currentUrl.startsWith(subItem.href)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-blue-600"
                                                    : "hover:bg-gray-100 text-gray-700 border-transparent")
                                            }
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </header>
    );
}