import { Link } from '@inertiajs/react';
import footerStyles from '../../css/footer.module.css';

export default function Footer() {
  return (
    <footer className={footerStyles.footerLppm}>
      <div className={footerStyles.footerContainer}>
        <div className={`${footerStyles.footerCol} ${footerStyles.infoCol}`}>
          <div className={footerStyles.footerLogoBrand}>
            <div className={footerStyles.plusIconBox}>+</div>
            <div className={footerStyles.brandText}>
              <h3 className={footerStyles.brandTitle}>LPPM Asaindo</h3>
              <p className={footerStyles.brandSubtitle}>Lembaga Penelitian dan Pengabdian Masyarakat</p>
            </div>
          </div>
          <p className={footerStyles.footerQuote}>"Menginspirasi Lewat Ilmu, Mengabdi Lewat Aksi."</p>
          <p className={footerStyles.footerDescription}>
            Memajukan penelitian berkualitas dan pengabdian masyarakat yang 
            berdampak untuk kemajuan bangsa dan kesejahteraan masyarakat Indonesia.
          </p>

          <div className={footerStyles.socialMediaSection}>
            <h4>Ikuti Kami</h4>
            <div className={footerStyles.socialIcons}>
              <a href="#" className={`${footerStyles.socialIcon} ${footerStyles.instagram}`}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={`${footerStyles.socialIcon} ${footerStyles.facebook}`}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={`${footerStyles.socialIcon} ${footerStyles.linkedin}`}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className={`${footerStyles.footerCol} ${footerStyles.navCol}`}>
          <h4>Navigasi</h4>
          <ul>
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/berita">Berita</Link></li>
            <li><Link href="/pengumuman">Pengumuman</Link></li>
            <li><Link href="/tentang">Tentang Kami</Link></li>
            <li><Link href="/kontak">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div className={`${footerStyles.footerCol} ${footerStyles.contactCol}`}>
          <h4>Kontak</h4>
          <div className={footerStyles.contactItem}>
            <i className="fas fa-map-marker-alt"></i>
            <p>Jl. Pendidikan Raya No.1<br />Jakarta Selatan 12345</p>
          </div>
          <div className={footerStyles.contactItem}>
            <i className="fas fa-envelope"></i>
            <p>lppm@asaindo.ac.id</p>
          </div>
          <div className={footerStyles.contactItem}>
            <i className="fas fa-phone"></i>
            <p>+62 21 2345 6789</p>
          </div>
        </div>
      </div>

      <div className={footerStyles.footerBottom}>
        <p className={footerStyles.copyrightText}>© 2025 LPPM Asaindo. All rights reserved.</p>
        <div className={footerStyles.footerLinksBottom}>
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}