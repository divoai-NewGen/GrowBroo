import React from "react";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <main className="relative w-full overflow-x-clip bg-[#F7FBF7]">
      {/* 
        Card 1: Hero Launchpad Stage (z-10)
        Calibrated runway height (138vh) so the exact moment the rocket clears the top,
        the Trust deck (Card 2) is already entering from the bottom with zero dead scroll gap.
      */}
      <div
        id="hero-card"
        className="sticky top-0 z-10 w-full h-[135vh] sm:h-[138vh] lg:h-[140vh] bg-[#F7FBF7] overflow-visible"
      >
        <div className="sticky top-0 w-full h-screen min-h-screen overflow-visible flex items-center">
          <Hero />
        </div>
      </div>

      {/* 
        Card 2: Trust & Social Proof Deck (z-20)
        Slides UP from bottom on scroll and stacks directly on top of Hero!
      */}
      <div
        id="trust-card"
        className="sticky top-0 z-20 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-white shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <TrustSection />
      </div>

      {/* 
        Card 3: Studio Philosophy & Manifesto Deck (z-30)
        Slides UP from bottom on scroll and stacks directly on top of Trust!
      */}
      <div
        id="about-card"
        className="sticky top-0 z-30 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-[#E9F8E9] shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <AboutSection />
      </div>

      {/* 
        Card 4: Capabilities & Services Deck (z-40)
        Slides UP from bottom on scroll and stacks directly on top of About!
      */}
      <div
        id="services-card"
        className="sticky top-0 z-40 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-white shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <ServicesSection />
      </div>

      {/* 
        Card 5: Selected Work & Projects Deck (z-50)
        Slides UP from bottom on scroll and stacks directly on top of Services!
      */}
      <div
        id="projects-card"
        className="sticky top-0 z-50 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-[#F7FBF7] shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <ProjectsSection />
      </div>

      {/* 
        Card 6: The Verdant Advantage Deck (z-60)
        Slides UP from bottom on scroll and stacks directly on top of Projects!
      */}
      <div
        id="why-card"
        className="sticky top-0 z-60 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-[#E9F8E9] shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <WhyChooseUs />
      </div>

      {/* 
        Card 7: Execution Roadmap & Process Deck (z-70)
        Slides UP from bottom on scroll and stacks directly on top of Why Choose Us!
      */}
      <div
        id="process-card"
        className="sticky top-0 z-70 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-white shadow-[0_-30px_90px_rgba(0,0,0,0.18)] border-t border-[#D8E7D8] flex flex-col justify-center"
      >
        <ProcessSection />
      </div>

      {/* 
        Card 8: Scope Estimator & Launch CTA Deck (z-80)
        Slides UP from bottom on scroll and stacks directly on top of Process!
      */}
      <div
        id="cta-card"
        className="sticky top-0 z-80 w-full min-h-screen rounded-t-[44px] sm:rounded-t-[60px] bg-[#10251A] text-white shadow-[0_-35px_90px_rgba(0,0,0,0.25)] border-t border-white/15 flex flex-col justify-center"
      >
        <CTASection />
      </div>
    </main>
  );
}
