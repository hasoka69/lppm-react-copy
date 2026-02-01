import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react'; // Added usePage for checking active url if needed
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { cn } from '@/lib/utils';
import {
  Home,
  Newspaper,
  Files,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Database,
  Activity,
  HardDrive,
  FolderOpen,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming these exist, otherwise I'll stick to manual divs or use existing structure if needed.
// Actually, the previous file used manual divs for dropdowns (isDropdownOpen state).
// To be safe and premium, I should try to use the shadcn `dropdown-menu` if it exists. 
// Step 945 showed imports from `@/components/ui/card` etc.
// The previous `AppSidebarHeader` used manual state `isPengajuanDropdownOpen`.
// I will keep manual state for now to avoid import errors if DropdownMenu is not set up, BUT I will style them much better.
// Actually, I can check if Radix primitives are available, but I'll stick to manual for safety but make it look like shadcn.

export function AppSidebarHeader({ breadcrumbs = [], hideSidebar = false }: { breadcrumbs?: BreadcrumbItemType[], hideSidebar?: boolean }) {
  const [lang, setLang] = useState('id');

  // States for dropdowns
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdowns when clicking outside logic is messy in manual implementation without a listener, 
  // but for now we'll rely on onBlur or explicit clicks. 
  // Better: Use a backdrop or just keep it simple.

  const NavItem = ({ href, icon: Icon, label, active = false }: { href: string; icon: any; label: string; active?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
        active
          ? "text-blue-600 bg-blue-50/80"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  const DropdownTrigger = ({ label, icon: Icon, isOpen, onClick }: { label: string; icon: any; isOpen: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 outline-none",
        isOpen
          ? "text-blue-600 bg-blue-50/80"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
      <ChevronDown className={cn("w-3.5 h-3.5 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  );

  const DropdownItem = ({ href, label, active = false }: { href: string; label: string; active?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "block px-4 py-2 text-sm transition-colors",
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md support-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Left Section: Logo & Sidebar Trigger */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2">
            {!hideSidebar && (
              <SidebarTrigger className="-ml-2 h-9 w-9 text-muted-foreground hover:text-foreground" />
            )}

            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img
                  src="/image/logo-asaindo.png"
                  alt="Logo"
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </div>
              <span className="hidden font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 md:inline-block">
                LPPM
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center ml-2 text-sm text-muted-foreground">
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>

        {/* Center Section: Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/50 border border-slate-200/50 backdrop-blur-sm">
            <NavItem href="/dashboard" icon={Home} label="Home" />
            <NavItem href="/berita" icon={Newspaper} label="Berita" />

            {/* Pengajuan Dropdown */}
            <div className="relative">
              <DropdownTrigger
                label="Pengajuan"
                icon={Files}
                isOpen={activeDropdown === 'pengajuan'}
                onClick={() => toggleDropdown('pengajuan')}
              />

              {activeDropdown === 'pengajuan' && (
                <div className="absolute top-full left-0 mt-2 w-56 p-1 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                  <DropdownItem href="/dosen/penelitian/Index" label="Usulan Baru" />
                  <DropdownItem href="/pengajuan/perbaikan" label="Perbaikan Usulan" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/dosen/penelitian/laporan-kemajuan" label="Laporan Kemajuan" />
                  <DropdownItem href="/dosen/penelitian/laporan-akhir" label="Laporan Akhir" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/pengajuan/pengkinian-luaran" label="Pengkinian Luaran" />
                  <DropdownItem href="/pengajuan/bintek" label="Bimbingan Teknis" />
                </div>
              )}
            </div>

            {/* Pengabdian Dropdown */}
            <div className="relative">
              <DropdownTrigger
                label="Pengabdian"
                icon={Users}
                isOpen={activeDropdown === 'pengabdian'}
                onClick={() => toggleDropdown('pengabdian')}
              />

              {activeDropdown === 'pengabdian' && (
                <div className="absolute top-full left-0 mt-2 w-56 p-1 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                  <DropdownItem href="/pengabdian/usulan" label="Usulan Baru" />
                  <DropdownItem href="/pengabdian/perbaikan" label="Perbaikan Usulan" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/dosen/pengabdian/laporan-kemajuan" label="Laporan Kemajuan" />
                  <DropdownItem href="/dosen/pengabdian/laporan-akhir" label="Laporan Akhir" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/pengabdian/pengkinian-luaran" label="Pengkinian Luaran" />
                  <DropdownItem href="/pengabdian/bintek" label="Bimbingan Teknis" />
                </div>
              )}
            </div>

            {/* Admin Dropdown */}
            <div className="relative">
              <DropdownTrigger
                label="Admin"
                icon={Shield}
                isOpen={activeDropdown === 'admin'}
                onClick={() => toggleDropdown('admin')}
              />

              {activeDropdown === 'admin' && (
                <div className="absolute top-full right-0 mt-2 w-56 p-1 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                  <DropdownItem href="/permissions" label="Manajemen Permission" />
                  <DropdownItem href="/users" label="Manajemen User" />
                  <DropdownItem href="/roles" label="Manajemen Roles" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/menus" label="Manajemen Menu" />
                  <DropdownItem href="/settingsapp" label="App Settings" />
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <DropdownItem href="/backup" label="System Backup" />
                  <DropdownItem href="/audit-logs" label="Audit Logs" />
                  <DropdownItem href="/files" label="File Manager" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: User Tools */}
        <div className="flex items-center gap-3">
          {/* Lang Switcher - Simplified */}
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[70px] h-9 border-none bg-transparent hover:bg-slate-100 focus:ring-0">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="en">EN</SelectItem>
            </SelectContent>
          </Select>

          <AppearanceDropdown />

          <div className="h-6 w-[1px] bg-slate-200 mx-1" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all hover:shadow-sm"
            >
              <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-700">Admin User</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
              <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isUserDropdownOpen && "rotate-180")} />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 p-1 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-semibold text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500">admin@example.com</p>
                </div>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  <User className="size-4" />
                  Profile Saya
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  <Settings className="size-4" />
                  Pengaturan Akun
                </Link>
                <div className="h-[1px] bg-slate-100 my-1" />
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="size-4" />
                  Keluar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for dropdowns could go here if needed, but sticky header makes it tricky. */}
    </header>
  );
}