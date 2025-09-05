"use client";
import * as React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function AutoAnimate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [parent] = useAutoAnimate({ duration: 180, easing: "ease-in-out" });
  return (
    <div ref={parent} className={className}>
      {children}
    </div>
  );
}

export default AutoAnimate;