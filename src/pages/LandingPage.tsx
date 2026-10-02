import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { 
  Monitor, Layout, Code2, Users, Target, Rocket, CheckCircle2, Star, 
  MapPin, Calendar, Clock, ArrowRight, BookOpen, GraduationCap, Sparkles 
} from "lucide-react";

interface AppSettings {
  event_name: string;
  event_description: string;
  event_date: string;
  event_location: string;
}

export default function LandingPage() {
  const [settings, setSettings] = useState<AppSettings>({
    event_name: "Workshop Portofolio Digital",
    event_description: "Membangun profil profesional siswa SMK yang siap bersaing di industri digital.",
    event_date: "20 - 22 Agustus 2026",
    event_location: "Aula Utama SMK"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (data && !error) {
        setSettings(data);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Memuat data acara...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 overflow-hidden">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide font-extrabold">
              PORTIVA
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/showcase" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Galeri Siswa
            </Link>
            <Link to="/admin" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white backdrop-blur-md">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20">
        {/* ── Hero Section ── */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium animate-fade-in-up">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Pameran Karya Unggulan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up animation-delay-100 text-balance leading-tight">
              {settings.event_name}
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed animate-fade-in-up animation-delay-200">
              {settings.event_description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shadow-sm">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">{settings.event_date}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shadow-sm">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{settings.event_location}</span>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link to="/showcase" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-1 hover:shadow-cyan-500/40">
                Lihat Galeri Portofolio <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Rundown Section ── */}
        <section className="py-20 bg-slate-900/50 border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Agenda Kegiatan</h2>
              <p className="text-slate-400">Rangkaian acara selama tiga hari untuk membekali siswa dengan kemampuan membuat portofolio digital standar industri.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { day: "Hari 1", title: "Fundamental Portofolio", desc: "Pengenalan struktur portofolio UI/UX yang menjual, personal branding, & pemilihan platform.", icon: BookOpen },
                { day: "Hari 2", title: "Workshop Praktik", desc: "Membuat desain portofolio menggunakan Canva/Figma. Hands-on pembuatan aset digital.", icon: Code2 },
                { day: "Hari 3", title: "Showcase & Review", desc: "Publikasi portofolio, presentasi hasil karya, dan review langsung dari praktisi industri.", icon: Target }
              ].map((item, i) => (
                <div key={i} className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <item.icon className="w-24 h-24 text-cyan-500" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-4">
                    <Clock className="w-3.5 h-3.5" /> {item.day}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kompetensi Section ── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Kompetensi Keahlian</h2>
              <p className="text-slate-400">Showcase ini menampilkan portofolio terbaik dari tiga program keahlian unggulan di sekolah kami.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { title: "RPL", name: "Rekayasa Perangkat Lunak", icon: Code2, color: "from-blue-500 to-indigo-600", border: "hover:border-blue-500/50" },
                { title: "DKV", name: "Desain Komunikasi Visual", icon: Layout, color: "from-fuchsia-500 to-pink-600", border: "hover:border-fuchsia-500/50" },
                { title: "TKJ", name: "Teknik Komputer & Jaringan", icon: Monitor, color: "from-emerald-500 to-teal-600", border: "hover:border-emerald-500/50" }
              ].map((jurusan, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-colors group ${jurusan.border}`}>
                  <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${jurusan.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                    <jurusan.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{jurusan.title}</h3>
                  <p className="text-slate-400 font-medium">{jurusan.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <GraduationCap className="w-5 h-5" />
            <span>PORTIVA</span>
          </div>
          <p>© 2026 {settings.event_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
