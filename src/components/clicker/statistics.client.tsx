"use client";
import { buyBuilding, computeRPS, computeXBuildingAhead, formatPrice, getPathImg, getTotalSpend } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useClickerStore } from "@/stores/use-clicker-store";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ImageCoin } from "@/components/shared/image-coin";
import { StatItem } from "./clicker-page";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { Button } from "@/components/ui/button-v2";
import { ShoppingCart, Calculator } from "lucide-react";
import { GroupedSpanContainer } from "../shared/group-span-container";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SearchPlayerInput } from "../home/search-player.client";

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Z" />
  </svg>
);

/**
 * Recommended purchase card component.
 */
export function BestBuyCard() {
  const { data: playerInfo } = usePlayerInfoStore();
  const { rps, setRPS, buildingBuyPaths, setBuildingBuyPaths } = useClickerStore();

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
  }, [playerInfo, rps, setBuildingBuyPaths]);
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-800 p-6 rounded-lg">
      <div className="flex items-center space-x-3 mb-3">
        <MdOutlineStarPurple500 className="w-8 h-8 text-yellow-300" />
        <h2 className="text-2xl font-bold ">Achat Recommandé</h2>
      </div>
      <div className="bg-black/60 p-4 rounded-lg flex items-center space-x-4">
        {buildingBuyPaths.length !== 0 ? <Image src={getPathImg(buildingBuyPaths[0].path, buildingBuyPaths[0].index)} height={48} width={48} className="object-cover pixelated text-indigo-300 text-4xl" alt="image" unoptimized /> : <LoadingSpinner />}
        <h3 className="text-xl text-indigo-300 font-semibold">{playerInfo && buildingBuyPaths.length !== 0 ? playerInfo[buildingBuyPaths[0].path][buildingBuyPaths[0].index].name : <LoadingSpinner />}</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm ">Coût</div>
          <div className='flex flex-row gap-2 items-center'>
            <div className="text-lg font-bold ">{buildingBuyPaths.length !== 0 ? formatPrice(buildingBuyPaths[0].price) : <LoadingSpinner />}</div>
            <ImageCoin />
          </div>
        </div>
        <div className={buildingBuyPaths.length !== 0 && buildingBuyPaths[0].timeToBuy !== "Maintenant" ? "" : "text-yellow-400"}>
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
  const { rps } = useClickerStore();
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
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { buildingBuyPaths } = useClickerStore();
  const handleBuyButton = () => buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths);

  return (<>
    <SearchPlayerInput variant={"clicker"} />
    <Button variant='secondary' className="flex-1 font-semibold py-2 px-4 rounded transition-colors" onClick={handleBuyButton}>
      Simuler l&apos;achat
    </Button>
  </>);
}

/**
 * Display multiple building best purchase list
 */
export function BatchPurchase() {
  const BATCH_PURCHASE_COUNT = 24;
  const [isOpen, setIsOpen] = useState(false);

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { buildingBuyPaths, setBuildingBuyPaths } = useClickerStore();
  const { rps } = useClickerStore();

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    if (rps !== 0 && isOpen && buildingBuyPaths.length !== BATCH_PURCHASE_COUNT) {
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, 24, rps));
    }
  }, [playerInfo, rps, setBuildingBuyPaths, buildingBuyPaths, isOpen]);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("fr-FR").format(amount) + " $";

  const handleSimulate = (count: number) => {
    buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths.slice(0, count));
  };

  const totalGlobalCost = buildingBuyPaths.reduce((acc, item) => acc + item.price, 0);

  return (
    <section className="w-full mb-6">
      <Card
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex flex-col md:flex-row justify-between items-center transition-all duration-200 group gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
            <Calculator size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Planificateur d&apos;Achats
            </h2>
            { buildingBuyPaths.length === BATCH_PURCHASE_COUNT &&
              <p className="text-sm text-muted-foreground">
                Coût total estimé : <span className="font-bold text-primary">{formatMoney(totalGlobalCost)}</span>
              </p>
            }
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Button
            variant='primary'
            onClick={(e) => {
              handleSimulate(buildingBuyPaths.length);
              e.stopPropagation();
            }}
            className="font-bold py-2 px-6 rounded shadow-md w-full md:w-auto"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Tout Simuler
          </Button>
          <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            <ChevronDown className="text-muted-foreground" />
          </div>

        </div>
      </Card>

      {isOpen && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {buildingBuyPaths.map((building, index) => {
              if (playerInfo === null) {
                return <LoadingSpinner key={index} />;
              }

              return (
                <GroupedSpanContainer group={playerInfo[building.path][building.index].name} className="gap-3" key={building.path + "-" + building.index + "-" + building.own}>
                  <Card
                    key={playerInfo[building.path][building.index].name + "-" + building.own}
                    className="rounded-xl overflow-hidden hover:border-primary/50 transition-colors w-full h-full"
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex flex-col items-center p-4 w-full gap-2">
                        <Image src={getPathImg(building.path, building.index)} height={48} width={48} className="object-cover text-indigo-400 pixelated" alt="image" unoptimized />
                        <h4 className="font-semibold text-center w-full">{playerInfo[building.path][building.index].name}</h4>
                      </div>

                      <div className="gap-3 flex items-center justify-around w-full">
                        <div className="flex flex-col items-center text-center">
                          <IconCalendar />
                          <span className="font-semibold">Heure d&apos;achat</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{building.timeToBuy}</p>
                      </div>

                      <div className="w-full h-px bg-border mt-2"></div>
                      <StatItem
                        icon={<ImageCoin />}
                        label="Prix"
                        value={`~${formatPrice(building.price)}`}
                      />
                      <StatItem
                        icon={<ImageCoin />}
                        label="Prod. Est."
                        value={formatPrice(building.newRps)}
                      />

                      <Button
                        variant='secondary'
                        size="sm"
                        onClick={() => handleSimulate(index + 1)}
                        className="font-semibold text-xs mt-1 h-8"
                      >
                        Simuler jusqu&apos;ici
                      </Button>

                    </div>
                  </Card>
                </GroupedSpanContainer>
              );
            })}
          </div>

          {/* Bouton de fermeture en bas de liste (Optionnel, pour l'UX sur mobile) */}
          <div
            onClick={() => setIsOpen(false)}
            className="flex justify-center mt-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronUp />
          </div>

        </div>
      )}
    </section>
  );
}