"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StackingLayoutProps {
  children: React.ReactNode[];
}

export default function StackingLayout({ children }: StackingLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>(".gsap-stack-card", containerRef.current);
    if (cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      cards.forEach((card, index) => {
        // We only pin cards that have a next card sliding over them
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];

          // Height check: if card is taller than viewport, wait until bottom reaches bottom
          const isTaller = card.offsetHeight > window.innerHeight;
          const pinStart = isTaller ? "bottom bottom" : "top top+=72";
          const runwayDistance = Math.min(window.innerHeight * 0.75, 600);

          // 1. Pin the current card so the user experiences the next card sliding over it
          ScrollTrigger.create({
            trigger: card,
            start: pinStart,
            end: `+=${runwayDistance}`,
            pin: true,
            pinSpacing: true,
            id: `pin-${index}`,
            invalidateOnRefresh: true,
          });

          // 2. 3D Card Stacking Depth & Scale:
          // As nextCard approaches and slides over, current card gently scales down and dims
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.7,
            y: -24,
            filter: "brightness(0.92)",
            ease: "power1.out",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top center",
              scrub: true,
              id: `depth-${index}`,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [children]);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-clip">
      {React.Children.map(children, (child, index) => {
        const zIndex = (index + 1) * 10;
        const isFirst = index === 0;

        return (
          <div
            key={index}
            className={`gsap-stack-card relative w-full will-change-transform ${
              !isFirst
                ? "rounded-t-[44px] sm:rounded-t-[56px] lg:rounded-t-[68px] shadow-[0_-30px_90px_-10px_rgba(0,0,0,0.18),0_-10px_30px_-5px_rgba(0,0,0,0.06)] border-t border-[#D8E7D8]/80"
                : ""
            }`}
            style={{
              zIndex,
              transformOrigin: "center top",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
