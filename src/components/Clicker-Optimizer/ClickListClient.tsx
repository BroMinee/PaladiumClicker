'use client';
import { cn } from "@/lib/utils.ts";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React from "react";
import { checkCondition, formatPrice } from "@/lib/misc.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { FaInfoCircle } from "react-icons/fa";
import { Card } from "@/components/ui/card.tsx";

export function ButtonCPS({ index, children }: { index: number, children: React.ReactNode }) {
  const { data: playerInfo, selectCPS } = usePlayerInfoStore();
  const cps = playerInfo?.CPS[index];

  return (
    <Card
      className={cn(
        buttonVariants({ variant: "card" }),
        "p-4 h-auto min-w-36 w-fit",
        cps?.own && "bg-primary text-primary-foreground",
        !cps?.own && "bg-yellow-500 text-primary-foreground",
        cps?.own && "hover:bg-primary-darker",
        !cps?.own && "hover:bg-yellow-600",
      )}
      onClick={() => selectCPS(index)}
    >
      {children}
    </Card>
  );
}

export function PreconditionDisplay({ index }: { index: number }) {
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
  } = checkCondition(playerInfo, playerInfo.CPS[index].condition);


  const texts = ["Précondition non remplie :"];
  if (Number(playerInfo.CPS[index].name) === -1)
    texts[0] = "Précondition non remplie (spéculation):";

  let isUnlockable = unlockable;
  for (let i = 1; i < index; i++) {
    if (!playerInfo.CPS[i].own) {
      texts.push(`Achetez ${playerInfo.CPS[i - 1].name}`)
      isUnlockable = false;
      break;
    }
  }
  if (!isUnlockable) {
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`Début de saison depuis ${formatPrice(dayCondition)} jours. Actuellement : ${formatPrice(Math.floor(daySinceStart))} jours`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`Collecter ${formatPrice(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
  }
  if (texts.length !== 2)
    texts[0] = "Préconditions non remplies :";

  if (!unlockable) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <FaInfoCircle className="inline-block h-4 w-4 text-secondary-foreground"/>
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