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
  title: "Our Services | Full-Stack Digital Product Engineering & UX Studio",
  description:
    "Explore our modular services: Next.js frontend development, bespoke UI/UX design systems, cloud architectures, headless e-commerce, and business automation.",
};

const detailedServices = [
  {
    id: "web-development",
    name: "Web Development",
    tagline: "Ultra-Fast, Zero-Bloat Next.js Engineering",
    icon: CodeIcon,
    overview:
      "We build production-ready, mission-critical web applications with Next.js App Router, React 19, and TypeScript. Every line of code is structured for sub-second Core Web Vitals, enterprise security, and long-term modularity.",
    capabilities: [
      "Next.js App Router with React Server Components (RSC)",
      "TypeScript architectures with strict end-to-end type safety",
      "Headless CMS setups (Sanity, Contentful, Strapi, Payload)",
      "Global Edge CDN deployment and asset compression pipelines",
      "Automated unit testing, integration suites, and Lighthouse auditing",
    ],
    deliverables: "Production Codebase, CI/CD Pipeline, CMS Configuration, Architecture Docs",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design Systems",
    tagline: "Human-Centered Interfaces Engineered for Conversion",
    icon: LayoutIcon,
    overview:
      "Design is how your venture builds immediate authority. We design holistic design systems with modular UI kits, typography hierarchies, and intuitive user journeys that minimize user drop-off.",
    capabilities: [
      "Design Tokens (Color palettes, spacing scales, type systems)",
      "Figma interactive wireframes and high-fidelity clickable prototypes",
      "Micro-interaction choreography and motion specifications",
      "Accessibility compliance (WCAG 2.1 AA/AAA standards)",
      "Developer-ready Figma handover tokens and style specs",
    ],
    deliverables: "Complete Figma Library, Component Design System, Interaction Prototypes",
  },
  {
    id: "digital-solutions",
    name: "Digital Solutions & Cloud",
    tagline: "Resilient Architectures Engineered for Peak Traffic",
    icon: CloudIcon,
    overview:
      "We design cloud-native systems that effortlessly withstand high concurrency and sudden traffic spikes without degraded performance or ballooning infrastructure costs.",
    capabilities: [
      "Serverless functions and Edge runtime microservices",
      "RESTful API design and GraphQL federated schema architectures",
      "Database schema modeling, indexing, and connection pooling (Postgres, Prisma)",
      "Automated cloud CI/CD workflows and preview deployment pipelines",
      "Real-time monitoring, error tracking (Sentry), and observability metrics",
    ],
    deliverables: "Cloud Infrastructure Setup, API Documentation, Telemetry Dashboard",
  },
  {
    id: "branding",
    name: "Brand Identity & Strategy",
    tagline: "Memorable Visual Identities for Ambitious Startups",
    icon: SparklesIcon,
    overview:
      "We crystallize what makes your venture exceptional into an authoritative brand narrative, iconic logo marks, and distinct visual languages that stand out in crowded markets.",
    capabilities: [
      "Brand strategy, positioning pillars, and value proposition design",
      "Primary logo suite, icon marks, favicons, and social avatars",
      "Typographic hierarchies and curated brand color systems",
      "Brand voice, messaging principles, and editorial copy guidelines",
      "Exportable vector asset kits (SVG, WebP, PNG, PDF vector guidelines)",
    ],
    deliverables: "Brand Identity Book, Vector Asset Kit, Social Asset Templates",
  },
  {
    id: "ecommerce",
    name: "Headless E-commerce",
    tagline: "Sub-Second Shopping Experiences Built to Convert",
    icon: ShoppingBagIcon,
    overview:
      "We liberate your storefront from slow, rigid templates by engineering bespoke headless frontends powered by modern commerce engines like Shopify Storefront API and Medusa.",
    capabilities: [
      "Headless Shopify Storefront API integrations with Next.js",
      "Sub-second faceted product search, filtering, and collection sorting",
      "Streamlined single-page checkout funnels and cart drawers",
      "Multi-currency, localization, and international tax compliance",
      "Custom product bundle builders and subscription engine setups",
    ],
    deliverables: "Headless Storefront, Shopify Admin Setup, Payment Gateways, Analytics",
  },
  {
    id: "automation",
    name: "Business Automation & AI",
    tagline: "Custom Internal Tools That Remove Operational Drag",
    icon: CpuIcon,
    overview:
      "We replace tedious manual spreadsheets and fragmented SaaS subscriptions with purpose-built internal workflows and intelligent AI assistant integrations.",
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
    <div className="bg-white">
      {/* Header Banner */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-4">
              CAPABILITIES &amp; EXPERTISE
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#003351] tracking-tight leading-[1.1] mb-6">
              Everything you need to move forward.
            </h1>
            <p className="text-lg sm:text-xl text-[#344054] leading-relaxed">
              We provide full-spectrum digital craft—from initial product architecture and brand strategy through to high-performance frontend engineering and automated scaling.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Scope Calculator */}
      <section className="py-16 bg-[#E9FAFC]/40 border-b border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceEstimator />
        </div>
      </section>

      {/* Detailed Services Breakdown */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {detailedServices.map((service, idx) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                id={service.id}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DCECEF] shadow-xs hover:border-[#0194A6]/40 transition-all scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#344054]">
                        0{idx + 1} • SERVICE
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#003351] tracking-tight">
                      {service.name}
                    </h2>

                    <div className="text-xs font-black uppercase tracking-wider text-[#0194A6]">
                      {service.tagline}
                    </div>

                    <p className="text-sm sm:text-base text-[#344054] leading-relaxed">
                      {service.overview}
                    </p>

                    <div className="pt-2 text-xs text-[#003351]">
                      <strong className="block text-[10px] uppercase font-bold tracking-wider text-[#344054] mb-1">
                        Primary Deliverables
                      </strong>
                      <span className="p-2.5 rounded-xl bg-[#E9FAFC]/60 border border-[#DCECEF] block font-semibold">
                        {service.deliverables}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#E9FAFC]/40 rounded-2xl p-6 sm:p-8 border border-[#DCECEF]">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#003351] mb-4">
                      Core Technical Capabilities
                    </h3>
                    <ul className="space-y-3">
                      {service.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-3 text-sm text-[#003351]">
                          <span className="text-[#0194A6] mt-0.5 shrink-0">
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
      <section className="py-16 bg-[#E9FAFC]/40 border-t border-[#DCECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#003351] tracking-tight mb-8">
            The Verdant Service Level Agreement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-[#DCECEF]">
              <div className="text-2xl font-black text-[#0194A6]">99+</div>
              <div className="text-sm font-bold text-[#003351] mt-1">Lighthouse Guaranteed</div>
              <div className="text-xs text-[#344054] mt-1">All pages pass Google Core Web Vitals</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#DCECEF]">
              <div className="text-2xl font-black text-[#0194A6]">100%</div>
              <div className="text-sm font-bold text-[#003351] mt-1">Code Ownership</div>
              <div className="text-xs text-[#344054] mt-1">Full IP transferred on project completion</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#DCECEF]">
              <div className="text-2xl font-black text-[#0194A6]">30 Days</div>
              <div className="text-sm font-bold text-[#003351] mt-1">Post-Launch Warranty</div>
              <div className="text-xs text-[#344054] mt-1">Zero-cost bug fixes &amp; telemetry monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
