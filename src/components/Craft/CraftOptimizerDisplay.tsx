'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useCraftStore } from "@/stores/use-craft-store";
import Image from "next/image";
import { CraftPrice, CraftSectionEnum } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, generateCraftUrl, getDDHHMMSS, parseMessageCraftPrice } from "@/lib/misc.ts";
import gsap from "gsap";
import { API_PALATRACKER_WS } from "@/lib/constants.ts";
import { toast } from "sonner";

type SortMode = "profit" | "margin" | "speed" | "score";
type CraftPriceWithComputed = CraftPrice & {
  profit: number,
  margin: number,
  totalSold: number,
  score: number,
}

export function CraftOptimizerDisplay() {
  const { craftingList, setCraftingList } = useCraftStore();
  const [topCraft, setTopCraft] = useState<Array<CraftPriceWithComputed>>([]);
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date("1970-01-01T00:00:00Z"));
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const cardRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`${API_PALATRACKER_WS}/v1/ws/craft-price`);

    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
      }
      if (socket.readyState === WebSocket.CLOSED) {
        setIsConnected(false);
        clearInterval(interval);
      }
    }, 30000);

    socket.addEventListener("open", () => {
      setIsConnected(true);
      console.log("WebSocket ouvert");
    });
    socket.addEventListener("message", (event) => {
      const message = parseMessageCraftPrice(event.data);
      if (message.type !== "update")
        return;
      setCraftingList(message.data);
    });
    socket.addEventListener("close", (e) => {
      setIsConnected(false);
      console.log(`WebSocket fermé à ${new Date().toLocaleTimeString()}`, e)
    });
    socket.addEventListener("error", (error) => console.error("WebSocket error:", error));

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, [setCraftingList]);

  useEffect(() => {
    const craftingListFiltered = craftingList.filter(c => c.priceToCraft > 0 && c.totalSold > 0 && c.item.item_name !== 'tile-empty-mob-spawner');//.filter(c => !(c.priceToCraft > c.currentPrice && c.priceToCraft > c.averagePrice));

    // const craftingListFiltered = craftingList.filter(c => c.priceToCraft > 0 && c.totalSold > 0).filter(c => !(c.priceToCraft > c.currentPrice && c.priceToCraft > c.averagePrice));
    const sortedList = craftingListFiltered.map(e => computeSortValue(e))
      .sort((a, b) => getSortValue(b, sortMode) - getSortValue(a, sortMode));
    setTopCraft(sortedList.slice(0, 100));
    if (craftingList.length === 0)
      return;
    setLastUpdate(new Date(craftingList[0].created_at));
  }, [craftingList, sortMode]);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.5, delay: index * 0.1 }
      );
    });
  }, [topCraft]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-b-xl rounded-t-none">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle>Voici la liste des items les plus rentables</CardTitle>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span
              className={`w-3 h-3 min-w-3 min-h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              title={isConnected ? "Actualisation automatique" : "N'actualise plus automatiquement"}
            />
            <span>Dernière mise à jour : {getDDHHMMSS(lastUpdate)}</span>
          </div>
          <Select defaultValue="score" onValueChange={(val) => setSortMode(val as SortMode)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Méthode de tri"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score" title="ratio = profit × totalSold">Profit brut pondéré par le volume de ventes</SelectItem>
              <SelectItem value="profit" title="ratio = currentPrice - priceToCraft">Profit brut</SelectItem>
              <SelectItem value="margin" title="ratio = (currentPrice - priceToCraft) / priceToCraft">Marge
                %</SelectItem>
              <SelectItem value="speed" title="ratio = totalSold">Nombre de vente</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch justify-between">
            {topCraft.map((item, i) => (
              <CraftPriceCard key={`craft-${i}`} data={item} index={i} cardRefs={cardRefs} sortMode={sortMode}/>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CraftPriceCard({ data, index, cardRefs, sortMode }: {
  data: CraftPriceWithComputed,
  index: number,
  cardRefs: MutableRefObject<HTMLElement[]>,
  sortMode: SortMode
}) {
  const { priceToCraft, currentPrice, averagePrice, totalSold } = data;

  const getBadges = () => {
    const badges = [];
    if (priceToCraft === -1) badges.push({ label: "Non craftable", color: "bg-red-700" }); // this should not happen (filter)
    if (currentPrice === -1) badges.push({ label: "Pas de vente en cours", color: "bg-green-500" }); // this should not happen (filter)
    if (averagePrice === -1) badges.push({ label: "Prix inconnu", color: "bg-yellow-500" });
    if (priceToCraft > averagePrice) badges.push({ label: "Prix de craft supérieur au prix moyen", color: "bg-orange-500" });
    if (priceToCraft > currentPrice) badges.push({ label: "Prix de craft supérieur au prix actuel", color: "bg-orange-500" });
    if (totalSold <= 0) badges.push({ label: "Jamais vendu", color: "bg-red-700" });
    else if (totalSold < 10) badges.push({
      label: `Très rarement vendu: ${totalSold} ventes en 7 jours`,
      color: "bg-red-600"
    });
    else if (totalSold < 30) badges.push({
      label: `Rarement vendu: ${totalSold} ventes en 7 jours`,
      color: "bg-yellow-500"
    });
    else if (totalSold < 100) badges.push({
      label: `Demande normale: ${totalSold} ventes en 7 jours`,
      color: "bg-blue-600"
    });
    else badges.push({
        label: `Très demandé ${totalSold} ventes en 7 jours`,
        color: "bg-green-600"
      });
    return badges;
  };

  return (
    <a
      className="text-card-foreground dark:bg-gray-800 duration-300 dark:hover:bg-gray-700 bg-gray-200 hover:bg-gray-300 rounded-2xl shadow-lg p-4 flex flex-col items-center text-white  transition flex-1"
      ref={el => cardRefs.current[index] = (el ?? undefined as any)}
      href={generateCraftUrl(data.item.item_name, 1, CraftSectionEnum.recipe)}
    >
      <div className="relative">
        <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
          #{index + 1}
        </span>
      </div>

      <Image
        src={`/AH_img/${data.item.img}`}
        alt={data.item.item_name}
        className="h-12 w-12 pixelated m-2 rounded-sm hover:scale-125 duration-300"
        width={64}
        height={64}
        unoptimized={true}
      />
      <h2 className="text-lg font-semibold text-card-foreground text-center">{data.item.us_trad}</h2>
      <h3 className="text-sm text-card-foreground/60 text-center">{data.item.fr_trad}</h3>

      <div className="flex flex-wrap justify-center gap-1 mt-2">
        {getBadges().map((b, i) => (
          <span key={i} className={`text-xs text-center text-white px-2 py-0.5 rounded-full ${b.color}`}>
            {b.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col mt-2 text-sm text-card-foreground space-y-1 items-center justify-center">
        <p>Prix de craft : <span className="text-green-400">{formatPrice(Math.max(0, priceToCraft))} $</span></p>
        <p>Prix actuel : <span className="text-blue-400">{formatPrice(Math.max(0, currentPrice))} $</span></p>
        <p>Prix moyen : <span className="text-yellow-400">{formatPrice(Math.max(0, averagePrice))} $</span></p>
        {sortMode === "profit" &&
          <p>Profit : <span className="text-green-400">{formatPrice(getSortValue(data, sortMode))} $</span></p>}
        {sortMode === "margin" &&
          <p>Marge : <span className="text-green-400">{formatPrice(Math.round(getSortValue(data, sortMode)*100))} %</span></p>}
      </div>
    </a>
  );
}


function computeSortValue(item: CraftPrice): CraftPriceWithComputed {
  const { priceToCraft, currentPrice, averagePrice, totalSold } = item;
  if (priceToCraft <= 0 || currentPrice <= 0) {
    return {
      ...item,
      profit: -Infinity,
      margin: -Infinity,
      totalSold: -Infinity,
      score: -Infinity,
    }
  }

  const profit = currentPrice - priceToCraft;
  const margin = profit / priceToCraft;
  const  score = profit * totalSold;

  return {
    ...item,
    profit,
    margin,
    totalSold,
    score,
  };
}

function getSortValue(item: CraftPriceWithComputed, mode: SortMode): number {
  switch (mode) {
    case "profit":
      return item.profit;
    case "margin":
      return item.margin;
    case "speed":
      return item.totalSold;
    case "score":
      return item.score;
    default:
      toast.error("Unknown sort mode: " + mode);
      return item.score;
  }
}
