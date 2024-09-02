'use client';
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { checkCondition, formatPrice } from "@/lib/misc.ts";
import { BuildingUpgrade, CategoryUpgrade, GlobalUpgrade, TerrainUpgrade, UpgradeKey } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaInfoCircle } from "react-icons/fa";
import { cn } from "@/lib/utils.ts";
import React from "react";

export function PreconditionDisplay({ index, upgradeType }: { index: number, upgradeType: UpgradeKey }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const {
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  } = checkCondition(playerInfo, playerInfo[upgradeType][index].condition);

  const texts = [];
  if (!unlockable) {
    texts.push("Précondition non remplie :");
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`${formatPrice(dayCondition)} days`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`${formatPrice(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
    if (texts.length !== 2)
      texts[0] = "Préconditions non remplies :";
  }

  if (!unlockable) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <FaInfoCircle className="inline-block h-4 w-4"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {texts.map((text, index) => (
            <p key={index} className="text-sm text-destructive">{text}</p>
          ))}
        </PopoverContent>
      </Popover>
    );
  }
  return null;
}

export function ButtonUpgrade({ index, upgradeType, children }: {
  index: number,
  upgradeType: UpgradeKey,
  children: React.ReactNode
}) {
  const { data: playerInfo, toggleUpgradeOwn } = usePlayerInfoStore();


  let upgrade: BuildingUpgrade | CategoryUpgrade | GlobalUpgrade | TerrainUpgrade | {
    own: false;
    name: string
  } = playerInfo ? playerInfo[upgradeType][index] : { own: false, name: "uninitialized" };

  return (
    <Button
      variant="card"
      className={cn(
        "p-4 h-auto",
        upgrade.own && "bg-primary text-primary-foreground",
        !upgrade.own && "bg-yellow-500 text-primary-foreground",
        upgrade.own && "hover:bg-primary-darker",
        !upgrade.own && "hover:bg-yellow-600",
      )}
      onClick={() => toggleUpgradeOwn(upgradeType, upgrade.name)}
    >
      {children}
    </Button>
  );
}