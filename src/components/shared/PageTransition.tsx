"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PageMotion from "@/components/shared/PageMotion.tsx";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="relative" aria-live="polite">
      <AnimatePresence mode="wait">
        <PageMotion routeKey={pathname}>{children}</PageMotion>
      </AnimatePresence>
    </div>
  );
}