"use client";

import Image from "next/image";
import manifestoData from "../../data/manifesto.json";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Eye, Target, Users, Award, Flag } from "lucide-react";
import TeacherProfile from "../../components/TeacherProfile";

// ============================================================================
// MOCK DATA (CMS-Ready) — TODO: Ganti dengan fetch dari API/CMS (FR-10)
// ============================================================================
// Visi & Misi — Sumber: data/manifesto.json (CMS-Ready via Git commit)
const MISSIONS = manifestoData.manifesto.mission.map((text) => {
  const [title, ...rest] = text.split(": ");
  return { title, text: rest.join(": ") || text };
});

import schoolProfile from "../../data/school-profile.json";

const TIMELINE = schoolProfile.timeline;

const ease = [0.22, 1, 0.36, 1] as const;

export default function TentangKamiPage() {
  return (
    <main className="w-full bg-white">
      {/* HERO BANNER */}
      <section className="relative flex h-[40vh] min-h-[320px] w-full items-end overflow-hidden bg-navy">
        <Image
          src={schoolProfile.heroImage}
          alt={schoolProfile.heroImageAlt}
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
            <span className="font-medium text-amber-400">Tentang Kami</span>
          </nav>
          <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[1.05] tracking-[-.02em] text-white md:text-6xl">
            {schoolProfile.heroTitle}
          </h1>
        </div>
      </section>

      {/* MANIFESTO: BENTO GRID VISI & MISI (Deep Navy) */}
      <section className="bg-[#0C2340] py-20 text-white md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            
            {/* VISI — Bento besar dengan tipografi raksasa */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#0A1D36] p-8 md:col-span-7 md:p-12 lg:col-span-8"
            >
              <Eye size={28} className="text-amber-400" aria-hidden="true" />
              <div>
                <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
                  Visi Kami
                </p>
                <p className="font-sans text-3xl font-medium leading-[1.15] tracking-[-.02em] md:text-5xl lg:text-6xl">
                  {manifestoData.manifesto.vision}
                </p>
              </div>
              {/* Dekorasi pola halus */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5"
              />
            </motion.div>

            {/* MISI (Header kecil di grid) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="flex flex-col justify-center border border-white/15 p-8 md:col-span-5 md:p-10 lg:col-span-4"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
                Misi Kami
              </p>
              <p className="mt-4 font-sans text-xl font-medium leading-relaxed md:text-2xl">
                Empat pilar gerakan yang menuntun setiap keputusan, kurikulum, dan tradisi di sekolah ini.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Bergulir ke bawah untuk membaca keempat poin misi tersebut.
              </p>
            </motion.div>

            {/* 4 KARTU MISI */}
            {MISSIONS.map((mission, i) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
                className="group bg-[#0A1D36] p-6 transition-colors duration-300 hover:bg-[#12294a] md:col-span-6 lg:col-span-3 md:p-8"
              >
                <Target size={24} className="text-amber-400" aria-hidden="true" />
                <h3 className="mt-4 font-sans text-lg font-medium tracking-[-.02em] md:text-xl">
                  {mission.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {mission.text}
                </p>
                <span className="mt-4 block font-mono text-xs font-bold text-white/30">
                  {String(i + 1).padStart(2, "0")} / 04
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SEJARAH (Vertical, Staggered) */}
      <section className="py-20 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 max-w-2xl"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
              {schoolProfile.timelineEyebrow}
            </p>
            <h2 className="mt-3 font-sans text-3xl font-medium leading-tight tracking-[-.02em] text-navy md:text-5xl">
              {schoolProfile.timelineHeading}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Garis vertikal tengah (desktop) / kiri (mobile) */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-0 h-full w-px bg-slate-200 md:left-1/2 md:-translate-x-1/2"
            />

            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={item.year} className="relative mb-16 last:mb-0 md:mb-24">
                  {/* Titik tahun */}
                  <div
                    aria-hidden="true"
                    className="absolute left-6 top-1 z-10 size-4 -translate-x-1/2 rounded-full border-4 border-white bg-amber-500 md:left-1/2 md:top-2"
                  />

                  <div
                    className={`grid grid-cols-1 gap-6 pl-14 md:grid-cols-2 md:gap-0 md:pl-0 ${
                      isLeft ? "" : ""
                    }`}
                  >
                    {/* Desktop: konten bergantian kiri/kanan */}
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 0 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7, ease }}
                      className={`flex flex-col ${
                        isLeft
                          ? "md:col-start-1 md:pr-16 md:text-right md:items-end"
                          : "md:col-start-2 md:pl-16"
                      }`}
                    >
                      <span className="font-mono text-4xl font-bold tracking-tight text-slate-300 md:text-6xl">
                        {item.year}
                      </span>
                      <h3 className="mt-2 font-sans text-xl font-medium tracking-[-.02em] text-navy md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-md text-base leading-relaxed text-slate-600">
                        {item.text}
                      </p>
                    </motion.div>

                    {/* Gambar di sisi berlawanan (desktop only) */}
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7, delay: 0.1, ease }}
                      className={`hidden md:block ${
                        isLeft ? "md:col-start-2 md:pl-16" : "md:col-start-1 md:pr-16 md:row-start-1 md:flex md:justify-end"
                      }`}
                    >
                      <div className="relative h-48 w-full max-w-md overflow-hidden shadow-lg">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 480px"
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PENUTUP: TEACHER PROFILE (FR-06) */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16 md:py-24">
          {/* Komponen reusable FR-06 */}
          <TeacherProfile />
        </div>
      </section>
    </main>
  );
}
