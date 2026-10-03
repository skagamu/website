"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PPDB_FORM_URL } from "../config/site";

// ============================================================================
// DATA & CONSTANTS
// ============================================================================
const NAV_LINKS = [
  { name: "Profil", href: "/tentang-kami" },
  { 
    name: "Program Keahlian", 
    href: "#",
    dropdown: [
      { name: "Teknik Kendaraan Ringan", href: "/program/teknik-kendaraan-ringan" },
      { name: "Bisnis Digital", href: "/program/bisnis-digital" },
      { name: "Akuntansi", href: "/program/akuntansi" },
    ]
  },
  { name: "Fasilitas", href: "#fasilitas" },
  { name: "Alumni", href: "/alumni" },
  { name: "Berita", href: "/berita" },
];

const PPDB_LINK = PPDB_FORM_URL;

export default function GlobalNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Tambahan state untuk active dropdown di desktop (opsional)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();

  // Handle scroll event untuk merubah state navbar transparan/putih
  useEffect(() => {
    const handleScroll = () => {
      // 50px threshold untuk transisi
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Cek inisial saat mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kunci scroll saat mobile menu terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Tutup menu mobile jika route berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 
        NAVBAR UTAMA (Desktop & Mobile Header)
        - Background Putih Solid permanen & Teks Navy
      */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 bg-white text-[#0C2340] ${
          isScrolled ? "shadow-md py-3 md:py-4" : "py-4 md:py-5 border-b border-slate-100"
        }`}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-16">
          
          {/* KOLOM KIRI: Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-sm"
            aria-label="Beranda SMK Gajah Mungkur 1"
          >
            {/* Logo Image */}
            <div className={`relative flex items-center justify-center transition-all duration-300 ${isScrolled ? 'size-10 md:size-12' : 'size-12 md:size-14'}`}>
              <Image 
                src="/website/media/brand/logo-smk.png" 
                alt="Logo SMK GM 1" 
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Text Logo */}
            <span className={`font-sans font-medium tracking-[-.01em] text-[#0C2340] transition-colors duration-300 ${isScrolled ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`}>
              SMK Gajah Mungkur 1 Wuryantoro
            </span>
          </Link>

          {/* KOLOM TENGAH: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={link.href}
                  className={`flex items-center gap-1 font-body text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-sm hover:text-[#F59E0B]`}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                  )}
                </Link>

                {/* Animated Underline Hover Effect */}
                <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 ease-out group-hover:w-full`} />

                {/* Simple Dropdown (Hover) */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, rotateX: -10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 10, rotateX: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 top-full pt-4 origin-top"
                      >
                        <div className="flex w-64 flex-col bg-white p-2 shadow-xl ring-1 ring-black/5">
                          {link.dropdown.map((drop) => (
                            <Link 
                              key={drop.name} 
                              href={drop.href}
                              className="px-4 py-3 font-body text-sm font-medium text-[#0F172A] hover:bg-slate-50 hover:text-[#F59E0B] focus:bg-slate-50 focus:text-[#F59E0B] focus:outline-none"
                            >
                              {drop.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* KOLOM KANAN: Desktop Actions (CTA) */}
          <div className="hidden lg:flex items-center gap-6">
            <a 
              href={PPDB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap px-8 py-3.5 font-body text-sm font-semibold transition-all duration-300 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border bg-[#0C2340] border-[#0C2340] text-white hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:shadow-lg focus-visible:ring-[#0C2340]`}
            >
              Daftar PPDB 
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className={`flex items-center justify-center p-2 lg:hidden transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-sm text-[#0C2340]`}
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
            aria-controls="mobile-menu"
          >
            <Menu size={28} strokeWidth={2} />
          </button>

        </div>
      </motion.nav>

      {/* 
        FULLSCREEN OVERLAY MOBILE MENU 
        - Warna background: Deep Navy (#0C2340)
        - Tipografi berukuran besar
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#0C2340] text-white overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header Mobile Menu (Logo & Close Btn) */}
            <div className="flex w-full items-center justify-between px-6 py-5 md:px-16 md:py-6 border-b border-white/10">
              <Link 
                href="/" 
                className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative size-12">
                  <Image 
                    src="/website/media/brand/logo-smk.png" 
                    alt="Logo SMK GM 1" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-sans text-base font-bold tracking-tight">SMK Gajah Mungkur 1 Wuryantoro</span>
              </Link>

              <button
                type="button"
                className="p-2 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu navigasi"
              >
                <X size={32} strokeWidth={2} />
              </button>
            </div>

            {/* Link List Mobile */}
            <div className="flex flex-col px-8 py-12 gap-8 flex-grow">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (i * 0.05), ease: "easeOut" }}
                >
                  <Link 
                    href={link.href}
                    className="font-sans text-3xl font-bold tracking-tight text-white hover:text-[#F59E0B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  
                  {/* Tampilkan sub-menu statis jika ada dropdown */}
                  {link.dropdown && (
                    <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-white/20">
                      {link.dropdown.map((drop) => (
                        <Link
                          key={drop.name}
                          href={drop.href}
                          className="font-body text-lg text-white/70 hover:text-[#F59E0B] transition-colors focus:outline-none"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {drop.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions Mobile (CTA) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="mt-auto flex flex-col gap-6 p-8 border-t border-white/10 bg-[#0A1D36]"
            >
              <a 
                href={PPDB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 w-full bg-[#0C2340] border border-[#0C2340] py-3.5 font-body text-sm font-semibold text-white transition-all active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0C2340]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar PPDB <ArrowRight size={18} aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
