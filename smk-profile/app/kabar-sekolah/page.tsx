"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CalendarDays, Tag, MapPin, Clock, ArrowRight } from "lucide-react";
import SchoolGallery from "../../components/SchoolGallery";
import kabarData from "../../data/kabar-sekolah.json";
import kabarArticles from "../../data/kabar-articles.json";
import type { ContentSection, Article } from "../../types";

// ============================================================================
// DATA KABAR SEKOLAH — Sumber: data/kabar-sekolah.json (CMS-Ready)
// ============================================================================
// Admin Panel mengubah isi konten ini via Git commit.
// ============================================================================
const CONTENT_SECTIONS: ContentSection[] = kabarData.contentSections as ContentSection[];
const ARTICLES: Article[] = kabarArticles.articles as Article[];


const TABS = [
  { id: "semua" as const, label: "Semua" },
  { id: "berita-akademik" as const, label: "Berita Akademik" },
  { id: "pengumuman" as const, label: "Pengumuman" },
  { id: "event" as const, label: "Event" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function KabarSekolahPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("semua");

  const filtered =
    activeTab === "semua" ? ARTICLES : ARTICLES.filter((a) => a.category === activeTab);

  return (
    <main className="w-full bg-white">
      {/* HERO BANNER */}
      <section className="relative flex h-[40vh] min-h-[320px] w-full items-end overflow-hidden bg-navy">
        <Image
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1920&auto=format&fit=crop"
          alt="Kegiatan siswa SMK Gajah Mungkur 1 Wuryantoro"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/95 via-[#0C2340]/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-10 pt-32 md:px-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-medium text-amber-400">Kabar Sekolah</span>
          </nav>
          <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[1.05] tracking-[-.02em] text-white md:text-6xl">
            Kabar & Momen Sekolah
          </h1>
        </div>
      </section>

      {/* INTRO TEXT (JIS-style lead paragraph) */}
      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
              Kabar Sekolah
            </p>
            <p className="font-sans text-2xl font-medium leading-[1.35] tracking-[-.01em] text-navy md:text-3xl">
              Setiap siswa didorong untuk bergabung dengan klub, tim, dan organisasi untuk menyalurkan hasrat mereka — mencoba hal baru dan mengembangkan pembelajaran jauh melampaui ruang kelas.
            </p>
            <p className="mt-6 text-base leading-[1.8] text-slate-600 md:text-lg">
              Dari kompetisi kejuruan, kunjungan industri, hingga pentas seni — inilah ruang tempat seluruh momen itu dikenang. Mari telusuri kegiatan, capaian, dan pengumuman terbaru dari warga SMK Gajah Mungkur 1 Wuryantoro.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTIONS (Alternating image + text, JIS-style) */}
      {CONTENT_SECTIONS.map((section) => (
        <section key={section.id} className="py-16 md:py-24">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 md:px-16 lg:grid-cols-2 lg:gap-16">
            
            {/* Gambar */}
            <motion.div
              initial={{ opacity: 0, x: section.imagePosition === "left" ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className={`relative aspect-[4/3] w-full overflow-hidden shadow-lg ${
                section.imagePosition === "right" ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <Image
                src={section.image}
                alt={section.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            {/* Teks */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className={`${
                section.imagePosition === "right" ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 font-sans text-3xl font-medium leading-tight tracking-[-.02em] text-navy md:text-4xl">
                {section.title}
              </h2>
              <div className="mt-6 space-y-5">
                {section.paragraphs.map((para, i) => {
                  const text = typeof para === 'string' ? para : (para as any).paragraph || '';
                  return (
                    <p key={i} className="max-w-prose text-base leading-[1.8] text-slate-600 md:text-lg">
                      {text}
                    </p>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* BERITA & EVENT + TABS */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-10 max-w-2xl"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
              Agenda Terbaru
            </p>
            <h2 className="mt-3 font-sans text-3xl font-medium leading-tight tracking-[-.02em] text-navy md:text-5xl">
              Jelajahi Kabar & Agenda
            </h2>
          </motion.div>

          {/* Tab Navigation (Underline style — JIS-like) */}
          <div
            className="mb-12 flex items-center gap-6 overflow-x-auto border-b border-slate-200 md:gap-10"
            role="tablist"
            aria-label="Filter kategori kabar"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 whitespace-nowrap pb-4 font-sans text-base font-medium tracking-[-.01em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:text-lg ${
                    isActive ? "font-bold text-navy" : "text-slate-500 hover:text-navy"
                  }`}
                >
                  {tab.label}
                  {/* Active underline indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute inset-x-0 -bottom-px h-[3px] bg-navy"
                        transition={{ duration: 0.35, ease }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Grid Artikel (3 kolom desktop / 1 kolom mobile) */}
          <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((article) => (
                <motion.article
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease }}
                  className="group flex flex-col overflow-hidden border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-xl"
                >
                  {/* Thumbnail 16:9 */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Label kategori */}
                    <span className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/90 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-navy backdrop-blur-sm">
                      <Tag size={12} aria-hidden="true" />
                      {article.categoryLabel}
                    </span>
                  </div>

                  {/* Body Kartu */}
                  <div className="flex flex-1 flex-col p-6">
                    <time className="flex items-center gap-2 text-sm text-slate-500" dateTime={article.date}>
                      <CalendarDays size={14} aria-hidden="true" />
                      {article.date}
                    </time>
                    {article.meta && (
                      <span className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                        <MapPin size={13} aria-hidden="true" />
                        {article.meta}
                      </span>
                    )}
                    <h2 className="mt-3 font-sans text-xl font-medium leading-[1.2] tracking-[-.02em] text-navy transition-colors group-hover:text-amber-600">
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {article.excerpt}
                    </p>
                    <Link href={`/kabar-sekolah/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-navy transition-all group-hover:gap-3 group-hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500">
                      Baca Selengkapnya
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA ke Kalender Event */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
            className="mt-16 flex flex-col items-start justify-between gap-6 bg-navy p-8 text-white md:flex-row md:items-center md:p-12"
          >
            <div>
              <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
                <Clock size={14} aria-hidden="true" />
                Agenda Berjalan
              </p>
              <h3 className="mt-3 max-w-xl font-sans text-2xl font-medium leading-tight tracking-[-.02em] md:text-3xl">
                Ingin tahu agenda besar selanjutnya? Jelajahi kalender event di halaman utama.
              </h3>
            </div>
            <Link
              href="/#berita"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-white px-8 py-3.5 font-body text-sm font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[.98]"
            >
              Lihat Kalender Event <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PENUTUP: SCHOOL GALLERY (FR-09) — Dinding Eksibisi Visual, sebelum Footer */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 pt-16 md:px-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-12 max-w-2xl"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
              Galeri Visual
            </p>
            <h2 className="mt-3 font-sans text-3xl font-medium leading-tight tracking-[-.02em] text-navy md:text-5xl">
              Momen & Fasilitas
            </h2>
          </motion.div>
        </div>

        {/* Komponen reusable FR-09 (bento grid) */}
        <SchoolGallery />
      </section>
    </main>
  );
}
