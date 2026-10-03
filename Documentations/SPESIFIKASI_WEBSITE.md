# Spesifikasi Desain & Kebutuhan Website Profil Sekolah
**Basis:** Hybrid Design System JIS (*Jakarta Intercultural School*) x Sampoerna Academy  
**Status:** Draf Final Spesifikasi & Arsitektur

---

## 1. Audit Komparatif UI/UX (Tri-Benchmark: JIS vs Avenues vs Sampoerna)

| Dimensi | Jakarta Intercultural School (JIS) | Avenues: The World School | Sampoerna Academy | Rekomendasi SMK Gajah Mungkur 1 |
| :--- | :--- | :--- | :--- | :--- |
| **Archetype Style** | Institutional Modern / Prestisius | Ultra-Modern Vanguard / Editorial | Vibrant STEAM / Dynamic Modern | **Modern Vocational Vanguard** |
| **Brand Tone** | Otoritatif, global, terstruktur | Futuristik, intelektual, transformatif | Energik, inovatif, ramah keluarga | **Otoritatif, siap kerja, terpercaya** |
| **Primary Color** | Deep Navy (`#014694`) | Pure Black (`#000000`), Clean White | Indigo Navy (`#292F78`) | Deep Navy (`#0C2340`) |
| **Accent / CTA** | Vivid Blue (`#1F78D8`), Cyan | Subtle Monochrome / High Contrast | Crimson Red (`#CE3827`), Blue | Electric Amber (`#F59E0B`), Rose (`#E11D48`) |
| **Background** | Neutral White (`#FFFFFF`), Slate | Ultra Clean White, Off-White (#F5F5F5) | Clean White (`#FFFFFF`), Soft Blue | Pristine White & Deep Slate (`#0B132B`) |
| **Typography** | Neue Haas Grotesk (Sharp Neo-Grotesk) | Editorial Sans-Serif / Clean Display | Campton (Geometric Rounded Sans) | Plus Jakarta Sans + Inter (Sharp & Readable) |
| **Narrative Format** | Segmented Persona Tabs, Fast Facts | Numbered Card Carousel (`01/04`), Manifestos | Bento Grid Jenjang, Dynamic Banners | **Hybrid Bento + Numbered Competency Modules** |
| **Hero Section** | Background video + 1 Value Proposition | Bold Typography Statement + Video/Image | Multi-carousel + Tagline Punchy | **Ambient Video Bengkel + Dual CTA (PPDB & 360°)** |
| **Social Proof** | World Top Universities Logos (Harvard, etc.) | Leader Feature Quotes + Student Research News | Partner Grid + Testimonial Switcher | **Marquee Logo Mitra DUDI + Testimoni Multi-Persona** |
| **Exploration Mode** | Virtual Tour 360° multi-kampus | Multi-campus explorer & Event Calendar | Interactive filter program keahlian | **Interactive 360° Workshop Explorer + Bento Grid** |
| **Lead Generation** | Multistep Form, Booking, Chatbot | Request Info Modal per lokasi | Floating WhatsApp, Inline Quick Form | **Multi-Step PPDB Form + Instant E-Brochure + Direct WA** |

---

## 2. Blueprint Design System Hibrida

### A. Design Tokens
- **Primary (60%):** Deep Institutional Navy (`#0C2340` / `#1E3A8A`)
- **Secondary (30%):** Clean Off-White & Slate Tint (`#F8FAFC`, `#FFFFFF`)
- **Accent / CTA (10%):** Energy Crimson (`#E11D48`) / Electric Amber (`#F59E0B`)
- **Text Primary:** Charcoal Slate (`#0F172A`)
- **Text Muted:** Cool Gray (`#64748B`)

### B. Typography Tokens
- **Display / Hero:** Plus Jakarta Sans / Inter Tight — Bold 48-56px (LH: 1.1)
- **H1 / Section:** Plus Jakarta Sans — SemiBold 32-40px (LH: 1.2)
- **H2 / Cards:** Plus Jakarta Sans — Medium 20-24px (LH: 1.3)
- **Body Regular:** Inter / Roboto — Regular 16px (LH: 1.6)
- **Caption / Tag:** Inter — SemiBold 12-14px (Letter Spacing: +0.05em)

### C. Spatial & Elevation
- **Grid System:** 8pt Grid (Padding: 16 / 24 / 32 / 48 / 64 / 96px)
- **Border Radius:** `md` (8px) untuk Cards, `full` (9999px) untuk Buttons/Badges
- **Elevation:** `0 4px 20px -2px rgba(12, 35, 64, 0.06)`

---

## 3. Arsitektur Informasi & UX Flow (AIDA Flow)

```
1. Header / Global Nav
   ├── Brand Logo SMK + Badge Akreditasi BAN-SM
   ├── Navigasi: Profil & Visi, Jurusan (TKR, Bisnis Digital, Akuntansi), Fasilitas 360°, Alumni, Guru, Event
   └── Sticky Quick Action: [Unduh Brosur PDF] + [Daftar PPDB Online]

2. [ATTENTION] FR-01: Hero Hub (JIS Style Carousel)
   ├── Video loop & hi-res photo slide combination
   ├── 48x48px accessible arrow navigation + linear timeline progress bar
   ├── Accessible pause/play controls (prefers-reduced-motion compliant)
   └── Dual CTA: Solid [Daftar PPDB] + Ghost [Jelajahi Fasilitas 360°]

3. [AWARENESS] FR-02: Visi Misi Manifesto ("Why We Exist" - Avenues Style)
   ├── Bold typographic manifesto statement
   ├── Kinetic text highlight scroll animation
   └── 3 Numbered cards (`01`, `02`, `03`) misi institusi

4. [INTEREST] FR-03: Program Keahlian (1 Card 1 Jurusan)
   ├── 3 Dedicated major cards:
   │   ├── Card 1: Teknik Kendaraan Ringan (TKR)
   │   ├── Card 2: Bisnis Digital
   │   └── Card 3: Akuntansi & Keuangan Lembaga
   └── Konten tiap card: Visual lab/bengkel, badge sertifikasi industri, mitra DUDI, CTA silabus

5. [EVIDENCE] FR-04: Campus Experience & Virtual Tour 360°
   ├── Interactive 360° panorama drag explorer
   ├── Hotspot detail peralatan teknis lab & bengkel
   └── Fullscreen immersive modal view

6. [VALIDATION - ALUMNI] FR-05: Rekam Jejak Alumni (Community Voices - Alumni)
   ├── Quote cards testimoni alumni
   └── Data kredensial: Nama, tahun lulus, jabatan, logo perusahaan DUDI tempat bekerja

7. [VALIDATION - GURU] FR-06: Tenaga Pendidik & Mentor Industri (Faculty & Mentors)
   ├── Card grid guru produktif & praktisi industri
   └── Profil keahlian, sertifikasi asesor/BNSP, dan mata pelajaran kejuruan

8. [CULTURE] FR-07: Event & Agenda Sekolah (Colored Background Carousel)
   ├── Horizontal card carousel dengan background warna terkalibrasi (WCAG AA)
   ├── Mini calendar badge (`TGL/BLN`)
   └── Status event (*Upcoming*, *Live*, *Selesai*) + Direct RSVP / Detail

9. [ACTION] FR-08: Lead Capture & PPDB Online
   ├── Multi-step quick wizard (Nama, WA +62, Pilihan 3 Jurusan, Asal Sekolah)
   ├── Webhook handler + auto-download file PDF brosur resmi
   └── Floating WhatsApp action center dengan preset message

10. [COMPLIANCE] FR-09: Footer Semantik & Legalitas
    ├── Kolom 1: Brand Identitas, NPSN, SK Operasional & Status Akreditasi BAN-SM
    ├── Kolom 2: Navigasi Cepat Halaman & Jurusan
    ├── Kolom 3: Layanan Siswa, PPDB, Unduh Brosur & Kontak DUDI
    └── Kolom 4: Alamat Terverifikasi Google Maps, Telepon Resmi, Media Sosial
```

---

## 4. Audit Animasi & Micro-Interactions (JIS vs Sampoerna)

| Elemen / Komponen | Jakarta Intercultural School (JIS) | Sampoerna Academy | Rekomendasi Blueprint Hibrida |
| :--- | :--- | :--- | :--- |
| **Hero Motion** | Background video loop (15s) + subtle fade-up text entrance (`duration: 0.6s, easeOut`). | Dynamic carousel slide + bouncing scroll-down indicator. | **Ambient Video + Staggered Hero Text Entrance** (Framer Motion). |
| **Hover State Card** | Subtle image zoom (`scale: 1.04`, `duration: 0.4s`) di dalam `overflow: hidden`. | Elevation lift (`translateY(-6px)`) + shadow expansion. | **Hybrid Card:** `translateY(-4px)` + Image `scale: 1.03` + CTA arrow nudge `+4px`. |
| **Social Proof / Partner**| Seamless infinite horizontal marquee (pause on hover). | Grid static logo kampus dengan opacity transisi. | **Infinite Logo Marquee** (CSS / Framer Motion ticker) dengan hover pause. |
| **Tabbed Switcher** | Smooth cross-fade tab content (`opacity: 0 -> 1`, `y: 6px -> 0`). | Quick tab switch dengan active pill indicator. | **Layout Animated Tab Bar** (`layoutId` active pill di background tab). |
| **Lead / Floating CTA** | Expandable floating chatbot ("Ask JIS") sudut kanan bawah. | Dual sticky button (WhatsApp + Note/Apply) dengan subtle pulse. | **Sticky Quick Bar + Floating WhatsApp** dengan entry spring motion. |
| **Scroll Trigger** | Natural standard viewport reveal. | Lazy-loaded media & card appearance. | **Viewport Reveal Trigger** (`whileInView`, `viewport: { once: true, margin: "-80px" }`). |

---

## 5. Token & Kurva Motion (Framer Motion / Tailwind)

```ts
// Motion Tokens & Easing Curves
export const motionTokens = {
  ease: {
    smooth: [0.25, 0.1, 0.25, 1.0],      // Default UI transitions
    springy: [0.175, 0.885, 0.32, 1.275], // Micro-interactions / CTAs
    gentle: [0.4, 0.0, 0.2, 1.0],         // Large card / modal entrances
  },
  duration: {
    fast: 0.2,   // Hover, click feedback, icon nudges
    base: 0.35,  // Tab switch, dropdown, card lifts
    smooth: 0.6, // Hero entrance, section scroll reveals
  },
};

// Preset Framer Motion Variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } 
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
```

---

## 6. Spesifikasi Teknis & Kebutuhan Pengembangan (PRD)

### A. Tech Stack Lengkap

1. **Framework & Styling:**
   - **Frontend Framework:** Next.js (App Router, SSG/ISR) atau Astro (Zero-JS default).
   - **Styling Core:** Tailwind CSS + `tailwindcss-animate`.
   - **UI Primitives:** Radix UI (`@radix-ui/*`) untuk accessible components (Modal, Dropdown, Accordion).
   - **Icon System:** Lucide React (`lucide-react`) dengan motion transitions.

2. **Animation & Micro-Interactions Engine:**
   - **Core Motion:** Framer Motion (`motion/react`)
     - Scroll reveals (`whileInView`, `viewport: { once: true }`).
     - Staggered children transitions (`staggerContainer`).
     - Tab & layout morphing (`layoutId` active indicator).
     - Hover/tap micro-interactions (`whileHover`, `whileTap`).
   - **Smooth Scrolling (Opsional / Extended):** Lenis (`lenis`) untuk momentum scroll premium.
   - **Touch Slider / Carousel:** Embla Carousel / Swiper untuk galeri & testimoni.

### B. Fitur & Integrasi Fungsional (GitHub Pages Architecture)
1. **PPDB & Intake System (Google Sheets & Apps Script):**
   - Form pendaftaran awal terhubung ke Webhook Google Apps Script $\rightarrow$ auto-append baris Google Sheets panitia.
   - Normalisasi & validasi nomor WhatsApp otomatis (`+62`).
2. **Custom Unified Admin Dashboard (`/admin`):**
   - Dashboard frontend terpadu berbasis Next.js untuk operasional satu pintu Humas & Panitia PPDB:
     - **Editor Konten Web:** Form interaktif mengedit `src/data/*.ts` via GitHub API commit.
     - **Lead Monitor:** Tabel pemantauan pendaftar langsung terhubung ke Google Sheets.
     - **Media & Doc Manager:** Interface upload brosur PDF & SK ke Google Drive panitia via Apps Script.
3. **Downloadable Brochure & File Storage (Google Drive):**
   - Unduh e-brosur PDF resmi via Google Drive direct link.
   - Berkas pendaftar diunggah via Apps Script ke folder Google Drive internal sekolah.
   - Aset visual UI tetap di `public/images/` untuk menjamin LCP < 2s dan mencegah rate-limit.
4. **Interactive Virtual Tour:**
   - Embed viewer 360° responsif tanpa menurunkan Core Web Vitals.

### C. Standar Kualitas (Non-Functional)
- **Performance:** Google Lighthouse Score >= 90 (Mobile & Desktop).
- **Aksesibilitas:** Standar WCAG 2.1 AA (kontras teks >= 4.5:1, target tap >= 48px).
- **Responsif:** Fluid layout pada 375px (Mobile), 768px (Tablet), 1280px/1440px (Desktop).
