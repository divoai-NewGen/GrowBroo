"use client";

import React, { useState, useEffect } from "react";
import { CloseIcon, CheckCircleIcon, ArrowRightIcon } from "./Icons";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function ContactModal({ isOpen, onClose, defaultService = "Web Development" }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(defaultService);
  const [budget, setBudget] = useState("$10k - $25k");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#002F4D]/70 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white border border-[#DCECEF] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-[#344054] hover:text-[#003351] hover:bg-[#E9FAFC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0194A6]"
        >
          <CloseIcon size={20} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E9FAFC] text-[#0194A6] flex items-center justify-center">
              <CheckCircleIcon size={32} />
            </div>
            <h3 id="modal-title" className="text-2xl font-black text-[#003351] tracking-tight">
              Proposal Request Received!
            </h3>
            <p className="text-sm text-[#344054] max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-[#003351]">{name || "Friend"}</strong>. Our strategy director will review your project requirements and email you back at <span className="underline decoration-[#02DEF1]">{email}</span> within 24 business hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0194A6] text-white font-bold text-sm hover:bg-[#003351] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-2">
                Start a Conversation
              </span>
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-black text-[#003351] tracking-tight">
                Let&apos;s build something impactful.
              </h2>
              <p className="text-sm text-[#344054] mt-1">
                Tell us about your venture, timeline, and goals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client-name" className="block text-xs font-bold text-[#003351] uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="e.g. Jordan Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F5F8F9] text-[#003351] placeholder:text-[#344054]/50 text-sm focus:outline-none focus:border-[#0194A6] focus:bg-white focus:ring-2 focus:ring-[#0194A6]/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="client-email" className="block text-xs font-bold text-[#003351] uppercase tracking-wider mb-1">
                  Work Email *
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F5F8F9] text-[#003351] placeholder:text-[#344054]/50 text-sm focus:outline-none focus:border-[#0194A6] focus:bg-white focus:ring-2 focus:ring-[#0194A6]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="service-type" className="block text-xs font-bold text-[#003351] uppercase tracking-wider mb-1">
                    Service Required
                  </label>
                  <select
                    id="service-type"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F5F8F9] text-[#003351] text-sm focus:outline-none focus:border-[#0194A6] focus:bg-white focus:ring-2 focus:ring-[#0194A6]/20 transition-all"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Solutions & Cloud">Digital Solutions & Cloud</option>
                    <option value="Brand Identity">Brand Identity & Strategy</option>
                    <option value="E-commerce">E-commerce Development</option>
                    <option value="Business Automation">Business Automation & AI</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget-range" className="block text-xs font-bold text-[#003351] uppercase tracking-wider mb-1">
                    Estimated Budget
                  </label>
                  <select
                    id="budget-range"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F5F8F9] text-[#003351] text-sm focus:outline-none focus:border-[#0194A6] focus:bg-white focus:ring-2 focus:ring-[#0194A6]/20 transition-all"
                  >
                    <option value="< $10k">&lt; $10k</option>
                    <option value="$10k - $25k">$10k - $25k</option>
                    <option value="$25k - $50k">$25k - $50k</option>
                    <option value="$50k+">$50k+</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="project-desc" className="block text-xs font-bold text-[#003351] uppercase tracking-wider mb-1">
                  Brief Project Overview
                </label>
                <textarea
                  id="project-desc"
                  rows={3}
                  placeholder="Share a sentence or two about your target timeline and goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCECEF] bg-[#F5F8F9] text-[#003351] placeholder:text-[#344054]/50 text-sm focus:outline-none focus:border-[#0194A6] focus:bg-white focus:ring-2 focus:ring-[#0194A6]/20 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#0194A6] text-white font-bold text-sm hover:bg-[#003351] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75 group cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <span>Send Project Brief</span>
                      <span className="w-5 h-5 rounded-full bg-[#02DEF1] text-[#003351] flex items-center justify-center transition-transform group-hover:translate-x-1">
                        <ArrowRightIcon size={12} strokeWidth={2.8} />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
