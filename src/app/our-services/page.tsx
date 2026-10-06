import React from "react";
import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import ServiceEstimator from "@/components/ServiceEstimator";
import {
  CodeIcon,
  LayoutIcon,
  CloudIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CpuIcon,
  CheckCircleIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Our Services | Full-Spectrum Digital Craftsmanship & Engineering",
  description:
    "Explore our modular engineering & design capabilities: Next.js Web Development, UI/UX Systems, Headless Commerce, Cloud Architectures, and AI Automation.",
};

interface DetailedServiceItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  tagline: string;
  overview: string;
  capabilities: string[];
  deliverables: string;
}

const detailedServices: DetailedServiceItem[] = [
  {
    id: "web-development",
    name: "Web Development",
    icon: CodeIcon,
    tagline: "Next.js • React • TypeScript • Edge CDN",
    overview:
      "We build robust, lightning-fast web applications with clean, modular architectures that eliminate technical debt. Every component is server-optimized to deliver sub-second response times.",
    capabilities: [
      "Next.js App Router Architecture with Server Components",
      "Type-safe API contracts and zero-bloat state management",
      "Flawless 99+ Core Web Vitals optimization",
      "Automated CI/CD deployment pipelines on Vercel & AWS",
      "Edge-rendered dynamic caching and instant routing",
    ],
    deliverables: "Production Codebase, Automated Test Suites, Architecture Documentation",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: LayoutIcon,
    tagline: "Figma • Design Systems • Micro-Interactions",
    overview:
      "Human-centered user experiences engineered for maximum conversion. We turn complex business workflows into simple, elegant digital interfaces that spark brand loyalty.",
    capabilities: [
      "End-to-end design tokens and modular UI components",
      "High-fidelity interactive prototypes in Figma",
      "Rigorous user journey mapping and conversion funnel audits",
      "WCAG 2.1 AAA accessibility conformance",
      "Bespoke typography, iconography, and responsive grid layouts",
    ],
    deliverables: "Complete Figma Design System, Interactive Prototypes, Dev Handoff Specs",
  },
  {
    id: "digital-solutions",
    name: "Digital Solutions & Cloud",
    icon: CloudIcon,
    tagline: "Serverless • Microservices • Database Tuning",
    overview:
      "Scalable backend architectures and cloud integrations designed to gracefully absorb massive traffic spikes during product launches and global press runs.",
    capabilities: [
      "High-throughput REST and GraphQL API gateways",
      "Serverless architecture and containerized microservices",
      "PostgreSQL and vector database indexing & optimization",
      "Automated telemetry, uptime alerts, and rate limiting",
      "Zero-downtime migration strategies from legacy monoliths",
    ],
    deliverables: "Cloud Infrastructure as Code, API Documentation, Real-Time Monitoring",
  },
  {
    id: "branding",
    name: "Brand Identity & Strategy",
    icon: SparklesIcon,
    tagline: "Visual Moat • Creative Direction • Guidelines",
    overview:
      "We forge distinctive brand personalities that command premium market positioning. From color theory and typographic hierarchy to interactive brand books.",
    capabilities: [
      "Strategic brand positioning & value proposition articulation",
      "Comprehensive logo suites and mark variations",
      "Curated chromatic color palettes and typography pairings",
      "Digital brand collateral and presentation design",
      "Brand voice, tone, and editorial copywriting playbooks",
    ],
    deliverables: "Comprehensive Brand Guidelines, Vector Asset Suite, Typographic Hierarchy",
  },
  {
    id: "ecommerce",
    name: "E-commerce Development",
    icon: ShoppingBagIcon,
    tagline: "Headless Storefronts • Stripe • High AOV",
    overview:
      "Modern e-commerce platforms engineered for extreme velocity and higher checkout conversions. We replace sluggish monolithic templates with headless agility.",
    capabilities: [
      "Headless Shopify, Medusa, and custom cart architectures",
      "Ultra-fast product filtering and instant faceted search",
      "Optimized one-page checkout funnels and upsell flows",
      "Multi-currency, localization, and automated tax systems",
      "Inventory synchronization and ERP webhook integrations",
    ],
    deliverables: "Live Headless Storefront, Custom Theme, Payment Gateway Integration",
  },
  {
    id: "automation",
    name: "Business Automation & AI",
    icon: CpuIcon,
    tagline: "Custom LLMs • Workflow Orchestration • Internal Tools",
    overview:
      "Automate repetitive operational bottlenecks with intelligent internal tools, workflow pipelines, and custom AI assistant integrations that save countless hours.",
    capabilities: [
      "Custom generative AI toolsets and document parsing",
      "Automated CRM and marketing pipeline orchestrations",
      "Bespoke internal administrative dashboards and portals",
      "Real-time business intelligence telemetry dashboards",
      "Secure API webhooks connecting Stripe, Slack, and Linear",
    ],
    deliverables: "Automated Workflows, Admin Dashboard, Integration Webhooks",
  },
];

export default function OurServicesPage() {
  return (
    <div className="bg-[#F7FBF7]">
      {/* Header Banner */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#D8E7D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#006B21] bg-[#E9F8E9] border border-[#D8E7D8] rounded-full mb-4">
              CAPABILITIES &amp; EXPERTISE
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050505] tracking-tight leading-[1.1] mb-6">
              Everything you need to move forward.
            </h1>
            <p className="text-lg sm:text-xl text-[#4D5C52] leading-relaxed">
              We provide full-spectrum digital craft—from initial product architecture and brand strategy through to high-performance frontend engineering and automated scaling.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Scope Calculator */}
      <section className="py-16 bg-[#E9F8E9]/40 border-b border-[#D8E7D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceEstimator />
        </div>
      </section>

      {/* Detailed Services Breakdown */}
      <section className="py-20 md:py-28 bg-[#F7FBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {detailedServices.map((service, idx) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                id={service.id}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D8E7D8] shadow-xs hover:border-[#006B21]/40 transition-all scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#4D5C52]">
                        0{idx + 1} • SERVICE
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight">
                      {service.name}
                    </h2>

                    <div className="text-xs font-black uppercase tracking-wider text-[#006B21]">
                      {service.tagline}
                    </div>

                    <p className="text-sm sm:text-base text-[#4D5C52] leading-relaxed">
                      {service.overview}
                    </p>

                    <div className="pt-2 text-xs text-[#050505]">
                      <strong className="block text-[10px] uppercase font-bold tracking-wider text-[#4D5C52] mb-1">
                        Primary Deliverables
                      </strong>
                      <span className="p-2.5 rounded-xl bg-[#E9F8E9]/60 border border-[#D8E7D8] block font-semibold">
                        {service.deliverables}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#E9F8E9]/40 rounded-2xl p-6 sm:p-8 border border-[#D8E7D8]">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#050505] mb-4">
                      Core Technical Capabilities
                    </h3>
                    <ul className="space-y-3">
                      {service.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-3 text-sm text-[#050505]">
                          <span className="text-[#006B21] mt-0.5 shrink-0">
                            <CheckCircleIcon size={16} />
                          </span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Service Level Guarantees */}
      <section className="py-16 bg-[#E9F8E9]/40 border-t border-[#D8E7D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight mb-8">
            The Verdant Service Level Agreement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-[#D8E7D8]">
              <div className="text-2xl font-black text-[#006B21]">99+</div>
              <div className="text-sm font-bold text-[#050505] mt-1">Lighthouse Guaranteed</div>
              <div className="text-xs text-[#4D5C52] mt-1">All pages pass Google Core Web Vitals</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#D8E7D8]">
              <div className="text-2xl font-black text-[#006B21]">100%</div>
              <div className="text-sm font-bold text-[#050505] mt-1">Code Ownership</div>
              <div className="text-xs text-[#4D5C52] mt-1">Full IP transferred on project completion</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#D8E7D8]">
              <div className="text-2xl font-black text-[#006B21]">30 Days</div>
              <div className="text-sm font-bold text-[#050505] mt-1">Post-Launch Warranty</div>
              <div className="text-xs text-[#4D5C52] mt-1">Zero-cost bug fixes &amp; telemetry monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
