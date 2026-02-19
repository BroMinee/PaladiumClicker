"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

/**
 * Button that toggles between dark and light themes.
 * Renders a placeholder on initial server/client render to avoid hydration mismatch,
 * then shows the correct icon and animation after mount.
 */
export function ToggleTheme() {
  const [mounted, setMounted] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden className="opacity-0 pointer-events-none">
        <FaMoon/>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()} aria-label="Toggle theme">
      <span
        className={cn(
          "inline-block transition-transform duration-300 ease-tween",
          resolvedTheme === "dark" ? "-rotate-12 scale-95" : "rotate-12 scale-105"
        )}
      >
        {resolvedTheme === "dark" ? <FaMoon/> : <FaSun/>}
      </span>
    </Button>
  );
}
