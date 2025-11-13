import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useEffect } from 'react';
import homeStyles from '../../css/home.module.css'; // Ganti nama
import NewsSection from '../components/NewsSection';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function Welcome() {
  const { auth, setting } = usePage<SharedData>().props;

  const primaryColor = setting?.warna || '#0ea5e9';
  const primaryForeground = '#ffffff';

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--primary-foreground', primaryForeground);
    document.documentElement.style.setProperty('--color-primary-foreground', primaryForeground);
  }, [primaryColor, primaryForeground]);

  return (
    <>
      <Head title="LPPM | Lembaga Penelitian Asa" />

      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className={homeStyles.heroLppm} style={{ marginTop: '95px' }}>
        <div className={homeStyles.heroOverlay}></div>
        <div className={homeStyles.heroContainerLppm}>
          <div className={homeStyles.heroTextContent}>
            <h1 className={homeStyles.welcomeLppmTitle}>Selamat Datang di LPPM Asaindo</h1>
            <p className={homeStyles.heroTagline}>Meneliti untuk Berkarya, Mengabdi untuk Negeri.</p>
            <a href="#" className={homeStyles.btnAjukanSekarang}>
              Ajukan Sekarang
              <span className={homeStyles.arrowIcon}>›</span>
            </a>
          </div>
          <div className={homeStyles.heroImageLppm}></div>
        </div>

        <div className={homeStyles.featureBoxesContainer}>
          <div className={homeStyles.featureBox}>
            <div className={homeStyles.boxIcon}>
              <img src="/image/pengajuan.png" alt="Ikon Pengajuan Usulan" />
            </div>
            <p>Pengajuan Usulan</p>
          </div>
          <div className={homeStyles.featureBox}>
            <div className={homeStyles.boxIcon}>
              <img src="/image/review.png" alt="Ikon Review Usulan" />
            </div>
            <p>Review Usulan</p>
          </div>
          <div className={homeStyles.featureBox}>
            <div className={homeStyles.boxIcon}>
              <img src="/image/pelaporan.png" alt="Ikon Pelaporan Kegiatan" />
            </div>
            <p>Pelaporan Kegiatan</p>
          </div>
        </div>
      </section>

      <NewsSection />

      {/* Pengumuman Section */}
      <section className={homeStyles.latestAnnouncementsLppm}>
        <div className={homeStyles.containerLppm}>
          <div className={homeStyles.announcementHeaderIcon}>
            <i className="fas fa-check-circle"></i>
          </div>

          <h2 className={homeStyles.sectionTitle}>Pengumuman Terbaru</h2>
          <p className={homeStyles.sectionSubtitle}>Informasi penting dan pembaruan resmi dari LPPM Asaindo.</p>

          <div className={homeStyles.announcementCardsWrapper}>
            <div className={homeStyles.announcementCard}>
              <div className={`${homeStyles.cardIconWrapper} ${homeStyles.bgBlue}`}>
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className={homeStyles.cardContent}>
                <div className={homeStyles.cardMeta}>
                  <span className={homeStyles.date}>16 Januari 2025</span>
                  <span className={`${homeStyles.tag} ${homeStyles.tagBlue}`}>Penting</span>
                </div>
                <h3 className={homeStyles.cardAnnouncementTitle}>Pembukaan Pendaftaran Hibah Penelitian 2025</h3>
                <p className={homeStyles.cardAnnouncementDescription}>
                  Pendaftaran hibah penelitian internal tahun 2025 dibuka mulai 20 Januari hingga 20 Februari 2025. Informasi lengkap tersedia di portal BIMA.
                </p>
              </div>
            </div>

            <div className={homeStyles.announcementCard}>
              <div className={`${homeStyles.cardIconWrapper} ${homeStyles.bgGreen}`}>
                <i className="fas fa-sync-alt"></i>
              </div>
              <div className={homeStyles.cardContent}>
                <div className={homeStyles.cardMeta}>
                  <span className={homeStyles.date}>14 Januari 2025</span>
                  <span className={`${homeStyles.tag} ${homeStyles.tagGreen}`}>Update</span>
                </div>
                <h3 className={homeStyles.cardAnnouncementTitle}>Update Sistem V2.1</h3>
                <p className={homeStyles.cardAnnouncementDescription}>
                  Sistem BIMA telah diperbarui dengan fitur notifikasi real-time dan dashboard analitik yang lebih komprehensif untuk monitoring penelitian.
                </p>
              </div>
            </div>

            <div className={homeStyles.announcementCard}>
              <div className={`${homeStyles.cardIconWrapper} ${homeStyles.bgOrange}`}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={homeStyles.cardContent}>
                <div className={homeStyles.cardMeta}>
                  <span className={homeStyles.date}>12 Januari 2025</span>
                  <span className={`${homeStyles.tag} ${homeStyles.tagOrange}`}>Deadline</span>
                </div>
                <h3 className={homeStyles.cardAnnouncementTitle}>Batas Akhir Laporan Penelitian 2024</h3>
                <p className={homeStyles.cardAnnouncementDescription}>
                  Reminder untuk semua peneliti yang memiliki hibah penelitian 2024, batas akhir pengumpulan laporan akhir adalah 31 Januari 2025.
                </p>
              </div>
            </div>

            <div className={homeStyles.announcementCard}>
              <div className={`${homeStyles.cardIconWrapper} ${homeStyles.bgPurple}`}>
                <i className="fas fa-building"></i>
              </div>
              <div className={homeStyles.cardContent}>
                <div className={homeStyles.cardMeta}>
                  <span className={homeStyles.date}>10 Januari 2025</span>
                  <span className={`${homeStyles.tag} ${homeStyles.tagPurple}`}>Workshop</span>
                </div>
                <h3 className={homeStyles.cardAnnouncementTitle}>Workshop Penulisan Proposal Penelitian</h3>
                <p className={homeStyles.cardAnnouncementDescription}>
                  Workshop pelatihan penulisan proposal penelitian yang efektif akan diselenggarakan pada 25 Januari 2025. Daftar melalui sistem BIMA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={homeStyles.aboutAsaLppm}>
        <div className={`${homeStyles.containerLppm} ${homeStyles.textCenter}`}>
          <h2 className={homeStyles.sectionTitleAbout}>Apa itu LPPM ASAINDO?</h2>
          <p className={homeStyles.sectionSubtitleAbout}>
            Sistem pintar yang memudahkan pengelolaan penelitian dan pengabdian masyarakat.
          </p>

          <div className={homeStyles.aboutContentWrapper}>
            <div className={homeStyles.aboutFeaturesList}>
              <div className={homeStyles.featureItem}>
                <div className={`${homeStyles.featureIconBox} ${homeStyles.bgBlueDark}`}>
                  <i className="fas fa-cubes"></i>
                </div>
                <div className={homeStyles.featureText}>
                  <h4>Platform Terpadu</h4>
                  <p>Mengelola penelitian dan pengabdian dalam satu sistem yang terintegrasi dan mudah diakses.</p>
                </div>
              </div>

              <div className={homeStyles.featureItem}>
                <div className={`${homeStyles.featureIconBox} ${homeStyles.bgGreenLight}`}>
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className={homeStyles.featureText}>
                  <h4>Mudah Digunakan</h4>
                  <p>Pengajuan, persetujuan, dan pelaporan bisa dilakukan online dengan antarmuka yang intuitif.</p>
                </div>
              </div>

              <div className={homeStyles.featureItem}>
                <div className={`${homeStyles.featureIconBox} ${homeStyles.bgOrangeLight}`}>
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className={homeStyles.featureText}>
                  <h4>Transparan & Efisien</h4>
                  <p>Pantau progres setiap kegiatan secara real-time dengan dashboard yang komprehensif.</p>
                </div>
              </div>

              <div className={homeStyles.featureItem}>
                <div className={`${homeStyles.featureIconBox} ${homeStyles.bgPurpleLight}`}>
                  <i className="fas fa-lock"></i>
                </div>
                <div className={homeStyles.featureText}>
                  <h4>Data Aman</h4>
                  <p>Semua arsip tersimpan rapi dan dapat diakses sesuai kebijakan lembaga dengan keamanan tinggi.</p>
                </div>
              </div>
            </div>

            <div className={homeStyles.aboutVisualDashboard}>
              <div className={homeStyles.dashboardCard}>
                <div className={`${homeStyles.dashboardHeader} ${homeStyles.bgGradientBlue}`}>
                  <h4 className={homeStyles.dashboardTitle}>Dashboard BIMA</h4>
                  <div className={homeStyles.dashboardStats}>
                    <div className={homeStyles.statItem}>
                      <span className={homeStyles.statNumber}>24</span>
                      <span className={homeStyles.statLabel}>Penelitian Aktif</span>
                    </div>
                    <div className={homeStyles.statItem}>
                      <span className={homeStyles.statNumber}>18</span>
                      <span className={homeStyles.statLabel}>Pengabdian</span>
                    </div>
                    <div className={`${homeStyles.statItem} ${homeStyles.completionStat}`}>
                      <span className={homeStyles.statNumber}>95%</span>
                      <span className={homeStyles.statLabel}>Completion</span>
                    </div>
                  </div>
                </div>

                <div className={homeStyles.dashboardProgressList}>
                  <div className={`${homeStyles.progressItem} ${homeStyles.approved}`}>
                    <i className={`fas fa-check-circle ${homeStyles.textGreen}`}></i>
                    <div className={homeStyles.progressText}>
                      <p className={homeStyles.progressTitle}>Proposal Disetujui</p>
                      <span className={homeStyles.progressSubtitle}>Penelitian AI Education</span>
                    </div>
                    <span className={`${homeStyles.progressStatus} ${homeStyles.textGreen}`}>Selesai</span>
                  </div>

                  <div className={`${homeStyles.progressItem} ${homeStyles.reviewing}`}>
                    <i className={`fas fa-clock ${homeStyles.textOrange}`}></i>
                    <div className={homeStyles.progressText}>
                      <p className={homeStyles.progressTitle}>Review Berlangsung</p>
                      <span className={homeStyles.progressSubtitle}>Pengabdian UMKM Digital</span>
                    </div>
                    <span className={`${homeStyles.progressStatus} ${homeStyles.textOrange}`}>Progress</span>
                  </div>

                  <div className={`${homeStyles.progressItem} ${homeStyles.new}`}>
                    <i className={`fas fa-plus-circle ${homeStyles.textBlue}`}></i>
                    <div className={homeStyles.progressText}>
                      <p className={homeStyles.progressTitle}>Proposal Baru</p>
                      <span className={homeStyles.progressSubtitle}>Teknologi Berkelanjutan</span>
                    </div>
                    <span className={`${homeStyles.progressStatus} ${homeStyles.textBlue}`}>Baru</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={homeStyles.howItWorksLppm}>
        <div className={`${homeStyles.containerLppm} ${homeStyles.textCenter}`}>
          <h2 className={homeStyles.sectionTitleHow}>Bagaimana LPPM Asaindo Bekerja?</h2>
          <p className={homeStyles.sectionSubtitleHow}>
            Proses kerja LPPM Asaindo dirancang agar setiap kegiatan penelitian dan pengabdian masyarakat
            berjalan efektif, transparan, dan terdokumentasi dengan baik.
          </p>

          <div className={homeStyles.processCardsWrapper}>
            <div className={homeStyles.processCard}>
              <div className={homeStyles.cardHeaderProcess}>
                <div className={homeStyles.stepNumber}>1</div>
                <div className={`${homeStyles.iconCircle} ${homeStyles.bgBlueDark}`}>
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
              <h3 className={homeStyles.processTitle}>Pengajuan Proposal</h3>
              <p className={homeStyles.processDescription}>
                Dosen atau peneliti mengunggah proposal penelitian dan pengabdian masyarakat secara daring melalui sistem LPPM Asaindo.
              </p>
            </div>

            <div className={homeStyles.processCard}>
              <div className={homeStyles.cardHeaderProcess}>
                <div className={homeStyles.stepNumber}>2</div>
                <div className={`${homeStyles.iconCircle} ${homeStyles.bgBlueDark}`}>
                  <i className="fas fa-clipboard-check"></i>
                </div>
              </div>
              <h3 className={homeStyles.processTitle}>Review & Persetujuan</h3>
              <p className={homeStyles.processDescription}>
                Tim LPPM melakukan evaluasi dan validasi proposal sebelum kegiatan disetujui untuk dijalankan.
              </p>
            </div>

            <div className={homeStyles.processCard}>
              <div className={homeStyles.cardHeaderProcess}>
                <div className={homeStyles.stepNumber}>3</div>
                <div className={`${homeStyles.iconCircle} ${homeStyles.bgBlueDark}`}>
                  <i className="fas fa-sitemap"></i>
                </div>
              </div>
              <h3 className={homeStyles.processTitle}>Pelaksanaan Kegiatan</h3>
              <p className={homeStyles.processDescription}>
                Kegiatan dilaksanakan dengan pendampingan dari LPPM untuk memastikan kesesuaian antara rencana dan implementasi.
              </p>
            </div>

            <div className={homeStyles.processCard}>
              <div className={homeStyles.cardHeaderProcess}>
                <div className={homeStyles.stepNumber}>4</div>
                <div className={`${homeStyles.iconCircle} ${homeStyles.bgBlueDark}`}>
                  <i className="fas fa-edit"></i>
                </div>
              </div>
              <h3 className={homeStyles.processTitle}>Pelaporan & Dokumentasi</h3>
              <p className={homeStyles.processDescription}>
                Seluruh hasil dan dokumentasi kegiatan diunggah ke sistem agar tersimpan rapi dan mudah diakses untuk evaluasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </>
  );
}
