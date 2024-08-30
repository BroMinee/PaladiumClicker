'use client';
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import LoadingData from "@/components/LoadingData.tsx";

export default function ComponentThatNeedsData2() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (playerInfo === null) {
    return <LoadingData username={undefined}/>;
  }

  return <div>{JSON.stringify(playerInfo)}</div>;
}