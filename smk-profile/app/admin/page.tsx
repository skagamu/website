"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Save, LogOut, Plus, Trash2, Github, 
  Users, Image as ImageIcon, Calendar, Loader2,
  AlertCircle, CheckCircle2
} from "lucide-react";

// ============================================================================
// KONFIGURASI SKEMA FORM DINAMIS
// ============================================================================
type FieldSchema = { key: string; label: string; type?: "textarea" | "text" };

const SCHEMAS: Record<string, FieldSchema[]> = {
  events: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "title", label: "Judul Event / Berita" },
    { key: "date", label: "Tanggal Display (Misal: 12 OKT 2026)" },
    { key: "dateISO", label: "Tanggal ISO (Misal: 2026-10-12)" },
    { key: "status", label: "Status (Upcoming/Selesai)" },
    { key: "category", label: "Kategori" },
    { key: "location", label: "Lokasi" },
    { key: "image", label: "URL Gambar (/media/events/...)" },
    { key: "colorTheme", label: "Tema Warna Tailwind" },
    { key: "href", label: "URL Tujuan" },
    { key: "excerpt", label: "Ringkasan", type: "textarea" },
  ],
  faculty: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "name", label: "Nama Lengkap" },
    { key: "role", label: "Jabatan" },
    { key: "image", label: "URL Foto (/media/teachers/...)" },
  ],
  gallery: [
    { key: "id", label: "ID Unik" },
    { key: "title", label: "Judul Foto" },
    { key: "category", label: "Kategori" },
    { key: "span", label: "Grid Span Tailwind (Misal: md:col-span-1)" },
    { key: "image", label: "URL Gambar" },
  ],
};

const TABS = [
  { id: "events", label: "Berita & Event", icon: Calendar, file: "data/events.json" },
  { id: "faculty", label: "Profil Guru", icon: Users, file: "data/faculty.json" },
  { id: "gallery", label: "Galeri Sekolah", icon: ImageIcon, file: "data/gallery.json" },
];

// Utilitas Base64 yang aman untuk UTF-8 (menghindari error karakter spesial)
const toBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)));
const fromBase64 = (str: string) => {
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    // Fallback if escape is deprecated or fails on specific chars
    return window.atob(str);
  }
};

export default function AdminDashboard() {
  // Auth & Config States
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Dashboard States
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileSha, setFileSha] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  
  // Notification States
  const [notification, setNotification] = useState<{ type: "success"|"error", message: string } | null>(null);

  // Cek sesi yang tersimpan saat pertama kali dimuat
  useEffect(() => {
    const savedToken = sessionStorage.getItem("gh_pat");
    const savedOwner = localStorage.getItem("gh_owner") || "skagamu";
    const savedRepo = localStorage.getItem("gh_repo") || "smk-profile";
    
    setOwner(savedOwner);
    setRepo(savedRepo);

    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken, savedOwner, savedRepo);
    }
  }, []);

  // Hapus notifikasi otomatis setelah 3 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  // ============================================================================
  // LOGIKA GITHUB API (AUTH, READ, WRITE)
  // ============================================================================
  
  const verifyToken = async (pat: string, repoOwner: string, repoName: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${pat}` },
      });
      if (!res.ok) throw new Error("Token tidak valid atau kedaluwarsa.");
      
      sessionStorage.setItem("gh_pat", pat);
      localStorage.setItem("gh_owner", repoOwner);
      localStorage.setItem("gh_repo", repoName);
      
      setIsLoggedIn(true);
      fetchFile(pat, repoOwner, repoName, TABS[0]);
    } catch (err: any) {
      setAuthError(err.message || "Gagal masuk.");
      sessionStorage.removeItem("gh_pat");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return setAuthError("Token wajib diisi.");
    verifyToken(token, owner, repo);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gh_pat");
    setIsLoggedIn(false);
    setToken("");
  };

  const fetchFile = async (pat: string, repoOwner: string, repoName: string, tab: typeof TABS[0]) => {
    setDataLoading(true);
    setActiveTab(tab);
    try {
      const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/smk-profile/${tab.file}`, {
        headers: { Authorization: `Bearer ${pat}`, Accept: "application/vnd.github.v3+json" },
      });
      
      if (!res.ok) throw new Error(`Gagal memuat ${tab.file}`);
      
      const data = await res.json();
      setFileSha(data.sha);
      
      const decodedContent = fromBase64(data.content);
      const parsedJson = JSON.parse(decodedContent);
      
      // JSON kita punya struktur root: { events: [...] } atau { faculty: [...] }
      // Kita ekstrak array-nya berdasarkan id tab
      setFileData(parsedJson[tab.id] || []);
    } catch (err: any) {
      showToast("error", err.message);
      setFileData([]);
    } finally {
      setDataLoading(false);
    }
  };

  const commitChanges = async () => {
    setDataLoading(true);
    try {
      // Rekonstruksi struktur JSON asli (misal: { events: [...] })
      const newJsonContent = JSON.stringify({ [activeTab.id]: fileData }, null, 2);
      const encodedContent = toBase64(newJsonContent);

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/smk-profile/${activeTab.file}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update ${activeTab.label} via Admin Panel`,
          content: encodedContent,
          sha: fileSha,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal melakukan commit.");
      }

      const responseData = await res.json();
      setFileSha(responseData.content.sha); // Update SHA untuk commit berikutnya
      showToast("success", "Perubahan berhasil disimpan ke GitHub!");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // ============================================================================
  // LOGIKA CRUD MEMORI (UI STATE)
  // ============================================================================
  
  const updateItem = (index: number, key: string, value: string) => {
    const newData = [...fileData];
    newData[index][key] = value;
    setFileData(newData);
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    const newData = [...fileData];
    newData.splice(index, 1);
    setFileData(newData);
  };

  const addNewItem = () => {
    const schema = SCHEMAS[activeTab.id];
    const newItem: any = {};
    schema.forEach((field) => {
      newItem[field.key] = field.key === "id" ? `new-item-${Date.now()}` : "";
    });
    setFileData([newItem, ...fileData]); // Tambah di atas
  };

  // ============================================================================
  // RENDER: LAYAR LOGIN
  // ============================================================================
  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-navy/5 text-navy mb-4">
              <Lock size={32} />
            </div>
            <h1 className="font-sans text-2xl font-bold text-navy">Admin Login</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sistem Manajemen Konten Git-Backed
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Owner Repo</label>
                <input 
                  type="text" required value={owner} onChange={(e) => setOwner(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Repo</label>
                <input 
                  type="text" required value={repo} onChange={(e) => setRepo(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">GitHub PAT (Token)</label>
              <input 
                type="password" required value={token} onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxx..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> Token hanya disimpan di memori browser.
              </p>
            </div>

            {authError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {authError}
              </div>
            )}

            <button 
              type="submit" disabled={authLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-bold text-white transition-all hover:bg-navy/90 active:scale-[.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : <Github size={18} />}
              {authLoading ? "Memverifikasi..." : "Akses Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ============================================================================
  // RENDER: DASHBOARD (UI Utama)
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-[80px] md:pt-[104px]">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-28 right-6 z-50 flex items-center gap-3 rounded-lg px-5 py-3 shadow-lg border ${
          notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
        } animate-in slide-in-from-right-8`}>
          {notification.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 shrink-0 bg-navy text-white shadow-xl flex flex-col border-r border-slate-200 z-10">
        <div className="p-6 border-b border-white/10">
          <p className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">CMS Admin</p>
          <p className="text-sm font-medium mt-1 truncate">{owner}/{repo}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => fetchFile(token, owner, repo, tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab.id === tab.id 
                  ? "bg-amber-500 text-navy shadow-sm" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-104px)] overflow-hidden">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <activeTab.icon size={22} className="text-amber-500" />
              Edit {activeTab.label}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Mengedit file: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">{activeTab.file}</code></p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addNewItem}
              disabled={dataLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy transition-all hover:bg-slate-50 active:scale-[.98] disabled:opacity-50"
            >
              <Plus size={16} /> Tambah Baru
            </button>
            <button
              onClick={commitChanges}
              disabled={dataLoading}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[.98] disabled:opacity-50"
            >
              {dataLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Commit ke GitHub
            </button>
          </div>
        </header>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {dataLoading && fileData.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-navy" />
              <p>Mengambil data dari GitHub...</p>
            </div>
          ) : (
            <div className="grid gap-6 max-w-5xl mx-auto pb-20">
              {fileData.map((item, index) => (
                <div key={index} className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* Card Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">Item #{index + 1}</span>
                    <button 
                      onClick={() => deleteItem(index)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Hapus Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Form Fields Mapping */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {SCHEMAS[activeTab.id].map((field) => (
                      <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            value={item[field.key] || ""}
                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all"
                          />
                        ) : (
                          <input
                            type="text"
                            value={item[field.key] || ""}
                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {fileData.length === 0 && !dataLoading && (
                <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
                  <p className="text-slate-500">Tidak ada data ditemukan. Silakan tambah baru.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
