"use client";

import React, { useState } from "react";
import { ArrowRightIcon, SparklesIcon } from "./Icons";
import ContactModal from "./ContactModal";

export default function CTASection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-10 sm:py-14 lg:py-16 relative w-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative rounded-[32px] bg-[#10251A] text-white p-8 sm:p-12 md:p-14 overflow-hidden shadow-2xl border border-white/10">
            {/* Ambient background glows */}
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-96 h-96 bg-[#39E900]/20 rounded-full blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#006B21]/30 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#39E900] text-xs font-bold uppercase tracking-wider mb-6">
                <SparklesIcon size={14} />
                <span>Let&apos;s collaborate</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Have an idea? <br />
                <span className="text-[#39E900]">Let&apos;s build it.</span>
              </h2>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mb-10">
                Tell us what you&apos;re working on and let&apos;s turn your vision into a lightning-fast, high-converting digital product.
              </p>

              {/* CTA Action */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#39E900] text-[#050505] font-black text-sm uppercase tracking-wider hover:bg-white shadow-lg active:scale-95 transition-all duration-200 group"
                >
                  <span>Start a Conversation</span>
                  <span className="w-6 h-6 rounded-full bg-[#006B21] text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRightIcon size={12} strokeWidth={3} />
                  </span>
                </button>

                <a
                  href="mailto:hello@verdantdigital.com"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
                >
                  Direct Email Inquiry
                </a>
              </div>

              {/* Guarantee footer note */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#39E900]">✓</span> NDA Signed on Request
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#39E900]">✓</span> 24h Response Time
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#39E900]">✓</span> Transparent Fixed Sprints
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Contact Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
