import { Link } from '@inertiajs/react';
import navbarStyles from '../../css/navbar.module.css';

export default function Navbar() {
  return (
    <>
      <nav className={navbarStyles.navbarLppm}>
        <div className={navbarStyles.navContainerLppm}>
          <div className={navbarStyles.headerContent}>
            <div className={navbarStyles.logoArea}>
              <img src="/image/logo-asaindo.png" alt="Logo Universitas Asa Indonesia" className={navbarStyles.logoLppm} />
            </div>
            <div className={navbarStyles.institutionDetails}>
              <div className={navbarStyles.lppmTitle}>LPPM</div>
              <div className={navbarStyles.lppmSubtitle}>LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT</div>
            </div>
          </div>

          <ul className={navbarStyles.navLinksLppm}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/berita">Berita</Link></li>
            
            {/* Dropdown Pengajuan */}
            <li className={navbarStyles.dropdown}>
              <a href="#">Pengajuan ▾</a>
              <ul className={navbarStyles.dropdownMenu}>
                <li><a href="#">Usulan</a></li>
                <li><a href="#">Perbaikan</a></li>
                <li><a href="#">Laporan Kemajuan</a></li>
                <li><a href="#">Catatan Harian</a></li>
                <li><a href="#">Laporan Akhir</a></li>
                <li><a href="#">Pengkinian Capaian Luaran</a></li>
                <li><a href="#">Bintek</a></li>
              </ul>
            </li>

            {/* Dropdown Pengabdian */}
            <li className={navbarStyles.dropdown}>
              <a href="#">Pengabdian ▾</a>
              <ul className={navbarStyles.dropdownMenu}>
                <li><a href="#">Usulan</a></li>
                <li><a href="#">Perbaikan</a></li>
                <li><a href="#">Laporan Kemajuan</a></li>
                <li><a href="#">Catatan Harian</a></li>
                <li><a href="#">Laporan Akhir</a></li>
                <li><a href="#">Pengkinian Capaian Luaran</a></li>
                <li><a href="#">Bintek</a></li>
              </ul>
            </li>

            <li><Link href="/login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <div className={navbarStyles.navbarBottomBar}></div>
    </>
  );
}