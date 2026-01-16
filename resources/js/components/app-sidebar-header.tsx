import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { cn } from '@/lib/utils';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const [lang, setLang] = useState('id');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isPengajuanDropdownOpen, setIsPengajuanDropdownOpen] = useState(false);
  const [isPengabdianDropdownOpen, setIsPengabdianDropdownOpen] = useState(false);

  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between px-6 md:px-4 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* Left: Logo + Sidebar + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Logo yang bisa diklik */}
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/image/logo-asaindo.png"
            alt="Logo LPPM"
            className="h-8 w-8 object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </div>

      {/* Center: Navigation Menu */}
      <div className="flex-1 mx-8">
        <div className="flex items-center justify-center gap-6">
          {/* Home */}
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          >
            Home
          </Link>

          {/* Berita */}
          <Link
            href="/berita"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          >
            Berita
          </Link>

          {/* Dropdown Pengajuan */}
          <div className="relative">
            <button
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-1"
              onClick={() => {
                setIsPengajuanDropdownOpen(!isPengajuanDropdownOpen);
                setIsPengabdianDropdownOpen(false);
                setIsAdminDropdownOpen(false);
              }}
            >
              Pengajuan ▾
            </button>
            {isPengajuanDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <Link href="/dosen/penelitian/Index" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Usulan</Link>
                  <Link href="/pengajuan/perbaikan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Perbaikan</Link>
                  <Link href="/pengajuan/laporan-kemajuan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Laporan Kemajuan</Link>
                  <Link href="/pengajuan/catatan-harian" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Catatan Harian</Link>
                  <Link href="/pengajuan/laporan-akhir" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Laporan Akhir</Link>
                  <Link href="/pengajuan/pengkinian-luaran" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Pengkinian Capaian Luaran</Link>
                  <Link href="/pengajuan/bintek" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Bintek</Link>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown Pengabdian */}
          <div className="relative">
            <button
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-1"
              onClick={() => {
                setIsPengabdianDropdownOpen(!isPengabdianDropdownOpen);
                setIsPengajuanDropdownOpen(false);
                setIsAdminDropdownOpen(false);
              }}
            >
              Pengabdian ▾
            </button>
            {isPengabdianDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <Link href="/pengabdian/usulan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Usulan</Link>
                  <Link href="/pengabdian/perbaikan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Perbaikan</Link>
                  <Link href="/pengabdian/laporan-kemajuan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Laporan Kemajuan</Link>
                  <Link href="/pengabdian/catatan-harian" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Catatan Harian</Link>
                  <Link href="/pengabdian/laporan-akhir" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Laporan Akhir</Link>
                  <Link href="/pengabdian/pengkinian-luaran" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Pengkinian Capaian Luaran</Link>
                  <Link href="/pengabdian/bintek" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Bintek</Link>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown Admin */}
          <div className="relative">
            <button
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 flex items-center gap-1"
              onClick={() => {
                setIsAdminDropdownOpen(!isAdminDropdownOpen);
                setIsPengajuanDropdownOpen(false);
                setIsPengabdianDropdownOpen(false);
              }}
            >
              Admin ▾
            </button>
            {isAdminDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <Link href="/permissions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Managemen Permission</Link>
                  <Link href="/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Manajemen User</Link>
                  <Link href="/roles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Managemen Roles</Link>
                  <Link href="/menus" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Manajemen Menu</Link>
                  <Link href="/settingsapp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Manajemen App Setting</Link>
                  <Link href="/backup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Backup</Link>
                  <Link href="/audit-logs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Log Audit</Link>
                  <Link href="/files" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">File Manager</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Language + Theme + User */}
      <div className="flex items-center gap-4">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">🇮🇩 Bahasa</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
          </SelectContent>
        </Select>

        <AppearanceDropdown />

        {/* User Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Super Administrator</p>
            </div>
            <svg
              className={cn(
                "w-4 h-4 text-gray-500 transition-transform",
                isDropdownOpen && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-2">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil Saya
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  Pengaturan
                </Link>
                <div className="h-px bg-gray-200 my-1"></div>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}