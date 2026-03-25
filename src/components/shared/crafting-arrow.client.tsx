"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { safeJoinPaths } from "@/lib/misc";
import { constants } from "@/lib/constants";

/**
 * Renders a crafting arrow image that adapts to the current theme.
 */
export function CraftingArrow() {
  const { theme } = useTheme();
  const imagePath = safeJoinPaths(constants.imgPathCraft, theme === "dark" ? "/arrow_white.png" : "/arrow_dark.png");
  return <Image src={imagePath} alt="Arrow crafting" width={90} height={58 / 2} className="pixelated"/>;
}