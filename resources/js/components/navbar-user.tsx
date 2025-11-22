// resources/js/components/navbar-user.jsx
import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import styles from '../../css/navbar-user.module.css';

const NavbarUser = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isPengajuanDropdownOpen, setIsPengajuanDropdownOpen] = useState(false);
  const [isPengabdianDropdownOpen, setIsPengabdianDropdownOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          {/* Logo dan Brand */}
          <div className={styles.logoSection}>
            <Link href="/dashboard" className={styles.logoLink}>
              <img 
                src="/image/logo-asaindo.png" 
                alt="Logo Universitas Asa Indonesia" 
                className={styles.logo}
              />
              <div className={styles.brand}>
                <div className={styles.brandTitle}>LPPM</div>
                <div className={styles.brandSubtitle}>LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT</div>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className={styles.navMenu}>
            {/* Home */}
            <Link 
              href="/" 
              className={styles.navLink}
            >
              Home
            </Link>

            {/* Berita */}
            <Link 
              href="/berita" 
              className={styles.navLink}
            >
              Berita
            </Link>

            {/* Dropdown Pengajuan */}
            <div className={styles.dropdown}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => {
                  setIsPengajuanDropdownOpen(!isPengajuanDropdownOpen);
                  setIsPengabdianDropdownOpen(false);
                  setIsAdminDropdownOpen(false);
                }}
              >
                Pengajuan ▾
              </button>
              {isPengajuanDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    <Link href="/pengajuan/usulan" className={styles.dropdownItem}>Usulan</Link>
                    <Link href="/pengajuan/perbaikan" className={styles.dropdownItem}>Perbaikan</Link>
                    <Link href="/pengajuan/laporan-kemajuan" className={styles.dropdownItem}>Laporan Kemajuan</Link>
                    <Link href="/pengajuan/catatan-harian" className={styles.dropdownItem}>Catatan Harian</Link>
                    <Link href="/pengajuan/laporan-akhir" className={styles.dropdownItem}>Laporan Akhir</Link>
                    <Link href="/pengajuan/pengkinian-luaran" className={styles.dropdownItem}>Pengkinian Capaian Luaran</Link>
                    <Link href="/pengajuan/bintek" className={styles.dropdownItem}>Bintek</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown Pengabdian */}
            <div className={styles.dropdown}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => {
                  setIsPengabdianDropdownOpen(!isPengabdianDropdownOpen);
                  setIsPengajuanDropdownOpen(false);
                  setIsAdminDropdownOpen(false);
                }}
              >
                Pengabdian ▾
              </button>
              {isPengabdianDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    <Link href="/pengabdian/usulan" className={styles.dropdownItem}>Usulan</Link>
                    <Link href="/pengabdian/perbaikan" className={styles.dropdownItem}>Perbaikan</Link>
                    <Link href="/pengabdian/laporan-kemajuan" className={styles.dropdownItem}>Laporan Kemajuan</Link>
                    <Link href="/pengabdian/catatan-harian" className={styles.dropdownItem}>Catatan Harian</Link>
                    <Link href="/pengabdian/laporan-akhir" className={styles.dropdownItem}>Laporan Akhir</Link>
                    <Link href="/pengabdian/pengkinian-luaran" className={styles.dropdownItem}>Pengkinian Capaian Luaran</Link>
                    <Link href="/pengabdian/bintek" className={styles.dropdownItem}>Bintek</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown Admin */}
            <div className={styles.dropdown}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => {
                  setIsAdminDropdownOpen(!isAdminDropdownOpen);
                  setIsPengajuanDropdownOpen(false);
                  setIsPengabdianDropdownOpen(false);
                }}
              >
                Admin ▾
              </button>
              {isAdminDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    <Link href="/permissions" className={styles.dropdownItem}>Managemen Permission</Link>
                    <Link href="/users" className={styles.dropdownItem}>Manajemen User</Link>
                    <Link href="/roles" className={styles.dropdownItem}>Managemen Roles</Link>
                    <Link href="/menus" className={styles.dropdownItem}>Manajemen Menu</Link>
                    <Link href="/settingsapp" className={styles.dropdownItem}>Manajemen App Setting</Link>
                    <Link href="/backup" className={styles.dropdownItem}>Backup</Link>
                    <Link href="/audit-logs" className={styles.dropdownItem}>Log Audit</Link>
                    <Link href="/files" className={styles.dropdownItem}>File Manager</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Dropdown */}
          <div className={styles.userDropdown}>
            <div 
              className={styles.userTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className={styles.userAvatar}>
                <span className={styles.avatarText}>A</span>
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>Admin User</p>
                <p className={styles.userRole}>Super Administrator</p>
              </div>
              <svg 
                className={cn(
                  styles.dropdownArrow,
                  isDropdownOpen && styles.dropdownArrowOpen
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
              <div className={styles.userDropdownMenu}>
                <div className={styles.userDropdownContent}>
                  <Link href="/profile" className={styles.userDropdownItem}>
                    <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil Saya
                  </Link>
                  <Link href="/settings" className={styles.userDropdownItem}>
                    <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Pengaturan
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <Link 
                    href="/logout" 
                    method="post" 
                    as="button"
                    className={styles.logoutButton}
                  >
                    <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;