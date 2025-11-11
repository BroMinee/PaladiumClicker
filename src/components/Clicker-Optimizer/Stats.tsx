"use client";
import { GradientText } from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buyBuilding, computeXBuildingAhead, formatPrice, getTotalSpend, } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { bestPurchaseInfoDetailed } from "@/types";
import React, { useEffect, useState } from "react";
import { useRpsStore } from "@/stores/use-rps-store";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const PROCHAIN_ACHAT_COUNT = 21;

/**
 * Checkbox to show/compute/simulate the next 21 optimal purchases.
 *
 * The component compute the next 21 optimal purchases ONLY if the checkbox is checked the "next building".
 */
export const Stats = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps } = useRpsStore();
  const [isNextBuildingVisible, setIsNextBuildingVisible] = useState(false);
  const [buildingBuyPaths, setBuildingBuyPaths] = useState([] as bestPurchaseInfoDetailed[]);

  const onChangeNextBuildingVisibility = (value: boolean) => {

    if (!playerInfo) {
      return;
    }

    setIsNextBuildingVisible(value);
  };

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    if (!isNextBuildingVisible) {
      return;
    }

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
          <StatList buildingBuyPaths={buildingBuyPaths}/>
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
}

/**
 * Display a list of upgrade to buys, as well as more information about it, such as production, price, time to buy, etc.
 * @param buildingBuyPaths
 * @param showProduction
 */
export const StatList = ({ buildingBuyPaths }: StatsListProps) => {

  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return "Loading";
  }

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
                showProduction={true}
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

/**
 * Show informations about the given upgrade.
 * @param buildingName - name of the upgrade (could be a upgrade or a building) the name is misleading. TODO change names
 * @param buildingPath - best purchase information. TODO change names
 * @param showProduction - boolean to display or not the production of that upgrade.
 */
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

/**
 * Component that compute and display the current coin in stock.
 */
export function DisplayCoinsDormants() {
  const { data: playerInfo, setProduction } = usePlayerInfoStore();

  if (!playerInfo) {
    return 0;
  }

  const totalSpend = getTotalSpend(playerInfo);
  const coinsDormants = Math.max(playerInfo.production - totalSpend, 0);

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