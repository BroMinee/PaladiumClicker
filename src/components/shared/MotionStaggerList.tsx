"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
  gap?: number;
};

export default function MotionStaggerList({ children, className, gap = 0.06 }: Props) {
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