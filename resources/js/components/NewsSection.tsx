import React from 'react';
import homeStyles from '../../css/home.module.css';

const NewsSection = () => {
    return (
        <section className={homeStyles.latestNewsLppm}>
            <div className={homeStyles.containerLppm}>
                <h2 className={homeStyles.sectionTitle}>Berita Terbaru</h2>
                <p className={homeStyles.sectionSubtitle}>
                    Kabar dan informasi terkini seputar kegiatan penelitian dan pengabdian masyarakat Asaindo.
                </p>

                <div className={homeStyles.newsCardsWrapper}>
                    <div className={`${homeStyles.newsCard} w-full`}>
                        <div className={`${homeStyles.cardHeader} ${homeStyles.bgBluePrimary}`}>
                            <h3>Penelitian Terbaru</h3>
                        </div>
                        <div className={homeStyles.cardBody}>
                            <h4 className={homeStyles.cardTitle}>Penelitian Inovasi Teknologi Pendidikan</h4>
                            <p className={homeStyles.cardDescription}>
                                Tim peneliti LPPM Asaindo berhasil mengembangkan platform pembelajaran digital yang meningkatkan efektivitas belajar mengajar hingga 40%.
                            </p>
                        </div>
                        <div className={homeStyles.cardFooter}>
                            <span className={homeStyles.newsDate}>15 Januari 2025</span>
                            <a href="#" className={homeStyles.readMore}>Baca Selengkapnya →</a>
                        </div>
                    </div>

                    <div className={homeStyles.newsCard}>
                        <div className={`${homeStyles.cardHeader} ${homeStyles.bgBlueSecondary}`}>
                            <h3>Pengabdian Masyarakat</h3>
                        </div>
                        <div className={homeStyles.cardBody}>
                            <h4 className={homeStyles.cardTitle}>Program Pemberdayaan UMKM Digital</h4>
                            <p className={homeStyles.cardDescription}>
                                Kegiatan pengabdian masyarakat yang membantu 200+ UMKM lokal untuk go digital dan meningkatkan penjualan online mereka.
                            </p>
                        </div>
                        <div className={homeStyles.cardFooter}>
                            <span className={homeStyles.newsDate}>12 Januari 2025</span>
                            <a href="#" className={homeStyles.readMore}>Baca Selengkapnya →</a>
                        </div>
                    </div>

                    <div className={homeStyles.newsCard}>
                        <div className={`${homeStyles.cardHeader} ${homeStyles.bgBlueTertiary}`}>
                            <h3>Kolaborasi Riset</h3>
                        </div>
                        <div className={homeStyles.cardBody}>
                            <h4 className={homeStyles.cardTitle}>Kolaborasi Riset Internasional</h4>
                            <p className={homeStyles.cardDescription}>
                                LPPM Asaindo menjalin kerjasama penelitian dengan universitas terkemuka di Asia Tenggara untuk pengembangan teknologi berkelanjutan.
                            </p>
                        </div>
                        <div className={homeStyles.cardFooter}>
                            <span className={homeStyles.newsDate}>10 Januari 2025</span>
                            <a href="#" className={homeStyles.readMore}>Baca Selengkapnya →</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;