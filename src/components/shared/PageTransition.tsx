"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const PageMotion = dynamic(() => import("@/components/shared/PageMotion"), {
  ssr: false,
});

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