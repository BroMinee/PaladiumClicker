"use client";
import { computeRPS, computeXBuildingAhead, formatPrice, getPathImg, getTotalSpend } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useRpsStore } from "@/stores/use-rps-store";
import { bestPurchaseInfoDetailed } from "@/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ImageCoin } from "@/components/shared/ImageCoin";
import { StatItem } from "./clicker-page";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { Button } from "../ui/button-v2";

/**
 * Recommended purchase card component.
 */
export function BestBuyCard() {
  const { data: playerInfo } = usePlayerInfoStore();
  const [buildingBuyPaths, setBuildingBuyPaths] = useState([] as bestPurchaseInfoDetailed[]);

  const { rps, setRPS } = useRpsStore();

  useEffect(() => {
    if (playerInfo) {
      setRPS(computeRPS(playerInfo));
    }
  }, [playerInfo, setRPS]);
  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    if (rps !== 0) {
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, 1, rps));
    }
  }, [playerInfo, rps]);
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-800 p-6 rounded-lg shadow-2xl border border-indigo-500">
      <div className="flex items-center space-x-3 mb-3">
        <MdOutlineStarPurple500 className="w-8 h-8 text-yellow-300" />
        <h2 className="text-2xl font-bold text-white">Achat Recommandé</h2>
      </div>
      <div className="bg-black/60 p-4 rounded-lg flex items-center space-x-4">
        {buildingBuyPaths.length !== 0 ? <Image src={getPathImg(buildingBuyPaths[0].path, buildingBuyPaths[0].index)} height={48} width={48} className="object-cover pixelated text-indigo-300 text-4xl" alt="image" unoptimized /> : <LoadingSpinner />}
        <h3 className="text-xl text-indigo-300 font-semibold">{playerInfo && buildingBuyPaths.length !== 0 ? playerInfo[buildingBuyPaths[0].path][buildingBuyPaths[0].index].name : <LoadingSpinner />}</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-200">Coût</div>
          <div className='flex flex-row gap-2 items-center'>
            <div className="text-lg font-bold text-white">{buildingBuyPaths.length !== 0 ? formatPrice(buildingBuyPaths[0].price) : <LoadingSpinner />}</div>
            <ImageCoin />
          </div>
        </div>
        <div className={buildingBuyPaths.length !== 0 && buildingBuyPaths[0].timeToBuy !== "Maintenant" ? "text-white" : "text-yellow-400"}>
          <div className='text-sm'>Achetable {buildingBuyPaths.length !== 0 && buildingBuyPaths[0].timeToBuy !== "Maintenant" && "le"} </div>
          <div className="text-lg font-bold">{buildingBuyPaths.length !== 0 && buildingBuyPaths[0].timeToBuy}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Display the RPS statistic.
 */
export function StatRPS() {
  const { rps } = useRpsStore();
  return <StatItem
    icon={<ImageCoin />}
    label="Revenu par seconde"
    value={`~${formatPrice(rps)}`}
  />;
}

/**
 * Display the Sleeping Coin statistic.
 */
export function StatSleepingCoin() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <StatItem
      icon={<ImageCoin />}
      label="Coins dormants"
      value="Chargement..."
    />;
  }
  const totalSpend = getTotalSpend(playerInfo);
  const coinsDormants = Math.max(playerInfo.production - totalSpend, 0);

  return <StatItem
    icon={<ImageCoin />}
    label="Coins dormants"
    value={`~${formatPrice(coinsDormants)}`}
  />;
}

/**
 * Display the Total Production statistic.
 */
export function StatTotalProd() {
  const { data: playerInfo } = usePlayerInfoStore();

  return <StatItem
    icon={<ImageCoin />}
    label="Production totale"
    value={formatPrice(Math.round(playerInfo?.production ?? 0))}
  />;
}

/**
 * Display Update profil and Simulate purchase button
 */
export function StatButton() {
  const onClick = () => alert("todo");
  return (<>
    <Button variant="primary" className="text-white font-bold py-2 px-4 rounded" onClick={onClick}>
      Mettre à jour les données
    </Button>
    <Button variant='secondary' className="flex-1 text-white font-semibold py-2 px-4 rounded transition-colors" onClick={onClick}>
      Simuler l&apos;achat
    </Button>
  </>);
}
