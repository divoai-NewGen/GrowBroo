import React from "react";

const steps = [
  {
    num: "01",
    name: "Discover",
    headline: "Understand business & goals",
    desc: "We analyze your audience, competitive moat, business model, and technical constraints to identify your highest-leverage growth opportunities.",
    deliverables: ["Stakeholder Interviews", "Competitor Audit", "Technical Feasibility"],
  },
  {
    num: "02",
    name: "Plan",
    headline: "Strategy, structure & roadmap",
    desc: "We formulate the information architecture, interactive user journeys, and component design tokens before a single line of production code is written.",
    deliverables: ["Information Architecture", "Wireframes & Prototypes", "Sprint Milestone Plan"],
  },
  {
    num: "03",
    name: "Build",
    headline: "Design & precision development",
    desc: "Pixel-perfect UI meets high-velocity engineering. We build with modern Next.js and Tailwind CSS, enforcing accessibility and sub-second load times.",
    deliverables: ["Responsive UI Engineering", "API & CMS Integration", "Quality Assurance & Testing"],
  },
  {
    num: "04",
    name: "Launch",
    headline: "Deploy, optimize & support",
    desc: "Seamless zero-downtime deployment, automated SEO indexing, Core Web Vitals telemetry tracking, and post-launch conversion optimization.",
    deliverables: ["Global Edge Deployment", "Lighthouse & SEO Audit", "Long-Term SLA Support"],
  },
];

export default function ProcessSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#006B21] bg-[#E9F8E9] border border-[#D8E7D8] rounded-full mb-3">
            OUR PROVEN METHOD
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#050505] tracking-tight leading-[1.15]">
            A clear path from vision to market leadership.
          </h2>
          <p className="text-base sm:text-lg text-[#4D5C52] mt-3">
            No endless meetings or opaque timelines. Our 4-step framework guarantees execution velocity without sacrificing engineering excellence.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D8E7D8] hover:border-[#006B21]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Step Number with Soft Mint / Growth Green accent */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#E9F8E9] text-[#006B21] font-black text-lg flex items-center justify-center group-hover:bg-[#006B21] group-hover:text-[#39E900] transition-colors duration-300">
                    {step.num}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F7FBF7] text-[#4D5C52] border border-[#D8E7D8]">
                    Step {index + 1}
                  </span>
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-[#006B21] block mb-1">
                  {step.name}
                </span>

                <h3 className="text-lg font-bold text-[#050505] tracking-tight mb-3">
                  {step.headline}
                </h3>

                <p className="text-xs text-[#4D5C52] leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Deliverables */}
              <div className="pt-4 border-t border-[#E9F8E9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D5C52] block mb-2">
                  Key Deliverables:
                </span>
                <ul className="space-y-1.5">
                  {step.deliverables.map((item) => (
                    <li key={item} className="text-xs text-[#050505] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39E900]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
