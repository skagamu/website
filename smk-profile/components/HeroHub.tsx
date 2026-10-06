"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PPDB_FORM_URL } from "../config/site";
import heroData from "../data/hero.json";

export type HeroSlide = {
  id: string;
  label: string;
  headline: readonly [string, string];
  description: string;
  durationMs: number;
  image: string; // Tipe diubah ke string untuk URL absolut
  objectPosition?: string;
} & ({ kind: "image" } | { kind: "video"; videoSrc: string });

// Hero Slides — Sumber: data/hero.json (CMS-Ready via Git commit)
// kind default "image"; slide video dapat ditambahkan admin dengan field "videoSrc".
export const heroSlides = heroData.slides.map((s: any) => ({
  ...s,
  headline: [s.headline?.[0] ?? "", s.headline?.[1] ?? ""] as [string, string],
  kind: s.videoSrc ? ("video" as const) : ("image" as const),
  videoSrc: s.videoSrc,
})) as unknown as readonly [HeroSlide, ...HeroSlide[]];

export type HeroHubProps = {
  slides?: readonly [HeroSlide, ...HeroSlide[]];
  ppdbHref?: string;
  facilitiesHref?: string;
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const controlClass = "group grid size-12 shrink-0 rotate-45 place-items-center border border-white/50 bg-transparent text-white transition-colors hover:bg-white/10 hover:border-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
const ctaClass = "inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap px-6 py-3 font-body text-sm font-semibold transition-colors active:scale-[.98]";

function BackgroundMedia({ slide, active, playing, reduced, priority }: {
  slide: HeroSlide;
  active: boolean;
  playing: boolean;
  reduced: boolean;
  priority: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && active && !reduced) {
      void video.play().catch(() => {
        // Browsers may block autoplay; the local poster remains visible.
      });
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [active, playing, reduced]);

  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.6 }}
      className="pointer-events-none absolute inset-0"
    >
      <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: slide.objectPosition }} />
      {slide.kind === "video" && active && !reduced && !failed && (
        <video ref={videoRef} muted loop playsInline preload="none"
          poster={slide.image} onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: slide.objectPosition }}
          src={slide.videoSrc} />
      )}
    </motion.div>
  );
}

export default function HeroHub({
  slides = heroSlides,
  ppdbHref = PPDB_FORM_URL,
  facilitiesHref = "/fasilitas/360/",
}: HeroHubProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const id = useId();
  const reduced = !ready || reduceMotion !== false;
  const playing = !paused && !reduced && visible && inView;
  const index = active % slides.length;
  const slide = slides[index];
  const multiple = slides.length > 1;

  const selectSlide = useCallback((target: number) => {
    progress.set(0);
    setActive((target + slides.length) % slides.length);
  }, [progress, slides.length]);

  useEffect(() => {
    setReady(true);
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing || !multiple) return;
    const duration = Math.max(1000, slide.durationMs) / 1000;
    const animation = animate(progress, 1, {
      duration: duration * (1 - progress.get()),
      ease: "linear",
      onComplete: () => selectSlide(index + 1),
    });
    return () => animation.stop();
  }, [index, multiple, playing, progress, selectSlide, slide.durationMs]);

  return (
    <section ref={sectionRef} aria-roledescription="karusel" aria-label="Mengenal SMK Gajah Mungkur 1 Wuryantoro"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-navy text-white"
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && event.target.matches(":focus-visible")) setPaused(true);
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || !multiple) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setPaused(true);
          selectSlide(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
      <div className="absolute inset-0 -z-20">
        {slides.map((item, itemIndex) => (
          <BackgroundMedia key={item.id} slide={item} active={index === itemIndex}
            playing={playing} reduced={reduced} priority={itemIndex === 0} />
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,.98)_0%,rgba(0,0,0,0)_50%)]" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-end px-6 pb-8 pt-16 md:px-16 md:pb-12">
        <div className="w-full border-t border-white/35 pt-8">
          <div id={`${id}-slide`} role="group" aria-roledescription="slide"
            aria-label={`${index + 1} dari ${slides.length}: ${slide.label}`}>
            <motion.div key={`${slide.id}-${reduced}`} initial={reduced ? false : "hidden"} animate="visible"
              variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}>
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
                <div>
                  <h1 className="max-w-4xl font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-.02em]">
                    {slide.headline.map((line, lineIndex) => (
                      <motion.span key={line} variants={reduced ? undefined : reveal}
                        className={`block ${lineIndex === 1 ? "text-amber" : "text-white"}`}>{line}</motion.span>
                    ))}
                  </h1>
                </div>
                <motion.p variants={reduced ? undefined : reveal}
                  className="max-w-[34rem] font-body text-base leading-[1.6] text-slate-100 md:text-right">
                  {slide.description}
                </motion.p>
              </div>
            </motion.div>
          </div>

          <motion.div initial={false} animate={{ opacity: 1 }}
            className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
            <motion.a href={facilitiesHref} whileHover={reduced ? undefined : { y: -2 }}
              className="flex items-center justify-center border border-white px-8 py-3.5 font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/20">
              Jelajahi
            </motion.a>
            <motion.a href={ppdbHref} target="_blank" rel="noopener noreferrer" whileHover={reduced ? undefined : { y: -2 }}
              className={`${ctaClass} bg-white text-black hover:bg-slate-200`}>
              Daftar PPDB <ArrowRight size={18} aria-hidden="true" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Navigasi layar menengah ke atas */}
      <div className="pointer-events-none absolute top-1/2 left-8 z-10 hidden -translate-y-1/2 md:block">
        <button type="button" disabled={!multiple} className={`pointer-events-auto ${controlClass}`}
          aria-label="Slide sebelumnya" aria-controls={`${id}-slide`}
          onClick={() => selectSlide(index - 1)}>
          <ChevronLeft size={24} aria-hidden="true" className="-rotate-45" />
        </button>
      </div>
      <div className="pointer-events-none absolute top-1/2 right-8 z-10 hidden -translate-y-1/2 md:block">
        <button type="button" disabled={!multiple} className={`pointer-events-auto ${controlClass}`}
          aria-label="Slide berikutnya" aria-controls={`${id}-slide`}
          onClick={() => selectSlide(index + 1)}>
          <ChevronRight size={24} aria-hidden="true" className="-rotate-45" />
        </button>
      </div>

      {/* Kontrol dan Pagination Mobile */}
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-6 md:px-16 md:pb-8">
        <div className="flex items-center justify-between gap-4 md:hidden">
          <span className="font-body text-xs tabular-nums text-white/70" aria-hidden="true">
            {index + 1} / {slides.length}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={!multiple} className="group grid size-10 shrink-0 rotate-45 place-items-center border border-white/50 bg-transparent text-white transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Slide sebelumnya" aria-controls={`${id}-slide`}
              onClick={() => selectSlide(index - 1)}>
              <ChevronLeft size={20} aria-hidden="true" className="-rotate-45" />
            </button>
            <button type="button" disabled={!multiple} className="group grid size-10 shrink-0 rotate-45 place-items-center border border-white/50 bg-transparent text-white transition-colors hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Slide berikutnya" aria-controls={`${id}-slide`}
              onClick={() => selectSlide(index + 1)}>
              <ChevronRight size={20} aria-hidden="true" className="-rotate-45" />
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        Slide {index + 1} dari {slides.length}. {slide.headline.join(" ")}
      </p>
    </section>
  );
}
