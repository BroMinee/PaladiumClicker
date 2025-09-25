'use client';
import Image from "next/image";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { cn } from "@/lib/utils.ts";

export default function FullSkin({ className = "" }) {

  const { data: playerInfo } = usePlayerInfoStore();

  if (playerInfo === null) {
    return null;
  }
  const urlImg = `https://crafatar.com/renders/body/${playerInfo.uuid}?size=4&default=MHF_Steve&overlay`;

  return <Image src={urlImg} className={cn("w-fit object-contain pixelated rounded-md", className)}
    alt={`Skin de ${playerInfo.username}`} width={128} height={128}
    unoptimized={true}
  />;
}