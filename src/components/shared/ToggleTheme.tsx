'use client';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from "react-icons/fa";


export default function ToggleTheme() {


  const { setTheme, resolvedTheme } = useTheme()


  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      {resolvedTheme === "dark" ? <FaMoon/> : <FaSun/>}
    </Button>
  );
}
