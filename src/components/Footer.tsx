import React from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Services", href: "/our-services" },
  { label: "Projects", href: "/projects" },
];

const serviceLinks = [
  { label: "Web Development", href: "/our-services#web-development" },
  { label: "UI/UX Design", href: "/our-services#ui-ux-design" },
  { label: "Digital Solutions & Cloud", href: "/our-services#digital-solutions" },
  { label: "Brand Identity", href: "/our-services#branding" },
  { label: "Headless E-commerce", href: "/our-services#ecommerce" },
  { label: "Business Automation & AI", href: "/our-services#automation" },
];

export default function Footer() {
  return (
    <footer className="bg-[#10251A] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#006B21] text-[#39E900] flex items-center justify-center font-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
                    stroke="#39E900"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="#39E900" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Verdant<span className="text-[#39E900]">.</span>
              </span>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              We design and engineer high-performance web products, scalable platforms, and bespoke digital experiences that fuel commercial growth.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-[#39E900]">
                <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                Available for Q4 &amp; 2027 Sprints
              </span>
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#39E900]">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[#39E900] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#39E900]">
              Capabilities
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/70 hover:text-[#39E900] transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#39E900]">
              Direct Contact
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>
                <span className="block text-[11px] uppercase tracking-wider text-white/50">
                  Email
                </span>
                <a
                  href="mailto:hello@verdantdigital.com"
                  className="font-medium text-white hover:text-[#39E900] transition-colors"
                >
                  hello@verdantdigital.com
                </a>
              </p>
              <p>
                <span className="block text-[11px] uppercase tracking-wider text-white/50">
                  Phone
                </span>
                <a
                  href="tel:+15553928821"
                  className="font-medium text-white hover:text-[#39E900] transition-colors"
                >
                  +1 (555) 392-8821
                </a>
              </p>
              <p>
                <span className="block text-[11px] uppercase tracking-wider text-white/50">
                  Studio Location
                </span>
                <span>548 Market St, Suite 402, San Francisco, CA &amp; Remote Worldwide</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} Verdant Digital Agency Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of Engagement
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Security &amp; SLAs
            </span>
            <Link href="/admin" className="hover:text-[#39E900] transition-colors text-white/40 hover:text-white">
              Admin Console ⚡
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
