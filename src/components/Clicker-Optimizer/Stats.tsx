'use client'
import GradientText from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  computePrice,
  computeRPS,
  formatPrice,
  getDDHHMMSS,
  getPathImg,
  getTotalSpend,
  safeJoinPaths
} from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { bestBuildingInfo, bestPurchaseInfo, bestPurchaseInfoDetailed, bestUpgradeInfo, PlayerInfo } from "@/types";
import { useEffect, useState } from "react";
import { FaBed, FaInfoCircle, FaMedal, FaTachometerAlt } from "react-icons/fa";
import { computeBestBuildingUgrade, findBestUpgrade } from "./RPS";
import { useRpsStore } from "@/stores/use-rps-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

const PROCHAIN_ACHAT_COUNT = 20;

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

    if (value) {
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, PROCHAIN_ACHAT_COUNT, rps));
    }
  }

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    setBuildingBuyPaths(computeXBuildingAhead(playerInfo, PROCHAIN_ACHAT_COUNT, rps));
  }, [playerInfo]);


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
        <label htmlFor="next-building-visibility" className="text-primary-foreground">
          Afficher les {PROCHAIN_ACHAT_COUNT} prochains achats optimaux (non recommandé sur téléphone)
        </label>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaBed className="w-12 h-12"/>
              <div className="flex flex-col gap-2 justify">
                    <span className="font-semibold flex items-center gap-2">Coins dormants
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FaInfoCircle className="inline-block h-4 w-4"/>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        Coins que vous avez sur votre clicker in-game, mais que vous n'avez pas encore dépensés.
                      </PopoverContent>
                    </Popover></span>
                <div className="flex gap-2 items-center">
                  <GradientText className="font-bold">
                    ~ {formatPrice(Math.round(coinsDormants))}
                  </GradientText>
                  <img src={safeJoinPaths("/coin.png")} className="h-6 w-6"
                       alt="Coin"/>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaTachometerAlt className="w-12 h-12"/>
              <div className="flex flex-col gap-2">
                  <span className="font-semibold flex items-center gap-2">Production totale
                  <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FaInfoCircle className="inline-block h-4 w-4"/>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        Ne prends pas en compte la production des cliques manuels.
                      </PopoverContent>
                    </Popover>
                  </span>
                <div className="flex gap-2 items-center">
                  <GradientText className="font-bold">
                    {(formatPrice(Math.round(playerInfo["production"])))}
                  </GradientText>
                  <img src={safeJoinPaths("/coin.png")} className="h-6 w-6"
                       alt="Coin"/>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaMedal className="w-12 h-12"/>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Classement</span>
                <div className="flex gap-2 items-center">
                  Top
                  <GradientText className="font-bold">
                    #{playerInfo["leaderboard"]}
                  </GradientText>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {isNextBuildingVisible &&
          <div className="flex flex-col gap-4 items-center pt-4">
            <StatList buildingBuyPaths={buildingBuyPaths} showProduction={true}/>
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

const BuildingName = ({ name, level }: { name: string, level: number | boolean }) => {
  return (
    <div className="flex flex-col rounded-sm px-2 py-1 bg-primary text-primary-foreground">
      <span className="text-xs font-bold">{name}</span>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
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
  showProduction: boolean
}

export const Stat = ({ buildingName, buildingPath, showProduction }: StatProps) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <img src={buildingPath.pathImg} className="w-12 h-12 object-cover" alt="image"/>
      <BuildingName name={buildingName} level={buildingPath.own}/>
      <GradientText className="font-bold">{formatPrice(buildingPath.price)} $</GradientText>
      <span
        className="text-sm">Achetable {buildingPath.timeToBuy !== "Maintenant" && "le"} {buildingPath.timeToBuy}</span>
      {showProduction &&
        <div className="flex flex-col items-center">
          <span className="text-sm">Production estimée</span>
          <GradientText
            className="text-sm font-bold">{formatPrice(buildingPath.newRps)}</GradientText>
        </div>
      }
    </div>
  );
}

export default Stats;


/**
 * @param {PlayerInfo} copyPlayerInfo
 * @returns {bestPurchaseInfo}
 * @description Get the best upgrade to buy
 * @note Already update the playerInfo own value
 * */
function getBestUpgrade(copyPlayerInfo: PlayerInfo): bestPurchaseInfo {

  const bestBuildingInfo = computeBestBuildingUgrade(copyPlayerInfo);
  const bestUpgradeInfo = findBestUpgrade(structuredClone(copyPlayerInfo));


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
    bestPurchase = bestBuildingInfo.bestRpsAfterUpgrade > bestUpgradeInfo.bestRpsAfterUpgrade ? bestBuildingInfo : bestUpgradeInfo;

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


export function computeXBuildingAhead(playerInfo: PlayerInfo, achatCount: number, rps: number) {
  // Path, index, own, timeToBuy (string), pathImg, newRps, price

  let copyRps = rps;
  let date = new Date();
  const copy = structuredClone(playerInfo);
  let currentCoins = Math.max(playerInfo["production"] - getTotalSpend(copy), 0);
  const buildingBuyPaths: bestPurchaseInfoDetailed[] = [];
  for (let i = 0; i < achatCount; i++) {

    const bestPurchase: bestPurchaseInfo = getBestUpgrade(copy);
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
          timeToBuy: getDDHHMMSS(timeToBuy),
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
