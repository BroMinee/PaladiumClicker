"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetierKey } from "@/types";
import { getColorByMetierName, JobXp, prettyJobName } from "@/lib/misc";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputDebounce } from "@/components/shared/input-debounce.client";
import { CoinSlider } from "@/components/shared/coin-slider.client";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

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
  const coefXp = Math.min(100, Math.round(100 * JobXp.xpCoef(metier.level, metier.xp, "java")));

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
  const formatter = new Intl.NumberFormat("fr-FR");
  const startLevel = playerInfo.metier[jobName].level;
  const currentXp = (playerInfo?.metier[jobName].xp ?? 0) - JobXp.totalXp(startLevel, "java");
  const nextLevelXp = JobXp.totalXp(playerInfo?.metier[jobName].level + 1, "java") - JobXp.totalXp(startLevel, "java");

  return (
    <div className="flex justify-between items-center w-full text-xs text-card-foreground mt-1">
      <p>{(currentXp * 100 / nextLevelXp).toFixed(2)}%</p>
      <p>{formatter.format(Math.floor(currentXp))} / {formatter.format(nextLevelXp)}xp</p>
    </div>
  );
}

/**
 * Dialog to edit a job level and XP for the clicker page.
 */
export function JobEditDialog({ jobName, open, onClose }: { jobName: MetierKey; open: boolean; onClose: () => void }) {
  const { data: playerInfo, increaseMetierLevel, decreaseMetierLevel, setMetierXp } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const metier = playerInfo.metier[jobName];
  const level = metier.level;
  const xpAtStart = JobXp.totalXp(level, "java");
  const xpPerLevel = JobXp.totalXp(level + 1, "java") - xpAtStart;
  const currentXpInLevel = Math.max(0, Math.min(metier.xp - xpAtStart, xpPerLevel));
  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!o) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Modifier - {prettyJobName(jobName)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <InputDebounce
            label="Ton niveau"
            value={level}
            onChange={(newLevel) => {
              const delta = newLevel - level;
              if (delta > 0) {
                increaseMetierLevel(jobName, delta);
              } else if (delta < 0) {
                decreaseMetierLevel(jobName, -delta, 1);
              }
            }}
            min={1}
            debounceTimeInMs={250}
          />
          <CoinSlider
            label="XP actuelle dans le niveau"
            min={0}
            max={xpPerLevel}
            value={currentXpInLevel}
            formatValue={(v) => formatter.format(v)}
            onChange={(v) => setMetierXp(jobName, xpAtStart + v)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Display the job card
 * @param jobName - The job name we are displaying
 */
export function JobCard({ jobName }: { jobName: MetierKey }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer border border-transparent hover:border-primary/50 hover:ring-2 hover:ring-primary/20 transition-all group"
        onClick={() => setDialogOpen(true)}
        title={`Modifier ${prettyJobName(jobName)}`}
      >
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-lg font-semibold">{prettyJobName(jobName)}</h3>
          <span className="text-sm font-bold flex items-center gap-1">
            <JobLevel jobName={jobName}/>
            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <JobProgressbar jobName={jobName}/>
        </div>
        <JobXpCount jobName={jobName}/>
      </Card>

      <JobEditDialog jobName={jobName} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}