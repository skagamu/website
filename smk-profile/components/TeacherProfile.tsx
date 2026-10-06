"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import facultyData from "../data/faculty.json";
import type { FacultyMember } from "../types";

// ============================================================================
// DATA GURU / TENAGA PENDIDIK — Sumber: data/faculty.json (CMS-Ready)
// ============================================================================
// Admin Panel mengubah isi file JSON ini via Git commit (GitHub API).
// Foto guru disimpan di public/media/teachers/.
// ============================================================================
const TEACHERS: FacultyMember[] = facultyData;

export default function TeacherProfile() {
  return (
    <section className="relative w-full bg-white pt-24 pb-20 overflow-hidden">
      {/* Container Lebar Penuh dengan Padding */}
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        
        {/* TOP HEADER SECTION (3 Kolom) */}
        {/* Divider Garis Atas */}
        <div className="mb-12 h-px w-full bg-gray-200" />
        
        <div className="mb-10 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          {/* Kiri: Judul Section */}
          <div className="md:w-5/12 lg:w-4/12">
            <h2 className="max-w-4xl font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-.02em]">
              <span className="block text-navy">Tenaga</span>
              <span className="block text-amber">Pendidik</span>
            </h2>
          </div>
          
          {/* Tengah: Deskripsi */}
          <div className="md:w-4/12 lg:w-3/12">
            <p className="font-body text-base leading-relaxed text-slate-600">
              Bertemu dengan para guru dan instruktur industri yang berdedikasi tinggi untuk membentuk karakter dan kompetensi siswa.
            </p>
          </div>
          
          {/* Kanan: Link CTA */}
          <div className="md:w-3/12 lg:w-4/12 flex md:justify-end">
            <Link 
              href="/guru" 
              className="group flex items-center gap-2 font-sans text-sm font-bold tracking-wide text-navy transition-colors hover:text-navy/80"
            >
              Lihat Semua Guru 
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* PORTRAIT GRID (Konten Utama) */}
        <div className="relative">
          
          {/* SOLID BACKGROUND BLOCK (Dekorasi) */}
          <div className="absolute top-[35%] left-[-50vw] right-[-50vw] bottom-[-4rem] bg-[#FAFAFA] z-0" />

          {/* Grid Container (Scrollable di Mobile, Grid 4 Kolom di Desktop) */}
          <div className="relative z-10 flex w-full snap-x snap-mandatory gap-0 overflow-x-auto pb-8 md:grid md:grid-cols-4 md:gap-0 md:overflow-visible md:pb-0 hide-scrollbar">
            
            {TEACHERS.map((teacher, index) => {
              return (
                <div
                  key={teacher.id}
                  className="group flex w-[85vw] shrink-0 snap-center flex-col md:w-auto"
                >
                  {/* Container Utama (Frame/Stroke Menyatukan Foto & Teks) */}
                  <div className={`relative flex flex-col h-full bg-[#FCFCFC] border-y border-gray-200 border-r md:border-r-0 md:border-l ${index === TEACHERS.length - 1 ? 'md:border-r' : 'md:border-r-0'} ${index === 0 ? 'border-l' : ''}`}>
                    
                    {/* Bagian Foto (Dengan Padding Atas-Kiri-Kanan) */}
                    <div className="relative aspect-[4/5] w-full p-5 pb-0">
                      <div className="relative h-full w-full overflow-hidden bg-gray-100">
                        <Image
                          src={teacher.image}
                          alt={teacher.name}
                          fill
                          sizes="(max-width: 768px) 85vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Teks Nama & Jabatan (Di dalam Container, Padding Bawah) */}
                    <div className="relative z-10 flex flex-col p-5 pt-6 pb-8">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 md:text-slate-500">
                        {teacher.role}
                      </p>
                      <h3 className="mt-3 font-sans text-xl md:text-[1.6rem] font-medium leading-[1.15] tracking-[-.02em] text-[#0f172a]">
                        {teacher.name}
                      </h3>
                    </div>
                  
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}
