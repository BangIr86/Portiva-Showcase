import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Sparkles,
  Monitor,
  Users,
  GraduationCap,
  ArrowRight,
  Target,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Award,
  Layers,
  Code2,
  Palette,
  Network,
  ChevronRight,
} from "lucide-react";

// Default content fallback in case database is empty or error
const defaultLandingData = {
  hero: {
    badge: "Workshop Inovasi Digital & Personal Branding Siswa SMK",
    title1: "Showcase Portofolio Digital",
    title2: "Siswa SMK Siap Kerja",
    desc: "Program inkubasi dan pameran karya digital berbasis Canva Site yang membekali siswa SMK dengan personal branding berstandar industri, portofolio interaktif, dan kesiapan kompetensi kerja nyata."
  },
  details: [
    { title: "Waktu Pelaksanaan", detail: "Oktober 2025", sub: "Workshop Intensif 3 Hari", iconName: "Calendar" },
    { title: "Tempat / Media", detail: "Lab Multimedia & Web", sub: "SMK Pusat Keunggulan", iconName: "MapPin" },
    { title: "Sasaran Peserta", detail: "Siswa Kelas XII", sub: "Persiapan PKL & Kerja", iconName: "Target" },
    { title: "Platform Karya", detail: "Canva Site + Live Hosting", sub: "Domain responsif interaktif", iconName: "Monitor" }
  ],
  rundown: [
    {
      hari: "Hari Ke-1",
      judul: "Personal Branding & Pondasi Portofolio",
      poin: [
        "Prinsip personal branding di era digital & industri 4.0",
        "Pemetaan skill, keahlian khusus, dan sertifikasi",
        "Pengenalan Canva Site builder & struktur halaman web"
      ]
    },
    {
      hari: "Hari Ke-2",
      judul: "Kurasi Karya & Produksi Website",
      poin: [
        "Kurasi 3-5 karya unggulan sesuai bidang keahlian",
        "Desain layout interaktif, tipografi, dan navigasi",
        "Penyusunan studi kasus proyek (Problem-Solution)"
      ]
    },
    {
      hari: "Hari Ke-3",
      judul: "Finalisasi, Kurasi, & Showcase Digital",
      poin: [
        "Publishing Canva Site ke domain publik",
        "Kurasi dan review oleh guru pembimbing & mentor",
        "Entri data ke portal showcase PORTIVA untuk siap diakses"
      ]
    }
  ],
  fasilitas: [
    { title: "Modul & Template", desc: "Template Canva Site premium yang siap dikustomisasi sesuai identitas siswa.", iconName: "FileText" },
    { title: "Akses Lab Komputer", desc: "Perangkat PC spesifikasi multimedia dan koneksi internet stabil.", iconName: "Monitor" },
    { title: "Mentoring Industri", desc: "Bimbingan langsung dari praktisi teknologi dan desain komunikasi visual.", iconName: "Briefcase" },
    { title: "Kurasi & Verifikasi", desc: "Sistem approval portofolio untuk memastikan kualitas standar industri.", iconName: "ShieldCheck" }
  ],
  jurusan: [
    { nama: "Rekayasa Perangkat Lunak (RPL)", fokus: "Web Application, UI/UX Design, REST API, Database Management, Mobile Apps.", badge: "Software Engineering", iconName: "Code2" },
    { nama: "Desain Komunikasi Visual (DKV)", fokus: "Branding & Identity, Motion Graphic, Ilustrasi Digital, Social Media Assets, Packaging.", badge: "Visual Design", iconName: "Palette" },
    { nama: "Teknik Komputer & Jaringan (TKJ)", fokus: "Network Infrastructure, Server Administration, Cloud Computing, Cyber Security, Mikrotik.", badge: "IT Infrastructure", iconName: "Network" }
  ]
};

// Helper for dynamic icons
const iconMap: Record<string, React.ElementType> = {
  Calendar, MapPin, Target, Monitor, FileText, Briefcase, ShieldCheck, Code2, Palette, Network
};

export default function LandingPage() {
  const [totalKarya, setTotalKarya] = useState(0);
  const [totalJurusan, setTotalJurusan] = useState(0);
  const [content, setContent] = useState(defaultLandingData);

  useEffect(() => {
    async function fetchData() {
      // Fetch stats
      const { data: portos } = await supabase.from("portfolios").select("jurusan").eq("is_approved", true);
      if (portos) {
        setTotalKarya(portos.length);
        setTotalJurusan(new Set(portos.map((d) => d.jurusan)).size);
      }

      // Fetch dynamic content
      const { data: settings } = await supabase.from("app_settings").select("landing_content").eq("id", 1).single();
      if (settings?.landing_content) {
        // Merge with default to ensure no missing keys if user deletes them
        setContent({ ...defaultLandingData, ...settings.landing_content });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide font-extrabold">
                PORTIVA
              </span>
              <span className="text-xs text-slate-500 block -mt-1 font-normal">
                SMK Showcase
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
            >
              Info Kegiatan
            </Link>
            <Link
              to="/showcase"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Galeri Portofolio
            </Link>
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-blue-600/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-inner">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{content.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">{content.hero.title1}</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                {content.hero.title2}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed">
              {content.hero.desc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/showcase"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Buka Galeri Portofolio (Page 2)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#kelengkapan"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
              >
                Kelengkapan Kegiatan
              </a>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-slate-400 hover:text-cyan-400 font-medium text-sm transition-colors"
              >
                <span>+ Tambah Link Porto (Admin)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{totalKarya}</p>
              <p className="text-slate-400 text-xs sm:text-sm">Portofolio Terkurasi</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">Canva Site</p>
              <p className="text-slate-400 text-xs sm:text-sm">Platform Website Interaktif</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{totalJurusan > 0 ? `${totalJurusan} Jurusan` : "Multi-Jurusan"}</p>
              <p className="text-slate-400 text-xs sm:text-sm">Kolaborasi Antar Bidang</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Kelengkapan Kegiatan ── */}
      <section id="kelengkapan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        
        {/* 1. Detail Parameter Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {content.details.map((item, i) => {
            const IconComponent = iconMap[item.iconName as string] || Target;
            return (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{item.title}</p>
                <p className="text-white font-bold text-lg mt-1">{item.detail}</p>
                <p className="text-slate-400 text-xs mt-1">{item.sub}</p>
              </div>
            );
          })}
        </div>

        {/* 2. Rundown & Tahapan Kegiatan */}
        <div className="mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Rundown &amp; Alur Pelaksanaan Kegiatan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.rundown.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                    {step.hari}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-4">{step.judul}</h4>
                  <ul className="space-y-2.5 text-sm text-slate-400">
                    {step.poin.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Fasilitas & Kelengkapan Pendukung */}
        <div className="mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            Fasilitas &amp; Kelengkapan Workshop
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.fasilitas.map((item, i) => {
              const IconComponent = iconMap[item.iconName as string] || FileText;
              return (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70">
                  <div className="p-2.5 rounded-xl bg-slate-800 w-fit mb-3 text-cyan-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-semibold text-base mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Program Keahlian / Jurusan Peserta */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            Program Keahlian Terlibat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.jurusan.map((jurusan, i) => {
              const IconComponent = iconMap[jurusan.iconName as string] || Monitor;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800 text-cyan-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {jurusan.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{jurusan.nama}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-slate-300 font-medium">Fokus Karya:</span> {jurusan.fokus}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section CTA Menuju Page 2 ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Page 2: Galeri Portofolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Lihat Karya Portofolio Siswa Sekarang
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Jelajahi karya Canva Site interaktif lengkap dengan fitur rotasi otomatis 10 detik, live viewer responsif, dan filter per jurusan.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/showcase"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                <span>Buka Showcase Portofolio</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
