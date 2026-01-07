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

/**
 * MotionFadeIn component, animates its children with a fade-in and upward motion when entering the viewport.
 * Use in error page
 *
 * @param children The React nodes to animate.
 * @param className Optional CSS class names for styling the container.
 * @param y The initial Y offset (in pixels) for the motion before animating into place. Defaults to 8.
 * @param delay The animation delay in seconds. Defaults to 0.
 * @param once Whether the animation should occur only once when the element first enters the viewport. Defaults to true.
 */
export function MotionFadeIn({ children, className, y = 8, delay = 0, once = true }: Props) {
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