// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER

import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useLeaderboardPosition from "@/hooks/use-leaderboard-position";
import { computePrice, formatPrice, getPathImg, getTotalSpend } from "@/lib/misc";
import { computeRPS } from "@/pages/OptimizerClicker/Components/BuildingList";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { PlayerInfo } from "@/types";
import { useState } from "react";
import { FaBed, FaMedal, FaTachometerAlt } from "react-icons/fa";
import { computeBestBuildingUgrade, findBestUpgrade } from "./RPS";
import { useRpsStore } from "@/stores/use-rps-store";

const PROCHAIN_ACHAT_COUNT = 20;

const Stats = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps } = useRpsStore();
  const [isNextBuildingVisible, setIsNextBuildingVisible] = useState(false);
  const [buildingBuyPaths, setBuildingBuyPaths] = useState([]);
  const positionLeaderboard = useLeaderboardPosition();

  const onChangeNextBuildingVisibility = (value: boolean) => {

    if (!playerInfo) {
      return;
    }

    setIsNextBuildingVisible(value);

    if (value) {
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, PROCHAIN_ACHAT_COUNT, rps));
    }
  }

  if (!playerInfo) {
    return null;
  }

  const coinsDormants = Math.max(playerInfo.production - getTotalSpend(playerInfo), 0);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="next-building-visibility"
          checked={isNextBuildingVisible}
          onCheckedChange={onChangeNextBuildingVisibility}
        />
        <label htmlFor="next-building-visibility">
          Afficher les {PROCHAIN_ACHAT_COUNT} prochains achats optimaux (non recommandé sur téléphone)
        </label>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaBed className="w-12 h-12" />
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Coins dormants</span>
                <div className="flex gap-2 items-center">
                  <GradientText className="font-bold">
                    ~ {formatPrice(Math.round(coinsDormants))}
                  </GradientText>
                  <img src={import.meta.env.BASE_URL + "/coin.png"} className="h-6 w-6" alt="Coin" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaTachometerAlt className="w-12 h-12" />
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Production totale</span>
                <div className="flex gap-2 items-center">
                  <GradientText className="font-bold">
                    {(formatPrice(Math.round(playerInfo["production"])))}
                  </GradientText>
                  <img src={import.meta.env.BASE_URL + "/coin.png"} className="h-6 w-6" alt="Coin" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaMedal className="w-12 h-12" />
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Classement</span>
                <div className="flex gap-2 items-center">
                  Top
                  <GradientText className="font-bold">
                    #{positionLeaderboard}
                  </GradientText>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {isNextBuildingVisible &&
          <div className="flex flex-col gap-4 items-center pt-4">
            <StatList playerInfo={playerInfo} buildingBuyPaths={buildingBuyPaths} showProduction={true} />
            <Button
              onClick={() => buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths)}
            >
              Simuler les {buildingBuyPaths.length} achats
            </Button>
          </div>
        }
      </div>
    </>
  );
}

const BuildingName = ({ name, level }: { name: string, level: string }) => {
  return (
    <div className="flex flex-col rounded-sm px-2 py-1 bg-primary text-primary-foreground">
      <span className="text-xs font-bold">{name}</span>
      <span className="text-xs text-center">Level {level}</span>
    </div>
  );
}

export const StatList = ({ playerInfo, buildingBuyPaths, showProduction }) => {

  // List of list [path, index, own, timeToBuy, pathImg]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {
        buildingBuyPaths.map((buildingPath) => (
          <Card>
            <CardContent className="p-4">
              <Stat
                key={buildingPath[0] + buildingPath[1]}
                buildingName={playerInfo[buildingPath[0]][buildingPath[1]]["name"]}
                buildingPath={buildingPath}
                showProduction={showProduction}
              />
            </CardContent>
          </Card>
        ))
      }
    </div>
  )
}

export const Stat = ({ buildingName, buildingPath, showProduction }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <img src={buildingPath[4]} className="w-12 h-12 object-cover" alt="image" />
      <BuildingName name={buildingName} level={buildingPath[2]} />
      <GradientText className="font-bold">{formatPrice(buildingPath[6].toFixed(0))} $</GradientText>
      <span className="text-sm">Achetable {buildingPath[3] !== "Maintenant" && "le"} {buildingPath[3]}</span>
      {showProduction &&
        <div className="flex flex-col items-center">
          <span className="text-sm">Production estimée</span>
          <GradientText className="text-sm font-bold">{formatPrice(buildingPath[5])}</GradientText>
        </div>
      }
    </div>
  );
}

export default Stats;

function getBestUpgrade(copyPlayerInfo: PlayerInfo) {

  const [indexToBuy, bestRpsBuiding] = computeBestBuildingUgrade(copyPlayerInfo);
  let path; // building or upgrade_name
  let index = 0;
  let own = false; // boolean true or int

  const [bestRpsAfterUpgrade, bestUpgradeIndex, bestListName] = findBestUpgrade(structuredClone(copyPlayerInfo));
  if (bestRpsAfterUpgrade > bestRpsBuiding) {
    index = bestUpgradeIndex;
    path = bestListName;
    own = true;
  } else {
    index = indexToBuy;
    path = "building";
    if (index === -1)
      own = 0;
    else
      own = copyPlayerInfo["building"][index]["own"];
  }
  const pathImg = getPathImg(path, index);
  return [path, index, own, pathImg];
}

export function computeXBuildingAhead(playerInfo: PlayerInfo, achatCount: number, rps: number) {
  // Path, index, own, timeToBuy (string), pathImg, newRps, price

  let copyRps = rps;
  let date = new Date();
  const copy = structuredClone(playerInfo);
  let currentCoins = Math.max(playerInfo["production"] - getTotalSpend(copy), 0);
  const buildingBuyPaths = [];
  for (let i = 0; i < achatCount; i++) {
    let [path, index, own, pathImg] = getBestUpgrade(copy);

    if (index !== -1) {
      let price = copy[path][index]["price"];
      const [timeToBuy, newCoins] = computeTimeToBuy(copy[path][index]["price"], own, currentCoins, copyRps, date);
      currentCoins = Math.max(newCoins, 0)
      date = timeToBuy;
      if (typeof own === "boolean")
        copy[path][index]["own"] = true;
      else
        price = computePrice(copy[path][index]["price"], own);
      copy[path][index]["own"] += 1;
      own += 1;

      copyRps = computeRPS(copy);

      buildingBuyPaths.push([path, index, own, getDDHHMMSS(timeToBuy), pathImg, copyRps, price]);
    }

  }
  return buildingBuyPaths;
}

function buyBuilding(playerInfo, setPlayerInfo, buildingPaths) {
  for (let i = 0; i < buildingPaths.length; i++) {
    const bestUpgradeIndex = buildingPaths[i][1];
    const bestListName = buildingPaths[i][0];
    if (bestUpgradeIndex === -1) {
      return;
    }
    if (typeof playerInfo[bestListName][bestUpgradeIndex]["own"] === "boolean") {
      playerInfo[bestListName][bestUpgradeIndex]["own"] = true;
    } else {
      playerInfo[bestListName][bestUpgradeIndex]["own"] += 1;
    }
  }
  setPlayerInfo({ ...playerInfo });
}

function computeTimeToBuy(price, own, coinsDormants, rps, curTime) {
  // return date when you can buy the building and the new currentCoins
  let priceToBuy;
  if (own === true)
    priceToBuy = price;
  else {
    priceToBuy = computePrice(price, own);
  }


  const factorLagServer = 1.33;
  if (coinsDormants >= priceToBuy)
    return [curTime, coinsDormants - priceToBuy];

  const nbSec = (priceToBuy - coinsDormants) * factorLagServer / rps;

  return [new Date(curTime.getTime() + nbSec * 1000), 0];
}

function getDDHHMMSS(d: Date) {
  if (new Date() > d)
    return "Maintenant";
  const padL = (num: number, chr = `0`) => `${num}`.padStart(2, chr);

  return `${padL(d.getDate())}/${padL(d.getMonth() + 1)}/${d.getFullYear()} à ${padL(d.getHours())}:${padL(d.getMinutes())}:${padL(d.getSeconds())}`;
}
