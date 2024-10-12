'use client'

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function CraftingArrow() {
  const { theme } = useTheme();

  const [imagePath, setImagePath] = useState<string>("/Craft/arrow_white.png");

  useEffect(() => {
    setImagePath(theme === "dark" ? "/Craft/arrow_white.png" : "/Craft/arrow_dark.png");
  }, [theme]);

  return <Image src={imagePath} alt="Arrow crafting" width={100} height={58/2} className="pixelated"/>
}