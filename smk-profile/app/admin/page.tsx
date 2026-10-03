"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Save, LogOut, Plus, Trash2, Github, 
  Users, Image as ImageIcon, Calendar, Loader2,
  AlertCircle, CheckCircle2, GraduationCap, Award, BookOpen, Flag, Upload,
  Menu, X
} from "lucide-react";

// ============================================================================
// KONFIGURASI SKEMA FORM DINAMIS
// ============================================================================
type FieldSchema = { key: string; label: string; type?: "textarea" | "text" | "select" | "image"; options?: string[] };

const SCHEMAS: Record<string, FieldSchema[]> = {
  events: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "title", label: "Judul Event / Berita" },
    { key: "date", label: "Tanggal Display (Misal: 12 OKT 2026)" },
    { key: "dateISO", label: "Tanggal ISO (Misal: 2026-10-12)" },
    { key: "status", label: "Status (Upcoming/Selesai)", type: "select", options: ["Upcoming", "Selesai"] },
    { key: "category", label: "Kategori" },
    { key: "location", label: "Lokasi" },
    { key: "image", label: "Gambar Thumbnail", type: "image" },
    { key: "colorTheme", label: "Tema Warna Tailwind" },
    { key: "href", label: "URL Tujuan" },
    { key: "excerpt", label: "Ringkasan", type: "textarea" },
  ],
  faculty: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "name", label: "Nama Lengkap" },
    { key: "role", label: "Jabatan" },
    { key: "image", label: "Foto Profil", type: "image" },
  ],
  alumni: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "name", label: "Nama Lengkap" },
    { key: "role", label: "Pekerjaan saat ini" },
    { key: "company", label: "Perusahaan / Instansi" },
    { key: "major", label: "Jurusan Asal" },
    { key: "year", label: "Tahun Angkatan" },
    { key: "image", label: "Foto Alumni", type: "image" },
    { key: "href", label: "URL Profil Lengkap (Opsional)" }
  ],
  programs: [
    { key: "id", label: "ID Unik (slug)" },
    { key: "name", label: "Nama Jurusan" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "icon", label: "Icon Name (Lucide)" },
    { key: "careers", label: "Peluang Karir (pisahkan koma)", type: "textarea" },
    { key: "facilities", label: "Fasilitas (pisahkan koma)", type: "textarea" },
    { key: "partners", label: "Mitra Industri (pisahkan koma)", type: "textarea" }
  ],
  manifesto: [
    { key: "id", label: "Tipe (Jangan diubah)" },
    { key: "vision", label: "Visi Sekolah", type: "textarea" },
    { key: "statement", label: "Statement/Slogan Utama", type: "textarea" },
    { key: "mission", label: "Misi (pisahkan tiap baris dengan enter)", type: "textarea" }
  ],
  gallery: [
    { key: "id", label: "ID Unik" },
    { key: "title", label: "Judul Foto" },
    { key: "category", label: "Kategori" },
    { key: "span", label: "Grid Span Tailwind (Misal: md:col-span-1)" },
    { key: "image", label: "Upload Foto", type: "image" },
  ],
};

const TABS = [
  { id: "events", label: "Berita & Event", icon: Calendar, file: "data/events.json" },
  { id: "alumni", label: "Daftar Alumni", icon: Award, file: "data/alumni.json" },
  { id: "programs", label: "Jurusan / Program", icon: GraduationCap, file: "data/programs.json" },
  { id: "faculty", label: "Profil Guru", icon: Users, file: "data/faculty.json" },
  { id: "gallery", label: "Galeri Sekolah", icon: ImageIcon, file: "data/gallery.json" },
  { id: "manifesto", label: "Tentang (Visi/Misi)", icon: Flag, file: "data/manifesto.json" },
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
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  // Notification States
  const [notification, setNotification] = useState<{ type: "success"|"error", message: string } | null>(null);

  // Cek sesi yang tersimpan saat pertama kali dimuat
  useEffect(() => {
    const savedToken = sessionStorage.getItem("gh_pat");
    
    // Paksa hapus isi yang tersisa di LocalStorage dari cache browser 
    localStorage.removeItem("gh_owner");
    localStorage.removeItem("gh_repo");
    
    // Jangan set setOwner/setRepo dari LocalStorage
    // Biarkan default awal string kosong dari useState bekerja

    if (savedToken) {
      setToken(savedToken);
      // Kita tidak menjalankan verify otomatis lagi jika owner dan repo dihapus.
      // User harus login ulang jika me-refresh (karena owner & repo kosong).
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
      // Khusus untuk manifesto, strukturnya berupa object langsung { manifesto: { vision: ..., mission: [...] } }
      // Kita perlu menyulapnya menjadi array beranak tunggal agar UI builder tetap bisa memprosesnya
      let extractedData = parsedJson[tab.id];

      if (tab.id === "manifesto" && !Array.isArray(extractedData)) {
        // Transform the object to a single-item array for our table UI
        extractedData = [
          {
            id: "manifesto-root",
            vision: extractedData?.vision || "",
            statement: extractedData?.statement || "",
            mission: Array.isArray(extractedData?.mission) ? extractedData.mission.join("\n") : (extractedData?.mission || "")
          }
        ];
      } else if (tab.id === "programs" && parsedJson.programs) {
         // Join array items back to comma separated string for textarea
         extractedData = parsedJson.programs.map((prog: any) => ({
           ...prog,
           careers: Array.isArray(prog.careers) ? prog.careers.join(", ") : prog.careers,
           facilities: Array.isArray(prog.facilities) ? prog.facilities.join(", ") : prog.facilities,
           partners: Array.isArray(prog.partners) ? prog.partners.join(", ") : prog.partners,
         }));
      }

      setFileData(extractedData || []);
    } catch (err: any) {
      showToast("error", err.message);
      setFileData([]);
    } finally {
      setDataLoading(false);
    }
  };

  // ============================================================================
  // UPLOAD GAMBAR KE GITHUB REPO
  // ============================================================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasi ukuran file (misal max 2MB untuk menghindari error push github API)
    if (file.size > 2 * 1024 * 1024) {
      return showToast("error", "Ukuran gambar terlalu besar. Maksimal 2MB.");
    }

    setUploadingImageKey(`${itemIndex}-${fieldKey}`);
    try {
      // 1. Convert file to Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]); // ambil base64 content
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // 2. Tentukan Path di Repositori (misal: /public/media/uploads/nama-file.jpg)
      const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const repoFilePath = `smk-profile/public/media/uploads/${safeFileName}`;
      const urlPath = `/website/media/uploads/${safeFileName}`;

      // 3. Push file biner ke GitHub (PUT endpoint contents)
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${repoFilePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload media: ${safeFileName} via CMS`,
          content: base64Data, // Github API menerima base64 standar
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengupload gambar ke GitHub");
      }

      // 4. Update nilai form dengan URL yang baru di-upload
      updateItem(itemIndex, fieldKey, urlPath);
      showToast("success", "Gambar berhasil di-upload ke server!");

    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setUploadingImageKey(null);
    }
  };

  const commitChanges = async () => {
    setDataLoading(true);
    try {
      // Rekonstruksi struktur JSON asli sebelum dikirim
      let formattedData: any = fileData;

      if (activeTab.id === "manifesto") {
        // Balikkan lagi dari array tunggal ke Object root
        const rootItem = fileData[0] || {};
        formattedData = {
          vision: rootItem.vision || "",
          statement: rootItem.statement || "",
          mission: rootItem.mission ? rootItem.mission.split("\n").map((s: string) => s.trim()).filter(Boolean) : []
        };
      } else if (activeTab.id === "programs") {
        // Balikkan dari comma separated string ke array untuk JSON
        formattedData = fileData.map((prog: any) => ({
          ...prog,
          careers: typeof prog.careers === "string" ? prog.careers.split(",").map((s:string) => s.trim()).filter(Boolean) : prog.careers,
          facilities: typeof prog.facilities === "string" ? prog.facilities.split(",").map((s:string) => s.trim()).filter(Boolean) : prog.facilities,
          partners: typeof prog.partners === "string" ? prog.partners.split(",").map((s:string) => s.trim()).filter(Boolean) : prog.partners,
        }));
      }

      const newJsonContent = JSON.stringify({ [activeTab.id]: formattedData }, null, 2);
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row md:overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 md:top-6 md:right-6 z-[60] flex items-center gap-3 rounded-lg px-4 py-3 md:px-5 shadow-lg border ${
          notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
        } animate-in slide-in-from-right-8`}>
          {notification.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          <p className="text-xs md:text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* MOBILE HEADER (Hanya Tampil di Mobile) */}
      <div className="md:hidden flex items-center justify-between bg-navy text-white px-4 py-3 sticky top-0 z-40 shadow-sm border-b border-white/10">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">CMS Admin</p>
          <p className="text-sm font-medium mt-0.5 truncate max-w-[200px]">{owner}/{repo}</p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-white/80 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white shadow-xl flex flex-col border-r border-slate-200 
        transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden md:block p-6 border-b border-white/10">
          <p className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">CMS Admin</p>
          <p className="text-sm font-medium mt-1 truncate">{owner}/{repo}</p>
        </div>
        
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
          <p className="font-mono text-sm font-bold tracking-widest text-amber-400 uppercase">Menu CMS</p>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                fetchFile(token, owner, repo, tab);
                setIsSidebarOpen(false); // Tutup sidebar mobile setelah klik menu
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab.id === tab.id 
                  ? "bg-amber text-navy font-bold shadow-md" 
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-[calc(100vh-56px)] md:h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-navy flex items-center gap-2">
              <activeTab.icon size={20} className="text-amber-500 md:w-[22px] md:h-[22px]" />
              Edit {activeTab.label}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Mengedit file: <code className="text-[10px] md:text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700 break-all">{activeTab.file}</code></p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={addNewItem}
              disabled={dataLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-navy transition-all hover:bg-slate-50 active:scale-[.98] disabled:opacity-50"
            >
              <Plus size={16} /> Tambah
            </button>
            <button
              onClick={commitChanges}
              disabled={dataLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[.98] disabled:opacity-50"
            >
              {dataLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span className="hidden sm:inline">Commit ke GitHub</span>
              <span className="sm:hidden">Simpan</span>
            </button>
          </div>
        </header>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {dataLoading && fileData.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-navy" />
              <p className="text-sm">Mengambil data dari GitHub...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 max-w-5xl mx-auto pb-20 md:pb-12">
              {fileData.map((item, index) => (
                <div key={index} className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* Card Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-5 py-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] md:text-xs font-bold text-slate-500">Item #{index + 1}</span>
                    <button 
                      onClick={() => deleteItem(index)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Hapus Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Form Fields Mapping */}
                  <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
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
                        ) : field.type === "image" ? (
                          <div className="space-y-3 p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50">
                            {/* Live Preview */}
                            {item[field.key] ? (
                              <div className="relative group rounded-md overflow-hidden bg-slate-200">
                                <img 
                                  // Hapus awalan /website jika ada agar preview jalan di local/development (opsional), 
                                  // Atau bisa asumsikan relative link akan resolve dari base path 
                                  src={item[field.key].startsWith("/website") ? item[field.key].replace("/website", "") : item[field.key]} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x150?text=Preview+Tidak+Tersedia";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <button
                                    onClick={() => updateItem(index, field.key, "")}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Hapus Gambar"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-32 flex flex-col items-center justify-center bg-white rounded-md border border-slate-200 text-slate-400">
                                <ImageIcon size={32} className="mb-2 text-slate-300" />
                                <span className="text-xs">Belum ada gambar</span>
                              </div>
                            )}

                            {/* Uploader Input (Manual URL OR File Upload) */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="/website/media/..."
                                value={item[field.key] || ""}
                                onChange={(e) => updateItem(index, field.key, e.target.value)}
                                className="flex-1 min-w-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                              />
                              <div className="relative shrink-0">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, image/webp"
                                  onChange={(e) => handleImageUpload(e, index, field.key)}
                                  disabled={uploadingImageKey === `${index}-${field.key}`}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <button
                                  disabled={uploadingImageKey === `${index}-${field.key}`}
                                  className="h-full px-3 flex items-center justify-center bg-navy text-white rounded-md hover:bg-navy/90 transition-colors disabled:opacity-50"
                                >
                                  {uploadingImageKey === `${index}-${field.key}` ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500">Bisa isi URL manual, atau klik tombol ⬆️ untuk upload (Max 2MB).</p>
                          </div>
                        ) : field.type === "select" ? (
                          <select
                            value={item[field.key] || ""}
                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all"
                          >
                            <option value="">-- Pilih --</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
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
