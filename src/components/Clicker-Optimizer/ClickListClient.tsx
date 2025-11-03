"use client";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";

import { checkCondition } from "@/lib/misc.ts";
import { Card } from "@/components/ui/card.tsx";
import { ReactNode } from "react";

/**
 * Wrapper component around the click IMG, used to buy/sell the CPS.
 * @param index - index of the CPS in the playerInfo.CPS list
 * @param children - the click IMG.
 */
export function ButtonCPS({ index, children }: { index: number, children: ReactNode }) {
  const { data: playerInfo, selectCPS } = usePlayerInfoStore();
  const cps = playerInfo?.CPS[index];

  if (!playerInfo) {
    return null;
  }

  const unlockable = checkCondition(playerInfo, playerInfo.CPS[index].condition, new Date()).unlockable;

  return (
    <Card
      id={`upgrade-click-${index}`}
      className={cn(
        buttonVariants({ variant: "card" }),
        "p-4 h-auto w-fit",
        cps?.own && "bg-primary text-primary-foreground",
        !cps?.own && "bg-yellow-500 text-primary-foreground",
        cps?.own && "hover:bg-primary-darker",
        !cps?.own && "hover:bg-yellow-600",
        !cps?.own && !unlockable && "bg-gray-500"
      )}
      onClick={() => selectCPS(index)}
    >
      {children}
    </Card>
  );
}