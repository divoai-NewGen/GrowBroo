"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface Hero3DVisualProps {
  isLaunching?: boolean;
}

export default function Hero3DVisual({ isLaunching = false }: Hero3DVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Smooth 3D mouse parallax tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 3D perspective rotation (max 10 degrees)
    setTilt({
      x: -y * 12,
      y: x * 14,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setActiveTooltip(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] lg:max-w-[640px] mx-auto select-none perspective-[1200px]"
    >
      {/* 
        Interactive 3D Stage Container
        Tilts smoothly with mouse cursor for authentic spatial depth
      */}
      <div
        className="relative w-full transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Ambient Shadow & Glow Base underneath laptop */}
        <div
          aria-hidden="true"
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-black/25 rounded-full blur-2xl pointer-events-none -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#39E900]/15 rounded-full blur-3xl pointer-events-none -z-10"
        />

        {/* 
          Master 3D Scene:
          - High-Resolution Open Metallic Laptop in 3D perspective
          - 3D Rocket blasting out of the screen with billowing smoke clouds
          - 4 Floating 3D Badges (Ads, Web Dev, E-commerce, Growth)
          - Glowing 3D Lightbulb & Swirling Energy Arrows
        */}
        <div className="relative w-full rounded-3xl overflow-visible">
          <Image
            src="/hero-launch-visual.png"
            alt="Verdant Digital 3D Rocket Launching from Laptop with Growth and Web Dev Badges"
            width={640}
            height={560}
            priority
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,107,33,0.18)]"
          />

          {/* 
            Continuous Glowing Heat Wave Overlay on Rocket Exhaust:
            Pulsates as a smooth, gentle breathing wave (animate-flame-wave),
            and intensifies when rocket is actively launching on scroll
          */}
          <div
            aria-hidden="true"
            className={`absolute top-[42%] left-[43%] w-24 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 animate-flame-wave ${
              isLaunching ? "scale-125 opacity-100" : "opacity-85"
            }`}
            style={{
              background: "radial-gradient(ellipse at center, rgba(255, 230, 0, 0.48) 0%, rgba(255, 120, 0, 0.32) 40%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 
            Subtle Floating Sparks & Embers
          */}
          <div aria-hidden="true" className="absolute top-[45%] left-[42%] w-20 h-28 pointer-events-none animate-ember-wave">
            <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
            <span className="absolute top-8 left-10 w-2 h-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFD700]" />
            <span className="absolute top-16 left-5 w-1.5 h-1.5 rounded-full bg-[#FF8800] shadow-[0_0_8px_#FF8800]" />
          </div>

          {/* 
            Interactive Hotspot 1: "Ads" Badge (Top Left)
          */}
          <div
            className="absolute top-[26%] left-[10%] w-[20%] h-[20%] rounded-2xl cursor-pointer transition-transform hover:scale-110 group z-20"
            onMouseEnter={() => setActiveTooltip("ads")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="w-full h-full rounded-2xl ring-2 ring-transparent group-hover:ring-[#39E900]/50 group-hover:shadow-[0_0_20px_rgba(57,233,0,0.3)] transition-all" />
            {activeTooltip === "ads" && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10251A] text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-white/20 animate-in fade-in duration-150">
                High-ROI Paid Acquisition
              </div>
            )}
          </div>

          {/* 
            Interactive Hotspot 2: "Web Dev" Badge (Bottom Left)
          */}
          <div
            className="absolute top-[52%] left-[6%] w-[20%] h-[20%] rounded-2xl cursor-pointer transition-transform hover:scale-110 group z-20"
            onMouseEnter={() => setActiveTooltip("webdev")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="w-full h-full rounded-2xl ring-2 ring-transparent group-hover:ring-[#006B21]/50 group-hover:shadow-[0_0_20px_rgba(0,107,33,0.3)] transition-all" />
            {activeTooltip === "webdev" && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10251A] text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-white/20 animate-in fade-in duration-150">
                Modern Next.js Architecture
              </div>
            )}
          </div>

          {/* 
            Interactive Hotspot 3: "E-commerce" Badge (Top Right)
          */}
          <div
            className="absolute top-[28%] right-[11%] w-[20%] h-[20%] rounded-2xl cursor-pointer transition-transform hover:scale-110 group z-20"
            onMouseEnter={() => setActiveTooltip("ecommerce")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="w-full h-full rounded-2xl ring-2 ring-transparent group-hover:ring-[#006B21]/50 group-hover:shadow-[0_0_20px_rgba(0,107,33,0.3)] transition-all" />
            {activeTooltip === "ecommerce" && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10251A] text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-white/20 animate-in fade-in duration-150">
                High-Throughput Storefronts
              </div>
            )}
          </div>

          {/* 
            Interactive Hotspot 4: "Growth" Badge (Bottom Right)
          */}
          <div
            className="absolute top-[57%] right-[14%] w-[20%] h-[20%] rounded-2xl cursor-pointer transition-transform hover:scale-110 group z-20"
            onMouseEnter={() => setActiveTooltip("growth")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="w-full h-full rounded-2xl ring-2 ring-transparent group-hover:ring-[#39E900]/50 group-hover:shadow-[0_0_20px_rgba(57,233,0,0.3)] transition-all" />
            {activeTooltip === "growth" && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10251A] text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-white/20 animate-in fade-in duration-150">
                +142% Conversion Velocity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
