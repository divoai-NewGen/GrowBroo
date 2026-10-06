"use client";

import React, { useState } from "react";
import { featuredProjects, ProjectItem } from "./ProjectsSection";
import ContactModal from "./ContactModal";
import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";

const allCategories = [
  "All",
  "Web App & Fintech",
  "UI/UX & Mobile Web",
  "Headless E-Commerce",
  "AI Platform & SaaS",
  "Digital Solutions & DevOps",
  "Branding & Web",
];

const testimonials = [
  {
    quote:
      "Verdant engineered our Next.js client portal from prototype to production in 6 weeks. Our activation rates jumped 280% on day one.",
    author: "Elena Rostova",
    role: "VP of Product, Horizon OS",
  },
  {
    quote:
      "The engineering rigor is exceptional. Zero layout shifts, sub-second TTFB, and our Google Lighthouse performance is a flawless 100.",
    author: "Marcus Lindqvist",
    role: "Founder, Verdia Nordic",
  },
];

export default function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered =
    activeFilter === "All"
      ? featuredProjects
      : featuredProjects.filter((p) => p.category === activeFilter);

  return (
    <>
      <div>
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {allCategories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0194A6] text-white shadow-xs"
                    : "bg-white text-[#003351] border border-[#DCECEF] hover:bg-[#E9FAFC] hover:border-[#0194A6]/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filtered.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#DCECEF] hover:border-[#0194A6]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between scroll-mt-28"
            >
              {/* Graphic Canvas */}
              <div
                className={`relative h-60 w-full bg-gradient-to-br ${project.gradientBg} p-6 flex flex-col justify-between overflow-hidden`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                    {project.badge}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#02DEF1] group-hover:text-[#003351] transition-all duration-300">
                    <ArrowUpRightIcon size={16} />
                  </span>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transform group-hover:scale-[1.03] transition-transform duration-300">
                  <div className="flex items-center justify-between text-xs text-white/80 pb-2 border-b border-white/10">
                    <span className="font-semibold">{project.name}</span>
                    <span className="text-[11px] font-mono text-[#02DEF1]">Production</span>
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

              {/* Text Meta */}
              <div className="p-7 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0194A6] block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#003351] tracking-tight group-hover:text-[#0194A6] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#344054] leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCECEF] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E9FAFC] text-[#003351] border border-[#DCECEF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0194A6] hover:text-[#003351] transition-colors cursor-pointer"
                  >
                    <span>Request Case Study</span>
                    <ArrowRightIcon size={12} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 pt-16 border-t border-[#DCECEF]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E9FAFC] text-[#0194A6] border border-[#DCECEF]">
              CLIENT FEEDBACK
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#003351] mt-2">
              What partners say about working with us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white rounded-3xl p-7 border border-[#DCECEF] shadow-xs flex flex-col justify-between"
              >
                <p className="text-sm sm:text-base text-[#003351] italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#DCECEF]">
                  <div className="w-10 h-10 rounded-full bg-[#002F4D] text-[#02DEF1] font-bold flex items-center justify-center text-xs">
                    {t.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#003351]">{t.author}</div>
                    <div className="text-[11px] text-[#344054]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
