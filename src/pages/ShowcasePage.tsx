import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Loader2,
  FolderOpen,
  Monitor,
  Users,
  Sparkles,
  GraduationCap,
  Filter,
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Globe,
  Info,
} from "lucide-react";

interface Portfolio {
  id: number;
  nama: string;
  jurusan: string;
  canva_url: string;
  deskripsi: string;
  is_approved: boolean;
}

const AUTO_SLIDE_INTERVAL = 10_000; // 10 detik

function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("is_approved", true)
        .order("id", { ascending: true });

      if (!cancelled) {
        setPortfolios(error ? [] : ((data as Portfolio[]) ?? []));
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { portfolios, loading };
}

function useAutoSlide(
  total: number,
  setIdx: Dispatch<SetStateAction<number>>,
  playing: boolean
) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paused = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    if (!playing || total === 0) return;
    timer.current = setInterval(() => {
      if (!paused.current) {
        setIdx((p) => (p + 1) % total);
      }
    }, AUTO_SLIDE_INTERVAL);
  }, [playing, total, setIdx, clear]);

  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  const pause = useCallback(() => {
    paused.current = true;
  }, []);

  const resume = useCallback(() => {
    paused.current = false;
  }, []);

  return { pause, resume };
}

function getCanvaEmbedInfo(url: string) {
  if (!url) return { embedUrl: "", isBlockedSite: false, isEmbedUrl: false };
  let trimmed = url.trim();

  // Jika input berupa tag HTML iframe (<iframe src="..."), ekstrak link src-nya
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) {
    trimmed = iframeMatch[1];
  }

  // Domain *.my.canva.site atau *.canva.site memblokir iframe via X-Frame-Options: SAMEORIGIN
  if (trimmed.includes(".canva.site")) {
    return { embedUrl: trimmed, isBlockedSite: true, isEmbedUrl: false };
  }

  // Format link Canva design biasa -> ubah jadi format embed resmi (/view?embed)
  if (trimmed.includes("canva.com/design/")) {
    let clean = trimmed.split("?")[0].replace(/\/edit$|\/watch$/, "/view");
    if (!clean.endsWith("/view")) clean += "/view";
    return { embedUrl: `${clean}?embed`, isBlockedSite: false, isEmbedUrl: true };
  }

  return { embedUrl: trimmed, isBlockedSite: false, isEmbedUrl: false };
}

export default function ShowcasePage() {
  const { portfolios, loading } = usePortfolios();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [search, setSearch] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const viewerRef = useRef<HTMLDivElement>(null);

  const { pause, resume } = useAutoSlide(
    portfolios.length,
    setActiveIndex,
    isPlaying
  );

  const goPrev = useCallback(() => {
    setActiveIndex((p) => (p === 0 ? portfolios.length - 1 : p - 1));
  }, [portfolios.length]);

  const goNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % portfolios.length);
  }, [portfolios.length]);

  const selectPortfolio = useCallback((idx: number) => {
    setActiveIndex(idx);
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const jurusanList = useMemo(() => {
    const set = new Set(portfolios.map((p) => p.jurusan));
    return ["Semua", ...Array.from(set).sort()];
  }, [portfolios]);

  const filtered = useMemo(() => {
    return portfolios.filter((p) => {
      const ms = p.nama.toLowerCase().includes(search.toLowerCase().trim());
      const mj = filterJurusan === "Semua" || p.jurusan === filterJurusan;
      return ms && mj;
    });
  }, [portfolios, search, filterJurusan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Memuat data portofolio siswa...</p>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">PORTIVA</span>
            </Link>
            <Link to="/" className="text-sm text-slate-400 hover:text-white">← Beranda</Link>
          </div>
        </nav>
        <div className="flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Belum Ada Portofolio Terverifikasi</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Data portofolio siswa dengan status disetujui (<code className="text-cyan-400">is_approved = true</code>) belum tersedia di database.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/admin" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Masuk Admin &amp; Tambah Link
              </Link>
              <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Info Kegiatan
              </Link>
            </div>
          </div>
        </div>
        <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-xs">
          PORTIVA — Showcase SMK
        </footer>
      </div>
    );
  }

  const active = portfolios[activeIndex] || portfolios[0];
  const activeEmbed = getCanvaEmbedInfo(active?.canva_url || "");

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide font-extrabold">
                PORTIVA
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium uppercase tracking-widest">
                Galeri Karya
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Info Kegiatan
            </Link>
            <Link
              to="/showcase"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
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

      {/* ── Section 1: Hero Showcase ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-medium animate-fade-in-up">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Showcase Portofolio Interaktif
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight animate-fade-in-up animation-delay-100">
              <span>Galeri Karya Digital </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Siswa Siap Kerja
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed animate-fade-in-up animation-delay-200">
              Jelajahi portofolio digital siswa SMK unggulan kami.
              Presentasi ini berputar otomatis setiap 10 detik, dan akan menjeda saat mouse melayang (hover).
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm shadow-sm">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span>Platform: <strong>Canva / Web</strong></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm shadow-sm">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Total: <strong>{portfolios.length} Karya</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Main Viewer (Mockup Browser & Auto-Slide) ── */}
      <section ref={viewerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-[0_20px_50px_-12px_rgba(8,145,178,0.25)] transition-all animate-fade-in-up animation-delay-400"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700/60">
            {/* macOS dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>

            {/* Address Bar */}
            <div className="hidden sm:flex items-center flex-1 mx-6 px-4 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-slate-400 text-xs sm:text-sm truncate">
              <span className="text-slate-600 mr-2">https://</span>
              <span className="truncate text-slate-300">
                {active.canva_url.replace(/^https?:\/\//, "")}
              </span>
            </div>

            {/* External Tab Link */}
            <a
              href={active.canva_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-medium transition-colors border border-cyan-500/20"
              title="Buka link asli Canva di tab baru"
            >
              <span>Buka di Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe 16:9 Showcase Frame */}
          <div className="relative w-full bg-slate-950" style={{ paddingBottom: "56.25%" }}>
            {activeEmbed.isBlockedSite ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40">
                <div className="relative z-10 max-w-lg space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Canva Website Live ({active.jurusan})</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {active.nama}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                    {active.deskripsi || "Portofolio website interaktif karya siswa SMK siap kerja."}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs flex items-start gap-3 text-left max-w-md mx-auto shadow-inner">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Domain Canva Site Terproteksi Keamanan</p>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                        Canva membatasi penayangan website ini secara langsung di dalam iframe demi keamanan browser Anda (X-Frame-Options). Silakan klik tombol di bawah untuk menjelajahinya di tab baru secara aman dan interaktif!
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={active.canva_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer"
                    >
                      <span>Buka Portofolio di Tab Baru</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="absolute inset-0 bg-radial from-cyan-500/5 to-transparent pointer-events-none" />
              </div>
            ) : (
              <iframe
                key={active.id}
                src={activeEmbed.embedUrl}
                title={`Portofolio ${active.nama}`}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
              />
            )}
          </div>

          {/* Bottom Bar: Info & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-slate-800/90 border-t border-slate-700/60">
            {/* Siswa Info */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-base shrink-0 shadow-md">
                {active.nama?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-base sm:text-lg truncate">
                    {active.nama}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-700 text-cyan-300 text-xs font-semibold shrink-0">
                    {active.jurusan}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm truncate max-w-md">
                  {active.deskripsi || "Portofolio Canva Site Siswa SMK Siap Kerja"}
                </p>
              </div>
              {isPlaying && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-medium ml-2 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                  </span>
                  Auto-Rotate 10s
                </span>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-400 text-xs font-medium mr-2">
                {activeIndex + 1} / {portfolios.length}
              </span>
              <button
                onClick={goPrev}
                className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                title="Portofolio Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  isPlaying
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
                title={isPlaying ? "Jeda rotasi otomatis" : "Mulai rotasi otomatis"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={goNext}
                className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                title="Portofolio Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Grid & Filter Peserta ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Daftar Portofolio Seluruh Siswa
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Klik salah satu kartu untuk langsung menampilkan portofolionya di viewer utama di atas.
            </p>
          </div>
          <div className="text-slate-400 text-xs">
            Menampilkan <strong>{filtered.length}</strong> dari {portfolios.length} karya
          </div>
        </div>

        {/* Search Bar + Filter Pills */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama siswa…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            {jurusanList.map((j) => (
              <button
                key={j}
                onClick={() => setFilterJurusan(j)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  j === filterJurusan
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800/60">
            <Search className="w-10 h-10 text-slate-600" />
            <p className="text-base text-slate-400">Tidak ada portofolio yang cocok dengan pencarian.</p>
            <button
              onClick={() => { setSearch(""); setFilterJurusan("Semua"); }}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Reset filter &amp; pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => {
              const originalIdx = portfolios.findIndex((o) => o.id === p.id);
              const isActive = originalIdx === activeIndex;
              const itemEmbed = getCanvaEmbedInfo(p.canva_url);

              return (
                <div
                  key={p.id}
                  onClick={() => selectPortfolio(originalIdx)}
                  className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "border-cyan-500 bg-slate-900 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-500/30 -translate-y-1"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div>
                    {/* Thumbnail Iframe or Aesthetic Badge */}
                    <div className="relative w-full aspect-video bg-slate-950 overflow-hidden border-b border-slate-800">
                      {!itemEmbed.isBlockedSite && itemEmbed.isEmbedUrl ? (
                        <iframe
                          src={itemEmbed.embedUrl}
                          title={`Preview ${p.nama}`}
                          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                          loading="lazy"
                          tabIndex={-1}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                            {p.nama?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[90%]">
                            {p.nama}
                          </span>
                          <span className="text-[10px] text-cyan-400 font-semibold mt-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/20">
                            <Globe className="w-3 h-3" /> Canva Site • {p.jurusan}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-transparent" />
                      {isActive && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-cyan-600 text-white text-[11px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                          Sedang Ditampilkan
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-white font-bold text-base group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {p.nama}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold shrink-0">
                          {p.jurusan}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {p.deskripsi || "Portofolio Canva Site siswa SMK siap kerja."}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40">
                    <span className="group-hover:text-cyan-400 transition-colors font-medium flex items-center gap-1">
                      Lihat Karya di Layar
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                    <a
                      href={p.canva_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-cyan-400 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="Buka link langsung"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>PORTIVA — Showcase Portofolio Siswa SMK Siap Kerja</span>
          </div>
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-300">Info &amp; Kelengkapan Kegiatan</Link>
            <span>•</span>
            <Link to="/showcase" className="hover:text-slate-300">Galeri Portofolio</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-slate-300">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
