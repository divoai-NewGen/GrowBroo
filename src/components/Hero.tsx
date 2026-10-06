"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";
import ContactModal from "./ContactModal";

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Ensure video autoplays automatically and cleanly
    if (videoRef.current) {
      if (!mediaQuery.matches) {
        videoRef.current.play().catch(() => {
          // Fallback if browser policy defers play
        });
      } else {
        videoRef.current.pause();
      }
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <>
      {/* 
        Hero Stage Wrapper:
        Maintains the exact two-column layout on desktop and vertical stacking on mobile.
      */}
      <div
        id="hero-stage"
        className="relative w-full h-full flex items-start bg-white overflow-hidden"
      >
        {/* Pinned visual stage */}
        <div className="w-full flex items-center overflow-visible pt-1 sm:pt-2 pb-8 sm:pb-12">
          {/* Ambient background glows */}
          <div
            aria-hidden="true"
            className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-[#E9FAFC] rounded-full blur-3xl pointer-events-none -z-10"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/3 -right-24 w-[380px] h-[380px] bg-[#02DEF1]/15 rounded-full blur-3xl pointer-events-none -z-10"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Typography & CTAs (approx 45% / 5 cols) - 100% UNCHANGED */}
              <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9FAFC] border border-[#DCECEF] shadow-xs mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#02DEF1] animate-pulse" />
                  <span className="text-[11px] font-black tracking-widest text-[#0194A6] uppercase">
                    BUILD • GROW • SCALE
                  </span>
                </div>

                {/* Big Headline in Navy */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#003351] tracking-tight leading-[1.08] mb-6">
                  Big Ideas. <br />
                  <span className="text-[#0194A6] relative inline-block">
                    Built for Real
                    <svg
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#02DEF1]"
                      viewBox="0 0 200 12"
                      fill="none"
                    >
                      <path
                        d="M2 9C58 3 142 3 198 9"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  Growth.
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg text-[#344054] leading-relaxed max-w-xl mb-8">
                  We engineer thoughtful digital platforms, high-velocity Next.js products, and conversion-focused systems that help ambitious companies launch, scale, and dominate their category.
                </p>

                {/* Dual CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0194A6] text-white font-bold text-sm hover:bg-[#003351] shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 group cursor-pointer"
                  >
                    <span>Get Started</span>
                    <span className="w-5 h-5 rounded-full bg-[#02DEF1] text-[#003351] flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon size={12} strokeWidth={3} />
                    </span>
                  </button>

                  <Link
                    href="/projects"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#DCECEF] text-[#003351] font-bold text-sm hover:bg-[#E9FAFC] hover:border-[#0194A6]/40 transition-all duration-200"
                  >
                    <span>View Projects</span>
                    <ArrowUpRightIcon size={16} className="text-[#344054]" />
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="mt-8 pt-6 border-t border-[#DCECEF] w-full flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#002F4D] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#02DEF1]">
                      AL
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0194A6] border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                      KS
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#02DEF1] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#003351]">
                      TR
                    </div>
                  </div>
                  <div className="text-xs text-[#344054]">
                    <span className="font-bold text-[#003351]">50+ venture-backed clients</span> scaling with zero bloat code.
                  </div>
                </div>
              </div>

              {/* 
                Right Column: Animated Laptop + Rocket Video Illustration
                Seamlessly integrated without visible cards, rectangular player borders or controls.
              */}
              <div className="lg:col-span-7 relative flex items-center justify-center overflow-visible py-2 sm:py-4">
                <div className="relative w-full max-w-[620px] sm:max-w-[720px] lg:max-w-[860px] xl:max-w-[960px] flex items-center justify-center lg:scale-105 xl:scale-115 transform-gpu origin-center">
                  <div className="w-full relative flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay={!prefersReducedMotion}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster="/hero/hero-poster.png"
                      aria-hidden="true"
                      className="w-full h-auto object-contain pointer-events-none select-none"
                    >
                      <source src="/hero/hero-laptop-rocket.mp4" type="video/mp4" />
                      {/* Fallback image */}
                      <img
                        src="/hero/hero-poster.png"
                        alt=""
                        className="w-full h-auto object-contain"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Contact Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
