import React from "react";
import {
  TrendingUpIcon,
  CodeIcon,
  ShieldCheckIcon,
  ZapIcon,
  MessageSquareIcon,
  SparklesIcon,
} from "./Icons";

const reasons = [
  {
    title: "Strategy First",
    headline: "We question assumptions before writing code.",
    description: "Every sprint starts with deep business validation to ensure what we build drives tangible commercial returns.",
    icon: TrendingUpIcon,
    accent: "bg-[#E9FAFC] text-[#0194A6]",
    badge: "ROI Driven",
  },
  {
    title: "Quality Development",
    headline: "Production-grade, zero-bloat engineering.",
    description: "Modular Next.js & TypeScript codebases that pass strict accessibility standards, Core Web Vitals, and security audits.",
    icon: CodeIcon,
    accent: "bg-[#003351] text-[#02DEF1]",
    badge: "100% Type-Safe",
  },
  {
    title: "Transparent Process",
    headline: "Real-time visibility, zero surprises.",
    description: "Direct Slack/Linear channels, weekly interactive demos, and transparent time-to-deliverable estimations.",
    icon: ShieldCheckIcon,
    accent: "bg-[#E9FAFC] text-[#0194A6]",
    badge: "No Surprises",
  },
  {
    title: "Scalable Solutions",
    headline: "Built to endure 100x traffic explosions.",
    description: "Cloud-native architectures, optimized database indexing, and edge-rendered assets that never choke during product launches.",
    icon: ZapIcon,
    accent: "bg-[#F5F8F9] text-[#0194A6] border border-[#DCECEF]",
    badge: "Infinite Scale",
  },
  {
    title: "Fast Communication",
    headline: "Direct access to senior partners.",
    description: "No junior account managers acting as telephone games. You speak directly with the architects building your product.",
    icon: MessageSquareIcon,
    accent: "bg-[#E9FAFC] text-[#0194A6]",
    badge: "<2hr Response",
  },
  {
    title: "Long-Term Support",
    headline: "We stay after launch to ensure victory.",
    description: "Post-launch maintenance, conversion rate optimization (CRO) audits, and feature iteration roadmaps.",
    icon: SparklesIcon,
    accent: "bg-[#002F4D] text-white",
    badge: "Ongoing SLA",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-white border border-[#DCECEF] rounded-full mb-3">
            THE VERDANT ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003351] tracking-tight leading-[1.15]">
            Engineered differently from the ground up.
          </h2>
          <p className="text-base sm:text-lg text-[#344054] mt-4">
            Most agencies leave you with fragile templates and bloated dependencies. We engineer enduring digital assets that scale with your ambition.
          </p>
        </div>

        {/* 6-Card Bento-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-[#DCECEF] hover:border-[#0194A6]/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.accent}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E9FAFC] text-[#003351] border border-[#DCECEF]">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-xs font-black uppercase tracking-wider text-[#0194A6]">
                    {item.title}
                  </span>

                  <h3 className="text-lg font-bold text-[#003351] mt-1 mb-3 leading-snug">
                    {item.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#344054] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCECEF] flex items-center justify-between text-xs text-[#0194A6] font-bold">
                  <span>Guaranteed in every contract</span>
                  <span>✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
