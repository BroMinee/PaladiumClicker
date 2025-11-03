"use client";
import * as React from "react";
import { motion, useReducedMotion, easeOut } from "framer-motion";

/**
 * PageMotion component, provides a smooth fade and slide animation for page transitions.
 *
 * @param children The React nodes to render inside the animated container.
 * @param routeKey A unique key for the current route, used to trigger animations on route change.
 */
export function PageMotion({
  children,
  routeKey,
}: {
  children: React.ReactNode;
  routeKey: string;
}) {

  const reduce = useReducedMotion();
  const initial = { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };
  const exit = { opacity: 0, y: -20 };
  const transition = reduce ? { duration: 0.12 } : { duration: 0.22, ease: easeOut };

  return (
    <motion.div
      key={routeKey}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}