'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";
import { useCraftStore } from "@/stores/use-craft-store";
import Image from "next/image";
import { CraftPrice } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDDHHMMSS, parseMessageCraftPrice } from "@/lib/misc.ts";
import gsap from "gsap";
import { API_PALATRACKER_WS } from "@/lib/constants.ts";

type SortMode = "profit" | "margin" | "speed" | "score";

export function CraftOptimizerDisplay() {
  const { craftingList, setCraftingList } = useCraftStore();
  const [topCraft, setTopCraft] = useState<CraftPrice[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date("1970-01-01T00:00:00Z"));
  const cardRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`${API_PALATRACKER_WS}/v1/ws/craft-price`);

    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    socket.addEventListener('open', () => console.log('WebSocket ouvert'));
    socket.addEventListener('message', (event) => {
      const message = parseMessageCraftPrice(event.data);
      if (message.type !== "update")
        return;
      setCraftingList(message.data);
    });
    socket.addEventListener('close', (e) => console.log(`WebSocket fermé à ${new Date().toLocaleTimeString()}`, e));
    socket.addEventListener('error', (error) => console.error('WebSocket error:', error));

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  useEffect(() => {
    const craftingListFiltered = craftingList.filter(c => c.priceToCraft > 0 && c.totalSold > 0).filter(c => !(c.priceToCraft > c.currentPrice && c.priceToCraft > c.averagePrice));
    const minTotalSold = Math.min(...craftingListFiltered.filter(c => c.totalSold).map(c => c.totalSold));
    const maxTotalSold = Math.max(...craftingListFiltered.filter(c => c.totalSold).map(c => c.totalSold));
    const sortedList = [...craftingListFiltered]
      .sort((a, b) => getSortValue(b, sortMode, minTotalSold, maxTotalSold) - getSortValue(a, sortMode, minTotalSold, maxTotalSold));
    setTopCraft(sortedList.slice(0, 100));
    if (craftingList.length === 0)
      return;
    setLastUpdate(new Date(craftingList[0].created_at));
  }, [craftingList, sortMode]);

  useEffect(() => {
    // Animation des cartes lors de la mise à jour
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
          <div className="text-gray-400 text-sm">
            Dernière mise à jour : {getDDHHMMSS(lastUpdate)}
          </div>
          <Select defaultValue="score" onValueChange={(val) => setSortMode(val as SortMode)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Méthode de tri"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score combiné</SelectItem>
              <SelectItem value="profit">Profit brut</SelectItem>
              <SelectItem value="margin">Marge %</SelectItem>
              <SelectItem value="speed">Prob. vente rapide</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
          <ScrollArea className="flex flex-grow justify-start gap-2 h-fit">
            <div className="grid grid-cols-4 justify-start gap-2 items-stretch">
              {topCraft.map((item, i) => (
                <div key={`craft-${i}`} ref={el => cardRefs.current[i] = (el ?? undefined as any)}>
                  <CraftPriceCard data={item} index={i}/>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal"/>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function CraftPriceCard({ data, index }: { data: CraftPrice, index: number }) {
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
    <div
      className="bg-gray-900 rounded-2xl shadow-lg p-4 w-80 flex flex-col items-center text-white hover:scale-105 transition flex-1">
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
      <h2 className="text-lg font-semibold text-center">{data.item.us_trad}</h2>
      <h3 className="text-sm text-gray-400 text-center">{data.item.fr_trad}</h3>

      <div className="flex flex-wrap justify-center gap-1 mt-2">
        {getBadges().map((b, i) => (
          <span key={i} className={`text-xs text-white px-2 py-0.5 rounded-full ${b.color}`}>
            {b.label}
          </span>
        ))}
      </div>

      <div className="mt-2 text-sm text-gray-300 space-y-1 flex-grow">
        <p>Prix de craft : <span className="text-green-400">{formatNumber(priceToCraft)}</span></p>
        <p>Prix actuel : <span className="text-blue-400">{formatNumber(currentPrice)}</span></p>
        <p>Prix moyen : <span className="text-yellow-400">{formatNumber(averagePrice)}</span></p>
      </div>
    </div>
  );
}

function formatNumber(value: number): string {
  if (value <= 0) return "N/A";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function getSortValue(item: CraftPrice, mode: SortMode, minTotalSold: number, maxTotalSold: number): number {
  const { priceToCraft, currentPrice, averagePrice, totalSold } = item;
  if (priceToCraft <= 0 || currentPrice <= 0) return -Infinity;

  const profit = currentPrice - priceToCraft;
  const margin = profit / priceToCraft;

  const probaVenteTotalSold = (totalSold - minTotalSold) / (maxTotalSold - minTotalSold);
  const probaVentePrice = (currentPrice - priceToCraft) / currentPrice;
  const probaVenteAverage = (averagePrice - priceToCraft) / averagePrice;

  let speed = -Infinity;
  if (priceToCraft < currentPrice) {
    speed = 1 - (probaVenteTotalSold * (0.6 * probaVentePrice + 0.4 * probaVenteAverage));
  }

  const score = 0.3 * margin + 0.7 * speed;

  switch (mode) {
    case "profit":
      return profit;
    case "margin":
      return margin;
    case "speed":
      return speed;
    case "score":
      return score;
  }
}
