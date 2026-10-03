# Dokumen Pra-Produksi: Website Profil Sekolah SMK Gajah Mungkur 1 Wuryantoro

**Fase:** Pra-Produksi (Pengumpulan Data, Perancangan Sitemap, Riset Kebutuhan & Arsitektur Sistem)  
**Status:** Draf Pra-Produksi Lengkap  
**Dibuat:** 2026-10-01  

---

## 1. Matriks Data & Konten Sekolah

Data inventaris yang diperlukan untuk pengisian konten profil:

### A. Data Kelembagaan & Legalitas
- **Identitas Sekolah:** Nama Resmi, NPSN, Akreditasi, SK Pendirian/Operasional.
- **Profil Pimpinan:** Sambutan Kepala Sekolah, Visi, Misi, Tujuan Strategis.
- **Struktur Organisasi:** Bagan Pimpinan, Ketua Jurusan, Tenaga Pendidik & Kependidikan.
- **Kontak & Lokasi:** Alamat Kampus, Titik Koordinat Peta, Email Resmi, Hotline WhatsApp Admin PPDB.

### B. Data Program Keahlian (Jurusan)
- **Daftar Jurusan:** Profil kompetensi, keunggulan program, fasilitas bengkel/lab.
- **Struktur Kurikulum:** Silabus inti, sertifikasi kompetensi (LSP/BNSP), proyek teaching factory.
- **Kemitraan Industri (DUDI):** Daftar perusahaan rekanan magang/PKL dan rekrutmen lulusan.
- **Peluang Karir / Profil Lulusan:** Jenjang karir industri, wirausaha, atau studi lanjut.

### C. Data Fasilitas & Kehidupan Kampus
- **Fasilitas Pembelajaran:** Lab komputer, bengkel praktik kerja, perpustakaan digital, ruang teori.
- **Fasilitas Penunjang:** Sarana olahraga, tempat ibadah, aula pertemuan, kantin sehat.
- **Aset Visual:** Foto resolusi tinggi (16:9), foto panorama 360° untuk virtual tour, klip video ambient (1080p/4K 60fps).

### D. Data Prestasi & Alumni
- **Prestasi:** Kejuaraan LKS, seni, olahraga, dan penghargaan tingkat regional/nasional.
- **Testimoni Persona:**
  - Orang Tua: Kepercayaan dan pembentukan karakter anak.
  - Siswa Aktif: Pengalaman belajar dan suasana praktik.
  - Alumni: Portofolio karir di industri setelah lulus.
  - Mitra Industri: Kesiapan kerja dan etos lulusan.

---

## 2. Perancangan Sitemap & Arsitektur Informasi (IA)

```
[Level 0: Root]
└── Beranda (Landing Page)
    ├── [0.1] Header & Navigasi Cepat (Sticky Quick Action)
    ├── [0.2] Hero Section (Headline Nilai + Video Ambient + Dual CTA)
    ├── [0.3] Quick Stats & Social Proof (Metrik Lulusan + Marquee Mitra Industri)
    ├── [0.4] Profil Singkat & Sambutan Kepala Sekolah
    ├── [0.5] Program Keahlian (Bento Grid Jurusan + Modal Kurikulum)
    ├── [0.6] Fasilitas & Virtual Tour 360° (Tab Explorer)
    ├── [0.7] Prestasi & Berita Terkini (Dynamic Cards)
    ├── [0.8] Testimoni Multi-Persona (Tab Switcher)
    ├── [0.9] Lead Capture PPDB & Download E-Brosur
    └── [0.10] Footer Komprehensif (Legalitas, Lokasi, Peta, Sosmed)

[Level 1: Halaman Detail / Direktori]
├── /profil
│   ├── Sejarah & Visi Misi
│   ├── Struktur Manajemen & Guru
│   └── Sarana & Prasarana
├── /jurusan
│   ├── /jurusan/[slug-jurusan-1] (Kurikulum, Bengkel, Prospek Karir)
│   ├── /jurusan/[slug-jurusan-2]
│   └── /jurusan/[slug-jurusan-n]
├── /ppdb (Penerimaan Peserta Didik Baru)
│   ├── Alur & Syarat Pendaftaran
│   ├── Biaya & Beasiswa
│   ├── Form Registrasi Online
│   └── Unduh Brosur Panduan PDF
├── /prestasi (Galeri Penghargaan & Rekam Jejak)
├── /berita (Artikel, Kegiatan & Pengumuman Sekolah)
├── /kontak (Lokasi Google Maps, Formulir Pertanyaan, Kontak WA)
└── /admin (Custom Unified Admin Dashboard)
    ├── /admin/login (Autentikasi Admin/Humas)
    ├── /admin/content (Editor Konten Web -> Git Repo Store)
    ├── /admin/leads (Tabel & Filter Data Pendaftar -> Google Sheets)
    └── /admin/media (Upload E-Brosur & Berkas -> Google Drive)
```

---

## 3. Riset Kebutuhan Library, Engine & Tooling

Evaluasi pemilihan engine dan pustaka berdasarkan kebutuhan performa, animasi, dan pemeliharaan:

### A. Core Engine & Framework
| Komponen | Opsi Terpilih | Justifikasi |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router)** | Mendukung Server Components (RSC) untuk SEO tinggi, SSG untuk halaman statis super cepat, dan API routes untuk form handling. |
| **Bahasa Pemrograman** | **TypeScript 5.x** | Type-safety penuh pada data sitemap, skema validasi form, dan props komponen. |
| **CSS Engine** | **Tailwind CSS v3.4+ / v4** | Utility-first, zero runtime overhead, kompatibel dengan design token hybrid JIS x Sampoerna. |

### B. Motion & Micro-Interaction Engine
| Kebutuhan Interaksi | Library Rekomendasi | Peran & Penggunaan |
| :--- | :--- | :--- |
| **Page & Component Motion** | `framer-motion` (`motion/react`) | Transisi tab persona via `layoutId`, stagger scroll entrance, hover lift. |
| **Smooth Scrolling** | `@studio-freight/lenis` | Momentum scroll halus editorial untuk pengalaman browsing premium. |
| **Accessible Primitives** | `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion` | Dialog modal kurikulum, dropdown navigasi, dan accordion FAQ tanpa masalah aksesibilitas. |
| **Iconography** | `lucide-react` | Set icon modern konsisten dengan bobot garis yang seragam. |
| **Visual Gallery / Slider** | `embla-carousel-react` | Carousel ringan berbasis touch-friendly gesture untuk galeri foto dan testimoni. |

### C. Form Validation & Data Handling
| Kebutuhan | Library Rekomendasi | Peran |
| :--- | :--- | :--- |
| **Form State Management** | `react-hook-form` | Handling input ringan tanpa re-render berlebih pada form PPDB. |
| **Schema Validation** | `zod` | Validasi skema nomor WA Indonesia (`+62`), email, dan kelengkapan data pendaftar. |
| **Class Merge Utility** | `clsx` + `tailwind-merge` (`cn` helper) | Penggabungan conditional class Tailwind tanpa konflik styling. |

### D. Media & 360° Viewer Engine
| Kebutuhan | Solusi | Karakteristik |
| :--- | :--- | :--- |
| **360° Virtual Tour** | `pannellum-react` / `@photo-sphere-viewer/core` atau iframe embed 360° | Rendering panorama WebGL ringan tanpa membebani initial bundle size (lazy-loaded). |
| **Image Optimization** | `next/image` | Format WebP/AVIF otomatis, responsive srcset, dan blur placeholder. |

---

## 4. Rencana Kebutuhan Integrasi Backend & Service Pihak Ketiga (GitHub Pages Hybrid Model)

1. **Lead Intake & PPDB Storage (Google Sheets Webhook):**
   - Webhook endpoint via **Google Apps Script Web App** untuk mencatat formulir pendaftaran langsung ke Google Spreadsheet panitia PPDB secara real-time.
2. **Media Storage & File Upload (Google Drive):**
   - File download e-brosur format PDF di-host di Google Drive publik.
   - Unggah berkas calon siswa (foto/ijazah) diproses via Apps Script ke Folder Google Drive panitia.
   - *Catatan Kritis:* Gambar visual UI disimpan di repository (`public/images/`) atau CDN gambar (Cloudinary), bukan direct link Google Drive untuk menghindari limit 403/429.
3. **Custom Unified Admin Dashboard (`/admin`):**
   - Frontend dashboard Next.js terintegrasi untuk mengelola 3 kanal sekaligus:
     - Form visual pembaruan konten web $\rightarrow$ commit ke repositori GitHub (`src/data/`).
     - Monitoring data pendaftar $\rightarrow$ sync dengan Google Sheets API / Apps Script.
     - Upload & ganti file brosur PDF $\rightarrow$ sync dengan Google Drive API / Apps Script.
4. **Direct Messaging (WhatsApp CRM):**
   - Integrasi WhatsApp Click-to-Chat dengan dynamic encoded URL dan preset pesan per kebutuhan (Info Biaya, Pendaftaran, Kunjungan).
5. **E-Brochure Delivery:**
   - Asset PDF tersimpan di Google Drive / Cloud Storage dengan direct trigger download otomatis setelah submit form.
6. **Analytics & Performance Tracking:**
   - Google Analytics 4 (GA4) / Google Tag Manager untuk tracking konversi tombol PPDB dan unduh brosur.

---

## 5. Checklist Kesiapan Pra-Produksi (Pre-Flight Gate)

- [x] Riset UI/UX & Design System (JIS x Sampoerna Academy).
- [x] Spesifikasi animasi & token kurva motion.
- [x] Perancangan Sitemap dan Arsitektur Informasi.
- [x] Pemetaan inventaris data konten sekolah yang dibutuhkan.
- [x] Riset & pemilihan dependensi library/engine.
- [ ] Pengumpulan aset mentah (logo resmi resolusi tinggi, foto kegiatan, sambutan Kepsek).
- [ ] Finalisasi copy text jurusan & keunggulan kompetensi SMK.
