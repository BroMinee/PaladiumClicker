'use client';

import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { useEffect } from "react";
import { PlayerInfo } from "@/types";


export default function ProfileStore({ data, children }: { data: PlayerInfo, children: React.ReactNode }) {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  useEffect(() => {
    if (playerInfo === null)
      setPlayerInfo(data);
  }, []);

  return (
    <>
      {children}
    </>
  );
}