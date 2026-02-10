import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Activity,
  Layers,
  Zap,
  Lock,
  BarChart3,
  Calendar,
  Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Welcome = ({ auth, pengumuman = [], berita = [] }: { auth: any, pengumuman: any[], berita: any[] }) => {
  const { setting } = usePage<SharedData>().props;
  const [scrolled, setScrolled] = useState(false);
  // ... existing code ...


  const primaryColor = setting?.warna || '#0ea5e9';
  const primaryForeground = '#ffffff';

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--primary-foreground', primaryForeground);
    document.documentElement.style.setProperty('--color-primary-foreground', primaryForeground);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [primaryColor, primaryForeground]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Head title="LPPM | Lembaga Penelitian Asa" />

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-95"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse duration-[10000ms]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse duration-[7000ms]"></div>
          <div className="absolute inset-0 bg-[url('/image/grid-pattern.svg')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center pb-32">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span className="text-sm font-medium text-blue-200">Portal Resmi LPPM Asaindo</span>
            </div>

            <div className="flex justify-center animate-in fade-in zoom-in-95 duration-1000 delay-50">
              <div className="p-6 bg-white rounded-3xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] ring-4 ring-white/10">
                <img src="/image/logo-asaindo.png" alt="Logo LPPM" className="h-20 md:h-24 w-auto" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight animate-in fade-in zoom-in-95 duration-1000 delay-100">
              Meneliti untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Berkarya</span>, <br />
              Mengabdi untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Negeri</span>.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Platform terintegrasi untuk pengelolaan penelitian dan pengabdian masyarakat yang modern, transparan, dan akuntabel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Link href="/login" className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Ajukan Proposal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="#panduan" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
                Pelajari Panduan
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Cards Bottom */}
        <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-20 px-6 hidden lg:block">
          <div className="container mx-auto grid grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Pengajuan Usulan", desc: "Submit proposal penelitian & pengabdian secara online", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Shield, title: "Review Terpadu", desc: "Proses seleksi dan validasi oleh reviewer ahli", color: "text-indigo-500", bg: "bg-indigo-50" },
              { icon: TrendingUp, title: "Monitoring Real-time", desc: "Pantau kemajuan kegiatan melalui dashboard interaktif", color: "text-purple-500", bg: "bg-purple-50" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className={cn("p-4 rounded-xl", item.bg)}>
                  <item.icon className={cn("w-8 h-8", item.color)} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-white pt-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { count: "150+", label: "Judul Penelitian", icon: BookOpen },
              { count: "85", label: "Pengabdian", icon: Users },
              { count: "12", label: "HAKI Terdaftar", icon: Award },
              { count: "98%", label: "Tingkat Penyelesaian", icon: Activity },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                <h3 className="text-4xl font-extrabold text-slate-900 mb-2">{stat.count}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & NEWS SECTION */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 space-y-20">

          {/* PENGUMUMAN SECTION (GRID OF 3) */}
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Informasi Terkini</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Pengumuman Terbaru</h2>
              <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pengumuman.length > 0 ? (
                pengumuman.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Admin LPPM</span>
                        <span className="text-xs font-bold text-slate-700">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-slate-700 leading-relaxed text-sm line-clamp-6">
                      {item.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400">Belum ada pengumuman saat ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* BERITA SECTION (HORIZONTAL SLIDER) */}
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                  Berita & Artikel
                </h2>
                <p className="text-slate-500 mt-2">Kabar terbaru seputar kegiatan penelitian dan pengabdian.</p>
              </div>
              <Link href="/berita" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Slider Container */}
            <div className="relative group">
              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

              <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollPaddingLeft: '1.5rem', scrollPaddingRight: '1.5rem' }}>
                {berita.length > 0 ? (
                  berita.map((item: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/berita/${item.slug}`}
                      className="flex-shrink-0 w-[300px] md:w-[350px] snap-center bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
                    >
                      <div className="h-48 overflow-hidden relative">
                        {item.gambar ? (
                          <img src={`${item.gambar}`} alt={item.judul} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <FileText className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                          {item.kategori || 'Berita'}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 leading-snug mb-3 line-clamp-2 group-hover/card:text-indigo-600 transition-colors">
                          {item.judul}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                          {item.ringkasan || item.konten?.substring(0, 100).replace(/<[^>]*>/g, '') || 'Baca selengkapnya...'}
                        </p>
                        <span className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover/card:gap-2 transition-all">
                          Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Belum ada berita terbaru.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden text-center">
              <Link href="/berita" className="inline-flex items-center gap-2 text-indigo-600 font-bold">
                Lihat Semua Berita <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES / ABOUT SECTION */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 translate-x-32 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Sistem Manajemen Penelitian <br />
                <span className="text-blue-600">Terintegrasi & Cerdas</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                LPPM Asaindo hadir untuk menyederhanakan kompleksitas administrasi akademik. Dari pengajuan hingga pelaporan, semua terpusat dalam satu ekosistem digital.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Layers, title: "Platform Terpadu", desc: "Integrasi penuh antara penelitian dan pengabdian dalam satu dashboard." },
                  { icon: Zap, title: "Efisiensi Tinggi", desc: "Automasi alur kerja menyiankat waktu proses hingga 50%." },
                  { icon: Lock, title: "Keamanan Data", desc: "Enkripsi tingkat lanjut untuk melindungi kekayaan intelektual Anda." }
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{feat.title}</h4>
                      <p className="text-slate-500">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">Activity Overview</h4>
                    <p className="text-sm text-slate-500">Real-time system monitoring</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Proposals Reviewed", val: 75, color: "bg-blue-500" },
                    { label: "Ongoing Research", val: 45, color: "bg-indigo-500" },
                    { label: "Completed Projects", val: 90, color: "bg-emerald-500" }
                  ].map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-slate-600">{bar.label}</span>
                        <span className="text-slate-900">{bar.val}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className={cn("h-2.5 rounded-full", bar.color)} style={{ width: `${bar.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <span className="block font-bold text-slate-800">Analytics</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <span className="block font-bold text-slate-800">Schedule</span>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-900 text-white" id="panduan">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bagaimana Cara Kerjanya?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Alur kerja yang sederhana dan transparan untuk memudahkan setiap langkah penelitian Anda.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 -z-0"></div>

            {[
              { step: "01", title: "Ajukan Proposal", desc: "Upload dokumen usulan Anda melalui form online.", icon: FileText },
              { step: "02", title: "Proses Review", desc: "Reviewer menilai kelayakan dan substansi proposal.", icon: Shield },
              { step: "03", title: "Pelaksanaan", desc: "Jalankan kegiatan sesuai timeline dan anggaran.", icon: Activity },
              { step: "04", title: "Pelaporan", desc: "Submit laporan akhir dan luaran kegiatan.", icon: CheckCircle }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 group-hover:border-blue-500 group-hover:bg-blue-600 transition-all duration-300 shadow-xl">
                  <item.icon className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-slate-800 absolute -top-4 left-1/2 -translate-x-1/2 -z-10 opacity-50 select-none">{item.step}</span>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed px-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Welcome;
