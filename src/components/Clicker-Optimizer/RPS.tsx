'use client'
import { checkCondition, computePrice, computeRPS, formatPrice, safeJoinPaths } from "@/lib/misc";
import { buyBuilding, computeXBuildingAhead, Stat } from "./Stats";
import { bestBuildingInfo, bestPurchaseInfoDetailed, bestUpgradeInfo, buildingPathType, PlayerInfo } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { useRpsStore } from "@/stores/use-rps-store";
import { FaCoins, FaRandom } from "react-icons/fa";
import Image from "next/image";

const RPS = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps, setRPS } = useRpsStore();
  const [estimatedRPS, setEstimatedRPS] = useState(3);

  const [buildingBuyPaths, setBuildingBuyPaths] = useState([] as bestPurchaseInfoDetailed[]);

  useEffect(() => {
    if (playerInfo)
      setRPS(computeRPS(playerInfo));
  }, [playerInfo, setRPS]);

  useEffect(() => {
    if (buildingBuyPaths.length !== 0)
      setEstimatedRPS(buildingBuyPaths[0].newRps);
  }, [setEstimatedRPS, buildingBuyPaths]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }

    if (rps !== 0)
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, 1, rps));
  }, [playerInfo, rps]);

  if (!playerInfo) {
    return <div>Loading...</div>
  }

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
                  <Stat
                    buildingName={playerInfo[buildingBuyPaths[0].path][buildingBuyPaths[0].index]["name"]}
                    buildingPath={buildingBuyPaths[0]} showProduction={false}/>
                  <Button
                    onClick={() => buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths)}
                  >
                    Simuler l&apos;achat
                  </Button>
                </div>
              </>
            }
            {(buildingBuyPaths.length === 0) &&
              <div className="flex flex-col items-center gap-4">
                <Image width={128} height={128} src={safeJoinPaths("/arty_chocbar.webp")}
                       className="h-auto object-contain"
                       alt="Arty"/>
                <p className="text-sm">Bravo tu as tout acheté, va prendre une douche
                  maintenant.</p>
                <Button>
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
            <Image width={48} height={48} src={safeJoinPaths("/arty_chocbar.webp")}
                   className="h-auto object-contain"
                   alt="Arty"/> :
            <FaCoins className="w-12 h-12"/>
          }
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production actuelle par seconde</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold">{'~ ' + formatPrice(rps)}</GradientText>
              <Image width={24} height={24} src={safeJoinPaths("/coin.png")} alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaRandom className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production estimée après achat</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold">
                {'~ ' + formatPrice(estimatedRPS)}{" "}
                ({estimatedRPS > rps ? "+" : ""}{(((estimatedRPS - rps) / (rps) * 100)).toFixed(5)}%)
              </GradientText>
              <Image src={safeJoinPaths("/coin.png")} height={24} width={24} alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export function computeBestBuildingUpgrade(playerInfo: PlayerInfo): bestBuildingInfo {
  let buildingOwned = playerInfo.building.filter((building) => Number(building.own) > 0).length;
  if (buildingOwned !== playerInfo.building.length && Number(playerInfo.building[buildingOwned]["name"]) !== -1) {
    buildingOwned += 1;
  }
  const currentRPS = computeRPS(playerInfo);
  let bestCoef = 0;
  let bestBuildingIndex = -1;
  for (let index = 0; index < buildingOwned; index++) {
    const copy = structuredClone(playerInfo);
    const building = copy.building[index];
    if (building.own === 99) {
      continue;
    }

    building.own += 1;

    const coef = (computeRPS(copy) - currentRPS) / (computePrice(copy.building[index].price, Number(copy.building[index].own) - 1));
    if (coef > bestCoef) {
      bestCoef = coef;
      bestBuildingIndex = index;
    }
  }

  return {
    bestCoef: bestCoef,
    bestUpgradeIndex: bestBuildingIndex,
    bestListName: "building"
  };
}


export function findBestUpgrade(playerInfo: PlayerInfo, date: Date): bestUpgradeInfo {

  // building_upgrade
  // category_upgrade
  // global_upgrade
  // many_upgrade
  // terrain_upgrade

  const bestUpgradeRes: bestUpgradeInfo = {
    bestCoef: 0,
    bestUpgradeIndex: -1,
    bestListName: "building_upgrade"
  }

  const buildingUpgradeUnlockable = playerInfo["building_upgrade"].filter((building) => !building["own"] && checkCondition(playerInfo, building["condition"], date).unlockable);
  const categoryUpgradeUnlockable = playerInfo["category_upgrade"].filter((building) => !building["own"] && checkCondition(playerInfo, building["condition"], date).unlockable);
  const globalUpgradeUnlockable = playerInfo["global_upgrade"].filter((building) => !building["own"] && building["name"] !== "-1" && checkCondition(playerInfo, building["condition"], date).unlockable);
  const manyUpgradeUnlockable = playerInfo["many_upgrade"].filter((building) => !building["own"] && checkCondition(playerInfo, building["condition"], date).unlockable);
  const terrainUpgradeUnlockable = playerInfo["terrain_upgrade"].filter((building) => !building["own"] && checkCondition(playerInfo, building["condition"], date).unlockable);
  const posteriorUpgradeUnlockable = playerInfo["posterior_upgrade"].filter((building) => !building["own"] && checkCondition(playerInfo, building["condition"], date).unlockable);


  const currentRPS = computeRPS(playerInfo);


  type typeListTmp =
    typeof buildingUpgradeUnlockable
    | typeof categoryUpgradeUnlockable
    | typeof globalUpgradeUnlockable
    | typeof manyUpgradeUnlockable
    | typeof terrainUpgradeUnlockable
    | typeof posteriorUpgradeUnlockable;

  function getBestIndex(list: typeListTmp, nameList: buildingPathType) {
    for (let index = 0; index < list.length; index++) {
      const copy = structuredClone(playerInfo)
      const name = list[index]["name"]

      if (!Object.keys(playerInfo).includes(nameList)) {
        return;
      }


      const indexInBuilding = playerInfo[nameList].findIndex((building) => building["name"] === name);
      copy[nameList][indexInBuilding]["own"] = true;

      const coef = (computeRPS(copy) - currentRPS) / (copy[nameList][indexInBuilding]["price"]);

      if (coef > bestUpgradeRes.bestCoef) {
        bestUpgradeRes.bestCoef = coef;
        bestUpgradeRes.bestUpgradeIndex = indexInBuilding;
        bestUpgradeRes.bestListName = nameList;
      }
    }
  }

  getBestIndex(buildingUpgradeUnlockable, "building_upgrade");
  getBestIndex(categoryUpgradeUnlockable, "category_upgrade");
  getBestIndex(globalUpgradeUnlockable, "global_upgrade");
  getBestIndex(manyUpgradeUnlockable, "many_upgrade");
  getBestIndex(terrainUpgradeUnlockable, "terrain_upgrade");
  getBestIndex(posteriorUpgradeUnlockable, "posterior_upgrade");

  return bestUpgradeRes;
}


export default RPS;
