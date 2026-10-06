import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0194A6] bg-[#E9FAFC] border border-[#DCECEF] rounded-full mb-4">
          404 — PAGE NOT FOUND
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#003351] tracking-tight mb-4">
          Lost in the digital woods?
        </h1>
        <p className="text-sm text-[#344054] leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist or has moved. Let&apos;s guide you back to our high-growth headquarters.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0194A6] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#003351] transition-colors shadow-sm"
        >
          <span>Return Home</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </div>
  );
}
