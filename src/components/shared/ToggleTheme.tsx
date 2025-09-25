"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const [mounted, setMounted] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon">
      <FaMoon/>
    </Button>;
  }
  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      {resolvedTheme === "dark" ? <FaMoon/> : <FaSun/>}
    </Button>
  );
}
