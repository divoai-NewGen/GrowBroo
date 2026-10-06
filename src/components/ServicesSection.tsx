import React from "react";
import Link from "next/link";
import {
  CodeIcon,
  LayoutIcon,
  CloudIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CpuIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "./Icons";

const services = [
  {
    id: "web-development",
    name: "Web Development",
    tagline: "Ultra-Fast & Modular",
    desc: "Production-grade web apps built with Next.js, React, and TypeScript. Optimized for sub-second Core Web Vitals and zero bloat.",
    icon: CodeIcon,
    highlights: ["App Router Architecture", "Headless CMS Integration", "Instant Global Edge CDN"],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    tagline: "Crafted for Conversion",
    desc: "Intuitive, human-centered interfaces that captivate users and elevate brand perception with premium typography and fluid interactions.",
    icon: LayoutIcon,
    highlights: ["Design Systems & Tokens", "Figma Interactive Prototypes", "Micro-interaction Polish"],
  },
  {
    id: "digital-solutions",
    name: "Digital Solutions & Cloud",
    tagline: "Scalable Infrastructure",
    desc: "Robust API architectures, serverless microservices, and database scaling that guarantee resilience under high-traffic spikes.",
    icon: CloudIcon,
    highlights: ["REST & GraphQL APIs", "Serverless Architecture", "CI/CD & Cloud Monitoring"],
  },
  {
    id: "branding",
    name: "Brand Identity & Strategy",
    tagline: "Stand Out Instantly",
    desc: "Distinctive visual identities, color palettes, typographic hierarchies, and brand guidelines that make your startup unforgettable.",
    icon: SparklesIcon,
    highlights: ["Visual Identity Systems", "Brand Tone & Guidelines", "Custom Asset Systems"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Development",
    tagline: "High-Throughput Checkout",
    desc: "Modern headless Shopify and custom commerce storefronts engineered for maximum conversion, fast filtering, and seamless checkout.",
    icon: ShoppingBagIcon,
    highlights: ["Headless Shopify / Medusa", "Optimized 1-Page Checkout", "Payment Gateway Security"],
  },
  {
    id: "automation",
    name: "Business Automation & AI",
    tagline: "Automate Repetitive Work",
    desc: "Intelligent internal tooling, workflow automation, and custom AI assistant integrations that eliminate bottlenecks and save operational hours.",
    icon: CpuIcon,
    highlights: ["Custom AI Integrations", "Workflow Orchestration", "Real-Time Telemetry Dashboards"],
  },
];

export default function ServicesSection() {
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-white border border-[#DCECEF] rounded-full mb-3">
              OUR EXPERTISE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003351] tracking-tight leading-[1.15]">
              Everything you need to move forward.
            </h2>
            <p className="text-base sm:text-lg text-[#344054] mt-4">
              End-to-end digital capabilities designed to help high-growth ventures ideate, construct, and scale without friction.
            </p>
          </div>
          <div>
            <Link
              href="/our-services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#DCECEF] text-xs font-bold uppercase tracking-wider text-[#003351] hover:bg-[#0194A6] hover:text-white transition-all shadow-xs"
            >
              <span>Explore All Capabilities</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>

        {/* 6-Card Services Grid with Soft Mint accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-[#DCECEF] hover:border-[#0194A6]/50 shadow-[0_4px_16px_rgba(0,51,81,0.03)] hover:shadow-[0_16px_32px_rgba(1,148,166,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Row: Icon + Number */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center group-hover:bg-[#003351] group-hover:text-[#02DEF1] transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#344054]/70 group-hover:text-[#0194A6] transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-widest text-[#0194A6] block mb-1">
                    {service.tagline}
                  </span>

                  <h3 className="text-xl font-bold text-[#003351] tracking-tight mb-3">
                    {service.name}
                  </h3>

                  <p className="text-sm text-[#344054] leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Highlights list & Link */}
                <div className="pt-4 border-t border-[#DCECEF] space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {service.highlights.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E9FAFC] text-[#003351] border border-[#DCECEF]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/our-services#${service.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0194A6] hover:text-[#003351] transition-colors"
                    >
                      <span>Learn more</span>
                      <ArrowUpRightIcon
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
