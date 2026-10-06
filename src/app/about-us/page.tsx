import React from "react";
import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import { CheckCircleIcon, SparklesIcon, ShieldCheckIcon, ZapIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us | Turning Vision Into Resilient Digital Platforms",
  description:
    "Learn about Verdant Digital's philosophy, engineering standards, and mission to deliver conversion-focused digital products for ambitious brands.",
};

const teamMembers = [
  {
    name: "Elena Rostova",
    role: "Founding Partner & Head of Product",
    bio: "Ex-Stripe product strategist specializing in growth mechanics, design architecture, and high-velocity product delivery.",
    initials: "ER",
  },
  {
    name: "Marcus Vance",
    role: "VP of Engineering & Systems Architect",
    bio: "12+ years building distributed React/Next.js platforms and edge APIs handling hundreds of millions in digital commerce.",
    initials: "MV",
  },
  {
    name: "Siddharth Nair",
    role: "Lead UI/UX & Interaction Designer",
    bio: "Obsessed with typography, tactile micro-animations, and frictionless conversion psychology.",
    initials: "SN",
  },
  {
    name: "Chloe Dupont",
    role: "Director of Performance & Cloud Operations",
    bio: "Ensures sub-second Core Web Vitals, bulletproof infrastructure, and zero-compromise security benchmarks.",
    initials: "CD",
  },
];

const milestones = [
  {
    year: "2021",
    title: "Founded on First Principles",
    description: "Started with a clear thesis: digital agencies were delivering bloated, slow code. We set out to build zero-compromise performance products.",
  },
  {
    year: "2023",
    title: "Venture Portfolio Expansion",
    description: "Partnered with 25+ venture-backed scaleups across San Francisco, London, and Tokyo, delivering $18M+ in verified client impact.",
  },
  {
    year: "2025",
    title: "The Zero-Bloat Standard",
    description: "Pioneered server-first Next.js architectures that achieve flawless 99+ Lighthouse scores and 3x conversion improvements.",
  },
  {
    year: "Today",
    title: "Category Leaders' Studio",
    description: "Over 50+ enterprise and startup launches with an average client relationship spanning 24+ continuous months.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-4">
              ABOUT OUR STUDIO
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#003351] tracking-tight leading-[1.1] mb-6">
              We craft digital engines for high-growth ventures.
            </h1>
            <p className="text-lg sm:text-xl text-[#344054] leading-relaxed">
              Verdant Digital is an independent product engineering and design studio. We partner directly with founders and product teams who refuse to settle for mediocre templates.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy Section */}
      <section className="py-20 bg-[#E9FAFC]/40 border-b border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6 text-[#003351]">
              <h2 className="text-3xl font-black text-[#003351] tracking-tight">
                Why we reject standard agency playbooks.
              </h2>
              <p className="text-base text-[#344054] leading-relaxed">
                Most agencies prioritize billable hours and flashy surface-level mockups that fall apart in production. They bundle dozens of heavy third-party plugins that drag load times down and kill conversion rates.
              </p>
              <p className="text-base text-[#344054] leading-relaxed">
                At Verdant, our philosophy is anchored in <strong className="text-[#0194A6]">radical subtraction</strong>. We remove everything superfluous until only pure performance, intuitive hierarchy, and compelling brand storytelling remain.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#DCECEF]">
                  <div className="text-2xl font-black text-[#003351]">100%</div>
                  <div className="text-xs text-[#344054] mt-1 font-semibold">In-House Senior Engineers</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#DCECEF]">
                  <div className="text-2xl font-black text-[#0194A6]">&lt; 0.8s</div>
                  <div className="text-xs text-[#344054] mt-1 font-semibold">Average Page Load Time</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-[#DCECEF] shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-[#003351]">
                Our Non-Negotiable Standards
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center shrink-0">
                  <ZapIcon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003351]">Lightweight Architecture</h4>
                  <p className="text-xs text-[#344054] mt-1">
                    Zero unnecessary NPM packages. Every library must justify its byte size against business value.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center shrink-0">
                  <ShieldCheckIcon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003351]">Accessible By Default</h4>
                  <p className="text-xs text-[#344054] mt-1">
                    WCAG AAA color contrast, semantic HTML headings, full keyboard navigation, and reduced-motion respect.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center shrink-0">
                  <SparklesIcon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003351]">Tactile Visual Polish</h4>
                  <p className="text-xs text-[#344054] mt-1">
                    Clean white surfaces, deep navy tones, bright cyan accents, and buttery micro-animations that feel bespoke.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center shrink-0">
                  <CheckCircleIcon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003351]">Transparent Sprints</h4>
                  <p className="text-xs text-[#344054] mt-1">
                    Direct access to engineers. Weekly interactive staging deployments so you test real software, not static PNGs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Leadership Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-3">
              LEADERSHIP &amp; CRAFTSMANSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#003351] tracking-tight">
              Small team. Outsized impact.
            </h2>
            <p className="text-sm sm:text-base text-[#344054] mt-3">
              We stay intentionally compact so every client works directly with senior specialists who care deeply about the craft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl p-6 border border-[#DCECEF] hover:border-[#0194A6]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#003351] text-[#02DEF1] font-black text-xl flex items-center justify-center mb-5 shadow-xs">
                    {member.initials}
                  </div>
                  <h3 className="text-base font-bold text-[#003351]">{member.name}</h3>
                  <div className="text-xs font-semibold text-[#0194A6] mt-0.5 mb-3">{member.role}</div>
                  <p className="text-xs text-[#344054] leading-relaxed">{member.bio}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#DCECEF] flex items-center justify-between text-[11px] text-[#344054]">
                  <span>Verdant Core</span>
                  <span className="w-2 h-2 rounded-full bg-[#02DEF1]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="py-20 bg-[#E9FAFC]/40 border-t border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-white border border-[#DCECEF] rounded-full mb-3">
              CHRONOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#003351] tracking-tight">
              Our Journey So Far
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="bg-white rounded-2xl p-6 border border-[#DCECEF] shadow-xs">
                <span className="text-2xl font-black text-[#0194A6] block mb-2">{m.year}</span>
                <h3 className="text-base font-bold text-[#003351] mb-2">{m.title}</h3>
                <p className="text-xs text-[#344054] leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
