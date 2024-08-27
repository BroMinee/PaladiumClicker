import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { Metier } from "@/types";
import { MetierKey } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import "./MetierList.css";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";

type MetierListProps = {
  editable?: boolean;
};

const MetierList = ({ editable = true }: MetierListProps) => {
  const { increaseMetierLevel, decreaseMetierLevel } = usePlayerInfoStore();

  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return <div>Loading...</div>;
  }

  // extract the key from type Metiers and order them first mineur, then farmer, then hunter, then alchimiste
  const keyPossible = Object.keys(playerInfo.metier).sort((a, b) => {
    if (a === "mineur") return -1;
    if (b === "mineur") return 1;
    if (a === "farmer") return -1;
    if (b === "farmer") return 1;
    if (a === "hunter") return -1;
    if (b === "hunter") return 1;
    if (a === "alchimiste") return -1;
    if (b === "alchimiste") return 1;
    return 0;
  }) as MetierKey[];


  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
      {keyPossible.map((e) => (
        <Card key={e}>
          <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
            <MetierComponent
              increaseMetierLevel={increaseMetierLevel}
              decreaseMetierLevel={decreaseMetierLevel} metier={playerInfo.metier[e]}
              editable={editable}
              metierKey={e}
            />
          </CardContent>
        </Card>
      ))}

    </div>
  );
}

type MetierProps = {
  increaseMetierLevel: (metierKey: MetierKey, value: number) => void;
  decreaseMetierLevel: (metierKey: MetierKey, value: number, min?: number) => void;
  metier: Metier;
  editable?: boolean;
  minLevel?: number;
  metierKey: MetierKey;
};

export const MetierComponent = ({
                                  increaseMetierLevel, decreaseMetierLevel,
                                  metier,
                                  editable = false,
                                  minLevel = 1,
                                  metierKey
                                }: MetierProps) => {

  const coefXp = getXpCoef(metier.level, metier?.xp || 0);
  const colors = getColorByMetierName(metier.name);

  return (
    <>
      <div className="relative">
        <Image src={safeJoinPaths("/JobsIcon/", `${metier.name}.webp`)} alt="image"
               style={{ position: "inherit", zIndex: 2 }} width={256} height={256}/>
        <div className="progress-bar">
          {/* BroMine.... Please, never touch this code again. It works !*/}
          <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
            <path className="track"
                  d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
            <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
                  style={{
                    strokeDashoffset: 2160 * (1 - (coefXp)),
                    stroke: `rgb(${colors.color[0]},${colors.color[1]},${colors.color[2]})`,
                  }}/>
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {editable &&
            <Button variant="outline" size="icon"
                    onClick={() => decreaseMetierLevel(metierKey, 1, minLevel)}>
                <FaArrowDown className="h-4 w-4"/>
            </Button>
        }
        <span
          className="text-white rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9"
          style={{ backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})` }}
        >
            {metier.level}
          </span>
        {editable &&
            <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metierKey, 1)}>
                <FaArrowUp className="h-4 w-4"/>
            </Button>}
      </div>
    </>
  );
}


function getXpCoef(level: number, currentXp: number) {
  if (level === 100)
    return 1;
  if (currentXp === 0)
    return 0;
  return (currentXp - constants.metier_palier[level - 1]) / constants.metier_xp[level];
}


const getColorByMetierName = (name: 'Alchimiste' | 'Fermier' | 'Mineur' | 'Chasseur') => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
    case "Mineur":
      color = [255, 47, 47];
      bgColor = [255, 47, 47];
      break;
    case "Fermier":
      color = [199, 169, 33];
      bgColor = [255, 209, 1];
      break;
    case "Chasseur":
      color = [47, 103, 255];
      bgColor = [47, 103, 255];
      break;
    case "Alchimiste":
      color = [255, 100, 201];
      bgColor = [255, 100, 201];
  }

  return { color, bgColor };
}

export default MetierList;