'use client'
import Link from "next/link";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";


export default function LinkClient({ path, label, requiredPseudo }: { path: string, label: string, requiredPseudo: boolean }) {

  const { data: playerInfo, reset } = usePlayerInfoStore();

  let link = undefined
  if (typeof window !== 'undefined')
    link = getLinkFromUrl(window.location.pathname);
  const href = requiredPseudo && playerInfo?.username ? safeJoinPaths("/", path, playerInfo.username) : path


  const isActive = link?.path === path;
  return <Link className={cn(isActive && "underline", "font-medium hover:underline")}
               href={href}>
    {label}
  </Link>
}