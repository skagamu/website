"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, CalendarDays } from "lucide-react";
import eventsData from "../../data/events.json";
import type { EventItem } from "../../types";

// ============================================================================
// DATA BERITA / EVENT (CMS-Ready)
// ============================================================================
// Panduan Admin Panel (FR-10):
// - Setiap objek mewakili satu entri event/berita di CMS.
// - Gambar disimpan di /media/event/ (misal: /media/event/workshop.jpg).
// - href bisa menuju halaman detail per event saat CMS aktif.
// ============================================================================
const EVENTS: EventItem[] = eventsData.events;

const ease = [0.22, 1, 0.36, 1] as const;

export default function BeritaPage() {
  return (
    <main className="w-full bg-white">
      {/* HERO BANNER */}
      <section className="relative flex h-[40vh] min-h-[320px] w-full items-end overflow-hidden bg-navy">
        <Image
          src="/website/media/hero/collaboration.jpg"
          alt="Kegiatan dan event SMK Gajah Mungkur 1 Wuryantoro"
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
            <span className="font-medium text-amber-400">Berita & Event</span>
          </nav>
          <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[1.05] tracking-[-.02em] text-white md:text-6xl">
            Berita & Agenda Sekolah
          </h1>
        </div>
      </section>

      {/* INTRO */}
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
              Kalender Kegiatan
            </p>
            <p className="font-sans text-2xl font-medium leading-[1.35] tracking-[-.01em] text-navy md:text-3xl">
              Agenda besar sekolah — dari workshop industri hingga sertifikasi kompetensi nasional.
            </p>
            <p className="mt-6 text-base leading-[1.8] text-slate-600 md:text-lg">
              Telusuri seluruh event dan kabar terbaru SMK Gajah Mungkur 1 Wuryantoro. Setiap agenda dirancang untuk memperluas wawasan, menajamkan kompetensi, dan membangun jaringan siswa dengan dunia industri.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GRID EVENT */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease }}
                className="group flex flex-col"
              >
                {/* Card Image (3:4, ala event homepage) */}
                <Link href={event.href} className="relative block aspect-[3/4] w-full overflow-hidden shadow-lg">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Gradient + caption ala event homepage */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="mb-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
                      <CalendarDays size={12} aria-hidden="true" />
                      {event.date} • {event.status}
                    </span>
                    <h2 className="font-sans text-xl font-medium leading-[1.15] tracking-[-.02em] text-white md:text-2xl">
                      {event.title}
                    </h2>
                  </div>
                </Link>

                {/* Excerpt + link */}
                <p className="mt-5 flex-1 text-sm leading-[1.7] text-slate-600 md:text-[15px]">
                  {event.excerpt}
                </p>
                <Link
                  href={event.href}
                  className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-navy transition-all group-hover:gap-3 group-hover:text-amber-600"
                >
                  Lihat Detail <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PENUTUP */}
      <section className="bg-navy py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
          >
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
                Bacaan Lainnya
              </p>
              <h2 className="mt-3 max-w-xl font-sans text-2xl font-medium leading-tight tracking-[-.02em] md:text-4xl">
                Ingin kabar lengkap dan pengumuman resmi sekolah?
              </h2>
            </div>
            <Link
              href="/kabar-sekolah"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-white px-8 py-3.5 font-body text-sm font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[.98]"
            >
              Jelajahi Kabar Sekolah <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
