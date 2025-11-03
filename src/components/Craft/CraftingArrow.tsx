"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { safeJoinPaths } from "@/lib/misc.ts";
import { constants } from "@/lib/constants.ts";

/**
 * Renders a crafting arrow image that adapts to the current theme.
 */
export function CraftingArrow() {
  const { theme } = useTheme();

  const [imagePath, setImagePath] = useState<string>(safeJoinPaths(constants.imgPathCraft,"arrow_white.png"));

  useEffect(() => {
    setImagePath(safeJoinPaths(constants.imgPathCraft, theme === "dark" ? "/arrow_white.png" : "/arrow_dark.png"));
  }, [theme]);

  return <Image src={imagePath} alt="Arrow crafting" width={90} height={58 / 2} className="pixelated"/>;
}