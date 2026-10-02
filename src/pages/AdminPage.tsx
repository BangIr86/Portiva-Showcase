import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  GraduationCap, LogIn, LogOut, Plus, Pencil, Trash2,
  Check, X, Loader2, Eye, EyeOff, Save, ArrowLeft,
  ShieldCheck, Users, AlertCircle,
} from "lucide-react";

interface Portfolio {
  id: number;
  nama: string;
  jurusan: string;
  canva_url: string;
  deskripsi: string;
  is_approved: boolean;
  created_at: string;
}

interface FormData {
  nama: string;
  jurusan: string;
  canva_url: string;
  deskripsi: string;
  is_approved: boolean;
}

const emptyForm: FormData = { nama: "", jurusan: "", canva_url: "", deskripsi: "", is_approved: false };

/* ── Login Component ── */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      onLogin();
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-slate-800 border border-slate-700/50 mb-4">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400">Masuk untuk mengelola portofolio siswa</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@sekolah.id" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" className="w-full px-4 py-2.5 pr-12 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-sm"><ArrowLeft className="w-4 h-4"/>Kembali ke Beranda</Link>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{isEdit ? "Edit Portofolio" : "Tambah Portofolio Baru"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Nama Siswa *</label>
            <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap siswa" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Jurusan *</label>
            <input value={form.jurusan} onChange={e => setForm({ ...form, jurusan: e.target.value })} placeholder="Contoh: RPL, DKV, TKJ" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">URL Canva Site *</label>
            <input value={form.canva_url} onChange={e => setForm({ ...form, canva_url: e.target.value })} placeholder="https://nama.my.canva.site/" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} placeholder="Deskripsi singkat portofolio..." className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_approved} onChange={e => setForm({ ...form, is_approved: e.target.checked })} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/40 cursor-pointer" />
            <span className="text-sm text-slate-300">Setujui &amp; tampilkan di showcase</span>
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer">Batal</button>
          <button onClick={onSave} disabled={saving || !form.nama || !form.jurusan || !form.canva_url} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Page ── */
export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Check session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("portfolios").select("*").order("id", { ascending: true });
    if (!error) setPortfolios((data as Portfolio[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (user) fetchPortfolios(); }, [user, fetchPortfolios]);

  function flash(text: string, type = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  }

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(p: Portfolio) { setForm({ nama: p.nama, jurusan: p.jurusan, canva_url: p.canva_url, deskripsi: p.deskripsi, is_approved: p.is_approved }); setEditId(p.id); setShowModal(true); }

  async function handleSave() {
    setSaving(true);
    if (editId) {
      const { error } = await supabase.from("portfolios").update(form).eq("id", editId);
      if (error) flash("Gagal menyimpan: " + error.message, "error");
      else flash("Portofolio berhasil diperbarui!");
    } else {
      const { error } = await supabase.from("portfolios").insert([form]);
      if (error) flash("Gagal menambah: " + error.message, "error");
      else flash("Portofolio berhasil ditambahkan!");
    }
    setSaving(false);
    setShowModal(false);
    fetchPortfolios();
  }

  async function handleDelete(id: number, nama: string) {
    if (!window.confirm(`Hapus portofolio "${nama}"?`)) return;
    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (error) flash("Gagal menghapus: " + error.message, "error");
    else flash("Portofolio dihapus.");
    fetchPortfolios();
  }

  async function toggleApproval(id: number, current: boolean) {
    await supabase.from("portfolios").update({ is_approved: !current }).eq("id", id);
    fetchPortfolios();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (checking) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-10 h-10 text-cyan-400 animate-spin" /></div>;
  if (!user) return <LoginForm onLogin={() => {}} />;

  const approved = portfolios.filter(p => p.is_approved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">PORTIVA</span>
            <span className="text-slate-500 text-sm font-normal ml-2">/ Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/showcase" className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">Showcase</Link>
            <span className="text-slate-600 text-sm truncate max-w-[120px] hidden sm:inline">{user.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"><LogOut className="w-4 h-4"/>Keluar</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flash message */}
        {msg.text && (
          <div className={`mb-6 flex items-center gap-2 p-4 rounded-xl border text-sm ${msg.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
            {msg.type === "error" ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}{msg.text}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Kelola Portofolio</h1>
            <p className="text-slate-400 text-sm mt-1">Tambah, edit, dan kelola portofolio siswa.</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer">
            <Plus className="w-5 h-5" />Tambah Portofolio
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-slate-800"><Users className="w-5 h-5 text-cyan-400"/></div>
            <div><p className="text-2xl font-bold">{portfolios.length}</p><p className="text-slate-500 text-sm">Total</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-slate-800"><Check className="w-5 h-5 text-green-400"/></div>
            <div><p className="text-2xl font-bold">{approved}</p><p className="text-slate-500 text-sm">Disetujui</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-slate-800"><X className="w-5 h-5 text-yellow-400"/></div>
            <div><p className="text-2xl font-bold">{portfolios.length - approved}</p><p className="text-slate-500 text-sm">Pending</p></div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin"/></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/60">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Siswa</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Jurusan</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">URL</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {portfolios.map(p => (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs shrink-0">{p.nama.charAt(0).toUpperCase()}</div>
                        <div><p className="text-white font-medium text-sm">{p.nama}</p>{p.deskripsi&&<p className="text-slate-500 text-xs truncate max-w-[200px]">{p.deskripsi}</p>}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">{p.jurusan}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><a href={p.canva_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs truncate block max-w-[200px]">{p.canva_url}</a></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleApproval(p.id, p.is_approved)} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${p.is_approved ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25"}`}>
                        {p.is_approved ? <><Check className="w-3 h-3"/>Approved</> : <><X className="w-3 h-3"/>Pending</>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(p.id, p.nama)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" title="Hapus"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {portfolios.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-16 text-center text-slate-500">Belum ada data portofolio.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <PortfolioModal form={form} setForm={setForm} onSave={handleSave} onClose={() => setShowModal(false)} saving={saving} isEdit={!!editId} />}
    </div>
  );
}
