import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRight, Wrench, Briefcase, Building2 } from "lucide-react";
import { PPDB_FORM_URL } from "../../../config/site";
import type { Metadata } from "next";

// ============================================================================
// MOCK DATA (CMS-Ready) — TODO: Ganti dengan fetch dari API/CMS (FR-10)
// ============================================================================
type Program = {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  description: string[];
  careers: string[];
  facilities: { title: string; image: string; caption: string }[];
};

const PROGRAMS: Program[] = [
  {
    slug: "teknik-kendaraan-ringan",
    name: "Teknik Kendaraan Ringan",
    tagline: "Menguasai mesin, menggerakkan masa depan.",
    heroImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1920&auto=format&fit=crop",
    description: [
      "Program Keahlian Teknik Kendaraan Ringan (TKR) SMK Gajah Mungkur 1 Wuryantoro menyiapkan tenaga teknisi profesional yang menguasai diagnosa, perawatan, dan perbaikan kendaraan roda empat modern — dari sistem mesin, kelistrikan, hingga teknologi berbasis komputer.",
      "Pembelajaran berlangsung di bengkel berstandar industri dengan pendekatan Project-Based Learning. Siswa terlibat langsung pada unit kendaraan nyata, dibimbing oleh guru bersertifikat kompetensi dan praktisi dari mitra industri otomotif.",
    ],
    careers: [
      "Teknisi Bengkel Resmi (Dealer)",
      "Mekanik Ahli Kelistrikan Mobil",
      "Pengusaha Bengkel Mandiri",
      "Quality Control Otomotif",
      "Asisten Service Advisor",
      "Teknisi Balap / Motorsport",
    ],
    facilities: [
      { title: "Bengkel Utama", image: "https://images.unsplash.com/photo-1632823469850-1b7b1e8b7e1e?q=80&w=1200&auto=format&fit=crop", caption: "Area praktik dengan 8 stall kerja dan lift kendaraan hidrolik." },
      { title: "Lab Kelistrikan", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop", caption: "Modul trainer kelistrikan bodi dan mesin." },
      { title: "Ruang Diagnosa", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop", caption: "Peralatan scanner OBD-II terkini." },
      { title: "Engine Room", image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=1200&auto=format&fit=crop", caption: "Koleksi cut-away engine untuk pembelajaran anatomi mesin." },
    ],
  },
  {
    slug: "bisnis-digital",
    name: "Bisnis Digital",
    tagline: "Berjualan tanpa batas, berkarya tanpa henti.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop",
    description: [
      "Bisnis Digital merancang lulusan yang cakap memanfaatkan teknologi untuk membangun dan mengelola usaha. Kurikulum mencakup digital marketing, pengelolaan marketplace, analitik data, hingga produksi konten kreatif.",
      "Siswa belajar langsung mengelola toko daring sekolah dan menjalankan proyek kampanye nyata bersama UMKM sekitar Wuryantoro — membangun portofolio sejak bangku sekolah.",
    ],
    careers: [
      "Digital Marketer",
      "Admin Marketplace / Toko Daring",
      "Content Creator & Copywriter",
      "Social Media Specialist",
      "Pengusaha UMKM Digital",
      "Analis Data E-Commerce",
    ],
    facilities: [
      { title: "Lab Komputer Bisnis", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", caption: "Workstation dengan software analitik dan desain." },
      { title: "Studio Konten", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop", caption: "Ruang produksi foto & video produk." },
      { title: "Ruang Live Streaming", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop", caption: "Set live commerce lengkap dengan lighting profesional." },
      { title: "Co-Working Space", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", caption: "Area kolaborasi proyek bisnis siswa." },
    ],
  },
  {
    slug: "akuntansi",
    name: "Akuntansi",
    tagline: "Angka yang jujur, bisnis yang sehat.",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1920&auto=format&fit=crop",
    description: [
      "Program Keahlian Akuntansi membekali siswa dengan kompetensi pembukuan keuangan, perpajakan, hingga pengoperasian aplikasi akuntansi komputerisasi yang menjadi standar dunia usaha.",
      "Melalui simulasi kantor dan praktik kerja lapangan di kantor akuntan dan perusahaan mitra, siswa terbiasa dengan sikap profesional, ketelitian, dan etika kerja seorang akuntan muda.",
    ],
    careers: [
      "Staf Administrasi Keuangan",
      "Asisten Akuntan",
      "Petugas Pajak",
      "Kasir Bank / Teller",
      "Pembukuan UMKM",
      "Auditor Junior",
    ],
    facilities: [
      { title: "Lab Akuntansi Komputer", image: "https://images.unsplash.com/photo-1542744173-8e7e5345bb63?q=80&w=1200&auto=format&fit=crop", caption: "Penerapan software akuntansi terintegrasi." },
      { title: "Ruang Simulasi Kantor", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop", caption: "Praktik administrasi transaksi harian." },
      { title: "Lab Perpajakan", image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=1200&auto=format&fit=crop", caption: "Studi kasus pelaporan pajak tahunan." },
      { title: "Perpustakaan Bisnis", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop", caption: "Referensi standar akuntansi keuangan." },
    ],
  },
];

// ============================================================================
// SEO Metadata Dinamis
// ============================================================================
export async function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) return { title: "Program tidak ditemukan" };
  return {
    title: `${program.name} — SMK Gajah Mungkur 1 Wuryantoro`,
    description: program.tagline,
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
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
          src={program.heroImage}
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
              Daftar PPDB
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
                {program.description.map((para, i) => (
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
              Daftar PPDB Sekarang
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
