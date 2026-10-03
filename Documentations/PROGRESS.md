# Progress & Activity Log — Website SMK Gajah Mungkur 1 Wuryantoro

Dokumen pelacak status implementasi, matriks fase SDLC, changelog, status task Kanban, dan template standar pencatatan progress.

---

## 1. Ringkasan Status Proyek

- **Fase Aktif Saat Ini:** Persiapan Integrasi Konten Asli & Deployment (Fase 5). Fase Pengembangan dan QA komponen UI telah 100% selesai.
- **Design System:** Hybrid JIS x Sampoerna Academy (Deep Navy `#0C2340`, Slate `#1E3A8A`, Energy Crimson `#E11D48`, Amber `#F59E0B`)
- **Tech Stack Terpilih:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Radix UI, Lucide React, Embla Carousel, Zod + React Hook Form
- **Dokumen Referensi:** `SPESIFIKASI_WEBSITE.md`, `PRA_PRODUKSI.md`, `PRD.md`

---

## 2. Matriks Roadmap SDLC (Software Development Life Cycle)

| No | Fase SDLC | Cakupan & Deliverables | Status | Dokumen Terkait |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Inisiasi & Riset (Discovery)** | Riset audiens, benchmark (JIS, Sampoerna, ACS), standar requirement fungsional & non-fungsional. | **Selesai** | `PRD.md`, `SPESIFIKASI_WEBSITE.md` |
| **2** | **Perancangan (Design & Architecture)** | Sitemap, arsitektur informasi, design tokens (warna, tipografi, motion), inventaris data pra-produksi. | **Selesai** | `PRA_PRODUKSI.md`, `SPESIFIKASI_WEBSITE.md` |
| **3** | **Pengembangan (Development)** | Slicing komponen modular, integrasi interaksi (PPDB, bento grid, carousel), routing halaman. | **Selesai** | `src/app/`, `src/components/` |
| **4** | **Pengujian (Quality Assurance / QA)** | Uji fungsional form, validasi responsivitas, audit UI/UX komponen. | **Selesai** | `tests/` |
| **5** | **Peluncuran (Deployment & Release)** | Setup hosting/Vercel/server, domain, SSL, metadata SEO, analitik. | **Selesai (GitHub Pages)** | `.github/workflows/deploy.yml`, `next.config.mjs` |
| **6** | **Pemeliharaan & Evaluasi (Maintenance)** | Monitoring uptime, perbaikan bug pasca-rilis, evaluasi metrik konversi lead PPDB. | **Pending** | - |

---

## 3. Kanban Board Tracker

| ID Task | Judul Task | Prioritas | Status | Assignee / Worker | Hasil / Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| FR-01 s/d FR-09 | Full UI Components & Pages Development | Tinggi | Selesai / Siap Konten Asli | AI coding agent & QA agent | Komponen lengkap & sub-pages terintegrasi di `smk-profile/` |

---

## 4. Log Penyelesaian & Changelog

### 2026-10-03 — Admin Panel CMS & Deployment (Fase 5)
1. **GitHub Pages Deployment & Git-Backed CMS:**
   - Dikerjakan oleh: AI coding agent
   - Fase SDLC: Fase 5 (Peluncuran)
   - Perubahan / Output: Migrasi state JSON lokal ke Custom CMS berbasis Octokit API. Setup GitHub Actions (`deploy.yml`) untuk Next.js static export ke repositori `skagamu/website`. Penyesuaian `basePath: "/website"` di next config dan manifest.
   - Status Verifikasi: CI/CD berhasil, situs live, login/edit admin via CMS sukses. Update styling UI form admin beres.

### YYYY-MM-DD — Penyelesaian UI Components & Pages (Fase 3 & 4)
1. **Pengembangan Seluruh Halaman & Komponen (FR-01 s/d FR-09):**
   - Dikerjakan oleh: AI coding agent (Sesi Coder & Sesi QA).
   - Fase SDLC: Fase 3 (Development) & Fase 4 (QA).
   - Perubahan / Output: Pembuatan komponen inti (HeroHub, ManifestoSection, ProgramKeahlianBento, AlumniCarousel, EventCarousel, TeacherProfile, SchoolGallery, GlobalNavbar, GlobalFooter) dan halaman sekunder (`app/program`, `app/tentang-kami`, `app/kabar-sekolah`).
   - Status Verifikasi: Selesai di-QA dan di-build. Komponen modular berhasil terintegrasi dengan App Router Next.js. Siap untuk tahap integrasi data rill dan deployment.

### Implementasi Hero Hub (FR-01)
1. **Hero Hub Carousel:**
   - Dikerjakan oleh: AI coding agent.
   - Fase SDLC: Fase 3 dan 4.
   - Perubahan / Output: aplikasi Next.js 15.5.27 App Router di `smk-profile`, komponen `components/HeroHub.tsx`, Tailwind tokens, next/font, media lokal foto/video, dan tes Playwright.
   - Referensi: PRD dan spesifikasi dibaca paralel dengan execute/Promise.all; Hero JIS ditemukan di `jis-clone/src/App.tsx` karena direktori `src/components` tidak tersedia.
   - Fitur: crossfade, staggered headline, dual CTA, kontrol 48×48 px, timeline transform, pause/resume tersinkron video, keyboard, reduced-motion, pause tab tersembunyi/keluar viewport.
   - Status Verifikasi: build dan TypeScript lulus; 8 tes browser lulus pada 320–1440 px; Lighthouse Accessibility/Best Practices/SEO masing-masing 100. Core Web Vitals belum diukur.
   - Integrasi: URL PPDB dan 360° disediakan melalui props; modul FR-08/FR-04 belum dibuat. Media stok diberi label ilustrasi, menunggu aset dokumentasi sekolah.

---

## 5. Template Standar Update Task (Aturan Tiap Selesai Task)

Setiap kali menyelesaikan task baru, format berikut wajib ditambahkan ke Changelog dan tabel Kanban di atas:

```markdown
### YYYY-MM-DD — [Judul Task] ([TASK-ID])
1. **[Nama Fitur / Modul]:**
   - Dikerjakan oleh: [Assignee / Agent Persona]
   - Fase SDLC: [Fase 1 / 2 / 3 / 4 / 5 / 6]
   - Perubahan / Output: [File yang dibuat/diedit & ringkasan hasil]
   - Status Verifikasi: [LSP clean / Test passed / Menunggu Review]
```

---

## 6. Item Berikutnya (Fase Pra-Produksi)

1. *(Daftar pekerjaan selanjutnya akan dicatat di sini)*
