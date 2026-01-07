"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

/**
 * Wraps children with a theme context, enabling dark/light mode and system preference detection.
 *
 * @param children - React elements that will have access to the theme context.
 */
export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>);
}
