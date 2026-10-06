import React from "react";

interface RocketIllustrationProps {
  className?: string;
  isLaunching?: boolean;
}

export default function RocketIllustration({
  className = "",
  isLaunching = false,
}: RocketIllustrationProps) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      {/* 
        ACTUAL FIERY YELLOW / ORANGE ROCKET EXHAUST (CONTINUOUSLY GLOWING & BURNING)
        - Blazing white-hot core
        - Electric solar yellow mid-flame
        - Radiant fiery orange outer plume with micro-flicker animation
        - Supersonic shock diamonds & rising embers
      */}
      <div
        className={`absolute -bottom-36 left-1/2 -translate-x-1/2 w-48 h-64 transition-all duration-300 pointer-events-none origin-top animate-flame-wave ${
          isLaunching
            ? "opacity-100 scale-y-[1.65] scale-x-[1.25] drop-shadow-[0_28px_50px_rgba(255,100,0,0.98)]"
            : "opacity-95 scale-y-100 scale-x-100 drop-shadow-[0_18px_35px_rgba(255,140,0,0.85)]"
        }`}
      >
        <svg
          viewBox="0 0 160 240"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Outer expanding flame gradient: Pure Solar Yellow to Deep Blazing Orange to Red-Amber */}
            <linearGradient id="fireOuter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF200" stopOpacity="0.98" />
              <stop offset="18%" stopColor="#FFB300" stopOpacity="0.95" />
              <stop offset="48%" stopColor="#FF5500" stopOpacity="0.9" />
              <stop offset="78%" stopColor="#D91E00" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FF1100" stopOpacity="0" />
            </linearGradient>

            {/* Core intense white-hot yellow jet */}
            <linearGradient id="fireCore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFFFD0" />
              <stop offset="55%" stopColor="#FFE600" />
              <stop offset="80%" stopColor="#FF8800" />
              <stop offset="100%" stopColor="#FF3700" stopOpacity="0" />
            </linearGradient>

            {/* Supersonic shock diamond gradient */}
            <linearGradient id="shockDiamond" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFF280" />
              <stop offset="100%" stopColor="#FFA000" stopOpacity="0.5" />
            </linearGradient>

            {/* Heat haze glow */}
            <radialGradient id="heatGlow" cx="50%" cy="15%" r="60%">
              <stop offset="0%" stopColor="#FFF480" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#FF9000" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF3000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Heat Haze Glow */}
          <ellipse cx="80" cy="55" rx="65" ry="34" fill="url(#heatGlow)" />

          {/* Outer Blazing Fire Stream */}
          <path
            d="M54 0C54 0 22 70 38 152C48 190 74 235 80 235C86 235 112 190 122 152C138 70 106 0 106 0H54Z"
            fill="url(#fireOuter)"
          />

          {/* Secondary Inner Fire Tongue */}
          <path
            d="M60 0C60 0 36 55 48 120C55 158 80 196 80 196C80 196 105 158 112 120C124 55 100 0 100 0H60Z"
            fill="url(#fireOuter)"
            className="animate-inner-wave"
            opacity="0.95"
          />

          {/* White-Hot Core Propulsion Jet */}
          <path
            d="M64 0C64 0 48 45 56 100C62 130 80 162 80 162C80 162 98 130 104 100C112 45 96 0 96 0H64Z"
            fill="url(#fireCore)"
            className="animate-inner-wave"
          />

          {/* Supersonic Shock Diamonds */}
          <polygon points="80,20 86,35 80,50 74,35" fill="url(#shockDiamond)" />
          <polygon points="80,58 85,71 80,84 75,71" fill="url(#shockDiamond)" />
          <polygon points="80,90 84,101 80,112 76,101" fill="url(#shockDiamond)" />

          {/* Fiery Embers & Sparks */}
          <g className="animate-ember-wave">
            <circle cx="64" cy="165" r="4" fill="#FFFFFF" opacity="0.9" />
            <circle cx="94" cy="190" r="3.5" fill="#FFF200" opacity="0.9" />
            <circle cx="78" cy="215" r="2.8" fill="#FF8800" opacity="0.8" />
            <circle cx="54" cy="120" r="2.2" fill="#FFFFFF" opacity="0.7" />
            <circle cx="108" cy="145" r="2.8" fill="#FFB000" opacity="0.8" />
            <circle cx="72" cy="230" r="2" fill="#FF4400" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Main 3D Vector Rocket with Big Bold Delta Wings */}
      <svg
        viewBox="0 0 380 430"
        fill="none"
        className="w-full h-auto max-w-[460px] sm:max-w-[520px] lg:max-w-[580px] drop-shadow-[0_30px_60px_rgba(0,107,33,0.22)] overflow-visible"
      >
        <defs>
          {/* Fuselage 3D Cylindrical Shader */}
          <linearGradient id="fuselageBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DCE8DC" />
            <stop offset="18%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F7FBF7" />
            <stop offset="85%" stopColor="#E2EFE2" />
            <stop offset="100%" stopColor="#B8D4B8" />
          </linearGradient>

          {/* Fuselage Specular Gloss Streak */}
          <linearGradient id="glossStreak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Nosecone Gradient in Deep Growth Green */}
          <linearGradient id="noseConeGrad" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#008C2B" />
            <stop offset="35%" stopColor="#006B21" />
            <stop offset="80%" stopColor="#004D18" />
            <stop offset="100%" stopColor="#10251A" />
          </linearGradient>

          {/* Neon Tip Glow */}
          <linearGradient id="neonTipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#39E900" />
            <stop offset="100%" stopColor="#006B21" />
          </linearGradient>

          {/* Expanded Left Delta Wing Shader */}
          <linearGradient id="leftWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#009A30" />
            <stop offset="40%" stopColor="#007E27" />
            <stop offset="75%" stopColor="#00601E" />
            <stop offset="100%" stopColor="#0C2015" />
          </linearGradient>

          {/* Expanded Right Delta Wing Shader */}
          <linearGradient id="rightWingGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#007A26" />
            <stop offset="45%" stopColor="#005A1C" />
            <stop offset="80%" stopColor="#004315" />
            <stop offset="100%" stopColor="#0A1810" />
          </linearGradient>

          {/* Center Stabilizer Fin Shader */}
          <linearGradient id="centerFinGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#008C2B" />
            <stop offset="50%" stopColor="#006B21" />
            <stop offset="100%" stopColor="#004315" />
          </linearGradient>

          {/* Cockpit Porthole Bezel */}
          <linearGradient id="bezelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D8E7D8" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#7E9F7E" />
          </linearGradient>

          {/* Cockpit Glass Reflex */}
          <linearGradient id="glassReflex" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
            <stop offset="0%" stopColor="#39E900" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#006B21" />
            <stop offset="75%" stopColor="#10251A" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          {/* Engine Nozzle Gradient */}
          <linearGradient id="nozzleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#25382D" />
            <stop offset="30%" stopColor="#4A6153" />
            <stop offset="65%" stopColor="#1B2B22" />
            <stop offset="100%" stopColor="#10251A" />
          </linearGradient>

          {/* Ambient space glow */}
          <radialGradient id="wingAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#39E900" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#39E900" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient wing glows to give spatial volume */}
        <circle cx="36" cy="330" r="45" fill="url(#wingAura)" />
        <circle cx="344" cy="330" r="45" fill="url(#wingAura)" />

        {/* Decorative launch orbit particles around rocket */}
        <g opacity="0.65">
          <circle cx="48" cy="180" r="2.5" fill="#39E900" />
          <circle cx="70" cy="120" r="1.8" fill="#006B21" />
          <circle cx="332" cy="190" r="2.5" fill="#39E900" />
          <circle cx="310" cy="130" r="1.8" fill="#006B21" />
          <circle cx="56" cy="270" r="2" fill="#FFA200" />
          <circle cx="324" cy="270" r="2" fill="#FFA200" />
          {/* Subtle Speed Streaks */}
          <line x1="38" y1="210" x2="38" y2="245" stroke="#D8E7D8" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
          <line x1="342" y1="210" x2="342" y2="245" stroke="#D8E7D8" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
        </g>

        {/* ======================================================== */}
        {/* 1. EXPANDED LEFT DELTA WING (Massive, Sleek, Aerodynamic) */}
        {/* ======================================================== */}
        <path
          d="M130 215 L20 326 C12 336 20 350 34 348 L134 338 L132 250 Z"
          fill="url(#leftWingGrad)"
        />
        {/* Left Wing Neon Lime Leading-Edge Bevel Highlight */}
        <path
          d="M20 326 L130 215 L127 220 L23 328 Z"
          fill="#39E900"
          opacity="0.9"
        />
        {/* Left Wing Surface Inset Detail Line */}
        <path
          d="M50 330 L126 250"
          stroke="#39E900"
          strokeWidth="1.8"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        {/* Left Wingtip Beacon / Navigation Light */}
        <circle cx="21" cy="336" r="3.5" fill="#39E900" />
        <circle cx="21" cy="336" r="1.5" fill="#FFFFFF" />

        {/* ======================================================== */}
        {/* 2. EXPANDED RIGHT DELTA WING (Massive, Sleek, Aerodynamic) */}
        {/* ======================================================== */}
        <path
          d="M250 215 L360 326 C368 336 360 350 346 348 L246 338 L248 250 Z"
          fill="url(#rightWingGrad)"
        />
        {/* Right Wing Shadow & Edge Bevel */}
        <path
          d="M360 326 L346 348 L246 338 L248 332 Z"
          fill="#0A1810"
          opacity="0.45"
        />
        {/* Right Wing Surface Inset Detail Line */}
        <path
          d="M330 330 L254 250"
          stroke="#006B21"
          strokeWidth="1.8"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        {/* Right Wingtip Beacon / Navigation Light */}
        <circle cx="359" cy="336" r="3.5" fill="#39E900" />
        <circle cx="359" cy="336" r="1.5" fill="#FFFFFF" />

        {/* ======================================================== */}
        {/* 3. ENGINE NOZZLE / EXHAUST BELL */}
        {/* ======================================================== */}
        <path
          d="M152 336 L228 336 L240 362 C241 366 238 370 234 370 L146 370 C142 370 139 366 140 362 Z"
          fill="url(#nozzleGrad)"
        />
        {/* Nozzle Fiery Yellow-Orange Hot Ring */}
        <ellipse cx="190" cy="370" rx="46" ry="6" fill="#FFA200" opacity="0.95" />
        <ellipse cx="190" cy="370" rx="34" ry="4" fill="#FFFF80" opacity="0.98" />

        {/* ======================================================== */}
        {/* 4. MAIN FUSELAGE BODY (Large, Glossy 3D Capsule) */}
        {/* ======================================================== */}
        <path
          d="M126 130 C126 78 190 16 190 16 C190 16 254 78 254 130 L256 332 C256 338 251 342 245 342 L135 342 C129 342 124 338 124 332 Z"
          fill="url(#fuselageBody)"
        />

        {/* 5. 3D Specular Highlight Streak on Fuselage */}
        <path
          d="M142 125 C142 90 184 35 184 35 C184 35 196 35 196 35 C196 35 162 90 162 125 L166 340 L148 340 Z"
          fill="url(#glossStreak)"
        />

        {/* ======================================================== */}
        {/* 6. NOSE CONE */}
        {/* ======================================================== */}
        <path
          d="M134 105 C134 78 190 16 190 16 C190 16 246 78 246 105 C230 112 150 112 134 105 Z"
          fill="url(#noseConeGrad)"
        />
        {/* Glossy highlight on nosecone */}
        <path
          d="M190 16 C190 16 170 50 162 85 C172 78 186 76 192 76 C186 50 190 16 190 16 Z"
          fill="#FFFFFF"
          opacity="0.38"
        />

        {/* 7. Neon Cone Tip */}
        <path
          d="M184 28 C184 28 190 14 190 14 C190 14 196 28 196 28 C193 30 187 30 184 28 Z"
          fill="url(#neonTipGrad)"
        />
        <circle cx="190" cy="14" r="3.5" fill="#FFFFFF" />

        {/* ======================================================== */}
        {/* 8. EMERALD & NEON RACING STRIPES */}
        {/* ======================================================== */}
        <path
          d="M124 280 L256 280 L256 290 L124 290 Z"
          fill="#006B21"
        />
        <path
          d="M124 295 L256 295 L256 300 L124 300 Z"
          fill="#39E900"
        />

        {/* ======================================================== */}
        {/* 9. COCKPIT PORTHOLE WINDOW */}
        {/* ======================================================== */}
        {/* Outer Bezel Ring */}
        <circle cx="190" cy="180" r="38" fill="url(#bezelGrad)" />
        {/* Chrome Inset */}
        <circle cx="190" cy="180" r="31" fill="#10251A" />
        {/* Deep Curved Glass */}
        <circle cx="190" cy="180" r="28" fill="url(#glassReflex)" />
        {/* Glass Specular Crescent Reflection */}
        <path
          d="M172 165 C182 156 200 156 208 165 C204 167 192 168 182 174 C176 178 173 182 171 185 C169 178 169 170 172 165 Z"
          fill="#FFFFFF"
          opacity="0.8"
        />
        {/* Mini Accent Star in Cockpit */}
        <polygon
          points="190,172 192,178 198,180 192,182 190,188 188,182 182,180 188,178"
          fill="#39E900"
          opacity="0.95"
        />

        {/* ======================================================== */}
        {/* 10. CENTER DORSAL FIN (3D Aerodynamic Spine) */}
        {/* ======================================================== */}
        <path
          d="M185 235 L195 235 L198 337 L182 337 Z"
          fill="url(#centerFinGrad)"
        />
        {/* Fin neon highlight edge */}
        <line
          x1="190"
          y1="235"
          x2="190"
          y2="337"
          stroke="#39E900"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ======================================================== */}
        {/* 11. SUBTLE PANEL SEAM LINES */}
        {/* ======================================================== */}
        <line
          x1="132"
          y1="210"
          x2="156"
          y2="210"
          stroke="#C4DEC4"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <line
          x1="224"
          y1="210"
          x2="248"
          y2="210"
          stroke="#C4DEC4"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="138" cy="210" r="1.5" fill="#7E9F7E" />
        <circle cx="242" cy="210" r="1.5" fill="#7E9F7E" />
      </svg>
    </div>
  );
}
