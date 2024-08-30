'use client';
import { computePrice, formatPrice, scaleCurrentProduction } from "@/lib/misc.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { Input } from "@/components/ui/input.tsx";
import { ChangeEvent } from "react";

export function BuildingRPS({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return <>RPS: 0</>

  return <>
    RPS: {formatPrice(scaleCurrentProduction(playerInfo, index, Number(playerInfo.building[index].own)))}
  </>
}

export function BuildingPrice({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return <>0 $</>

  return <>{formatPrice(computePrice(Number(playerInfo.building[index].price), Number(playerInfo.building[index].own)))} $</>
}

export function BuildingLvl({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return <>0</>

  return <>Level: {playerInfo.building[index].own}</>
}

export function BuildingInput({ index }: { index: number }) {
  const { data: playerInfo, setBuildingOwn } = usePlayerInfoStore();

  function onChangeLevel(event: ChangeEvent<HTMLInputElement>) {
    if (!playerInfo)
      return;

    let value = Number(event.target.value);
    if (value) {
      value = Math.floor(value);
      setBuildingOwn(playerInfo.building[index].name, value);
    }
  }

  if (!playerInfo)
    return <Input
      type="number"
      min="0"
      step="1"
      max="99"
      defaultValue={0}
    />

  return <Input
    type="number"
    min="0"
    step="1"
    max="99"
    defaultValue={Number(playerInfo.building[index].own)}
    onChange={onChangeLevel}
  />
}