"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Wrench, ShoppingCart, Calculator, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import Link from "next/link";

import programsData from "../data/programs.json";
import type { ProgramData } from "../types";

// ============================================================================
// DATA PROGRAM KEAHLIAN — Sumber: data/programs.json (CMS-Ready)
// ============================================================================
// Konten (nama, deskripsi, fasilitas, karir) dikelola Admin Panel via JSON.
// Pemetaan dekoratif (ikon lucide + kelas Tailwind per program) tetap di kode
// karena class dinamis Tailwind tidak boleh dipindah ke file JSON.
// ============================================================================
const ICONS: Record<ProgramData["icon"], typeof Wrench> = {
  wrench: Wrench,
  "shopping-cart": ShoppingCart,
  calculator: Calculator,
};

const STYLES: Record<string, { color: string; hoverColor: string; iconColor: string }> = {
  "teknik-kendaraan-ringan": {
    color: "bg-navy text-white",
    hoverColor: "hover:bg-navy/95",
    iconColor: "text-amber",
  },
  "bisnis-digital": {
    color: "bg-white text-navy border border-slate-200",
    hoverColor: "hover:border-slate-300",
    iconColor: "text-[#2563EB]",
  },
  akuntansi: {
    color: "bg-[#F9F8F6] text-navy border border-slate-200",
    hoverColor: "hover:border-slate-300",
    iconColor: "text-green-600",
  },
};

const programs = (programsData as ProgramData[]).map((p) => ({
  ...p,
  title: p.name,
  skills: p.competencies,
  icon: ICONS[p.icon] ?? Wrench,
  color: STYLES[p.id]?.color ?? "bg-navy text-white",
  hoverColor: STYLES[p.id]?.hoverColor ?? "hover:bg-navy/95",
  iconColor: STYLES[p.id]?.iconColor ?? "text-amber",
  link: `/program/${p.id}`,
}));

export default function ProgramKeahlianBento() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section id="program-keahlian" className="bg-white px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[1.5px] text-navy/70">
            Program Keahlian
          </h2>
          <h3 className="max-w-2xl font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-[1.2] tracking-tight text-navy">
            Tiga pilar keahlian untuk masa depan yang lebih baik.
          </h3>
        </div>

        {/* Bento Grid Container */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-2 lg:gap-8"
        >
          {/* Card 1: TKR (Large Left Card, spans 7 cols and 2 rows) */}
          <motion.div
            variants={cardVariants}
            className={`group relative flex h-full min-h-[400px] flex-col overflow-hidden p-8 md:col-span-7 md:row-span-2 lg:p-12 ${programs[0].color} ${programs[0].hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Background pattern / watermark */}
            <Wrench className="absolute -right-12 -top-12 z-0 size-64 rotate-12 opacity-[0.05] md:size-96" />
            
            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-6 flex items-center gap-4">
                <div className={`grid size-14 place-items-center bg-white/10 backdrop-blur-md ${programs[0].iconColor}`}>
                  {(() => {
                    const Icon = programs[0].icon;
                    return <Icon size={28} />;
                  })()}
                </div>
                <h4 className="font-sans text-2xl font-semibold leading-tight tracking-tight md:text-3xl lg:text-4xl">
                  {programs[0].title}
                </h4>
              </div>
              
              <p className="mb-10 max-w-md font-body text-base leading-relaxed text-slate-300 md:text-lg">
                {programs[0].description}
              </p>

              {/* Badges section pushes to bottom */}
              <div className="mt-auto flex flex-col gap-6">
                <div>
                  <div className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <ShieldCheck size={16} /> Kompetensi
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {programs[0].skills.map(skill => (
                      <span key={skill} className="border border-white/20 bg-white/10 px-4 py-1.5 font-body text-sm font-medium text-white backdrop-blur-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <Briefcase size={16} /> Mitra Industri
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {programs[0].partners.map(partner => (
                        <span key={partner} className="bg-amber px-4 py-1.5 font-body text-sm font-bold text-navy">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={programs[0].link} className="inline-flex items-center gap-2 font-body text-sm font-semibold text-white underline-offset-4 hover:underline">
                    Detail Silabus <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bisnis Digital (Top Right, spans 5 cols and 1 row) */}
          <motion.div
            variants={cardVariants}
            className={`group relative flex h-full min-h-[300px] flex-col overflow-hidden p-6 lg:p-8 md:col-span-5 md:row-span-1 ${programs[1].color} ${programs[1].hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className={`grid size-12 shrink-0 place-items-center bg-slate-100 ${programs[1].iconColor}`}>
                  {(() => {
                    const Icon = programs[1].icon;
                    return <Icon size={24} />;
                  })()}
                </div>
                <h4 className="font-sans text-xl font-semibold leading-tight tracking-tight lg:text-2xl">
                  {programs[1].title}
                </h4>
              </div>
              
              <p className="mb-6 font-body text-sm leading-relaxed text-slate-600">
                {programs[1].description}
              </p>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {programs[1].skills.map(skill => (
                    <span key={skill} className="bg-slate-100 px-3 py-1 font-body text-[13px] font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mitra:</span>
                    <span className="font-body text-sm font-semibold text-navy">{programs[1].partners.join(", ")}</span>
                  </div>
                  <Link href={programs[1].link} className="grid size-8 place-items-center bg-slate-100 text-navy transition-colors hover:bg-slate-200" aria-label="Detail silabus">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Akuntansi (Bottom Right, spans 5 cols and 1 row) */}
          <motion.div
            variants={cardVariants}
            className={`group relative flex h-full min-h-[300px] flex-col overflow-hidden p-6 lg:p-8 md:col-span-5 md:row-span-1 ${programs[2].color} ${programs[2].hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className={`grid size-12 shrink-0 place-items-center bg-white shadow-sm ${programs[2].iconColor}`}>
                  {(() => {
                    const Icon = programs[2].icon;
                    return <Icon size={24} />;
                  })()}
                </div>
                <h4 className="font-sans text-xl font-semibold leading-tight tracking-tight lg:text-2xl">
                  {programs[2].title}
                </h4>
              </div>
              
              <p className="mb-6 font-body text-sm leading-relaxed text-slate-600">
                {programs[2].description}
              </p>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {programs[2].skills.map(skill => (
                    <span key={skill} className="bg-white border border-slate-200 px-3 py-1 font-body text-[13px] font-medium text-slate-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mitra:</span>
                    <span className="font-body text-sm font-semibold text-navy">{programs[2].partners.join(", ")}</span>
                  </div>
                  <Link href={programs[2].link} className="grid size-8 place-items-center bg-white border border-slate-200 text-navy transition-colors hover:bg-slate-50" aria-label="Detail silabus">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
