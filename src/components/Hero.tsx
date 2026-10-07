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
            className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-[#E9F8E9] rounded-full blur-3xl pointer-events-none -z-10"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/3 -right-24 w-[380px] h-[380px] bg-[#39E900]/12 rounded-full blur-3xl pointer-events-none -z-10"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Typography & CTAs with smooth staggered entrance on refresh */}
              <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
                {/* Eyebrow Badge */}
                <div className="animate-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F8E9] border border-[#D8E7D8] shadow-xs mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                  <span className="text-[11px] font-black tracking-widest text-[#006B21] uppercase">
                    BUILD • GROW • SCALE
                  </span>
                </div>

                {/* Big Headline in Pure Black with Deep Green & Neon Lime Accent */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050505] tracking-tight leading-[1.08] mb-6">
                  <span className="block animate-hero-title-1">
                    Big Ideas.
                  </span>
                  <span className="block animate-hero-title-2 mt-1 sm:mt-1.5">
                    <span className="text-[#006B21] relative inline-block">
                      Built for Real
                      <svg
                        aria-hidden="true"
                        className="absolute -bottom-2 left-0 w-full h-3 text-[#39E900]"
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
                  </span>
                </h1>

                {/* Supporting Paragraph */}
                <p className="animate-hero-desc text-base sm:text-lg text-[#4D5C52] leading-relaxed max-w-xl mb-8">
                  We engineer thoughtful digital platforms, high-velocity Next.js products, and conversion-focused systems that help ambitious companies launch, scale, and dominate their category.
                </p>

                {/* Dual CTA Buttons */}
                <div className="animate-hero-cta flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#006B21] text-white font-bold text-sm hover:bg-[#10251A] shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 group cursor-pointer"
                  >
                    <span>Get Started</span>
                    <span className="w-5 h-5 rounded-full bg-[#39E900] text-[#050505] flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon size={12} strokeWidth={3} />
                    </span>
                  </button>

                  <Link
                    href="/projects"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#D8E7D8] text-[#050505] font-bold text-sm hover:bg-[#E9F8E9] hover:border-[#006B21]/40 transition-all duration-200"
                  >
                    <span>View Projects</span>
                    <ArrowUpRightIcon size={16} className="text-[#4D5C52]" />
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="animate-hero-proof mt-8 pt-6 border-t border-[#D8E7D8] w-full flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#10251A] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#39E900]">
                      AL
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#006B21] border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                      KS
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#39E900] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#050505]">
                      TR
                    </div>
                  </div>
                  <div className="text-xs text-[#4D5C52]">
                    <span className="font-bold text-[#050505]">50+ venture-backed clients</span> scaling with zero bloat code.
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
