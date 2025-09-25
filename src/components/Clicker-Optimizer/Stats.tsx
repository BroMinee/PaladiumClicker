'use client'
import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { computePrice, computeRPS, formatPrice, getDDHHMMSSOnlyClicker, getPathImg, getTotalSpend, } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { bestBuildingInfo, bestPurchaseInfo, bestPurchaseInfoDetailed, bestUpgradeInfo, PlayerInfo } from "@/types";
import React, { useEffect, useState } from "react";
import { computeBestBuildingUpgrade, findBestUpgrade } from "./RPS";
import { useRpsStore } from "@/stores/use-rps-store";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox.tsx";

const PROCHAIN_ACHAT_COUNT = 21;

const Stats = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps } = useRpsStore();
  const [isNextBuildingVisible, setIsNextBuildingVisible] = useState(false);
  const [buildingBuyPaths, setBuildingBuyPaths] = useState([] as bestPurchaseInfoDetailed[]);

  const onChangeNextBuildingVisibility = (value: boolean) => {

    if (!playerInfo) {
      return;
    }

    setIsNextBuildingVisible(value);
  }

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    if (!isNextBuildingVisible)
      return;

    setBuildingBuyPaths(computeXBuildingAhead(playerInfo, PROCHAIN_ACHAT_COUNT, rps));
  }, [playerInfo, isNextBuildingVisible, rps]);


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
          Afficher les {PROCHAIN_ACHAT_COUNT} prochains achats optimaux
        </label>
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
}

const BuildingName = ({ name, level }: { name: string, level: number | boolean }) => {
  return (
    <div className="flex flex-col rounded-sm px-2 py-1 bg-primary text-primary-foreground">
      <span className="text-xs font-bold text-center break-words">{name}</span>
      {typeof level === "number" ? <span className="text-xs text-center">Level {level}</span> : ""}
    </div>
  );
}

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
      id={`stats-list-${buildingBuyPaths.length}`}
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
  )
}

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
}

export default Stats;


/**
 * @param {PlayerInfo} copyPlayerInfo
 * @param {Date} date
 * @returns {bestPurchaseInfo}
 * @description Get the best upgrade to buy
 * @note Already update the playerInfo own value
 * */
function getBestUpgrade(copyPlayerInfo: PlayerInfo, date: Date): bestPurchaseInfo {

  const bestBuildingInfo = computeBestBuildingUpgrade(structuredClone(copyPlayerInfo));
  const bestUpgradeInfo = findBestUpgrade(structuredClone(copyPlayerInfo), date);


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
export function computeXBuildingAhead(playerInfo: PlayerInfo, achatCount: number, rps: number) {
  // Path, index, own, timeToBuy (string), pathImg, newRps, price

  let copyRps = rps;
  let date = new Date();
  const copy = structuredClone(playerInfo);
  let currentCoins = Math.max(playerInfo["production"] - getTotalSpend(copy), 0);
  const buildingBuyPaths: bestPurchaseInfoDetailed[] = [];
  for (let i = 0; i < achatCount; i++) {

    const bestPurchase: bestPurchaseInfo = getBestUpgrade(copy, date);
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
      currentCoins = Math.max(newCoins, 0)
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
    }
  }
  return buildingBuyPaths;
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
    }

  const nbSec = (priceToBuy - coinsDormants) * factorLagServer / rps;

  return {
    timeToBuy: new Date(curTime.getTime() + nbSec * 1000),
    newCoins: 0
  }
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
  }

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
  </div>
}