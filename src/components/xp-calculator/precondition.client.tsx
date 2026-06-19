"use client";

import { JobXp } from "@/lib/misc";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";

interface PreconditionsDisplayProps {
  startLevel: number;
  endLevel: number;
}

/**
 * Displays the XP prerequisite (20% of level XP) for each level to reach
 */
export const PreconditionsDisplay = ({ startLevel, endLevel }: PreconditionsDisplayProps) => {
  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  const levelsToDisplay = useMemo(() => {
    const levels = [];
    for (let lvl = startLevel + 1; lvl <= endLevel; lvl++) {
      const xpForLevel = JobXp.totalXp(lvl, "java") - JobXp.totalXp(lvl - 1, "java");
      const requiredXp = Math.ceil(xpForLevel * 0.2);
      levels.push({ targetLevel: lvl, requiredXp });
    }
    return levels;
  }, [startLevel, endLevel]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b border-secondary pb-2">
        Préconditions pour le Niveau
      </h3>

      {levelsToDisplay.map(level => (
        <Card key={level.targetLevel} className="border border-secondary">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-primary">
              Prérequis Niv. {level.targetLevel}
            </span>
            <span className="text-sm text-card-foreground">
              {formatter.format(level.requiredXp)} XP
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
