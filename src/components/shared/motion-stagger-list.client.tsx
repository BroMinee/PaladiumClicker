"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
  gap?: number;
};

/**
 * MotionStaggerList component, sequentially animates a list of child elements with a staggered fade-in and upward motion.
 *
 * @param children The React nodes to animate in sequence.
 * @param className Optional CSS class names for styling the container.
 * @param gap The delay (in seconds) between each child’s animation start. Defaults to 0.06.
 */
export function MotionStaggerList({ children, className, gap = 0.06 }: Props) {
  const reduce = useReducedMotion();
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={(child as any)?.key ?? i}
          initial={reduce ? {} : { opacity: 0, y: 8 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut", delay: i * gap }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}