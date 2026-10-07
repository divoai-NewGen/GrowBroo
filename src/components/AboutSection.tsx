import React from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon, ShieldCheckIcon, ZapIcon } from "./Icons";

const values = [
  {
    title: "Engineering Without Compromise",
    desc: "Lightweight architectures, zero bloat, and sub-second load times engineered for modern conversion.",
    icon: ZapIcon,
  },
  {
    title: "Human-Centric Digital Craft",
    desc: "Every interaction, curve, and animation is designed to spark trust and reduce friction.",
    icon: SparklesIcon,
  },
  {
    title: "Transparent & Accountable",
    desc: "No black boxes or vague agency speak. Clear sprint roadmaps, measurable ROI, and weekly demos.",
    icon: ShieldCheckIcon,
  },
];

export default function AboutSection() {
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading and Story (7 cols) */}
          <div className="lg:col-span-7">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#006B21] bg-[#E9F8E9] border border-[#D8E7D8] rounded-full mb-4">
              ABOUT VERDANT DIGITAL
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#050505] tracking-tight leading-[1.15] mb-6">
              Turning ideas into meaningful digital experiences.
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#4D5C52] leading-relaxed mb-8">
              <p>
                We are a boutique digital product studio partnering with ambitious founders, startups, and established enterprises. We don&apos;t build cookie-cutter templates—we engineer bespoke digital platforms that accelerate commercial growth.
              </p>
              <p>
                By blending strategic UX design with precision frontend engineering, we bridge the gap between aesthetic beauty and high-throughput business conversions.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 mb-8">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="p-4 rounded-2xl bg-white border border-[#D8E7D8] hover:border-[#006B21]/40 transition-colors shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center mb-3">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-[#050505] mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-[#4D5C52] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#050505] hover:text-[#006B21] group"
              >
                <span>Read our full studio philosophy &amp; team manifesto</span>
                <span className="w-6 h-6 rounded-full bg-[#E9F8E9] flex items-center justify-center text-[#006B21] group-hover:translate-x-1 transition-transform">
                  <ArrowRightIcon size={12} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dark Forest Promotional Panel (#10251A) */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Card */}
              <div className="rounded-3xl bg-[#10251A] text-white p-7 sm:p-9 shadow-2xl relative overflow-hidden border border-white/10">
                {/* Background soft glow */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#39E900]/20 rounded-full blur-3xl pointer-events-none"
                />

                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#39E900] tracking-wide">
                    OUR CORE PRINCIPLES
                  </span>
                  <span className="text-xs text-white/60">EST. 2021</span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#39E900] text-[#050505] flex items-center justify-center shrink-0 font-black text-sm">
                      01
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Velocity Meets Rigor</h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        We iterate rapidly without cutting corners on accessibility, security, or clean codebase architecture.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E9F8E9] text-[#006B21] flex items-center justify-center shrink-0 font-black text-sm">
                      02
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Conversion By Design</h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        Design is not merely visual decoration; it is the strategic catalyst that turns casual visitors into loyal brand advocates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center shrink-0 font-black text-sm">
                      03
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Long-Term Partnership</h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        We remain by your side beyond deployment, continuously measuring telemetry and optimizing conversion funnels.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub banner */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">Ready to experience the difference?</span>
                  <span className="text-[#39E900] font-bold">100% In-House Team</span>
                </div>
              </div>

              {/* Floating accent card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-[#D8E7D8] rounded-2xl p-4 shadow-xl items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center shrink-0">
                  <CheckCircleIcon size={20} />
                </div>
                <div>
                  <div className="text-xs font-black text-[#050505]">Sub-second Speed</div>
                  <div className="text-[11px] text-[#4D5C52]">Zero unnecessary libraries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
