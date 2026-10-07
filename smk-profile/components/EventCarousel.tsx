"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import eventsData from "../data/events.json";
import type { EventItem } from "../types";

// ============================================================================
// DATA EVENT / BERITA — Sumber: data/events.json (CMS-Ready)
// ============================================================================
// Admin Panel mengubah daftar event via Git commit ke file JSON ini.
// Gambar event disimpan di public/media/events/.
// ============================================================================
const EVENTS = eventsData as EventItem[];
const THEMES = { blue: "from-blue-900 to-slate-900", green: "from-emerald-900 to-slate-900", purple: "from-purple-900 to-slate-900", rose: "from-rose-900 to-slate-900", orange: "from-orange-900 to-slate-900" };

// Varian animasi pergerakan kartu
const cardVariantsDesktop = {
  active: { x: "0%", scale: 1, opacity: 1, zIndex: 30 },
  prev: { x: "-85%", scale: 0.85, opacity: 1, zIndex: 20 },
  next: { x: "85%", scale: 0.85, opacity: 1, zIndex: 20 },
  hiddenRight: { x: "120%", scale: 0.7, opacity: 0, zIndex: 10 },
  hiddenLeft: { x: "-120%", scale: 0.7, opacity: 0, zIndex: 10 },
};

const cardVariantsMobile = {
  active: { x: "0%", scale: 1, opacity: 1, zIndex: 30 },
  prev: { x: "-105%", scale: 0.85, opacity: 0.5, zIndex: 20 },
  next: { x: "105%", scale: 0.85, opacity: 0.5, zIndex: 20 },
  hiddenRight: { x: "200%", scale: 0.7, opacity: 0, zIndex: 10 },
  hiddenLeft: { x: "-200%", scale: 0.7, opacity: 0, zIndex: 10 },
};

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check window size for responsive variants
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = EVENTS.length - 1;
      if (nextIndex >= EVENTS.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // Logika penentuan posisi setiap kartu relatif terhadap currentIndex
  const getCardState = (index: number) => {
    if (index === currentIndex) return "active";
    if (index === (currentIndex + 1) % EVENTS.length) return "next";
    if (index === (currentIndex - 1 + EVENTS.length) % EVENTS.length) return "prev";
    
    const diff = (index - currentIndex + EVENTS.length) % EVENTS.length;
    return diff > EVENTS.length / 2 ? "hiddenLeft" : "hiddenRight";
  };

  const activeEvent = EVENTS[currentIndex];

  return (
    <section id="berita" className="relative flex min-h-[100dvh] md:min-h-0 w-full flex-col items-center justify-center overflow-hidden py-24 lg:h-screen lg:py-0">
      {/* Dynamic Vibrant Background Gradient */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${THEMES[activeEvent.theme]}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col justify-center px-4 md:px-8 h-full">
        
        {/* DESKTOP TYPOGRAPHY (Overlapping on left) */}
        <div className="pointer-events-none absolute left-[5%] top-1/2 z-40 hidden w-[45%] -translate-y-1/2 flex-col md:flex lg:left-[8%] lg:w-[40%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-auto flex flex-col items-start"
            >
              <span className="mb-4 inline-block bg-white/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
                {activeEvent.date} • {activeEvent.status}
              </span>
              <h3 className="font-sans text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-.02em] text-white drop-shadow-xl">
                {activeEvent.title}
              </h3>
              
              <Link 
                href={activeEvent.href} 
                className="mt-8 flex items-center gap-3 border border-white/50 bg-white/10 px-8 py-4 font-sans text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-navy"
              >
                Lihat Detail <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER MODE CAROUSEL TRACK (Sliding Cards) */}
        <div className="relative flex w-full items-center justify-center py-4 md:py-0 mt-8 md:mt-0">
          <div className="relative flex aspect-[4/3] sm:aspect-video w-[85%] sm:w-[90%] items-center justify-center md:w-[60%] lg:w-[55%]">
            {EVENTS.map((event, index) => {
              const state = getCardState(index);
              const isActive = state === "active";
              
              if (!mounted) return null;

              return (
                <motion.div
                  key={event.id}
                  variants={isMobile ? cardVariantsMobile : cardVariantsDesktop}
                  initial={false}
                  animate={state}
                  transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 cursor-pointer overflow-hidden shadow-2xl"
                  onClick={() => {
                    if (state === "prev") paginate(-1);
                    if (state === "next") paginate(1);
                  }}
                >
                  {/* Dimming overlay for inactive cards */}
                  <motion.div 
                    animate={{ opacity: isActive ? 0 : 0.6 }} 
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 z-10 bg-black pointer-events-none" 
                  />
                  
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, 60vw"
                    priority={isActive}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE TYPOGRAPHY (Stacked below carousel) */}
        <div className="z-40 mt-8 mb-36 flex w-full flex-col items-center text-center md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <span className="mb-3 inline-block bg-white/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {activeEvent.date}
              </span>
              <h3 className="mb-6 px-4 font-sans text-xl sm:text-2xl font-medium leading-[1.15] tracking-[-.02em] text-white drop-shadow-md">
                {activeEvent.title}
              </h3>
              <Link 
                href={activeEvent.href} 
                className="flex items-center gap-2 border border-white/50 bg-white/10 px-6 py-3 font-sans text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-navy"
              >
                Lihat Detail <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM CONTROLS (Diamond Arrows & Progress Line) */}
        <div className="absolute bottom-6 left-4 right-4 z-40 flex flex-row items-center justify-between md:items-end md:bottom-12 md:left-8 md:right-8 lg:left-16 lg:right-16">
          
          {/* Diamond Navigation */}
          <div className="flex shrink-0 gap-3 sm:gap-6 md:gap-6">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous Event"
              className="grid size-10 rotate-45 place-items-center border border-white/40 bg-transparent text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-navy md:size-14"
            >
              <ChevronLeft size={20} strokeWidth={1.5} className="-rotate-45 md:scale-125" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next Event"
              className="ml-2 sm:ml-4 grid size-10 rotate-45 place-items-center border border-white/40 bg-transparent text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-navy md:ml-6 md:size-14"
            >
              <ChevronRight size={20} strokeWidth={1.5} className="-rotate-45 md:scale-125" />
            </button>
          </div>

          {/* Progress Line */}
          <div className="ml-4 sm:ml-8 flex w-full max-w-[150px] sm:max-w-[280px] flex-col gap-2 sm:gap-3 md:max-w-md">
            <div className="flex justify-between font-mono text-xs font-medium text-white/70 md:text-sm">
              <span>0{currentIndex + 1}</span>
              <span>0{EVENTS.length}</span>
            </div>
            <div className="relative h-[2px] w-full overflow-hidden bg-white/20">
              <motion.div
                className="absolute bottom-0 left-0 top-0 bg-white"
                initial={false}
                animate={{ width: `${((currentIndex + 1) / EVENTS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
