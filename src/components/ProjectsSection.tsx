import React from "react";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  metric: string;
  tags: string[];
  gradientBg: string;
  mockupAccent: string;
  badge: string;
}

export const featuredProjects: ProjectItem[] = [
  {
    id: "horizon-flow",
    name: "Horizon Financial OS",
    category: "Web App & Fintech",
    headline: "Automated liquidity & treasury management platform",
    description: "Architected a zero-latency Next.js client portal processing $18M+ daily liquidity with real-time audit logs.",
    metric: "+280% User Activation",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    gradientBg: "from-[#002F4D] to-[#003351]",
    mockupAccent: "#02DEF1",
    badge: "Case Study",
  },
  {
    id: "kinetiq-health",
    name: "Kinetiq Telehealth",
    category: "UI/UX & Mobile Web",
    headline: "Patient-first biometric diagnostics and scheduling",
    description: "Designed a clean, frictionless booking experience resulting in a 4.2x increase in digital appointment confirmations.",
    metric: "4.9/5 App Rating",
    tags: ["Design System", "Figma", "Accessibility WCAG AAA"],
    gradientBg: "from-[#012F51] to-[#0194A6]",
    mockupAccent: "#E9FAFC",
    badge: "Design Award",
  },
  {
    id: "verdia-commerce",
    name: "Verdia Nordic Goods",
    category: "Headless E-Commerce",
    headline: "High-throughput storefront with sub-second page switches",
    description: "Re-engineered an international commerce storefront delivering 18ms Edge render times and a 34% checkout uplift.",
    metric: "+34% Checkout Rate",
    tags: ["Headless Commerce", "Edge CDN", "Stripe API"],
    gradientBg: "from-[#002F4D] to-[#0194A6]",
    mockupAccent: "#02DEF1",
    badge: "E-Commerce",
  },
  {
    id: "aurora-ai",
    name: "Aurora Synthetics",
    category: "AI Platform & SaaS",
    headline: "Real-time generative prompt studio for design teams",
    description: "Engineered responsive canvas tools and intelligent asset management handling 2.4M monthly synthesis jobs.",
    metric: "120k+ Active Users",
    tags: ["AI Tools", "WebSockets", "Serverless"],
    gradientBg: "from-[#0194A6] to-[#002F4D]",
    mockupAccent: "#02DEF1",
    badge: "AI Platform",
  },
  {
    id: "strata-cloud",
    name: "Strata Intelligence",
    category: "Digital Solutions & DevOps",
    headline: "Multi-cloud telemetry & compliance command center",
    description: "Migrated legacy monolith to modern micro-frontend architecture reducing cold starts from 3.2s down to 240ms.",
    metric: "99.99% SLA Uptime",
    tags: ["Next.js App Router", "REST API", "Telemetry"],
    gradientBg: "from-[#002F4D] to-[#003351]",
    mockupAccent: "#02DEF1",
    badge: "Enterprise",
  },
  {
    id: "lumina-studio",
    name: "Lumina Brand Identity",
    category: "Branding & Web",
    headline: "Global repositioning & bespoke digital showroom",
    description: "Crafted an immersive brand universe and interactive digital experience for a Paris-based architectural collective.",
    metric: "14 International Mentions",
    tags: ["Identity", "Typography", "Interactive Web"],
    gradientBg: "from-[#012F51] to-[#0194A6]",
    mockupAccent: "#E9FAFC",
    badge: "Branding",
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-3">
              SELECTED WORK
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003351] tracking-tight leading-[1.15]">
              Projects we&apos;re proud of.
            </h2>
            <p className="text-base sm:text-lg text-[#344054] mt-3">
              Explore how we engineer ambitious platforms that deliver measurable commercial outcomes for industry pioneers.
            </p>
          </div>
          <div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0194A6] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#003351] transition-colors shadow-sm"
            >
              <span>View All 18+ Projects</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>

        {/* Responsive Grid: Showing single row of 3 featured project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.slice(0, 3).map((project) => (
            <article
              key={project.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#DCECEF] hover:border-[#0194A6]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Visual Card Image */}
              <div
                className={`relative h-60 w-full bg-gradient-to-br ${project.gradientBg} p-6 flex flex-col justify-between overflow-hidden`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]"
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                    {project.badge}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#02DEF1] group-hover:text-[#003351] transition-all duration-300"
                  >
                    <ArrowUpRightIcon size={16} />
                  </span>
                </div>

                {/* Abstract UI card inside */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transform group-hover:scale-[1.03] transition-transform duration-300">
                  <div className="flex items-center justify-between text-xs text-white/80 pb-2 border-b border-white/10">
                    <span className="font-semibold">{project.name}</span>
                    <span className="text-[11px] font-mono text-[#02DEF1]">Live Prod</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-xl font-black text-white">{project.metric}</div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.mockupAccent }}
                    />
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-7 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0194A6] block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#003351] tracking-tight group-hover:text-[#0194A6] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#344054] leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags & Footer */}
                <div className="pt-4 border-t border-[#DCECEF] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E9FAFC] text-[#003351] border border-[#DCECEF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects#${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0194A6] hover:text-[#003351] transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRightIcon
                      size={12}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
