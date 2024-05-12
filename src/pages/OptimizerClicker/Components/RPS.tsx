// @ts-nocheck

import { computeRPS } from "@/pages/OptimizerClicker/Components/BuildingList";
import { checkCondition, computePrice, formatPrice } from "@/lib/misc";
import { computeXBuildingAhead, Stat } from "./Stats";
import { PlayerInfo } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { useRpsStore } from "@/stores/use-rps-store";
import { FaCoins, FaRandom } from "react-icons/fa";

const RPS = () => {
  const { data: playerInfo, buyBuildingByIndex } = usePlayerInfoStore();
  const { rps } = useRpsStore();
  const [estimatedRPS, setEstimatedRPS] = useState(3);

  const buildingBuyPaths = computeXBuildingAhead(playerInfo!, 1, rps);
  console.log(buildingBuyPaths)

  useEffect(() => {
    if (buildingBuyPaths.length !== 0)
      setEstimatedRPS(buildingBuyPaths[0][5]);
  }, [setEstimatedRPS, buildingBuyPaths]);

  return (
    <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-4">
      <Card className="md:row-span-2">
        <CardHeader>
          <CardTitle>Prochain achat optimal</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {(buildingBuyPaths.length !== 0) &&
              <>
                <div className="flex flex-col justify-center gap-4">
                  <Stat buildingName={playerInfo[buildingBuyPaths[0][0]][buildingBuyPaths[0][1]]["name"]} buildingPath={buildingBuyPaths.at(0)} showProduction={false} />
                  <Button
                    onClick={() => buyBuildingByIndex(buildingBuyPaths[0][1])}
                  >
                    Simuler l'achat
                  </Button>
                </div>
              </>
            }
            {(buildingBuyPaths.length === 0) &&
              <div className="flex flex-col items-center gap-4">
                <img src="/arty_chocbar.webp" className="w-32 h-auto object-contain" alt="Arty" />
                <p className="text-sm">Bravo tu as tout acheté, va prendre une douche maintenant.</p>
                <Button
                  onClick={() => {
                    localStorage.setItem("CPS", "-2")
                  }}
                  style={{ marginTop: "10px" }}
                >
                  Aller prendre une douche
                </Button>
              </div>
            }
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          {rps < 0 ?
            <img src="/arty_chocbar.webp" className="w-12 h-auto object-contain" alt="Arty" /> :
            <FaCoins className="w-12 h-12" />
          }
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production actuelle par seconde</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold">{'~ ' + formatPrice(rps)}</GradientText>
              <img src="/coin.png" className="h-6 w-6" alt="Coin" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaRandom className="w-12 h-12" />
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production estimée après achat</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold">
                {'~ ' + formatPrice(estimatedRPS)}{" "}
                ({estimatedRPS > rps ? "+" : ""}{(((estimatedRPS - rps) / (rps) * 100)).toFixed(5)}%)
              </GradientText>
              <img src="/coin.png" className="h-6 w-6" alt="Coin" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export function computeBestBuildingUgrade(playerInfo: PlayerInfo) {
  let buildingOwned = playerInfo["building"].filter((building) => Number(building.own) > 0).length;
  if (buildingOwned !== playerInfo["building"].length && Number(playerInfo["building"][buildingOwned]["name"]) !== -1) {
    buildingOwned += 1;
  }
  const currentRPS = computeRPS(playerInfo);
  let bestRpsAfterUpgrade = 0;
  let bestBuildingIndex = -1;
  for (let index = 0; index < buildingOwned; index++) {
    const copy = structuredClone(playerInfo);
    const building = copy.building[index];
    if (building.own === 99) {
      continue;
    }
    if (typeof building.own === "number") {
      building.own += 1;
    }
    const rpsAfterUpgrade = (computeRPS(copy) - currentRPS) / (computePrice(copy.building[index].price, Number(copy.building[index].own)));
    if (rpsAfterUpgrade > bestRpsAfterUpgrade) {
      bestRpsAfterUpgrade = rpsAfterUpgrade;
      bestBuildingIndex = index;
    }
  }
  return [bestBuildingIndex, bestRpsAfterUpgrade];
}


export function findBestUpgrade(playerInfo: PlayerInfo) {

  // building_upgrade
  // category_upgrade
  // global_upgrade
  // many_upgrade
  // terrain_upgrade

  const buildingUpgradeUnlockable = playerInfo["building_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
  const categoryUpgradeUnlockable = playerInfo["category_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
  const globalUpgradeUnlockable = playerInfo["global_upgrade"].filter((building) => building["own"] === false && building["name"] !== -1 && checkCondition(playerInfo, building["condition"])[0]);
  const manyUpgradeUnlockable = playerInfo["many_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
  const terrainUpgradeUnlockable = playerInfo["terrain_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
  const posteriorUpgradeUnlockable = playerInfo["posterior_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);

  let bestUpgradeIndex = -1;
  let bestListName = "building_upgrade";
  let bestRpsAfterUpgrade = 0;

  const currentRPS = computeRPS(playerInfo);

  // console.log(buildingUpgradeUnlockable)
  function getBestIndex(list: unknown[], nameList: string) {
    for (let index = 0; index < list.length; index++) {
      const copy = structuredClone(playerInfo)
      const name = list[index]["name"]
      const indexInBuilding = playerInfo[nameList].findIndex((building) => building["name"] === name);
      copy[nameList][indexInBuilding]["own"] = true;

      const RPSafterUpgrade = (computeRPS(copy) - currentRPS) / (copy[nameList][indexInBuilding]["price"]);
      // console.log(`${copy[nameList][indexInBuilding]["name"]} ${computeRPS(copy)} ${currentRPS} ${bestRpsAfterUpgrade} ${copy[nameList][indexInBuilding]["price"]} ${RPSafterUpgrade}`)
      if (RPSafterUpgrade > bestRpsAfterUpgrade) {
        bestRpsAfterUpgrade = RPSafterUpgrade;
        bestUpgradeIndex = indexInBuilding;
        bestListName = nameList;
      }
    }
  }

  getBestIndex(buildingUpgradeUnlockable, "building_upgrade");
  getBestIndex(categoryUpgradeUnlockable, "category_upgrade");
  getBestIndex(globalUpgradeUnlockable, "global_upgrade");
  getBestIndex(manyUpgradeUnlockable, "many_upgrade");
  getBestIndex(terrainUpgradeUnlockable, "terrain_upgrade");
  getBestIndex(posteriorUpgradeUnlockable, "posterior_upgrade");

  // console.log(`Best upgrade : ${playerInfo[bestListName][bestUpgradeIndex]["name"]}`);

  return [bestRpsAfterUpgrade, bestUpgradeIndex, bestListName];
}


export default RPS;
