"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { PPDB_FORM_URL } from "../../config/site";
import alumniData from "../../data/alumni.json";
import type { AlumniItem } from "../../types";

// ============================================================================
// DATA ALUMNI (CMS-Ready)
// ============================================================================
// Panduan Admin Panel (FR-10):
// - Setiap objek mewakili satu entri alumni di CMS.
// - Gambar disimpan di /media/alumni/ (misal: /media/alumni/budi.jpg).
// ============================================================================
const ALUMNI: AlumniItem[] = alumniData.alumni;

const ease = [0.22, 1, 0.36, 1] as const;

export default function AlumniPage() {
  return (
    <main className="w-full bg-white">
      {/* HERO BANNER */}
      <section className="relative flex h-[40vh] min-h-[320px] w-full items-end overflow-hidden bg-navy">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop"
          alt="Alumni SMK Gajah Mungkur 1 Wuryantoro"
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
            <span className="font-medium text-amber-400">Alumni</span>
          </nav>
          <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[1.05] tracking-[-.02em] text-white md:text-6xl">
            Kisah Sukses Alumni
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
              Jaringan Lulusan
            </p>
            <p className="font-sans text-2xl font-medium leading-[1.35] tracking-[-.01em] text-navy md:text-3xl">
              Mereka yang pernah menempa diri di bengkel dan lab kami — kini berkiprah di industri nasional.
            </p>
            <p className="mt-6 text-base leading-[1.8] text-slate-600 md:text-lg">
              Kenali profil lulusan terbaik kami yang telah berinovasi, memimpin, dan memberikan dampak nyata di dunia usaha dan industri. Setiap kisah adalah bukti bahwa vokasi membuka jalan menuju karier yang bermartabat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GRID ALUMNI */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ALUMNI.map((alumnus, i) => (
              <motion.div
                key={alumnus.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease }}
                className="group flex flex-col"
              >
                {/* Photo (4:5) */}
                <div className="relative w-full overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src={alumnus.image}
                    alt={`Foto ${alumnus.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Text */}
                <div className="mt-6 flex flex-col">
                  <h3 className="font-sans text-xl font-medium leading-[1.15] tracking-[-.02em] text-[#0f172a] md:text-[1.4rem]">
                    {alumnus.name}
                  </h3>
                  <div className="mt-1 flex flex-col font-sans text-[15px] font-bold text-[#2563EB] md:text-base">
                    <span>{alumnus.major}</span>
                    <span>{alumnus.year}</span>
                  </div>
                  <div className="mt-4 flex flex-col">
                    <span className="font-sans text-sm font-bold text-navy md:text-[15px]">
                      {alumnus.role}
                    </span>
                    <span className="mt-0.5 font-body text-sm text-slate-600 md:text-[15px]">
                      {alumnus.company}
                    </span>
                  </div>
                </div>
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
                Ingin bergabung?
              </p>
              <h2 className="mt-3 max-w-xl font-sans text-2xl font-medium leading-tight tracking-[-.02em] md:text-4xl">
                Jadilah bagian dari generasi vokasi berikutnya.
              </h2>
            </div>
            <a
              href={PPDB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-white px-8 py-3.5 font-body text-sm font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[.98]"
            >
              Daftar PPDB <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
