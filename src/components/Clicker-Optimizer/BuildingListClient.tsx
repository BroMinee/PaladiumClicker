'use client';
import { computePrice, formatPrice, scaleCurrentProduction } from "@/lib/misc.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input.tsx";

export function BuildingRPS({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return <>Prod: 0</>

  return <>
    Prod: {formatPrice(Math.floor(scaleCurrentProduction(playerInfo, index, Number(playerInfo.building[index].own)) * 10) / 10)}
  </>
}

export function BuildingPrice({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();

  const price = !playerInfo ? 0 : formatPrice(computePrice(Number(playerInfo.building[index].price), Number(playerInfo.building[index].own)));

  return <div
    className="text-primary font-bold text-center text-nowrap mx-2">{price} $
  </div>
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
    if (!isNaN(value)) {
      value = Math.floor(value);
      setBuildingOwn(playerInfo.building[index].name, value);
    }
  }

  if (!playerInfo)
    return <Input
      className="mx-2"
      type="number"
      min="0"
      step="1"
      max="99"
      defaultValue={0}
    />

  return <Input
    className="mx-2 w-fit"
    type="number"
    min="0"
    step="1"
    max="99"
    placeholder={String(playerInfo.building[index].own)}
    onChange={onChangeLevel}
    value={playerInfo.building[index].own}
  />
}