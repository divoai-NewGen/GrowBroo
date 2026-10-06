"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";
import ContactModal from "./ContactModal";
import RocketIllustration from "./RocketIllustration";

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const isLaunchingRef = useRef(false);

  useEffect(() => {
    let rafId: number;

    const updateScrollAnimation = () => {
      if (!rocketRef.current || !heroWrapperRef.current) return;

      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        rocketRef.current.style.transform = "none";
        rocketRef.current.style.opacity = "1";
        rocketRef.current.style.visibility = "visible";
        return;
      }

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight || 800;

      // Runway is calibrated to 38vh (~300px - 340px) so the rocket's complete exit and
      // the Trust card's arrival happen on the EXACT same scroll point without any dead gap
      const runway = window.innerWidth < 640
        ? Math.max(viewportHeight * 0.35, 240)
        : Math.max(viewportHeight * 0.38, 300);

      const progress = Math.max(scrollY / runway, 0);

      // Rocket exit distance: completely clears top edge including large exhaust flame
      const exitDistance = viewportHeight * 1.35 + 240;

      // Liftoff kinematics:
      // Smooth start -> accelerating liftoff -> fully clears top edge right as progress reaches 0.95 - 1.0
      const flightProgress = Math.min(progress / 0.96, 1.0);
      const translateY = -Math.pow(flightProgress, 1.55) * exitDistance;

      // Subtle engine burn rumble during active liftoff
      const isActivelyFiring = progress > 0.02 && progress < 0.98;
      const rumbleX = isActivelyFiring ? Math.sin(scrollY * 1.8) * 1.5 : 0;
      const rumbleRot = isActivelyFiring ? Math.cos(scrollY * 1.4) * 0.4 : 0;

      // Subtle scale factor (1.0 -> 1.03 during takeoff boost)
      const scale = progress < 0.3 ? 1 + progress * 0.1 : Math.max(1.03 - (progress - 0.3) * 0.06, 0.97);

      // Rotation aligns to pure 0deg
      const rotation = progress < 0.2 ? -2 * (1 - progress / 0.2) : 0;

      // Opacity and visibility:
      // Rocket stays fully visible during its ascent
      // Disappears cleanly as it clears the top (progress >= 0.98), right as Card 2 arrives
      let opacity = 1;
      if (progress >= 1.0) {
        opacity = 0;
        rocketRef.current.style.visibility = "hidden";
      } else if (progress > 0.9) {
        opacity = Math.max(0, 1 - (progress - 0.9) / 0.1);
        rocketRef.current.style.visibility = "visible";
      } else {
        opacity = 1;
        rocketRef.current.style.visibility = "visible";
      }

      rocketRef.current.style.opacity = `${opacity}`;
      rocketRef.current.style.transform = `translate3d(${rumbleX}px, ${translateY}px, 0) rotate(${rotation + rumbleRot}deg) scale(${scale})`;

      // Toggle thruster ignition state (activates fiery yellow/orange blast trail)
      const launchingNow = progress > 0.02 && progress < 0.98;
      if (launchingNow !== isLaunchingRef.current) {
        isLaunchingRef.current = launchingNow;
        setIsLaunching(launchingNow);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollAnimation);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial position call
    updateScrollAnimation();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* 
        Hero Stage Wrapper:
        Calibrated within the hero runway, pinned during the liftoff phase
        so the rocket clears the viewport before the next section card rises to cover the stage.
      */}
      <div
        ref={heroWrapperRef}
        id="hero-stage"
        className="relative w-full h-full min-h-screen flex items-center bg-[#F7FBF7] overflow-visible"
      >
        {/* Pinned visual stage */}
        <div className="w-full flex items-center overflow-visible pt-4 pb-12 sm:pt-6 sm:pb-16">
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
              {/* Left Column: Typography & CTAs (approx 45% / 5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F8E9] border border-[#D8E7D8] shadow-xs mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                  <span className="text-[11px] font-black tracking-widest text-[#006B21] uppercase">
                    BUILD • GROW • SCALE
                  </span>
                </div>

                {/* Big Headline in Pure Black */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050505] tracking-tight leading-[1.08] mb-6">
                  Big Ideas. <br />
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
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg text-[#4D5C52] leading-relaxed max-w-xl mb-8">
                  We engineer thoughtful digital platforms, high-velocity Next.js products, and conversion-focused systems that help ambitious companies launch, scale, and dominate their category.
                </p>

                {/* Dual CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#006B21] text-white font-bold text-sm hover:bg-[#10251A] shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 group"
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
                <div className="mt-8 pt-6 border-t border-[#D8E7D8] w-full flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#10251A] border-2 border-[#F7FBF7] flex items-center justify-center text-[10px] font-black text-[#39E900]">
                      AL
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#006B21] border-2 border-[#F7FBF7] flex items-center justify-center text-[10px] font-black text-white">
                      KS
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#39E900] border-2 border-[#F7FBF7] flex items-center justify-center text-[10px] font-black text-[#050505]">
                      TR
                    </div>
                  </div>
                  <div className="text-xs text-[#4D5C52]">
                    <span className="font-bold text-[#050505]">50+ venture-backed clients</span> scaling with zero bloat code.
                  </div>
                </div>
              </div>

              {/* 
                Right Column: Standalone 3D Rocket Illustration
                Card section & laptop completely removed as requested.
                Only the pure, prominent 3D rocket with fiery yellow/orange thruster flame.
              */}
              <div className="lg:col-span-7 relative flex items-center justify-center overflow-visible min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] py-4">
                <div
                  ref={rocketRef}
                  className="relative z-15 will-change-transform w-full flex items-center justify-center py-4"
                  style={{
                    transform: "translate3d(0, 0px, 0) rotate(0deg) scale(1)",
                  }}
                >
                  <RocketIllustration
                    isLaunching={isLaunching}
                    className={!isLaunching ? "animate-subtle-float" : ""}
                  />
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
