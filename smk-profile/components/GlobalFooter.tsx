"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock, ArrowRight, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { PPDB_FORM_URL } from "../config/site";

// ============================================================================
// DATA & KONSTANTA FOOTER
// ============================================================================
// Ganti tautan/nomor kontak di sini melalui Admin Panel (CMS) di kemudian hari.
const CONTACT_INFO = {
  phone: "+62 273 532 7111",
  email: "info@smkgajahmungkur1wuryantoro.sch.id",
};

export default function GlobalFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0C2340] text-white">
      {/* 
        Subtle Background Pattern (SVG Data URI) 
        Pattern heksagonal/damask sangat tipis (opacity 5-10%) menutupi seluruh footer.
      */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-16 md:px-16 md:py-20 lg:py-24">
        
        {/* TOP SECTION: Logo & Tagline (Left) | Diamond CTAs (Right) */}
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between border-b border-white/20 pb-12 md:pb-16">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left">
            <div className="relative size-20 shrink-0 md:size-24 lg:size-28">
              <Image 
                src="/media/brand/logo-smk.png" 
                alt="Logo SMK Gajah Mungkur 1 Wuryantoro" 
                fill
                className="object-contain" 
              />
            </div>
            <div className="mt-6 md:mt-0 md:ml-6 flex flex-col">
              <h2 className="font-sans text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                SMK Gajah Mungkur 1<br/>Wuryantoro
              </h2>
              <p className="mt-2 font-mono text-sm font-medium tracking-wide text-[#F59E0B]">
                Vokasi Hebat, Lulusan Bermartabat.
              </p>
            </div>
          </div>

          {/* The PPDB Button CTA */}
          <div className="flex flex-col items-center justify-center md:items-end gap-12 pt-8 md:pt-0">
            {/* PPDB CTA from Hero */}
            <a 
              href={PPDB_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 border border-white bg-white px-8 py-3.5 font-body text-sm font-semibold text-black transition-colors duration-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              Daftar PPDB <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

        </div>

        {/* MIDDLE SECTION: Kontak Global & Grid Alamat */}
        <div className="flex flex-col gap-10 py-12 md:py-16 border-t border-white/20">
          
          {/* Global Phone */}
          <div className="flex items-center gap-3">
            <Phone size={24} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-sans text-xl font-bold tracking-wide md:text-2xl">
              {CONTACT_INFO.phone}
            </span>
          </div>

          {/* 3-Column Address Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            
            {/* Kampus 1 (Utama) */}
            <div className="flex items-start gap-4">
              <MapPin size={24} className="mt-1 shrink-0 text-[#F59E0B]" />
              <div className="flex flex-col">
                <h4 className="font-sans text-lg font-bold text-white">
                  Kampus Utama (Gedung A)
                </h4>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-white/80">
                  Jl. Raya Wonogiri - Pracimantoro Km. 13<br />
                  Kec. Wuryantoro, Kab. Wonogiri<br />
                  Jawa Tengah 57661
                </p>
              </div>
            </div>

            {/* Email / Info Lanjutan */}
            <div className="flex items-start gap-4">
              <Mail size={24} className="mt-1 shrink-0 text-[#F97316]" />
              <div className="flex flex-col">
                <h4 className="font-sans text-lg font-bold text-white">
                  Surat Elektronik & Informasi
                </h4>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-white/80">
                  Untuk pertanyaan umum, legalisir, dan kerjasama industri silakan hubungi:<br />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-amber-400 hover:underline">
                    {CONTACT_INFO.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="flex items-start gap-4">
              <Clock size={24} className="mt-1 shrink-0 text-[#10B981]" />
              <div className="flex flex-col">
                <h4 className="font-sans text-lg font-bold text-white">
                  Jam Operasional Sekolah
                </h4>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-white/80">
                  Senin - Jumat: 07.00 - 15.30 WIB<br />
                  Sabtu: 07.00 - 12.00 WIB (Ekstrakurikuler)<br />
                  Minggu & Libur Nasional: Tutup
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Utilities & Socials */}
        <div className="flex flex-col-reverse items-center justify-between gap-6 pt-12 md:flex-row md:items-center">
          
          {/* Utility Links */}
          <div className="flex flex-wrap justify-center gap-6 font-sans text-sm font-medium text-white/90 md:justify-start md:gap-8">
            <Link href="/kontak" className="hover:text-[#F59E0B] transition-colors">Hubungi Kami</Link>
            <Link href="/privasi" className="hover:text-[#F59E0B] transition-colors">Kebijakan Privasi</Link>
            <Link href="/sitemap" className="hover:text-[#F59E0B] transition-colors">Peta Situs</Link>
            <Link href="/aksesibilitas" className="hover:text-[#F59E0B] transition-colors">Aksesibilitas</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-[#F59E0B] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-[#F59E0B] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter/X" className="text-white hover:text-[#F59E0B] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="text-white hover:text-[#F59E0B] transition-colors">
              <Youtube size={20} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-[#F59E0B] transition-colors">
              <Linkedin size={20} />
            </a>
          </div>

        </div>

        {/* LOGO MITRA INDUSTRI / AKREDITASI (Bottom-most strip) */}
        {/* Dihapus sesuai permintaan user */}

      </div>
    </footer>
  );
}