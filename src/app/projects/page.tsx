import React from "react";
import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import ProjectGallery from "@/components/ProjectGallery";

export const metadata: Metadata = {
  title: "Projects | Digital Products & High-Performance Web Applications",
  description:
    "Browse our portfolio of high-impact web apps, headless e-commerce storefronts, and enterprise platforms built with Next.js, React, and TypeScript.",
};

export default function ProjectsPage() {
  return (
    <div className="bg-[#F7FBF7]">
      {/* Header Banner */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#D8E7D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#006B21] bg-[#E9F8E9] border border-[#D8E7D8] rounded-full mb-4">
              CASE STUDIES &amp; PORTFOLIO
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050505] tracking-tight leading-[1.1] mb-6">
              Projects we&apos;re proud of.
            </h1>
            <p className="text-lg sm:text-xl text-[#4D5C52] leading-relaxed">
              Every project is an opportunity to redefine an industry standard. Discover how we partner with forward-thinking companies to build fast, beautiful, and resilient digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectGallery />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
