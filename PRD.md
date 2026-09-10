# Product Requirement Document (PRD): SKAGAMU Digital Branding & CMS Admin Panel

## 1. Executive Summary & Tech Stack
- **Project Name**: SKAGAMU Digital Branding & Student Showcase Portal (3-Layer Educational Hierarchy)
- **Target Repository**: `https://github.com/skagamu/website.git`
- **Hosting Target**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- **Database & Backend**: Google Apps Script Web App (`1_lF1z09YUaDnNyhbiaRSLNclUW7NY-n8PLm3BuZGwbsVjp959zmTf0dV`)
- **API URL**: `https://script.google.com/macros/s/AKfycbzJoZ5OjeiUVHNZ6eCl6FSdwpJJre5cLgUQ5Pawr-5_5gSbDJza3c11vL_BjXSVBG7N/exec`
- **Admin Credentials**: Verified dynamic auth from `users` Google Sheet.
- **Design System**: 
  - Landing Page (`index.html`): VoltAgent Framer Dark Canvas (`#090909`, `#262626`, glow `#ff7a3d`/`#6a4cf5`, 1600ms smooth motion).
  - Admin Dashboard (`admin.html`): Windows Explorer / Linear Folder Structure (`#0f1011`, breadcrumb hierarchy, folder cards, media preview player).

---

## 2. 3-Layer Hierarchical Data Schema (Google Sheets)

1. **`babs` Sheet (Modul Pembelajaran)**:
   - `id`: e.g. `bab_1` / `bab_178842...`
   - `title`: Judul Modul (e.g. Modul 1: Identitas & Brand Visual)
   - `description`: Deskripsi lingkup pembelajaran
   - `order`: Urutan tampil (Integer)
   - `created_at`: ISO timestamp

2. **`projects` Sheet (Tugas Proyek di dalam Bab)**:
   - `id`: e.g. `proj_1` / `proj_178842...`
   - `bab_id`: Foreign key referensi ke `babs.id`
   - `title`: Judul Project (e.g. Brand Identity Kopi Wuryantoro)
   - `brief`: Instruksi singkat / capaian tugas
   - `lkpd_url`: File/Link panduan LKPD (Google Docs/PDF/Drive)
   - `deadline`: Target pengumpulan (Date string)
   - `order`: Integer urutan project
   - `created_at`: ISO timestamp

3. **`karya` Sheet (Upload Karya Siswa di dalam Project)**:
   - `id`: e.g. `kar_1` / `kar_178842...`
   - `project_id`: Foreign key referensi ke `projects.id`
   - `title`: Judul Karya Siswa
   - `student_name`: Nama Siswa Pembuat
   - `class`: Kelas / Jurusan (e.g. XI DKV 1)
   - `media_type`: `image` | `video` | `link`
   - `media_url`: Direct URL Google Drive, YouTube embed URL, atau Link External
   - `description`: Refleksi & narasi karya siswa
   - `status`: `published` | `draft`
   - `created_at`: ISO timestamp

4. **`gallery` Sheet**:
   - `id`, `title`, `image_url`, `order`, `created_at` (16 curated masonry activity photos).

5. **`settings` Sheet**:
   - Key-value metadata website (`hero_title`, `contact_email`, dll).

6. **`users` Sheet**:
   - `username`, `password`, `name`, `role`, `created_at`.

---

## 3. UI/UX Specifications

### A. Admin Panel Explorer (`admin.html` & `assets/js/admin.js`)
- **Breadcrumb Navigation**: `Semua Modul` > `[Nama Modul]` > `[Nama Project]`.
- **Level 1 (All Projects / Modul)**: Grid folder cards dengan indikator jumlah project & karya di dalamnya + tombol `+ Tambah Modul`.
- **Level 2 (Modul View)**: List project cards dalam modul terkait + tombol `+ Tambah Project`.
- **Level 3 (Project View)**: Header instruksi tugas + info/link LKPD + Grid karya siswa + tombol `+ Upload Karya Siswa` (mendukung image compressor, video URL, & link).

### B. Frontend Showcase (`index.html` & `assets/js/app.js`)
- Menampilkan **6 Karya Siswa Terbaru** (status `published`).
- Tag label konteks: `[Nama Modul] • [Nama Project]`.
- Modal Lightbox: Full resolution viewer (Image/Video/Link) + info siswa + deskripsi karya + link acuan LKPD.
- Editorial masonry gallery untuk dokumentasi kegiatan.
