import React from "react";

const clientLogos = [
  { name: "Apex Labs", tag: "FINTECH" },
  { name: "Verdia AI", tag: "ENTERPRISE AI" },
  { name: "Kinetiq", tag: "HEALTH TECH" },
  { name: "Horizon", tag: "SAAS PLATFORM" },
  { name: "Lumina", tag: "ECOMMERCE" },
  { name: "Synapse", tag: "AUTOMATION" },
];

const stats = [
  { value: "50+", label: "Projects Delivered", desc: "Across 14 industries worldwide" },
  { value: "99.4%", label: "Client Satisfaction", desc: "Based on post-launch NPS" },
  { value: "5+", label: "Years Experience", desc: "Continuous design & code mastery" },
  { value: "$42M+", label: "Client Capital Raised", desc: "Fueling real venture velocity" },
];

export default function TrustSection() {
  return (
    <section className="pt-14 pb-14 sm:pt-18 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase font-black tracking-widest text-[#4D5C52]">
            Trusted by ambitious businesses &amp; venture-backed scaleups
          </p>
        </div>

        {/* Client Badges / Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#D8E7D8] hover:border-[#006B21]/40 hover:shadow-xs transition-all duration-200 group"
            >
              <span className="text-base font-black text-[#050505] tracking-tight group-hover:text-[#006B21] transition-colors">
                {client.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#4D5C52] mt-0.5">
                {client.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-[#D8E7D8]">
          {stats.map((stat) => (
            <div key={stat.label} className="text-left pl-2 sm:pl-4 border-l-2 border-[#006B21]">
              <div className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-[#050505] mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-[#4D5C52] mt-0.5">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
