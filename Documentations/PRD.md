# Product Requirement Document (PRD): Website Profil SMK Gajah Mungkur 1 Wuryantoro

**Fase:** Pra-Produksi  
**Status:** Draf Final PRD & Standar Kebutuhan  
**Disusun oleh:** Prabowo (Project Manager) via Firecrawl Research  
**Tanggal:** 2026-10-01  

---

## 1. Overview & Best Practices
Website SMK modern menjembatani institusi pendidikan vokasi dengan Dunia Usaha & Dunia Industri (DUDI). Mengadaptasi arsitektur **Hybrid UI/UX System** berbasis 3 benchmark institusi pendidikan kelas dunia:
- **Prestige & Community Storytelling:** JIS (*Jakarta Intercultural School*) — otoritas kelembagaan, tur 360°, dan penyerapan universitas/industri.
- **Editorial Cleanliness & Narrative Stacking:** Avenues: The World School (`avenues.org`) — manifesto tipografi tebal, modular index story (`01/04`), dan kartu profil pimpinan terstruktur.
- **Conversion-Optimized & Dynamic Bento:** Sampoerna Academy — lead capture instan via WhatsApp, interaktif bento grid, dan segmented filter persona.
- **Compliance:** Kepatuhan ISO/IEC 25010 (Kualitas Perangkat Lunak) & WCAG 2.1 AA (Aksesibilitas).

---

## 1.1 Deep Benchmark & Competitive Audit (JIS vs Avenues: The World School)

| Dimensi Evaluasi | Jakarta Intercultural School (JIS - `jisedu.or.id`) | Avenues: The World School (`avenues.org`) | Rekomendasi Sintesis (SMK Gajah Mungkur 1) |
| :--- | :--- | :--- | :--- |
| **Brand Archetype** | Institutional Legacy, Prestisius, Otoritatif (70+ tahun sejarah) | Ultra-Modern, Global Vanguard, Editorial & Futuristik | **Modern Vocational Vanguard** (Kredibel + Siap Kerja) |
| **Visual Architecture** | Deep Navy (`#014694`), layout modular formal, density seimbang | Minimalis monokromatik, white-space luas, typography-forward | **Navy-Slate-Amber Hybrid** (Otoritas Navy + Aksen Energi) |
| **Hero Strategy** | Full-width ambient video loop + 1 authoritative value prop | Bold statement manifestos + minimal hero + high-contrast text | **Ambient Video Bengkel/Praktik + Dual CTA Konversi** |
| **Narrative Stacking** | Segmented tabs per jenjang / topik (Admissions, Academics, Tour) | Numbered slide story cards (`01/04`) dengan visual & copy berdampingan | **Numbered Bento Modules (`01/05`)** untuk tiap jurusan & sarpras |
| **Social Proof System** | Grid logo universitas dunia (Harvard, Stanford, Cambridge) | Feature quote cards pimpinan kampus + news card terindeks waktu baca | **Marquee Logo DUDI (Astra, PAMA, dll) + Quote Card Kepala Sekolah** |
| **Exploration Mode** | Virtual Tour 360° interaktif multi-kampus (Pattimura, Pondok Indah) | Campus multi-city switcher (New York, São Paulo) & event calendar | **Interactive 360° Workshop Explorer + Jurusan Quick Filter** |
| **Lead Generation Flow**| Multistep form terstruktur, Tour Booking, AI Chatbot ("Ask JIS") | Direct Request Info modal per kampus + event registration | **Multi-step Quick PPDB Form + Instant E-Brochure Download + Direct WA** |
| **Content Storytelling**| JIS Blog artikel mendalam, fast facts, alumni spotlight | "World of Avenues" (artikel inovasi siswa, estimasi waktu baca `3 mins read`) | **Katalog Prestasi & Kisah Sukses Lulusan Berbasis Estimasi Baca** |

---

## 2. Functional Requirements (FR) & AIDA Narrative Flow

### 2.0 Urutan Narasi Halaman Utama (AIDA Narrative Architecture)
1. **[ATTENTION] FR-01: Hero Hub** — Video/photo carousel, dual navigation arrow (48x48px tap target), timeline progress bar, pause/play control.
2. **[AWARENESS] FR-02: Visi Misi Manifesto ("Why We Exist")** — Avenues editorial style, high-contrast bold typography, kinetic highlight text, numbered cards (`01/03`).
3. **[INTEREST] FR-03: Program Keahlian / 3 Jurusan Unggulan** — Grid 3 kartu jurusan independen (1 Card 1 Jurusan):
   - *Teknik Kendaraan Ringan (TKR)*
   - *Bisnis Digital*
   - *Akuntansi & Keuangan Lembaga*
   Masing-masing card memuat badge kompetensi, rasio serapan DUDI, dan visual workshop/lab.
4. **[EVIDENCE] FR-04: Fasilitas & Lab Praktik (Virtual Tour 360°)** — Interactive panorama viewer 360°, hotspot spesifikasi alat bengkel, modal immersive full-screen.
5. **[VALIDATION - ALUMNI] FR-05: Rekam Jejak Alumni & Karir (Community Voices - Alumni)** — JIS style quote cards, logo perusahaan tempat bekerja, jabatan/angkatan, video snippet kisah sukses.
6. **[VALIDATION - GURU] FR-06: Tenaga Pendidik & Mentor Industri (Faculty & Mentors)** — Card grid pengajar, badge sertifikasi kompetensi industri, latar belakang keahlian praktisi.
7. **[CULTURE] FR-07: Event & Agenda Sekolah** — JIS style colored background carousel, mini calendar badge (`TGL/BLN`), status event (*Upcoming / Selesai*), direct RSVP/detail.
8. **[ACTION] FR-08: Lead Capture & PPDB Online** — Multi-step wizard (max 4 field esensial tahap 1), auto-masking WhatsApp (`+62`), auto-trigger download e-brosur PDF, webhook pendaftaran.
9. **[COMPLIANCE] FR-09: Footer Semantik & Legalitas** — 4 kolom: (1) Brand, NPSN & Akreditasi BAN-SM, (2) Navigasi Cepat, (3) Layanan & PPDB, (4) Peta Terverifikasi Google Maps + Kontak Resmi.
10. **[MANAGEMENT] FR-10: Custom Integrated Admin Dashboard (`/admin`)** — Portal admin terpadu satu pintu untuk mengelola 3 database:
    - *Konten Web:* Form CRUD visual untuk update file data repo (`src/data/*.ts`) via GitHub API / Octokit.
    - *Lead PPDB:* Monitor, filter, search, & ekspor data pendaftar dari Google Sheets via Apps Script Web App.
    - *Media & Dokumen:* Upload berkas brosur & panduan PDF langsung ke Google Drive panitia via Apps Script.

---

### 2.1 Spesifikasi Detail Tiap Modul

#### FR-01: Hero Hub Carousel (JIS Standard)
- Support kombinasi video loop background dan foto resolusi tinggi.
- Navigasi panah kiri/kanan dengan target sentuh minimal 48x48px (standar WCAG & Mobile HIG).
- Linear timeline progress bar untuk indikator durasi slide aktif.
- Tombol toggle pause/play eksplisit dan kepatuhan `prefers-reduced-motion`.

#### FR-02: Visi Misi "Why We Exist" (Avenues Standard)
- Tipografi sans-serif tebal (Plus Jakarta Sans) dengan kontras tinggi pada background off-white.
- Kinetic highlight scroll animation pada kata kunci misi vokasi.
- 3 kartu poin turunan misi bernomor urut (`01`, `02`, `03`).

#### FR-03: Program Keahlian (3 Dedicated Major Cards)
- 3 Kartu Jurusan:
  1. **Teknik Kendaraan Ringan (TKR):** Fokus teknologi otomotif modern, sertifikasi mesin injeksi & kelistrikan kendaraan, mitra bengkel resmi.
  2. **Bisnis Digital:** Fokus e-commerce, digital marketing, content creation & social media strategy, sertifikasi marketplace.
  3. **Akuntansi & Keuangan Lembaga:** Fokus software akuntansi modern, perpajakan, perbankan syariah/konvensional, sertifikasi teknisi akuntansi.
- Setiap card menampilkan: Gambar representatif, badge sertifikasi, daftar mitra industri utama, dan CTA detail silabus.

#### FR-04: Fasilitas Kampus & Bengkel 360° Explorer
- Panorama 360° interaktif dengan kontrol drag mouse/touch.
- Hotspot titik info spesifikasi peralatan teknis bengkel/lab komputer.
- Fullscreen immersive modal.

#### FR-05: Jejak Alumni & Karir (Community Voices - Alumni)
- Fokus pada *Social Proof & Career Outcomes*.
- Data point: Nama alumni, tahun kelulusan, jabatan, logo perusahaan DUDI tempat bekerja.
- Format quote card dengan typography quote marks bergaya editorial.

#### FR-06: Tenaga Pendidik & Mentor Industri (Faculty & Mentors)
- Profil guru produktif dan praktisi industri pengajar tamu.
- Badge sertifikasi profesi (BNSP, Asesor Vokasi, Sertifikasi Industri).

#### FR-07: Event & Agenda Sekolah (Colored Background Carousel)
- Horizontal carousel dengan variasi warna latar card terkalibrasi (WCAG AA ratio >= 4.5:1).
- Badge tanggal kalender format kotak (`12 / OKT`).
- Indikator status event (*Upcoming*, *Live*, *Completed*).

#### FR-08: Lead Capture PPDB & WhatsApp Automation
- Form ringkas 4 field: Nama Lengkap, No. WhatsApp (masking `+62`), Pilihan Jurusan (TKR / Bisnis Digital / Akuntansi), Asal SMP.
- Pengiriman data via webhook handler + auto-download file PDF brosur resmi.
- Floating WhatsApp widget dengan preset pesan pendaftaran instan.

#### FR-09: Footer Semantik & Legalitas Kelembagaan
- 4 Kolom semantik: Identitas & NPSN, Navigasi Utama, Layanan Siswa & PPDB, Alamat Google Maps & Kontak Resmi.

#### FR-10: Custom Integrated Admin Dashboard (`/admin`)
- **Single-Door Management:** Panel visual terintegrasi khusus admin/humas di rute `/admin`.
- **Modul 1: Manajemen Konten Web (Git Data Store):**
  - Form editor visual (Event, Guru, Jurusan, Testimoni, Sambutan, Visi Misi).
  - Integrasi GitHub Rest API / Octokit untuk commit perubahan JSON langsung ke branch `main`.
  - Preview real-time sebelum publish.
- **Modul 2: Pendaftar & Lead PPDB (Google Sheets Bridge):**
  - Tabel data calon siswa terintegrasi Google Apps Script API.
  - Fitur pencarian, filter status (Pending/Terverifikasi), dan export rekap data.
- **Modul 3: Berkas & Media Hub (Google Drive Bridge):**
  - Interface upload file brosur/SK resmi langsung ke Google Drive folder panitia via Apps Script.
  - Copy/paste otomatis direct download ID ke konfigurasi situs.
- **Autentikasi & Keamanan:**
  - Login via GitHub OAuth (Personal Access Token / GitHub App) atau PIN + Session Storage tersandi.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Keamanan (Security)
- **NFR-SEC-01:** Enkripsi HTTPS/TLS 1.3 in-transit dan at-rest.
- **NFR-SEC-02:** Sanitasi dan validasi input (Zod) untuk mencegah XSS & SQLi.
- **NFR-SEC-03:** Rate limiting proteksi form PPDB terhadap spam bot.

### 3.2 Aksesibilitas (WCAG 2.1 AA)
- **NFR-ACC-01:** Rasio kontras warna tinggi (Deep Navy `#0C2340` vs Off-White `#F8FAFC`).
- **NFR-ACC-02:** Navigasi keyboard penuh (focus rings, tab index teratur).
- **NFR-ACC-03:** Label ARIA pada seluruh elemen interaktif & viewer 360°.

### 3.3 Kinerja (Core Web Vitals)
- **NFR-PERF-01:** LCP (*Largest Contentful Paint*) < 2.5 detik.
- **NFR-PERF-02:** FID (*First Input Delay*) < 100 milidetik / INP < 200 milidetik.
- **NFR-PERF-03:** CLS (*Cumulative Layout Shift*) < 0.1.
- **NFR-PERF-04:** Lazy loading pada panorama 360° dan aset visual berat.

### 3.4 SEO & Responsivitas (ISO/IEC 25010)
- **NFR-SEO-01:** Struktur semantik HTML5, OpenGraph tags, dan schema JSON-LD `EducationalOrganization`.
- **NFR-RES-01:** Sistem grid fluid 8pt responsif untuk mobile (320px) hingga ultra-wide desktop.

---

## 4. User Personas & Journey Mapping

### Persona 1: Calon Siswa
- **Karakter:** Gen Z, visual-driven, prioritas mobile device.
- **Kebutuhan:** Mencari jurusan favorit, fasilitas keren, dan ekskul menarik.
- **Journey:** Homepage → Eksplorasi Bento Jurusan → Virtual Tour 360° → WhatsApp Chat / PPDB.

### Persona 2: Orang Tua / Wali
- **Karakter:** Mengutamakan legalitas, akreditasi, biaya transparan, dan jaminan kerja.
- **Kebutuhan:** Memastikan prospek kerja lulusan, keamanan lingkungan, dan reputasi sekolah.
- **Journey:** Homepage → Cek Akreditasi & Testimoni → Cek Mitra DUDI → Unduh E-Brosur via Form.

### Persona 3: Mitra Industri / DUDI
- **Karakter:** HRD / Divisi CSR Perusahaan.
- **Kebutuhan:** Menilai keselarasan kurikulum vokasi untuk penyaluran PKL/magang dan rekrutmen.
- **Journey:** Direktori Kemitraan → Cek Roadmap Jurusan → Kontak Kerjasama Industri.

### Persona 4: Asesor Akreditasi & Pemerintah
- **Karakter:** Pejabat dinas pendidikan / tim akreditasi.
- **Kebutuhan:** Verifikasi kelengkapan sarana, legalitas, dan transparansi institusi.
- **Journey:** Halaman Profil / Legalitas → Verifikasi Fasilitas 360° → Data Prestasi & Lulusan.

---

## 5. Entitas Data Inti (Data Model)
- **`StudentLead`**: `id`, `name`, `phone`, `email`, `interested_program_id`, `status`, `created_at`.
- **`AcademicProgram`**: `id`, `name`, `slug`, `description`, `competency_tags`, `roadmap_json`.
- **`Facility`**: `id`, `name`, `panorama_url`, `hotspots_json`, `category`.
- **`DUDIPartner`**: `id`, `company_name`, `logo_url`, `partnership_type`, `mou_status`.

---

## 6. Strategi Deployment & Manajemen Data (GitHub Pages & Hybrid Architecture)

### 6.1 Deployment Target
- **Platform:** GitHub Pages (`output: 'export'`, SSG HTML/CSS/JS statis murni).
- **CI/CD:** GitHub Actions workflow auto-deploy on push to `main`.

### 6.2 Data & Content Management Strategy (Custom Unified Admin Model)
1. **Custom Unified Dashboard (`/admin`):**
   - Frontend Next.js dedicated page (`/admin`) sebagai pusat kendali tunggal (Single Sign-On / Single Interface).
   - Pengganti Decap CMS murni dengan form UI kustom yang disesuaikan persis dengan skema data SMK.
2. **Koneksi Multi-Database Terpadu:**
   - **Repository GitHub (`src/data/`):** CRUD konten profil sekolah dikirim via GitHub Contents API / Octokit.
   - **Google Sheets (Lead Database):** Pembacaan & pembaruan status pendaftar PPDB via endpoint Google Apps Script.
   - **Google Drive (Asset Hub):** Pengunggahan e-brosur PDF & berkas pendaftaran via Apps Script Multipart Upload ke Google Drive Panitia.
   - **UI Assets Cache:** Aset gambar visual tetap disajikan via folder `public/images/` untuk menjamin skor LCP optimal.
