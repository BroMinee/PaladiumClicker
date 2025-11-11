"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { PageMotion } from "@/components/shared/PageMotion";

/**
 * Wraps pages with an animated transition that reacts to route changes.
 * Uses `AnimatePresence` to handle enter and exit animations smoothly.
 *
 * @param children The page content to render within the animated container.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="relative" aria-live="polite">
      <AnimatePresence mode="wait">
        <PageMotion routeKey={pathname}>{children}</PageMotion>
      </AnimatePresence>
    </div>
  );
}