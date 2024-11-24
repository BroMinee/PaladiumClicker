'use client';
import { computePrice, formatPrice, scaleCurrentProduction } from "@/lib/misc.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React, { ChangeEvent } from "react";

export function BuildingRPS({ index }: { index: number }) {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo)
    return <>0</>

  return <>
    {formatPrice(Math.floor(scaleCurrentProduction(playerInfo, index, Number(playerInfo.building[index].own)) * 10) / 10)}
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
  const count = !playerInfo ? 0 : playerInfo.building[index].own;

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
    return <input
      className="text-white text-center rounded-sm font-mc font-bold text-sm flex items-center justify-center h-9 w-fit px-2"
      type="number"
      min="0"
      step="1"
      max="99"
      defaultValue={0}
    />

  return <input
    type="number"
    min="0"
    step="1"
    max="100"
    className="text-white text-center rounded-sm font-mc font-bold text-sm flex items-center justify-center h-9 w-fit px-2 bg-[#2b2a33] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
    onChange={onChangeLevel}
    placeholder={String(count)}
    value={count}/>
}