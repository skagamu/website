# Product Requirement Document (PRD): SKAGAMU Digital Branding & CMS Admin Panel

## 1. Executive Summary & Tech Stack
- Project Name: SKAGAMU Digital Branding & Student Showcase Portal
- Target Repository: https://github.com/skagamu/website.git
- Hosting Target: GitHub Pages via GitHub Actions (.github/workflows/deploy.yml)
- Database & Backend: Google Apps Script Web App (Spreadsheet ID auto, Folder Drive SKAGAMU_UPLOADS)
- Web App API URL: https://script.google.com/macros/s/AKfycbzJoZ5OjeiUVHNZ6eCl6FSdwpJJre5cLgUQ5Pawr-5_5gSbDJza3c11vL_BjXSVBG7N/exec
- Admin Credentials: Username adminwebsite, Password skagamu123
- Design System: 
  - Landing Page (index.html): VoltAgent Framer Dark Canvas (#090909, hairline border #262626, radiant gradients #ff7a3d / #6a4cf5, pill buttons, Plus Jakarta Sans, Lucide icons).
  - Admin Dashboard (admin.html): VoltAgent Linear Design (#0f1011, surface layers, status badges, dense data-table, drag & drop uploader).

---

## 2. Dynamic Content Schema (Google Sheets)
1. portfolio Sheet:
   - id: Unique timestamp id (e.g. p_1788423124984)
   - title: Judul karya siswa (e.g. Identitas Merek Kopi Wuryantoro)
   - category: branding | design | content
   - author: Nama & Kelas (e.g. Ahmad Fauzi • XI DKV)
   - image_url: Direct URL Google Drive
   - description: Deskripsi singkat karya
   - status: published | draft
   - created_at: ISO timestamp

2. gallery Sheet:
   - id: Unique timestamp id (g_1788423124984)
   - title: Judul aktivitas/kegiatan
   - image_url: Direct URL gambar
   - order: Integer urutan tampil
   - created_at: ISO timestamp

3. settings Sheet:
   - hero_title: Judul headline hero
   - hero_lead: Subtitle / deskripsi hero
   - about_title: Judul section tentang
   - about_desc: Deskripsi profil studio
   - contact_email: Email resmi kontak sekolah
   - footer_text: Teks hak cipta footer

---

## 3. Core Modules & Implementation Requirements

### A. Central Config (assets/js/config.js)
- Expose global CONFIG object:
  - API_URL: Google Apps Script Endpoint.
  - STORAGE_KEY: Session storage key untuk auth token.
  - Helper fungsi apiRequest(action, data) dengan error handling dan timeout.

### B. Admin Panel Dashboard (admin.html & assets/js/admin.js)
1. Authentication:
   - Modern floating login modal.
   - Verifikasi credential ke Apps Script via action login / saveSettings.
   - Simpan session di sessionStorage dengan auto-logout.
2. Portfolio Manager:
   - Tab list karya siswa lengkap dengan image thumbnail preview, category badge, author info, dan switch status.
   - Form modal Add/Edit Karya.
   - Client-side image compression (Canvas resize max 1600px, WebP/JPEG 0.85) -> Convert Base64 -> Upload ke Google Drive via GAS endpoint uploadImage.
   - Tombol Edit dan Hapus dengan dialog konfirmasi.
3. Gallery Manager:
   - Grid list dokumentasi kegiatan.
   - Upload foto kegiatan langsung ke Google Drive & simpan record ke Sheet.
   - Hapus foto kegiatan.
4. Site Settings Manager:
   - Form pengeditan teks Hero, Lead, About Studio, dan Email Kontak sekolah.
   - Feedback toast notification saat berhasil menyimpan.

### C. Public Landing Page (index.html, assets/js/app.js, assets/css/style.css)
1. Dynamic Data Fetching:
   - Fetch parallel data portfolio, gallery, dan settings saat page load.
   - Skeleton loader placeholder saat fetching berlangsung.
   - Fallback offline data statis jika request gagal atau kuota Google Apps Script habis.
2. Interactive Showcase & Filter:
   - Filter button: Semua, Branding, Desain, Konten yang responsif dan realtime.
   - Lightbox modal karya: Klik kartu karya untuk melihat foto resolusi penuh, pembuat karya, dan deskripsi detail.
3. Gallery Section:
   - Render grid galeri aktivitas secara dinamis.
4. Design Enhancement:
   - Framer style dark aesthetic, glassy sticky navbar, animated gradient orb, responsive mobile drawer.

### D. GitHub Actions CI/CD (.github/workflows/deploy.yml)
- Workflow on push to main branch.
- Deploy statis otomatis ke GitHub Pages.
