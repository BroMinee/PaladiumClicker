'use client';
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { checkCondition } from "@/lib/misc.ts";
import { BuildingUpgrade, CategoryUpgrade, GlobalUpgrade, TerrainUpgrade, UpgradeKey } from "@/types";
import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import React from "react";
import { Card } from "@/components/ui/card.tsx";

// export function PreconditionDisplay({ index, upgradeType }: { index: number, upgradeType: UpgradeKey }) {
//   const { data: playerInfo } = usePlayerInfoStore();
//
//   if (!playerInfo) {
//     return null;
//   }
//
//   const {
//     unlockable,
//     coinsCondition,
//     totalCoins,
//     dayCondition,
//     daySinceStart,
//     buildingIndex,
//     buildingNeed,
//     buildingCount
//   } = checkCondition(playerInfo, playerInfo[upgradeType][index].condition, new Date());
//
//   const texts = [];
//   if (!unlockable) {
//     texts.push("Précondition non remplie :");
//     if (dayCondition !== -1 && daySinceStart < dayCondition)
//       texts.push(`${formatPrice(dayCondition)} days`);
//     if (coinsCondition !== -1 && totalCoins < coinsCondition)
//       texts.push(`${formatPrice(coinsCondition)} coins`);
//     if (buildingIndex !== -1 && buildingCount < buildingNeed)
//       texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
//     if (texts.length !== 2)
//       texts[0] = "Préconditions non remplies :";
//   }
//
//   if (!unlockable) {
//     return (
//       // <Popover>
//       //   <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
//       //     <Button variant="outline" size="icon">
//       //       <FaInfoCircle className="inline-block h-4 w-4"/>
//       //     </Button>
//       //   </PopoverTrigger>
//       //   <PopoverContent className="w-80">
//       <div>
//         {texts.map((text, index) => (
//           <p key={index}>{text}</p>
//         ))}
//       </div>
//
//       // </PopoverContent>
//
//       // </Popover>
//     );
//   }
//   return null;
// }

export function ButtonUpgrade({ index, upgradeType, children }: {
  index: number,
  upgradeType: UpgradeKey,
  children: React.ReactNode
}) {
  const { data: playerInfo, toggleUpgradeOwn } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  let upgrade: BuildingUpgrade | CategoryUpgrade | GlobalUpgrade | TerrainUpgrade | {
    own: false;
    name: string
  } = playerInfo ? playerInfo[upgradeType][index] : { own: false, name: "uninitialized" };

  const unlockable = checkCondition(playerInfo, playerInfo[upgradeType][index].condition, new Date()).unlockable;

  return (
    <Card
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