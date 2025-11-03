"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import AhItem from "@/components/Profil/AhItem.tsx";
import { OptionType } from "@/types";
import { adaptPlurial, formatPrice, safeJoinPaths } from "@/lib/misc.ts";
import { toast } from "sonner";
import { constants } from "@/lib/constants.ts";
import Image from "next/image";

export function AhInfoTitleClient() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah) {
    return null;
  }

  const totalCount = playerInfo.ah.totalCount;
  return <>
    <span className="text-primary">
      {totalCount}
    </span>
    {" "}{adaptPlurial("vente", totalCount) + " en cours"}

  </>;
}

export function AhInfoGetTotalBenefice() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah) {
    return null;
  }

  const totalCount = playerInfo.ah.data.reduce((acc, e) => e.item.name === "tile-luckydrawer" ? acc : acc + e.price * e.item.quantity, 0);
  return <span className="text-primary">
    {formatPrice(totalCount)}{" $"}
  </span>;
}

export function AhItemClient({ allItemsInfo }: { allItemsInfo: OptionType[] }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah) {
    return null;
  }

  const totalCount = playerInfo.ah.totalCount;
  if (totalCount !== playerInfo.ah.data.length) {
    console.error("The player's market data length and totalCount are different.");
    toast.error("Incohérence dans les valeurs données par l'API.");
  }
  if (totalCount === 0) {

    return (
      <>
        <Image src={safeJoinPaths(constants.imgPathError, "/arty_decu_right.webp")} alt="arty" width={128} height={92}/>
        <h3 className="font-semibold leading-none tracking-tight flex flex-row items-center">
          <p className={"text-[20px]"}>
            <span className="text-primary">
              {playerInfo.username}{" "}
            </span>
            ne vends rien pour l&apos;instant.
          </p></h3>
      </>);
  }

  return <>
    {
      playerInfo.ah.data.map((e, index) => {
        return <AhItem key={index} item={e} allItemsInfo={allItemsInfo} uuid_seller={playerInfo.uuid}/>;
      })
    }
  </>;
}
