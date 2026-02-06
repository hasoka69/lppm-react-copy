import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
  }

  const navLinks: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Panduan', href: '#panduan' },
    { label: 'Pengumuman', href: '#pengumuman' },
    { label: 'Berita', href: '/berita' },
    { label: 'Kontak', href: '#footer' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled || mobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src="/image/logo-asaindo.png" alt="Logo" className="h-12 w-auto" />
          <div className={cn("flex flex-col", scrolled ? "text-slate-800" : "text-white")}>
            <span className="font-bold text-2xl leading-none tracking-wide">LPPM</span>
            <span className="text-xs font-medium opacity-80 tracking-wider">LEMBAGA PENELITIAN & PENGABDIAN</span>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <li key={idx} className="relative group">
              {link.children ? (
                <button className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-blue-400 focus:outline-none",
                  scrolled ? "text-slate-600" : "text-white/90"
                )}>
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-400",
                    scrolled ? "text-slate-600" : "text-white/90"
                  )}
                >
                  {link.label}
                </Link>
              )}

              {/* Dropdown */}
              {link.children && (
                <div className="absolute top-full left-0 mt-4 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                    {link.children.map((child, cIdx) => (
                      <Link
                        key={cIdx}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* LOGIN BUTTON & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className={cn(
              "hidden md:inline-flex px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg",
              scrolled
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                : "bg-white text-blue-600 hover:bg-blue-50 shadow-white/20"
            )}
          >
            Login
          </Link>

          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen
              ? <X className={cn("w-6 h-6", scrolled ? "text-slate-800" : "text-white")} />
              : <Menu className={cn("w-6 h-6", scrolled ? "text-slate-800" : "text-white")} />
            }
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 md:hidden animate-in slide-in-from-top-4 fade-in">
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link, idx) => (
              <div key={idx}>
                {link.children ? (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 px-4 py-2">{link.label}</div>
                    <div className="pl-4 border-l-2 border-slate-100 ml-4 space-y-1">
                      {link.children.map((child, cIdx) => (
                        <Link
                          key={cIdx}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <Link href="/login" className="block w-full text-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                Masuk ke Sistem
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;