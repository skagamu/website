// ============================================================================
// TYPE DEFINITIONS — Data Layer JSON
// ============================================================================
// Semua interface di bawah mendefinisikan struktur file JSON di /data.
// Admin Panel (FR-10) nantinya melakukan commit ke file JSON tersebut via
// GitHub API; TypeScript akan menjaga kontrak bentuk data tetap aman.
// ============================================================================

/** data/hero.json */
export interface HeroSlideData {
  id: string;
  label: string;
  /** Baris judul besar; 2 baris (baris kedua berwarna amber). */
  headline: string[];
  description: string;
  /** Durasi slide aktif (ms) sebelum berpindah otomatis. */
  durationMs: number;
  image: string;
  videoSrc?: string;
  objectPosition?: string;
}

export interface HeroData {
  slides: HeroSlideData[];
}

/** data/manifesto.json */
export interface ManifestoData {
  manifesto: {
    statement: string;
    vision: string;
    mission: string[];
  };
}

/** data/programs.json */
export interface ProgramData {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  description: string;
  /** Ikon lucide-react: "wrench" | "shopping-cart" | "calculator". */
  icon: "wrench" | "shopping-cart" | "calculator";
  tagline: string;
  detailParagraphs: string[];
  competencies: string[];
  facilities: { title: string; image: string; caption: string }[];
  /** Mitra industri terkait program. */
  partners: string[];
  careers: string[];
}

/** data/faculty.json */
export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

/** data/events.json */
export interface EventItem {
  id: string;
  title: string;
  /** Format tampilan, contoh: "12 OKT 2026". */
  date: string;
  /** Format ISO untuk <time dateTime>. */
  dateISO: string;
  status: string;
  excerpt: string;
  category: string;
  location: string;
  image: string;
  /** Pilihan tema dekoratif dipetakan ke kelas Tailwind di komponen. */
  theme: "blue" | "green" | "purple" | "rose" | "orange";
  href: string;
}

/** data/gallery.json */
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  layout: "normal" | "wide" | "feature";
  image: string;
}

/** data/alumni.json */
export interface AlumniItem {
  id: string;
  name: string;
  major: string;
  year: string;
  role: string;
  company: string;
  image: string;
}

/** data/kabar-sekolah.json */
export interface ContentSection {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: (string | { paragraph: string })[];
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
}

export type ArticleCategory = "berita-akademik" | "pengumuman" | "event";

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  categoryLabel: string;
  date: string;
  title: string;
  excerpt: string;
  body?: string;
  image: string;
  meta?: string;
}

export interface KabarSekolahData {
  contentSections: ContentSection[];
  articles: Article[];
}
