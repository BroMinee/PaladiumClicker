"use client";
import * as React from "react";
import { motion, useReducedMotion, easeOut } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  once?: boolean;
};

export default function MotionFadeIn({ children, className, y = 8, delay = 0, once = true }: Props) {
  const reduce = useReducedMotion();
  const initial = reduce ? {} : { opacity: 0, y };
  const animate = reduce ? {} : { opacity: 1, y: 0 };
  const transition = reduce ? { duration: 0 } : { duration: 0.3, ease: easeOut, delay };
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}