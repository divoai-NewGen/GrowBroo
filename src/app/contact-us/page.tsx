"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon, ShieldCheckIcon, ZapIcon } from "@/components/Icons";

const serviceOptions = [
  "Web Development",
  "UI/UX Design",
  "Digital Solutions & Cloud",
  "Brand Identity",
  "Headless E-commerce",
  "AI & Automation",
];

const budgetOptions = [
  "< $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
];

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("Web Development");
  const [budget, setBudget] = useState("$10k - $25k");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          service,
          budget,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setService("Web Development");
    setBudget("$10k - $25k");
    setMessage("");
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="bg-[#F7FBF7] min-h-screen text-[#050505]">
      {/* Hero Header */}
      <section className="pt-12 pb-16 md:pt-18 md:pb-20 border-b border-[#D8E7D8] relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#39E900]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F8E9] border border-[#D8E7D8] text-xs font-black uppercase tracking-wider text-[#006B21] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
              <span>Contact Us &bull; Let&apos;s Build Together</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050505] tracking-tight leading-[1.1] mb-6">
              Have an ambitious vision? <br />
              <span className="text-[#006B21]">Let&apos;s engineer it into reality.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4D5C52] leading-relaxed max-w-2xl">
              Tell us about your product goals, timeline, or current bottlenecks. Our team guarantees a direct response from a senior partner within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area: Left details + Right Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct info & Guarantees */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#006B21]">
                  Direct Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight mt-1 mb-4">
                  Partner-led from day one.
                </h2>
                <p className="text-sm text-[#4D5C52] leading-relaxed">
                  We don&apos;t use junior account managers or generic ticketing systems. Your inquiry is reviewed directly by our founding engineers and product strategists.
                </p>
              </div>

              {/* Contact Card Details */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-[#D8E7D8] shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006B21] text-[#39E900] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#4D5C52]">
                      Email Us Directly
                    </h3>
                    <a
                      href="mailto:growbroo.info@gmail.com"
                      className="text-sm font-bold text-[#050505] hover:text-[#006B21] transition-colors"
                    >
                      growbroo.info@gmail.com
                    </a>
                    <p className="text-[11px] text-[#4D5C52] mt-0.5">
                      Submissions sync directly with our instant notification feed.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D8E7D8] shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center shrink-0">
                    <ZapIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#4D5C52]">
                      Response Time
                    </h3>
                    <p className="text-sm font-bold text-[#050505]">
                      Guaranteed within 24 Hours
                    </p>
                    <p className="text-[11px] text-[#4D5C52] mt-0.5">
                      Average reply time is under 2 hours during regular sprint windows.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D8E7D8] shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center shrink-0">
                    <ShieldCheckIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#4D5C52]">
                      Privacy &amp; NDA
                    </h3>
                    <p className="text-sm font-bold text-[#050505]">
                      100% Confidential
                    </p>
                    <p className="text-[11px] text-[#4D5C52] mt-0.5">
                      Mutual NDA available upfront prior to architectural discussions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Studio Metrics */}
              <div className="p-6 rounded-3xl bg-[#10251A] text-white border border-white/10 shadow-lg">
                <div className="flex items-center gap-2 text-[#39E900] text-xs font-black uppercase tracking-wider mb-4">
                  <SparklesIcon size={14} />
                  <span>The Verdant Standard</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-black text-white">99.8%</div>
                    <div className="text-[11px] text-white/70 font-semibold mt-0.5">On-Time Sprints</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#39E900]">50+</div>
                    <div className="text-[11px] text-white/70 font-semibold mt-0.5">Launched Products</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#D8E7D8] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                {/* Form header */}
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#E9F8E9] text-[#006B21] text-[11px] font-black uppercase tracking-wider mb-3">
                    Project Request Form
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight">
                    Start Your Project
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4D5C52] mt-1">
                    Fill out the scope details below. We review every enquiry thoroughly.
                  </p>
                </div>

                {submitted ? (
                  /* Success State */
                  <div className="text-center py-12 px-4 space-y-5 animate-in fade-in duration-300">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#E9F8E9] text-[#006B21] flex items-center justify-center">
                      <CheckCircleIcon size={36} />
                    </div>
                    <h4 className="text-2xl font-black text-[#050505] tracking-tight">
                      Enquiry Sent Successfully!
                    </h4>
                    <p className="text-sm text-[#4D5C52] max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us, <strong className="text-[#050505]">{name}</strong>. Your project brief has been forwarded directly to our senior lead at <strong className="text-[#006B21]">growbroo.info@gmail.com</strong>.
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 rounded-full bg-[#006B21] text-white text-xs font-black tracking-wider uppercase hover:bg-[#10251A] transition-all cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                      <Link
                        href="/"
                        className="px-6 py-3 rounded-full bg-[#F7FBF7] text-[#050505] border border-[#D8E7D8] text-xs font-black tracking-wider uppercase hover:bg-[#E9F8E9] transition-all"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Active Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Basic details: Name, Email, Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Johnson"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="alex@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="Company or project name (optional)"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all"
                      />
                    </div>

                    {/* Service Selection Pills */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-2">
                        Service of Interest
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {serviceOptions.map((opt) => {
                          const isSelected = service === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setService(opt)}
                              className={`px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight text-left transition-all border cursor-pointer ${isSelected
                                  ? "bg-[#006B21] text-white border-[#006B21] shadow-xs"
                                  : "bg-[#F7FBF7] text-[#4D5C52] border-[#D8E7D8] hover:border-[#006B21]/50"
                                }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget Selection Pills */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-2">
                        Expected Investment Range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {budgetOptions.map((b) => {
                          const isSelected = budget === b;
                          return (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setBudget(b)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${isSelected
                                  ? "bg-[#006B21] text-white border-[#006B21]"
                                  : "bg-[#F7FBF7] text-[#4D5C52] border-[#D8E7D8] hover:border-[#006B21]/50"
                                }`}
                            >
                              {b}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                        Project Overview &amp; Requirements <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the product goals, target launch timeline, or specific challenges you want solved..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#006B21] text-white text-sm font-black uppercase tracking-widest hover:bg-[#10251A] hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer group"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Project Enquiry</span>
                          <span className="w-6 h-6 rounded-full bg-[#39E900] text-[#050505] flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <ArrowRightIcon size={12} strokeWidth={3} />
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-[#4D5C52]">
                      🔒 By sending this form, your information is processed securely under strict privacy terms.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
