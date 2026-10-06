"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import alumniData from "../data/alumni.json";
import type { AlumniItem } from "../types";

// ============================================================================
// DATA ALUMNI
// ============================================================================
// Panduan CMS / Admin Panel:
// Bagian ini dirancang untuk diisi oleh Admin Panel secara dinamis.
// Pastikan CMS menyimpan URL gambar alumni ke folder `public/media/alumni/`
// (misal: "/media/alumni/budi.jpg") agar tidak tercampur dengan aset lain.
// ============================================================================
const ALUMNI: AlumniItem[] = alumniData;

export default function AlumniCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    
    // Scroll sebesar lebar satu kartu + gap
    const card = track.firstElementChild as HTMLElement | null;
    if (card) {
      // getComputedStyle untuk mengambil nilai gap
      const gap = parseInt(window.getComputedStyle(track).gap) || 0;
      const step = card.offsetWidth + gap;
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  };

  return (
    <section id="alumni" className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16">
        {/* Header Area */}
        <div className="mb-10 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="md:w-5/12 lg:w-4/12">
            <h2 className="max-w-4xl font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-.02em]">
              <span className="block text-navy">Kisah Sukses</span>
              <span className="block text-amber">Alumni</span>
            </h2>
          </div>

          <div className="md:w-4/12 lg:w-3/12">
            <p className="font-body text-base leading-relaxed text-slate-600">
              Kenali profil lulusan terbaik kami yang telah berkiprah, berinovasi, dan memberikan dampak nyata di dunia industri dan usaha.
            </p>
          </div>

          <div className="flex flex-col items-start gap-8 md:w-3/12 md:items-end lg:w-4/12">
            <Link
              href="/alumni"
              className="group inline-flex items-center gap-2 font-sans text-sm font-bold text-[#2563EB] transition-colors hover:text-navy"
            >
              Lihat Semua Alumni
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Carousel Row: Diamond Nav (left) + Cards (right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-start gap-6 md:gap-10"
        >
          {/* Diamond Navigation Buttons */}
          <div className="hidden shrink-0 flex-col gap-4 pt-[15%] md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Alumni sebelumnya"
              className="grid size-12 rotate-45 place-items-center border border-navy text-navy bg-white transition-all duration-300 hover:border-black hover:bg-black hover:text-white lg:size-14"
            >
              <ChevronLeft size={20} className="-rotate-45" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Alumni berikutnya"
              className="ml-6 grid size-12 rotate-45 place-items-center border border-navy text-navy bg-white transition-all duration-300 hover:border-black hover:bg-black hover:text-white lg:ml-8 lg:size-14"
            >
              <ChevronRight size={20} className="-rotate-45" />
            </button>
          </div>

          {/* Carousel Track (With Gap) */}
          <div
            ref={trackRef}
            className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-8 hide-scrollbar md:gap-8"
          >
            {ALUMNI.map((alumnus) => (
              <div
                key={alumnus.id}
                className="group relative flex w-[75vw] shrink-0 snap-start flex-col sm:w-[50vw] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] focus:outline-none"
              >
                {/* Photo Area (Aspect Ratio 3:4 or 4:5 style) */}
                <div className="relative w-full overflow-hidden aspect-[4/5] bg-slate-100">
                  <div className="absolute inset-0">
                    <Image
                      src={alumnus.image}
                      alt={`Foto ${alumnus.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </div>

                {/* Editorial Text Content Area */}
                <div className="mt-6 flex flex-col">
                  {/* 1. Nama */}
                  <h3 className="font-sans text-xl md:text-[1.6rem] font-medium leading-[1.15] tracking-[-.02em] text-[#0f172a]">
                    {alumnus.name}
                  </h3>
                  
                  {/* 2 & 3. Jurusan & Angkatan (Warna Biru sesuai referensi) */}
                  <div className="mt-1 flex flex-col font-sans text-[15px] font-bold text-[#2563EB] md:text-base">
                    <span>{alumnus.major}</span>
                    <span>{alumnus.year}</span>
                  </div>

                  {/* Jabatan & Pekerjaan */}
                  <div className="mt-4 flex flex-col">
                    <span className="font-sans text-sm font-bold text-navy md:text-[15px]">
                      {alumnus.role}
                    </span>
                    <span className="mt-0.5 font-body text-sm text-slate-600 md:text-[15px]">
                      {alumnus.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
