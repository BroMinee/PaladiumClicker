"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetierKey } from "@/types";
import { getColorByMetierName, getTotalXPForLevel, getXpCoef } from "@/lib/misc";

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
      className={"h-2.5 rounded-full animate-pan-gradient duration-5000"}
      style={{
        backgroundImage: gradientStyle,
        backgroundSize: "200% auto",
        width: `${coefXp}%`,
        // backgroundColor: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`
      }}

    ></div>
  );
}


/**
 * Display the player job xp percentage, current xp and next level xp
 * @param jobName - The job name we are displaying
 */
export function JobXpCount({ jobName }: { jobName: MetierKey }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner/>;
  }
  const formatter = new Intl.NumberFormat('fr-FR');
  const startLevel = playerInfo.metier[jobName].level;
  const currentXp = (playerInfo?.metier[jobName].xp ?? 0) - getTotalXPForLevel(startLevel);
  const nextLevelXp = getTotalXPForLevel(playerInfo?.metier[jobName].level + 1) - getTotalXPForLevel(startLevel);



  return (
    <div className="flex justify-between items-center w-full text-xs text-card-foreground mt-1">
        <p>{(currentXp * 100 / nextLevelXp).toFixed(2)}%</p>
        <p>{formatter.format(Math.floor(currentXp))} / {formatter.format(nextLevelXp)}xp</p>
      </div>
  );
}