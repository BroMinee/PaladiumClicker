"use client";

import { constants } from "@/lib/constants";
import { prettyJobName, textFormatting } from "@/lib/misc";
import { MetierKey } from "@/types";
import { useMemo } from "react";
import { Card } from "@/components/ui/card-v2";

interface PreconditionsDisplayProps {
  startLevel: number;
  endLevel: number;
  metier: MetierKey;
}

/**
 * Displays all the precondition to reach the next level
 */
export const PreconditionsDisplay = ({ startLevel, endLevel, metier }: PreconditionsDisplayProps) => {
  const levelsToDisplay = useMemo(() => {
    const levels = [];
    for (let lvl = startLevel + 1; lvl <= endLevel; lvl++) {
      if (constants.LEVEL_PRECONDITIONS[metier]?.[lvl] && constants.LEVEL_PRECONDITIONS[metier][lvl].length > 0) {
        levels.push({
          targetLevel: lvl,
          preconditions: constants.LEVEL_PRECONDITIONS[metier]![lvl]
        });
      }
    }
    return levels;
  }, [startLevel, endLevel, metier]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
        Préconditions pour le Niveau
      </h3>

      {levelsToDisplay.length === 0 ? (
        <Card className="border border-gray-700">
          <p className="text-gray-400">
            {textFormatting(`Aucune précondition spécifique trouvée pour le métier **${prettyJobName(metier)}** entre le niveau ${startLevel} et ${endLevel}.`)}
          </p>
        </Card>
      ) : (
        levelsToDisplay.map(level => (
          <Card key={level.targetLevel} className="border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-primary">
                Prérequis Niv. {level.targetLevel}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="text-sm pl-5 space-y-1">
                {textFormatting(level.preconditions)}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};