"use client";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { checkCondition } from "@/lib/misc.ts";
import { BuildingUpgrade, CategoryUpgrade, GlobalUpgrade, TerrainUpgrade, UpgradeKey } from "@/types";
import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import React from "react";
import { Card } from "@/components/ui/card.tsx";

/**
 * Button wrapper around the upgrade IMG.
 * @param index - index in the list of upgrade to which the button is bind.
 * @param upgradeType - The upgrade type, used to iterate over the correctly list.
 * @param children - IMG of the upgrade
 */
export function ButtonUpgrade({ index, upgradeType, children }: {
  index: number,
  upgradeType: UpgradeKey,
  children: React.ReactNode
}) {
  const { data: playerInfo, toggleUpgradeOwn } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const upgrade: BuildingUpgrade | CategoryUpgrade | GlobalUpgrade | TerrainUpgrade | {
    own: false;
    name: string
  } = playerInfo ? playerInfo[upgradeType][index] : { own: false, name: "uninitialized" };

  const unlockable = checkCondition(playerInfo, playerInfo[upgradeType][index].condition, new Date()).unlockable;

  return (
    <Card
      id={`upgrade-${upgradeType}-${index}`}
      className={cn(
        buttonVariants({ variant: "card" }),
        "p-3 h-auto",
        upgrade.own && "bg-primary text-primary-foreground",
        !upgrade.own && "bg-yellow-500 text-primary-foreground",
        upgrade.own && "hover:bg-primary-darker",
        !upgrade.own && "hover:bg-yellow-600",
        !upgrade.own && !unlockable && "bg-gray-500"
      )}
      onClick={() => toggleUpgradeOwn(upgradeType, upgrade.name)}
    >
      {children}
    </Card>
  );
}