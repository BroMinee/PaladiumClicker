// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER

import {usePlayerInfoStore} from "@/stores/use-player-info-store";
import type {Metier} from "@/types";
import {Card, CardContent} from "./ui/card";
import {Button} from "./ui/button";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";

import "./MetierList.css";
import constants from "@/lib/constants.ts";

type MetierListProps = {
  editable?: boolean;
};

const MetierList = ({editable = true}: MetierListProps) => {
  const {data: playerInfo, increaseMetierLevel, decreaseMetierLevel} = usePlayerInfoStore();

  const metiers = playerInfo?.metier.sort((a, b) => {
    return a.name.localeCompare(b.name);
  }) ?? [];

  return (
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
        {metiers.map((metier, index) => (
            <Card key={index}>
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                <Metier key={metier.name} playerInfoMetier={playerInfo.metier} increaseMetierLevel={increaseMetierLevel}
                        decreaseMetierLevel={decreaseMetierLevel} metier={metier} editable={editable}/>
              </CardContent>
            </Card>))
        }
      </div>
  );
}

type MetierProps = {
  playerInfoMetier: Metier[]
  increaseMetierLevel: (name: string, value: number) => void;
  decreaseMetierLevel: (name: string, value: number, min?: number) => void;
  metier: Metier;
  editable?: boolean;
  minLevel?: number;
};

export const Metier = ({
                         playerInfoMetier, increaseMetierLevel, decreaseMetierLevel,
                         metier,
                         editable = false,
                         minLevel = 1,
                       }: MetierProps) => {

  const playerMetier = playerInfoMetier.find((m) => m.name === metier.name);
  const coefXp = getXpCoef(metier.level, playerMetier?.xp || 0);
  const colors = getColorByMetierName(metier.name);

  return (
      <>
        <div className="relative">
          <img src={import.meta.env.BASE_URL + `/JobsIcon/${metier.name}.webp`} alt="image"
               style={{position: "inherit", zIndex: 2}}/>
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
              <Button variant="outline" size="icon" onClick={() => decreaseMetierLevel(metier.name, 1, minLevel)}>
                  <FaArrowDown className="h-4 w-4"/>
              </Button>
          }
          <span
              className="text-white rounded-sm font-bold text-sm flex items-center justify-center h-9 w-9"
              style={{backgroundColor: `rgb(${colors.bgColor[0]},${colors.bgColor[1]},${colors.bgColor[2]})`}}
          >
            {metier.level}
          </span>
          {editable &&
              <Button variant="outline" size="icon" onClick={() => increaseMetierLevel(metier.name, 1)}>
                  <FaArrowUp className="h-4 w-4"/>
              </Button>}
        </div>
      </>
  );
}

export default MetierList;

function getXpCoef(level: number, currentXp: number) {
  if (level === 100)
    return 1;
  if (currentXp === 0)
    return 0;
  return (currentXp - constants.metier_palier[level - 1]) / constants.metier_xp[level];
}

const getColorByMetierName = (name: string) => {
  let color = [0, 150, 0];
  let bgColor = [0, 0, 0];

  switch (name) {
    case "mineur":
      color = [255, 47, 47];
      bgColor = [255, 47, 47];
      break;
    case "farmer":
      color = [199, 169, 33];
      bgColor = [255, 209, 1];
      break;
    case "hunter":
      color = [47, 103, 255];
      bgColor = [47, 103, 255];
      break;
    case "alchimiste":
      color = [255, 100, 201];
      bgColor = [255, 100, 201];
  }

  return {color, bgColor};
}
