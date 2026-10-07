"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import galleryData from "../data/gallery.json";
import type { GalleryItem } from "../types";

// ============================================================================
// DATA GALLERY (BENTO GRID) — Sumber: data/gallery.json (CMS-Ready)
// ============================================================================
// Admin Panel mengubah urutan, judul, dan ukuran span foto via Git commit.
// Array ini memetakan urutan & ukuran grid; kelas `span` mengatur besar foto di desktop.
// ============================================================================
const GALLERY_ITEMS = galleryData as GalleryItem[];
const LAYOUTS = { normal: "md:col-span-1 md:row-span-1", wide: "md:col-span-2 md:row-span-1", feature: "md:col-span-2 md:row-span-2" };

export default function SchoolGallery() {
  return (
    <section id="fasilitas" className="relative w-full bg-white py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        
        {/* TOP HEADER SECTION */}
        <div className="mb-12 h-px w-full bg-gray-200" />
        
        <div className="mb-10 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          {/* Kiri: Judul Section */}
          <div className="md:w-5/12 lg:w-4/12">
            <h2 className="max-w-4xl font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-.02em]">
              <span className="block text-navy">Momen &</span>
              <span className="block text-[#8A4B00]">Fasilitas</span>
            </h2>
          </div>
          
          {/* Tengah: Deskripsi */}
          <div className="md:w-4/12 lg:w-3/12">
            <p className="font-body text-base leading-relaxed text-slate-600">
              Jelajahi ekosistem pembelajaran yang dinamis, fasilitas berstandar industri, dan momen tak terlupakan di SMK Gajah Mungkur 1 Wuryantoro.
            </p>
          </div>
          
        </div>

        {/* ASYMMETRIC BENTO GRID */}
        {/* Grid ini mengatur tata letak yang asimetris dan editorial di layar desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px]">
          {GALLERY_ITEMS.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: (index % 4) * 0.1, 
                  ease: [0.25, 1, 0.5, 1] 
                }}
                className={`group relative overflow-hidden bg-slate-100 w-full h-full ${LAYOUTS[item.layout]}`}
              >
                {/* Image (Berwarna, tanpa filter, membesar perlahan saat hover di desktop) */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
                />
                
                {/* Gradient Overlay (Mobile terlihat otomatis, Desktop hanya saat hover) 
                    Tinggi h-[120px] md:h-[180px] memastikan 0% (transparent) jatuh pas di atas judul */}
                <div className="absolute inset-x-0 bottom-0 h-[140px] md:h-[180px] bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 transition-opacity duration-500 md:group-hover:opacity-100 pointer-events-none" />
                
                {/* Caption Teks (Mobile selalu terlihat, Desktop slide up & muncul saat hover) */}
                <div className="absolute bottom-0 left-0 flex flex-col p-6 md:p-8 translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 transition-all duration-500 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100 pointer-events-none">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber mb-2 drop-shadow-md">
                    {item.category}
                  </span>
                  <h3 className="font-sans text-xl md:text-2xl font-medium leading-[1.15] tracking-[-.02em] text-white drop-shadow-lg">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
