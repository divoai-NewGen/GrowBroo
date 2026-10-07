"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon } from "./Icons";
import ContactModal from "./ContactModal";

interface NavItem {
  label: string;
  href: string;
}

const navLinks: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about-us" },
  { label: "OUR SERVICES", href: "/our-services" },
  { label: "PROJECTS", href: "/projects" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#F7FBF7]/95 backdrop-blur-md shadow-sm border-b-2 border-[#006B21] py-2.5 sm:py-3"
            : "bg-[#F7FBF7] border-b-2 border-transparent py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006B21] rounded-lg z-10"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#006B21] flex items-center justify-center text-[#39E900] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
                    stroke="#39E900"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6L7 9.5V14.5L12 18L17 14.5V9.5L12 6Z"
                    fill="#39E900"
                    fillOpacity="0.3"
                  />
                  <circle cx="12" cy="12" r="2.5" fill="#39E900" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#050505] leading-tight">
                  Verdant<span className="text-[#006B21]">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#4D5C52] -mt-0.5">
                  Digital Agency
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Centered */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs lg:text-[13px] font-bold tracking-widest transition-colors uppercase py-1 ${
                      isActive
                        ? "text-[#006B21] font-black"
                        : "text-[#4D5C52] hover:text-[#006B21]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: CONTACT US Green Badge Button (Desktop) */}
            <div className="hidden md:flex items-center z-10">
              <Link
                href="/contact-us"
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95 ${
                  pathname === "/contact-us"
                    ? "bg-[#006B21] text-[#39E900] ring-2 ring-[#39E900] shadow-md"
                    : "bg-[#006B21] text-white hover:bg-[#10251A] border border-[#39E900]/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                <span>CONTACT US</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center z-10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="p-2.5 rounded-xl bg-white border border-[#D8E7D8] text-[#050505] hover:bg-[#E9F8E9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006B21]"
              >
                {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D8E7D8] bg-[#F7FBF7] px-4 pt-4 pb-6 mt-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors ${
                      isActive
                        ? "text-[#006B21] font-black bg-[#E9F8E9]"
                        : "text-[#050505] hover:bg-[#E9F8E9]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact Us Green Badge */}
            <div className="pt-2 border-t border-[#D8E7D8]">
              <Link
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase shadow-md active:scale-95 transition-all ${
                  pathname === "/contact-us"
                    ? "bg-[#006B21] text-[#39E900] ring-2 ring-[#39E900]"
                    : "bg-[#006B21] text-white hover:bg-[#10251A]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                <span>CONTACT US</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Contact Modal (Kept for quick CTA triggers across app if needed) */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
