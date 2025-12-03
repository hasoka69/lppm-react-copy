// resources/js/pages/admin/Dashboard.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Footer from '@/components/footer';
import styles from '../../../css/dashboard_admin.module.css';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

const kelolaItems = [
  {
    title: 'Kelola Usulan',
    subtitle: 'Penelitian',
  },
  {
    title: 'Kelola Usulan',
    subtitle: 'Pengabdian',
  },
  {
    title: 'Kelola Luaran',
    subtitle: 'PKM, Buku, Jurnal, HKI',
  }
];

const statsData = [
  {
    title: 'Total Penelitian Masuk',
    value: '247',
    percentage: '↑2%',
    description: 'dari bulan lalu',
  },
  {
    title: 'Total Pengabdian Masuk',
    value: '189',
    percentage: '↑5%',
    description: 'dari bulan lalu',
  },
  {
    title: 'Total Dosen Terdaftar',
    value: '524',
    percentage: '↑5%',
    description: 'dari bulan lalu',
  },
  {
    title: 'Total Luaran',
    value: '1,342',
    percentage: '↑8%',
    description: 'dari bulan lalu',
  }
];

const activitiesData = [
  {
    title: 'Usulan Penelitian Baru Diajukan',
    description: 'Dr. Ahmad Fauzi mengajukan penelitian tentang AI dalam Pendidikan',
    time: '5 menit yang lalu'
  },
  {
    title: 'Pengabdian Menunggu Review',
    description: 'Prof. Siti Nurhaliza – Program Pemberdayaan Masyarakat Desa',
    time: '1 jam yang lalu'
  },
  {
    title: 'HKI Baru Diterbitkan',
    description: 'Dr. Budi Santoso mendaftarkan HKI untuk sistem monitoring kesehatan',
    time: '2 jam yang lalu'
  },
  {
    title: 'Dosen Baru Terdaftar',
    description: 'Dr. Maria Wijaya bergabung dari Fakultas Teknik Informatika',
    time: '3 jam yang lalu'
  }
];

const adminToolsData = {
  usulan: [
    { label: 'Penelitian', value: 247 },
    { label: 'Pengabdian', value: 189 },
    { label: 'Perbaikan', value: 32 },
    { label: 'Review', value: 85 },
    { label: 'Penetapan Pemenang', value: 15 }
  ],
  luaran: [
    { label: 'Buku', value: 342 },
    { label: 'HKI', value: 116 }
  ]
};

export default function DashboardAdmin() {
  return (
    <AppLayout breadcrumbs={breadcrumbs} hideSidebar={true}>
      <Head title="Dashboard Admin" />

      <div className={styles.dashboardContainer}>

        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.welcomeHeader}>
            <h1 className={styles.welcomeTitle}>Selamat Datang, Super Admin Asaindo</h1>
            <p className={styles.welcomeSubtitle}>
              Kelola seluruh data penelitian, pengabdian, user dosen, serta luaran melalui dashboard ini.
            </p>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            {kelolaItems.map((item, index) => (
              <div key={index} className={styles.quickActionItem}>
                <div className={styles.actionIcon}>
                  {index === 0 && '🔬'}
                  {index === 1 && '🤝'}
                  {index === 2 && '🎖️'}
                </div>
                <div className={styles.actionContent}>
                  <div className={styles.actionTitle}>{item.title}</div>
                  <div className={styles.actionSubtitle}>{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className={styles.statsGridCompact}>
          {statsData.map((stat, index) => (
            <div key={index} className={styles.statCardCompact}>
              <div className={styles.statContentCompact}>
                {/* Content di kiri */}
                <div className={styles.statTextContent}>
                  <div className={styles.statTitleCompact}>{stat.title}</div>
                  <div className={styles.statValueCompact}>{stat.value}</div>
                  <div className={styles.statInfoCompact}>
                    <span className={styles.statPercentageCompact}>{stat.percentage}</span>
                    <span className={styles.statDescriptionCompact}>{stat.description}</span>
                  </div>
                </div>

                {/* Icon di kanan */}
                <div className={styles.statIcon}>
                  {index === 0 && '🔬'} {/* Penelitian */}
                  {index === 1 && '🤝'} {/* Pengabdian */}
                  {index === 2 && '👨‍🏫'} {/* Dosen */}
                  {index === 3 && '🎖️'} {/* Luaran */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainContent}>

          {/* Left Column - Stats & Activities */}
          <div className={styles.leftColumn}>

            {/* Recent Activities */}
            <div className={styles.activitiesSection}>
              <div className={styles.sectionHeaderCompact}>
                <h2 className={styles.sectionTitleCompact}>Aktivitas Terbaru</h2>
                <button className={styles.seeAllButtonCompact}>Lihat Semua</button>
              </div>

              <div className={styles.activitiesListCompact}>
                {activitiesData.map((activity, index) => (
                  <div key={index} className={styles.activityItemCompact}>
                    <div className={styles.activityBullet}></div>
                    <div className={styles.activityContentCompact}>
                      <h4 className={styles.activityTitleCompact}>{activity.title}</h4>
                      <p className={styles.activityDescriptionCompact}>{activity.description}</p>
                      <span className={styles.activityTimeCompact}>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Tools */}
            <div className={styles.adminTools}>
              <h2 className={styles.sectionTitleCompact}>Admin Tools</h2>

              <div className={styles.toolsSectionCompact}>
                <h3 className={styles.toolsSubtitleCompact}>Management Usulan</h3>
                <div className={styles.toolsListCompact}>
                  {adminToolsData.usulan.map((item, index) => (
                    <div key={index} className={styles.toolItemCompact}>
                      <span className={styles.toolLabelCompact}>{item.label}</span>
                      <span className={styles.toolValueCompact}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.toolsSectionCompact}>
                <h3 className={styles.toolsSubtitleCompact}>Management Luaran</h3>
                <div className={styles.toolsListCompact}>
                  {adminToolsData.luaran.map((item, index) => (
                    <div key={index} className={styles.toolItemCompact}>
                      <span className={styles.toolLabelCompact}>{item.label}</span>
                      <span className={styles.toolValueCompact}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>

            {/* Status Overview */}
            <div className={styles.statusOverview}>
              <h2 className={styles.sectionTitleCompact}>Status Usulan Terbaru</h2>

              <div className={styles.progressSectionCompact}>
                <div className={styles.progressCircleCompact}>
                  <div className={styles.progressPercentageCompact}>75%</div>
                </div>
                <div className={styles.progressLabelCompact}>Disetujui</div>
              </div>

              <div className={styles.statusListCompact}>
                <div className={styles.statusItemCompact}>
                  <span className={styles.statusNameCompact}>Menunggu Review</span>
                  <span className={styles.statusCountCompact}>28</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <span className={styles.statusNameCompact}>Dalam Proses</span>
                  <span className={styles.statusCountCompact}>42</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <span className={styles.statusNameCompact}>Disetujui</span>
                  <span className={styles.statusCountCompact}>156</span>
                </div>
              </div>

              <button className={styles.detailButtonCompact}>Lihat Detail Usulan</button>
            </div>

            {/* Management Dosen */}
            <div className={styles.managementDosen}>
              <h3 className={styles.managementTitleCompact}>Manajemen Dosen</h3>

              <div className={styles.managementListCompact}>
                <div className={styles.managementItemCompact}>
                  <div className={styles.managementItemContent}>
                    <div className={styles.managementText}>
                      <div className={styles.managementMainText}>Admin LPPM</div>
                      <div className={styles.managementSubText}>Super Administrator</div>
                    </div>
                  </div>
                </div>

                <div className={styles.managementItemCompact}>
                  <div className={styles.managementItemContent}>
                    <div className={styles.managementText}>
                      <div className={styles.managementMainText}>Kelola Data Dosen</div>
                    </div>
                    <div className={styles.managementArrow}>&gt;</div>
                  </div>
                </div>

                <div className={styles.managementItemCompact}>
                  <div className={styles.managementItemContent}>
                    <div className={styles.managementText}>
                      <div className={styles.managementMainText}>Tambah Dosen Baru</div>
                    </div>
                    <div className={styles.managementArrow}>&gt;</div>
                  </div>
                </div>

                <div className={styles.managementItemCompact}>
                  <div className={styles.managementItemContent}>
                    <div className={styles.managementText}>
                      <div className={styles.managementMainText}>Sinkronisasi SINTA</div>
                    </div>
                    <div className={styles.managementArrow}>&gt;</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </AppLayout>
  );
}