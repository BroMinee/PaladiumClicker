"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Display the qdf history list
 */
export function QdfHistoryGrid({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const cards = containerRef.current.children;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.05,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {children}
    </div>
  );
}
