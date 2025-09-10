"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function AnimatedButton({ className, children, ...props }: AnimatedButtonProps) {
  const reduce = useReducedMotion();
  return (
    /* @ts-ignore */
    <motion.button
      whileHover={reduce ? undefined : { y: -1, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium",
        "transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;