"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "../ui/loading-spinner";
import { MetierKey } from "@/types";
import { getColorByMetierName, getXpCoef } from "@/lib/misc";

/**
 * Display the player job level
 * @param jobName - The job name we are displaying
 */
export function JobLevel({ jobName }: { jobName: MetierKey }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner/>;
  }

  return <>
        Niv. {playerInfo.metier[jobName].level}
    </>;
}

/**
 * Display the player job progress bar
 * @param jobName - The job name we are displaying
 */
export function JobProgressbar({ jobName }: { jobName: MetierKey }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner/>;
  }

  const metier = playerInfo.metier[jobName];
  const coefXp = Math.min(100, Math.round(100 * getXpCoef(metier.level, metier.xp)));

  const colors = getColorByMetierName(jobName);
  function convertToString(colors: number[]) {
    return `rgb(${colors[0]},${colors[1]},${colors[2]})`;
  }
  const gradientStyle = `linear-gradient(to right, ${convertToString(colors.color)}, ${convertToString(colors.bgColor)}, ${convertToString(colors.color)})`;
  return (
    <div
      className={"h-2.5 rounded-full animate-pan-gradient"}
      style={{
        backgroundImage: gradientStyle,
        backgroundSize: "200% auto",
        width: `${coefXp}%`,
        // backgroundColor: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`
      }}

    ></div>
  );
}