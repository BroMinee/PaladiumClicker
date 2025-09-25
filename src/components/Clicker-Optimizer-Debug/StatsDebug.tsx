'use client';
import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { computePrice, computeRPS, formatPrice, getDDHHMMSSOnlyClicker, getPathImg, getTotalSpend, } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import {
  AnyCondition,
  bestBuildingInfo,
  bestPurchaseInfo,
  bestPurchaseInfoDetailed,
  bestPurchaseInfoDetailedDebug,
  bestUpgradeInfo,
  buildingPathType,
  PlayerInfo
} from "@/types";
import React, { useEffect, useState } from "react";
import { computeBestBuildingUpgrade } from "../Clicker-Optimizer/RPS";
import { useRpsStore } from "@/stores/use-rps-store";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox.tsx";

function getCoinsCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;

  const r = conditions.find(c => typeof c !== 'undefined' && "coins" in c) as { coins: number } | undefined;
  return r ? r.coins : -1;
}

function getBuildingIndexCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "index" in c) as { index: number } | undefined;
  return r ? r.index : -1;
}

function getBuildingCountCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "own" in c) as { own: number } | undefined;
  return r ? r.own : -1;
}

function getDayCondition(conditions: AnyCondition | undefined) {
  if (conditions === undefined)
    return 0;
  const r = conditions.find(c => typeof c !== 'undefined' && "day" in c) as { day: number } | undefined;
  return r ? r.day : -1;
}

export function checkConditionDebug(playerInfo: PlayerInfo, conditions: AnyCondition, date: Date, startSeason: Date) {
  const coinsCondition = getCoinsCondition(conditions);
  const dayCondition = getDayCondition(conditions);
  const spend = getTotalSpend(playerInfo);
  const totalCoins = Math.round(spend + Math.max(playerInfo.production - spend, 0));
  const buildingIndex = getBuildingIndexCondition(conditions);
  const buildingNeed = getBuildingCountCondition(conditions);
  const daySinceStart = (date.getTime() - startSeason.getTime()) / (1000 * 60 * 60 * 24);
  const buildingCount = buildingIndex === -1 ? -1 : playerInfo.building[buildingIndex].own;

  const unlockable = totalCoins >= coinsCondition &&
    daySinceStart >= dayCondition &&
    (buildingIndex === -1 ? true : Number(playerInfo.building[buildingIndex].own) >= buildingNeed); // TODO change day

  return {
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  };
}


export function findBestUpgradeDebug(playerInfo: PlayerInfo, date: Date, startSeason: Date): bestUpgradeInfo {

  // building_upgrade
  // category_upgrade
  // global_upgrade
  // many_upgrade
  // terrain_upgrade

  const bestUpgradeRes: bestUpgradeInfo = {
    bestCoef: 0,
    bestUpgradeIndex: -1,
    bestListName: "building_upgrade"
  };

  const buildingUpgradeUnlockable = playerInfo["building_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);
  const categoryUpgradeUnlockable = playerInfo["category_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);
  const globalUpgradeUnlockable = playerInfo["global_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);
  const manyUpgradeUnlockable = playerInfo["many_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);
  const terrainUpgradeUnlockable = playerInfo["terrain_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);
  const posteriorUpgradeUnlockable = playerInfo["posterior_upgrade"].filter((building) => !building["own"] && checkConditionDebug(playerInfo, building["condition"], date, startSeason).unlockable);


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
      const copy = structuredClone(playerInfo);
      const name = list[index]["name"];

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


const StatsDebug = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps } = useRpsStore();
  const [isNextBuildingVisible, setIsNextBuildingVisible] = useState(false);
  const [buildingBuyPaths, setBuildingBuyPaths] = useState<bestPurchaseInfoDetailed[]>([]);
  const [buildingBuyPathsDebug, setBuildingBuyPathsDebug] = useState<bestPurchaseInfoDetailedDebug[]>([]);
  const [count, setCount] = useState(3);
  const [startSeason, setStartSeason] = useState(new Date());

  const onChangeNextBuildingVisibility = (value: boolean) => {

    if (!playerInfo) {
      return;
    }

    setIsNextBuildingVisible(value);
  };

  const onCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCount(value);
    }
  };

  const handleDownload = () => {
    const download_content = buildingBuyPathsDebug.map((buildingPath) => ({
      name: playerInfo![buildingPath.path][buildingPath.index].name ?? "Mp moi discord j'ai fait une erreur",
      level: buildingPath.own,
      price: buildingPath.price,
      newRps: buildingPath.newRps,
      timeSinceBeginInSeconds: buildingPath.timeToBuy,
    }));

    const json = JSON.stringify(download_content, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'ElementList.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Libère la mémoire
  };

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    if (!isNextBuildingVisible)
      return;

    const { normal, debug } = computeXBuildingAheadDebug(playerInfo, count, rps, new Date().getTime() < startSeason.getTime() ? new Date() : startSeason);
    setBuildingBuyPathsDebug(debug);
    setBuildingBuyPaths(normal);
  }, [playerInfo, isNextBuildingVisible, count,startSeason, rps]);


  if (!playerInfo) {
    return null;
  }


  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="next-building-visibility"
          className="h-6 w-6"
          checked={isNextBuildingVisible}
          onCheckedChange={onChangeNextBuildingVisibility}
        />
        <label htmlFor="next-building-visibility" className="text-primary-foreground">
          Afficher les {count} prochains achats optimaux
        </label>
        <input
          id="count-input"
          type="number"
          min="1"
          value={count}
          onChange={onCountChange}
          className="w-16 text-center border border-gray-300 rounded-md"
        />
        <input
          id="start-season-input"
          type="date"
          value={startSeason.toISOString().split('T')[0]}
          onChange={(e) => setStartSeason(new Date(e.target.value))}
          className="w-32 text-center border border-gray-300 rounded-md"/>

        <Button onClick={handleDownload}>
          Télécharger la liste
        </Button>
      </div>

      {isNextBuildingVisible &&
        <div className="flex flex-col gap-4 items-center pt-4 animate-fade-in">
          <StatList buildingBuyPaths={buildingBuyPaths} showProduction={true}/>
          <Button
            onClick={() => buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths)}
          >
            Simuler les {buildingBuyPaths.length} achats
          </Button>
        </div>
      }
    </>
  );
};

const BuildingName = ({ name, level }: { name: string, level: number | boolean }) => {
  return (
    <div className="flex flex-col rounded-sm px-2 py-1 bg-primary text-primary-foreground">
      <span className="text-xs font-bold text-center break-words">{name}</span>
      {typeof level === "number" ? <span className="text-xs text-center">Level {level}</span> : ""}
    </div>
  );
};

type StatsListProps = {
  buildingBuyPaths: bestPurchaseInfoDetailed[],
  showProduction: boolean
}

export const StatList = ({ buildingBuyPaths, showProduction }: StatsListProps) => {

  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return "Loading";

  // List of list [path, index, own, timeToBuy, pathImg]

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 w-full gap-2">
      {
        buildingBuyPaths.map((buildingPath, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Stat
                key={buildingPath.path + buildingPath.index}
                buildingName={playerInfo[buildingPath.path][buildingPath.index].name}
                buildingPath={buildingPath}
                showProduction={showProduction}
              />
            </CardContent>
          </Card>
        ))
      }
    </div>
  );
};

type StatProps = {
  buildingName: string,
  buildingPath: bestPurchaseInfoDetailed,
  showProduction: boolean,
}

export const Stat = ({ buildingName, buildingPath, showProduction }: StatProps) => {
  return (
    <div className="flex flex-col gap-2 items-center text-sm">
      <Image src={buildingPath.pathImg} height={48} width={48} className="object-cover" alt="image"/>
      <BuildingName name={buildingName} level={buildingPath.own}/>
      <div className="text-primary font-bold text-center text-nowrap">{formatPrice(buildingPath.price)} $</div>
      <span
        className=" text-center break-words">Achetable {buildingPath.timeToBuy !== "Maintenant" && "le"} {buildingPath.timeToBuy}</span>
      {showProduction &&
        <div className="flex flex-col items-center">
          <span className="text-center">Production estimée</span>
          <GradientText
            className="font-bold">{formatPrice(Math.floor(buildingPath.newRps * 10) / 10)}</GradientText>
        </div>
      }
    </div>
  );
};

export default StatsDebug;


/**
 * @param {PlayerInfo} copyPlayerInfo
 * @param {Date} date
 * @returns {bestPurchaseInfo}
 * @description Get the best upgrade to buy
 * @note Already update the playerInfo own value
 * */
function getBestUpgrade(copyPlayerInfo: PlayerInfo, date: Date, startSeason: Date): bestPurchaseInfo {

  const bestBuildingInfo = computeBestBuildingUpgrade(structuredClone(copyPlayerInfo));
  const bestUpgradeInfo = findBestUpgradeDebug(structuredClone(copyPlayerInfo), date, startSeason);


  let bestPurchase = {} as (bestUpgradeInfo | bestBuildingInfo);
  if (bestBuildingInfo.bestUpgradeIndex === -1 && bestUpgradeInfo.bestUpgradeIndex === -1)
    return {
      path: "building",
      index: -1,
      own: -1,
      pathImg: "",
    };

  else if (bestBuildingInfo.bestUpgradeIndex === -1)
    bestPurchase = bestUpgradeInfo;
  else if (bestUpgradeInfo.bestUpgradeIndex === -1)
    bestPurchase = bestBuildingInfo;
  else
    bestPurchase = bestBuildingInfo.bestCoef > bestUpgradeInfo.bestCoef ? bestBuildingInfo : bestUpgradeInfo;

  const own = copyPlayerInfo[bestPurchase.bestListName][bestPurchase.bestUpgradeIndex].own;
  if (typeof own === "boolean" && own === true)
    alert("Error in getBestUpgrade true");
  else if (typeof own === "boolean" && own === false)
    copyPlayerInfo[bestPurchase.bestListName][bestPurchase.bestUpgradeIndex].own = true;
  else if (typeof own === "number")
    copyPlayerInfo[bestPurchase.bestListName][bestPurchase.bestUpgradeIndex].own = own + 1;
  else
    alert("Error in getBestUpgrade");


  return {
    path: bestPurchase.bestListName,
    index: bestPurchase.bestUpgradeIndex,
    own: copyPlayerInfo[bestPurchase.bestListName][bestPurchase.bestUpgradeIndex].own,
    pathImg: getPathImg(bestPurchase.bestListName, bestPurchase.bestUpgradeIndex),
  };
}

/**
 * This algorithm is the original one. It has been copied many times, but none have ever matched its quality. :)
 * You are probably wondering why it has been copied — well, it was the first of its kind, and people just wanted a piece of the cake.
 */

export function computeXBuildingAheadDebug(playerInfo: PlayerInfo, achatCount: number, rps: number, startSeason: Date):
  { normal: bestPurchaseInfoDetailed[], debug: bestPurchaseInfoDetailedDebug[] } {
  // Path, index, own, timeToBuy (string), pathImg, newRps, price

  let copyRps = rps;
  const startingDate = new Date();
  let date = new Date();
  const copy = structuredClone(playerInfo);
  let currentCoins = Math.max(playerInfo["production"] - getTotalSpend(copy), 0);
  const buildingBuyPaths: bestPurchaseInfoDetailed[] = [];
  const buildingBuyPathsDebug: bestPurchaseInfoDetailedDebug[] = [];
  for (let i = 0; i < achatCount; i++) {

    const bestPurchase: bestPurchaseInfo = getBestUpgrade(copy, date, startSeason);
    // own already updated
    if (bestPurchase.index === -1)
      break;

    //let [path, index, own, pathImg] = getBestUpgrade(copy);

    if (bestPurchase.index !== -1) {
      let price = copy[bestPurchase.path][bestPurchase.index].price;
      const {
        timeToBuy: timeToBuy,
        newCoins: newCoins
      } = computeTimeToBuy(price, bestPurchase.own, currentCoins, copyRps, date);
      currentCoins = Math.max(newCoins, 0);
      date = timeToBuy;
      const own = copy[bestPurchase.path][bestPurchase.index].own;

      if (typeof own === "number") {
        price = computePrice(copy[bestPurchase.path][bestPurchase.index]["price"], own - 1);
      }

      copyRps = computeRPS(copy);


      buildingBuyPaths.push(
        {
          path: bestPurchase.path,
          index: bestPurchase.index,
          own: copy[bestPurchase.path][bestPurchase.index].own,
          timeToBuy: getDDHHMMSSOnlyClicker(timeToBuy),
          pathImg: bestPurchase.pathImg,
          newRps: copyRps,
          price: price
        }
      );

      buildingBuyPathsDebug.push(
        {
          path: bestPurchase.path,
          index: bestPurchase.index,
          own: copy[bestPurchase.path][bestPurchase.index].own,
          timeToBuy: (timeToBuy.getTime() / 1000) - (startingDate.getTime() / 1000),
          pathImg: bestPurchase.pathImg,
          newRps: copyRps,
          price: price
        }
      );
    }
  }
  return { normal: buildingBuyPaths, debug: buildingBuyPathsDebug };
}


export function buyBuilding(playerInfo: PlayerInfo | null, setPlayerInfo: (arg0: PlayerInfo) => (void), buildingPaths: bestPurchaseInfoDetailed[]) {
  if (!playerInfo) {
    return;
  }
  for (let i = 0; i < buildingPaths.length; i++) {
    const bestUpgradeIndex = buildingPaths[i].index;
    const bestListName = buildingPaths[i].path;
    if (bestUpgradeIndex === -1) {
      return;
    }
    const own = playerInfo[bestListName][bestUpgradeIndex]["own"];
    if (typeof own === "boolean") {
      playerInfo[bestListName][bestUpgradeIndex]["own"] = true;
    } else {
      playerInfo[bestListName][bestUpgradeIndex]["own"] = Math.min(own + 1, 99);
    }
  }
  setPlayerInfo({ ...playerInfo });
}

function computeTimeToBuy(price: number, own: boolean | number, coinsDormants: number, rps: number, curTime: Date) {
  // return date when you can buy the building and the new currentCoins

  let priceToBuy = -1;
  if (typeof own === "boolean" && own === true)
    priceToBuy = price;
  else if (typeof own === "boolean" && own === false)
    alert("Error in computeTimeToBuy false");
  else {
    priceToBuy = computePrice(price, own - 1);
  }


  const factorLagServer = 1.33;
  if (coinsDormants >= priceToBuy)
    return {
      timeToBuy: curTime,
      newCoins: coinsDormants - priceToBuy
    };

  const nbSec = (priceToBuy - coinsDormants) * factorLagServer / rps;

  return {
    timeToBuy: new Date(curTime.getTime() + nbSec * 1000),
    newCoins: 0
  };
}


export function DisplayCoinsDormants() {
  const { data: playerInfo, setProduction } = usePlayerInfoStore();

  if (!playerInfo) {
    return 0;
  }


  const totalSpend = getTotalSpend(playerInfo);
  let coinsDormants = Math.max(playerInfo.production - totalSpend, 0);

  const onChangeCoinsDormants = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerInfo) {
      return;
    }
    const rowValue = event.target.value;
    const bitBetterValue = rowValue.replaceAll(" ", "");
    let value = Number(bitBetterValue);
    if (!isNaN(value)) {
      value = Math.floor(value);
      const production = value + totalSpend;
      setProduction(production);
    }
  };

  return <div className="flex flex-row items-center">
    ~ <input
    type="text"
    min="0"
    step="1"
    max="100"
    className="bg-clip-text text-transparent bg-gradient-to-tr from-primary to-destructive/85 text-center rounded-sm font-bold w-32 md:w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    placeholder={String(coinsDormants)}
    onChange={onChangeCoinsDormants}
    value={formatPrice(Math.round(coinsDormants))}/>
  </div>;
}