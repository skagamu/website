"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import manifestoData from "../data/manifesto.json";

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  // Statement manifesto — Sumber: data/manifesto.json (CMS-Ready)
  const text = manifestoData.manifesto.statement;
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.032,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
  };

  return (
    <section className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#F9F8F6] px-6 py-24 text-navy md:px-16 md:py-32">
      {/* Top Left Organic Shape (Amber) */}
      <svg className="absolute -left-20 -top-20 -z-10 w-48 text-amber opacity-90 md:w-96 lg:-left-32 lg:-top-32 lg:w-[32rem]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0,0 L400,0 C380,120 300,280 180,360 C80,420 0,380 0,400 Z" fill="currentColor" />
      </svg>

      {/* Top Right Organic Shape (Crimson) */}
      <svg className="absolute -right-16 -top-16 -z-10 w-40 text-crimson opacity-90 md:-right-24 md:-top-24 md:w-80 lg:w-[28rem]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M400,0 L200,0 C180,150 250,280 350,380 C390,420 400,380 400,400 Z" fill="currentColor" />
        {/* Subtle leaf/laurel pattern inside the shape (JIS style) */}
        <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
          <path d="M280,100 C300,120 320,150 330,180" />
          <path d="M290,120 C310,140 330,130 350,110" />
          <path d="M270,140 C290,160 310,150 330,130" />
          <path d="M260,160 C280,180 300,170 320,150" />
        </g>
      </svg>

      {/* Bottom Right Geometric Corner (Navy/Slate/Green accents) */}
      <svg className="absolute -bottom-16 -right-16 -z-10 w-48 opacity-95 md:-bottom-24 md:-right-24 md:w-[26rem] lg:-bottom-32 lg:-right-32 lg:w-[36rem]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M400,400 L0,400 C100,250 250,150 400,50 Z" fill="#2563EB" /> {/* Blue curve base */}
      </svg>
      <div className="absolute bottom-4 right-4 z-0 opacity-80 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16">
        <Image src="/website/media/brand/logo-smk.png" alt="" width={80} height={80} className="w-12 h-12 md:w-20 md:h-20 object-contain" aria-hidden="true" />
      </div>

      {/* Bottom Left Leaf Shape (Green) */}
      <svg className="absolute -bottom-12 -left-12 -z-10 w-32 text-green-700 opacity-90 md:-bottom-16 md:-left-16 md:w-64" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0,300 L150,300 C250,280 280,180 200,100 C150,50 50,50 0,150 Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto w-full max-w-[1200px] text-center">
        {/* Center Logo Placeholder */}
        <div className="mx-auto mb-8 flex h-16 items-center justify-center md:mb-12 md:h-32">
          {/* Untuk mengganti logo ini dengan file asli, cukup ubah tag Image di bawah ini dengan gambar logo yang sesuai */}
          <Image src="/website/media/brand/logo-smk.png" alt="Logo SMK Gajah Mungkur 1 Wuryantoro" width={140} height={140} className="w-20 h-20 md:w-[140px] md:h-[140px] object-contain drop-shadow-md" />
        </div>

        {/* Title / Label */}
        <h2 className="mb-6 font-sans text-xs md:text-sm font-semibold uppercase tracking-[1.5px] text-navy/70 md:mb-10">
          Why We Exist
        </h2>

        {/* Animated Text */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-[0.25em] gap-y-[0.2em] font-sans text-[clamp(1.5rem,4.5vw,3rem)] font-light leading-[1.3] text-navy md:text-[clamp(2.5rem,4vw,3.5rem)]"
        >
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {word.split("").map((letter, letterIndex) => (
                <motion.span key={letterIndex} variants={letterVariants}>
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
