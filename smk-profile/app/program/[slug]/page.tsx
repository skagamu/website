import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRight, Wrench, Briefcase, Building2 } from "lucide-react";
import { PPDB_FORM_URL } from "../../../config/site";
import type { Metadata } from "next";

import programsData from "../../../data/programs.json";
import type { ProgramData } from "../../../types";

const PROGRAMS = programsData as ProgramData[];

// ============================================================================
// SEO Metadata Dinamis
// ============================================================================
export async function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.id === slug);
  if (!program) return { title: "Program tidak ditemukan" };
  return {
    title: `${program.name} — SMK Gajah Mungkur 1 Wuryantoro`,
    description: program.tagline,
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.id === slug);
  if (!program) notFound();

  const SIDEBAR_LINKS = [
    { id: "tentang", label: "Tentang Program" },
    { id: "karir", label: "Peluang Karir" },
    { id: "fasilitas", label: "Fasilitas" },
  ];

  return (
    <main className="w-full bg-white">
      {/* HERO BANNER (h-[40vh]) */}
      <section className="relative flex h-[40vh] min-h-[320px] w-full items-end overflow-hidden bg-navy">
        <Image
          src={program.image!}
          alt={`Kegiatan pembelajaran ${program.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/95 via-[#0C2340]/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-10 pt-32 md:px-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/#program" className="hover:text-white transition-colors">Program Keahlian</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-medium text-amber-400">{program.name}</span>
          </nav>
          <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[1.05] tracking-[-.02em] text-white md:text-6xl">
            {program.name}
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-widest text-amber-400">
            {program.tagline}
          </p>
        </div>
      </section>

      {/* MOBILE: Scrollable Quick Nav */}
      <div className="sticky top-[64px] z-40 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur-md lg:hidden">
        {SIDEBAR_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="whitespace-nowrap border border-slate-200 px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CONTENT: Split 3:9 */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 md:px-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        
        {/* SIDEBAR (Sticky, 30% / lg:col-span-3) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav className="sticky top-28 flex flex-col gap-2 border-l border-slate-200 pl-6" aria-label="Navigasi konten">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
              Di halaman ini
            </p>
            {SIDEBAR_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy"
              >
                {link.label}
              </a>
            ))}
            
            {/* CTA PPDB di sidebar */}
            <a
              href={PPDB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-slate-800 active:scale-[.98]"
            >
              Daftar SPMB
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT (70% / lg:col-span-9) */}
        <div className="lg:col-span-9">
          
          {/* TENTANG PROGRAM */}
          <section id="tentang" className="scroll-mt-32">
            <h2 className="mb-8 flex items-center gap-3 font-sans text-2xl font-medium tracking-[-.02em] text-navy md:text-3xl">
              <Wrench size={24} className="text-amber-500" aria-hidden="true" />
              Tentang Program
            </h2>
              <div className="max-w-prose space-y-6">
                {program.detailParagraphs.map((para, i) => (
                  <p key={i} className="text-lg leading-[1.8] text-slate-700">
                    {para}
                  </p>
                ))}
              </div>
          </section>

          {/* PELUANG KARIR */}
          <section id="karir" className="mt-24 scroll-mt-32">
            <h2 className="mb-8 flex items-center gap-3 font-sans text-2xl font-medium tracking-[-.02em] text-navy md:text-3xl">
              <Briefcase size={24} className="text-amber-500" aria-hidden="true" />
              Peluang Karir Lulusan
            </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {program.careers.map((career, i) => (
                  <div
                    key={career}
                    className="flex items-start gap-3 border border-slate-200 bg-white p-5 transition-colors hover:border-navy/30 hover:bg-slate-50"
                  >
                    <span className="font-mono text-xs font-bold text-amber-500 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-base font-medium leading-snug text-navy">
                      {career}
                    </p>
                  </div>
                ))}
              </div>
          </section>

          {/* FASILITAS */}
          <section id="fasilitas" className="mt-24 scroll-mt-32">
            <h2 className="mb-8 flex items-center gap-3 font-sans text-2xl font-medium tracking-[-.02em] text-navy md:text-3xl">
              <Building2 size={24} className="text-amber-500" aria-hidden="true" />
              Fasilitas Lab & Bengkel
            </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {program.facilities.map((facility, i) => (
                  <figure
                    key={facility.title}
                    className="group overflow-hidden border border-slate-200 bg-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={facility.image}
                        alt={facility.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="p-5">
                      <h3 className="font-sans text-lg font-medium tracking-[-.02em] text-navy">
                        {facility.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {facility.caption}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
          </section>

          {/* CTA PENUTUP */}
          <section className="mt-24 bg-navy p-8 text-white md:p-12">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
              Tertarik dengan {program.name}?
            </p>
            <h2 className="mt-3 max-w-2xl font-sans text-2xl font-medium leading-tight tracking-[-.02em] md:text-4xl">
              Jadilah bagian dari generasi vokasi yang siap kerja dan siap berkarya.
            </h2>
            <a
              href={PPDB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap bg-white px-8 py-3.5 font-body text-sm font-semibold text-black transition-colors hover:bg-slate-200 active:scale-[.98]"
            >
              Daftar SPMB Sekarang
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
