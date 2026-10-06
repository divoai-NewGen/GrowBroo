"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon } from "./Icons";
import ContactModal from "./ContactModal";

interface NavItem {
  label: string;
  href: string;
  isAction?: boolean;
}

const navLinks: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about-us" },
  { label: "OUR SERVICES", href: "/our-services" },
  { label: "PROJECTS", href: "/projects" },
  { label: "GET IN TOUCH", href: "#contact", isAction: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
            ? "bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,51,81,0.06)] border-b border-[#DCECEF] py-2.5 sm:py-3"
            : "bg-white border-b border-transparent py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            {/* Brand Logo - Navy text, Cyan accent */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0194A6] rounded-lg z-10"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#003351] flex items-center justify-center text-[#02DEF1] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
                    stroke="#02DEF1"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6L7 9.5V14.5L12 18L17 14.5V9.5L12 6Z"
                    fill="#02DEF1"
                    fillOpacity="0.3"
                  />
                  <circle cx="12" cy="12" r="2.5" fill="#02DEF1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#003351] leading-tight">
                  Verdant<span className="text-[#0194A6]">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#344054] -mt-0.5">
                  Digital Agency
                </span>
              </div>
            </Link>

            {/* 
              Desktop Navigation Links - Perfectly centered, NO badge container
              Pure text links with clean typography
            */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.isAction) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="text-xs lg:text-[13px] font-bold tracking-widest text-[#0194A6] hover:text-[#003351] transition-colors uppercase py-1 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs lg:text-[13px] font-bold tracking-widest transition-colors uppercase py-1 ${
                      isActive
                        ? "text-[#0194A6] font-black"
                        : "text-[#344054] hover:text-[#0194A6]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center z-10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="p-2.5 rounded-xl bg-white border border-[#DCECEF] text-[#003351] hover:bg-[#E9FAFC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0194A6]"
              >
                {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#DCECEF] bg-white px-4 pt-4 pb-6 mt-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.isAction) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsModalOpen(true);
                      }}
                      className="text-left px-4 py-3 rounded-xl text-sm font-black text-[#0194A6] hover:bg-[#E9FAFC] transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors ${
                      isActive
                        ? "text-[#0194A6] font-black bg-[#E9FAFC]"
                        : "text-[#003351] hover:bg-[#E9FAFC]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Global Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
