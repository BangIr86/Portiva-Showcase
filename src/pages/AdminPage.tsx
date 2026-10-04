import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  GraduationCap, LogIn, LogOut, Plus, Pencil, Trash2, Check, X, Loader2, Eye, EyeOff, Save, ArrowLeft, ShieldCheck, Users, AlertCircle, HelpCircle, Settings, Code
} from "lucide-react";

interface Portfolio {
  id: number;
  nama: string;
  jurusan: string;
  canva_url: string;
  deskripsi: string;
  is_approved: boolean;
  created_at?: string;
}

interface FormData {
  nama: string;
  jurusan: string;
  canva_url: string;
  deskripsi: string;
  is_approved: boolean;
}

const emptyForm: FormData = { nama: "", jurusan: "", canva_url: "", deskripsi: "", is_approved: false };

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSCODE || "adminportiva";

const defaultLandingData = {
  hero: {
    badge: "Workshop Inovasi Digital & Personal Branding Siswa SMK",
    title1: "Showcase Portofolio Digital",
    title2: "Siswa SMK Siap Kerja",
    desc: "Program inkubasi dan pameran karya digital berbasis Canva Site yang membekali siswa SMK dengan personal branding berstandar industri, portofolio interaktif, dan kesiapan kompetensi kerja nyata."
  },
  details: [
    { title: "Waktu Pelaksanaan", detail: "Oktober 2025", sub: "Workshop Intensif 3 Hari" },
    { title: "Tempat / Media", detail: "Lab Multimedia & Web", sub: "SMK Pusat Keunggulan" },
    { title: "Sasaran Peserta", detail: "Siswa Kelas XII", sub: "Persiapan PKL & Kerja" },
    { title: "Platform Karya", detail: "Canva Site + Live Hosting", sub: "Domain responsif interaktif" }
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
    { title: "Modul & Template", desc: "Template Canva Site premium yang siap dikustomisasi sesuai identitas siswa." },
    { title: "Akses Lab Komputer", desc: "Perangkat PC spesifikasi multimedia dan koneksi internet stabil." },
    { title: "Mentoring Industri", desc: "Bimbingan langsung dari praktisi teknologi dan desain komunikasi visual." },
    { title: "Kurasi & Verifikasi", desc: "Sistem approval portofolio untuk memastikan kualitas standar industri." }
  ],
  jurusan: [
    { nama: "Rekayasa Perangkat Lunak (RPL)", fokus: "Web Application, UI/UX Design, REST API, Database Management, Mobile Apps.", badge: "Software Engineering" },
    { nama: "Desain Komunikasi Visual (DKV)", fokus: "Branding & Identity, Motion Graphic, Ilustrasi Digital, Social Media Assets, Packaging.", badge: "Visual Design" },
    { nama: "Teknik Komputer & Jaringan (TKJ)", fokus: "Network Infrastructure, Server Administration, Cloud Computing, Cyber Security, Mikrotik.", badge: "IT Infrastructure" }
  ]
};

/* ── Login Component ── */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.trim() === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Password salah! Silakan coba lagi.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-cyan-500/5">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Masukkan password untuk mengelola website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Password Admin
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Masukkan password..."
                className="w-full px-4 py-2.5 pr-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Admin</span>
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio Form Modal ── */
function PortfolioModal({
  form, setForm, onSave, onClose, saving, isEdit,
}: {
  form: FormData; setForm: (f: FormData) => void;
  onSave: () => void; onClose: () => void;
  saving: boolean; isEdit: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/60 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Portofolio" : "Tambah Portofolio Siswa"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nama Siswa *</label>
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Muhammad Rizki"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Jurusan *</label>
            <input
              value={form.jurusan}
              onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
              placeholder="Contoh: RPL / DKV"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              URL Canva Site / Embed Link *
            </label>
            <input
              value={form.canva_url}
              onChange={(e) => setForm({ ...form, canva_url: e.target.value })}
              placeholder="https://namasiswa.my.canva.site atau link embed"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm transition-all"
            />
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                Tips Link Canva:
              </p>
              <p>• <strong>Canva Site</strong> (<code className="text-slate-300">*.my.canva.site</code>): Ditampilkan dalam card interaktif.</p>
              <p>• <strong>Live Embed</strong> (<code className="text-slate-300">/view?embed</code>): Tampil langsung di frame. Tag <code className="text-slate-300">&lt;iframe&gt;</code> akan diekstrak otomatis.</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Singkat</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              rows={3}
              placeholder="Deskripsi singkat karya, keahlian, atau proyek..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm transition-all resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.is_approved}
              onChange={(e) => setForm({ ...form, is_approved: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/40 cursor-pointer"
            />
            <span className="text-sm text-slate-300">
              Setujui &amp; langsung tampilkan di showcase
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.nama || !form.jurusan || !form.canva_url}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEdit ? "Simpan" : "Tambah Karya"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Page ── */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"portofolio" | "settings">("portofolio");

  // Portfolio State
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Settings State (Advanced JSON Editor)
  const [jsonText, setJsonText] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("portiva_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // Fetch Portfolios
    const { data: portData } = await supabase.from("portfolios").select("*").order("id", { ascending: true });
    if (portData) setPortfolios(portData as Portfolio[]);
    
    // Fetch Settings
    const { data: settsData } = await supabase.from("app_settings").select("landing_content").eq("id", 1).single();
    if (settsData && settsData.landing_content) {
      setJsonText(JSON.stringify(settsData.landing_content, null, 2));
    } else {
      setJsonText(JSON.stringify(defaultLandingData, null, 2));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  function flash(text: string, type = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  }

  // PORTFOLIO ACTIONS
  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(p: Portfolio) {
    setForm({
      nama: p.nama,
      jurusan: p.jurusan,
      canva_url: p.canva_url,
      deskripsi: p.deskripsi,
      is_approved: p.is_approved,
    });
    setEditId(p.id);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    let cleanUrl = form.canva_url.trim();

    const iframeMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) cleanUrl = iframeMatch[1];

    const payload = {
      nama: form.nama.trim(),
      jurusan: form.jurusan.trim(),
      canva_url: cleanUrl,
      deskripsi: form.deskripsi.trim(),
      is_approved: form.is_approved,
    };

    if (editId) {
      const { error } = await supabase.from("portfolios").update(payload).eq("id", editId);
      if (error) flash("Gagal menyimpan: " + error.message, "error");
      else flash("Portofolio berhasil diperbarui!");
    } else {
      const { error } = await supabase.from("portfolios").insert([payload]);
      if (error) flash("Gagal menambah: " + error.message, "error");
      else flash("Portofolio berhasil ditambahkan!");
    }
    setSaving(false);
    setShowModal(false);
    fetchData();
  }

  async function handleDelete(id: number, nama: string) {
    if (!window.confirm(`Hapus portofolio "${nama}"?`)) return;
    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (error) flash("Gagal menghapus: " + error.message, "error");
    else flash("Portofolio dihapus.");
    fetchData();
  }

  async function toggleApproval(id: number, current: boolean) {
    await supabase.from("portfolios").update({ is_approved: !current }).eq("id", id);
    fetchData();
  }

  // SETTINGS ACTIONS
  async function handleSaveSettings() {
    setSavingSettings(true);
    try {
      const parsed = JSON.parse(jsonText);
      const { error } = await supabase.from("app_settings").upsert({ id: 1, landing_content: parsed });
      if (error) throw error;
      flash("Konten website (JSON) berhasil diperbarui!");
    } catch (e: any) {
      flash("Format JSON tidak valid! Pastikan tidak ada tanda kutip yang hilang. " + (e.message || ""), "error");
    }
    setSavingSettings(false);
  }

  function handleLogout() {
    localStorage.removeItem("portiva_admin_auth");
    setIsAuthenticated(false);
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={() => {
          localStorage.setItem("portiva_admin_auth", "true");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const approved = portfolios.filter((p) => p.is_approved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PORTIVA
            </span>
            <span className="text-slate-500 text-sm font-normal ml-2">/ Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/showcase"
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Lihat Showcase
            </Link>
            <span className="text-cyan-400 text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-medium">
              Mode Admin
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB NAVIGATION */}
        <div className="flex gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button 
            onClick={() => setActiveTab("portofolio")}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "portofolio" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            <Users className="w-4 h-4" /> Kelola Portofolio
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "settings" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            <Settings className="w-4 h-4" /> Semua Konten Website (JSON)
          </button>
        </div>

        {/* Flash message */}
        {msg.text && (
          <div
            className={`mb-6 flex items-center gap-2 p-4 rounded-xl border text-sm animate-fade-in-up ${
              msg.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            {msg.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* TAB 1: PORTOFOLIO */}
        {activeTab === "portofolio" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold">Kelola Portofolio Siswa</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Tambah, edit, hapus, dan verifikasi persetujuan link karya siswa.
                </p>
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Portofolio</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
                <div className="p-2.5 rounded-lg bg-slate-800">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{portfolios.length}</p>
                  <p className="text-slate-500 text-xs">Total Portofolio</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
                <div className="p-2.5 rounded-lg bg-slate-800">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approved}</p>
                  <p className="text-slate-500 text-xs">Disetujui (Tayang)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
                <div className="p-2.5 rounded-lg bg-slate-800">
                  <X className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{portfolios.length - approved}</p>
                  <p className="text-slate-500 text-xs">Menunggu Persetujuan</p>
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/60">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Siswa</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Jurusan</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">URL Canva</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {portfolios.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs shrink-0">
                              {p.nama.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{p.nama}</p>
                              {p.deskripsi && (
                                <p className="text-slate-500 text-xs truncate max-w-[200px]">
                                  {p.deskripsi}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 text-xs font-medium">
                            {p.jurusan}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <a
                            href={p.canva_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-xs truncate block max-w-[220px]"
                          >
                            {p.canva_url}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleApproval(p.id, p.is_approved)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              p.is_approved
                                ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25"
                            }`}
                          >
                            {p.is_approved ? (
                              <><Check className="w-3 h-3" /> Approved</>
                            ) : (
                              <><X className="w-3 h-3" /> Pending</>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.nama)}
                              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {portfolios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                          Belum ada data portofolio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SETTINGS CMS (JSON EDITOR) */}
        {activeTab === "settings" && (
          <div className="max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[700px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Advanced Editor: Semua Konten Landing Page
              </h2>
              <p className="text-slate-400 text-sm mt-1">Ubah teks informasi, rundown, fasilitas, hingga detail jurusan langsung dari format data JSON di bawah ini. Pastikan Anda tidak menghapus tanda kutip (<code className="text-cyan-400">"</code>) pada struktur datanya.</p>
            </div>

            <div className="flex-1 min-h-0">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-[13px] outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all resize-none leading-relaxed shadow-inner"
                spellCheck={false}
              />
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {savingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>Simpan Semua Perubahan</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <PortfolioModal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
          isEdit={!!editId}
        />
      )}
    </div>
  );
}
