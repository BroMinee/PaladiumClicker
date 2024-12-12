'use client';

import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import AhItem from "@/components/Profil/AhItem.tsx";
import { OptionType } from "@/types";

export function AhInfoTitleClient() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah)
    return null;

  const totalCount = playerInfo.ah.totalCount;
  return <>
    {totalCount}{" "}
    {totalCount !== 1 ? "ventes en cours" : "vente en cours"}
  </>
}

export function AhItemClient({ itemNameMatcher }: { itemNameMatcher: OptionType[] }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo || !playerInfo.ah)
    return null;

  const totalCount = playerInfo.ah.totalCount;
  if (totalCount === 0)
    return <div>Aucune vente en cours</div>;

  return <>
    {
      playerInfo["ah"]["data"].map((e, index) => {
        return <AhItem key={index} item={e} itemNameMatcher={itemNameMatcher}/>
      })
    }
  </>
}


