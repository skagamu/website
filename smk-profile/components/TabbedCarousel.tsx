"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ============================================================================
// KONTEN PROGRAM KEAHLIAN
// ============================================================================
// Panduan Mengganti Gambar (Sangat Mudah):
// 1. Siapkan foto asli untuk jurusan terkait.
// 2. Simpan foto ke folder `public/media/` (misal: public/media/tkr-asli.jpg)
// 3. Ubah nama file pada bagian `image` di bawah ini agar sesuai dengan fotomu.
// ============================================================================
const PROGRAMS = [
  {
    id: "tkr",
    title: "Teknik Kendaraan Ringan",
    subtitle: "Teknologi Otomotif Modern",
    // 👇 GANTI GAMBAR TKR DI SINI 👇
    image: "/website/media/hero/workshop-poster.jpg",
    href: "/program/tkr",
  },
  {
    id: "bisnis",
    title: "Bisnis Digital",
    subtitle: "E-commerce & Digital Marketing",
    // 👇 GANTI GAMBAR BISNIS DIGITAL DI SINI 👇
    image: "/website/media/hero/collaboration.jpg",
    href: "/program/bisnis",
  },
  {
    id: "akuntansi",
    title: "Akuntansi",
    subtitle: "Keuangan & Perpajakan",
    // 👇 GANTI GAMBAR AKUNTANSI DI SINI 👇
    image: "/website/media/hero/workshop.jpg",
    href: "/program/akuntansi",
  },
];

export default function TabbedCarousel() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
        {/* Header Area: 3 Asymmetric Columns */}
        <div className="mb-10 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          {/* Left: Big Title (Matched to Hero H1 styling) */}
          <div className="md:w-5/12 lg:w-4/12">
            <h2 className="max-w-4xl font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-.02em]">
              <span className="block text-navy">Jelajahi</span>
              <span className="block text-amber">Program Keahlian</span>
            </h2>
          </div>

          {/* Middle: Description */}
          <div className="md:w-4/12 lg:w-3/12">
            <p className="font-body text-base leading-relaxed text-slate-600">
              Pendidikan vokasi yang mempersiapkan siswa dengan keterampilan nyata untuk kebutuhan industri modern dan masa depan.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-start gap-8 md:w-3/12 md:items-end lg:w-4/12">
            <Link
              href="/program"
              className="group inline-flex items-center gap-2 font-sans text-sm font-bold text-[#2563EB] transition-colors hover:text-navy"
            >
              Lihat Semua Program
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        // 1. Margin container disamakan dengan header
        className="mx-auto w-full max-w-[1440px] px-6 md:px-16"
      >
        <div className="flex w-full flex-col gap-6 overflow-hidden md:flex-row md:snap-x md:snap-mandatory md:overflow-x-auto hide-scrollbar md:gap-0">
          {PROGRAMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative h-[320px] w-full shrink-0 overflow-hidden md:h-[500px] md:w-1/3 md:snap-center lg:h-[600px]"
            >
              {/* Background Image with Hover Zoom */}
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, 33vw"
                />
              </div>

              {/* 2. Gradient Hitam: dari gelap pekat di paling bawah (0%), menghilang utuh (transparan) di batas sepertiga bawah (33%) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 from-0% to-transparent to-[33%] transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                <h3 className="font-sans text-2xl md:text-3xl font-medium leading-[1.15] tracking-[-.02em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm font-medium text-slate-200 md:text-base">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}