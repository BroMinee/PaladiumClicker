"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useCraftOptimizerStore } from "@/stores/use-craft-store";
import { CraftPrice, CraftSectionEnum } from "@/types";
import { formatPrice, generateCraftUrl, parseMessageCraftPrice, textFormatting } from "@/lib/misc";
import { API_PALATRACKER_WS } from "@/lib/constants";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { Card } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";

type SortMode = "profit" | "margin" | "speed" | "score";

type CraftPriceWithComputed = CraftPrice & {
  profit: number;
  margin: number;
  totalSold: number;
  score: number;
  rank: number;
};

const Badge = ({ text, color }: { text: string; color: string }) => {
  return (
    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full text-white ${color}`}>
      {text}
    </span>
  );
};

function computeSortValue(item: CraftPrice): Omit<CraftPriceWithComputed, "rank"> {
  const { priceToCraft, averagePrice, totalSold } = item;
  let { currentPrice } = item;
  currentPrice = currentPrice <= 0 ? averagePrice : currentPrice;
  
  if (priceToCraft <= 0) {
    return {
      ...item,
      profit: -Infinity,
      margin: -Infinity,
      totalSold: -Infinity,
      score: -Infinity,
    };
  }

  const profit = currentPrice - priceToCraft;
  const margin = profit / priceToCraft;
  const score = profit * totalSold;

  return {
    ...item,
    profit,
    margin,
    totalSold,
    score,
  };
}

function getSortValue(item: Omit<CraftPriceWithComputed, "rank">, mode: SortMode): number {
  switch (mode) {
    case "profit": return item.profit;
    case "margin": return item.margin;
    case "speed": return item.totalSold;
    case "score": return item.score;
    default: return item.score;
  }
}

const CraftCard = ({ data, sortMode }: { data: CraftPriceWithComputed; sortMode: SortMode }) => {
  const { priceToCraft, currentPrice, averagePrice, totalSold, rank } = data;

  const getBadges = () => {
    const badges = [];
    if (priceToCraft === -1) badges.push({ label: "Non craftable", color: "bg-destructive" });
    if (currentPrice === -1) badges.push({ label: "Pas de vente", color: "bg-destructive" });
    if (averagePrice === -1) badges.push({ label: "Prix inconnu", color: "bg-yellow-500" });
    
    if (priceToCraft > 0 && averagePrice > 0 && priceToCraft > averagePrice) {
      badges.push({ label: "Craft > Moyen", color: "bg-primary" });
    }
    if (priceToCraft > 0 && currentPrice > 0 && priceToCraft > currentPrice) {
      badges.push({ label: "Craft > Actuel", color: "bg-primary" });
    }

    if (totalSold <= 0) {
      badges.push({ label: "Jamais vendu", color: "bg-destructive" });
    } else if (totalSold < 10) {
      badges.push({ label: `${totalSold} ventes / 7j`, color: "bg-destructive" });
    } else if (totalSold < 30) {
      badges.push({ label: `${totalSold} ventes / 7j`, color: "bg-yellow-500" });
    } else if (totalSold < 100) {
      badges.push({ label: `${totalSold} ventes / 7j`, color: "bg-blue-600" });
    } else {
      badges.push({ label: `${totalSold} ventes / 7j`, color: "bg-emerald-600" });
    }
    return badges;
  };

  return (
    <Link
      href={generateCraftUrl(data.item.item_name, 1, CraftSectionEnum.recipe)}
      className="group h-full block"
    >
      <Card className="relative h-full overflow-hidden border border-border bg-card text-card-foreground transition-all duration-300 hover:scale-105 hover:border-primary flex flex-col">
        <div className="absolute top-3 left-3 z-10">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-border text-xs font-bold text-primary">
            #{rank}
          </span>
        </div>

        <div className="flex flex-col items-center p-6 pb-2 gap-4">
          <div className="relative h-16 w-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute inset-0 bg-primary/60 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <UnOptimizedImage
              src={`/AH_img/${data.item.img}`}
              alt={data.item.item_name}
              width={64}
              height={64}
              className="object-contain pixelated relative z-10"
            />
          </div>

          <div className="text-center space-y-1 w-full">
            <h3 className="font-bold text-lg leading-tight truncate px-2 text-foreground group-hover:text-primary transition-colors">
              {data.item.us_trad}
            </h3>
            <p className="text-xs text-secondary-foreground font-medium truncate px-4">
              {data.item.fr_trad}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 w-full">
            {getBadges().map((b, i) => (
              <Badge key={i} text={b.label} color={b.color} />
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 bg-secondary/50 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-secondary-foreground">Craft</span>
            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${priceToCraft <= 0 ? "text-destructive" : "text-emerald-600 bg-emerald-600/10"}`}>
              {priceToCraft <= 0 ? "N/A" : `${formatPrice(priceToCraft)} $`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-foreground">Actuel</span>
            <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${currentPrice <= 0 ? "text-secondary-foreground" : "text-blue-600 bg-blue-600/10"}`}>
              {currentPrice <= 0 ? "-" : `${formatPrice(currentPrice)} $`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-foreground">Moyen</span>
            <span className="font-mono font-bold text-yellow-600 bg-yellow-600/10 px-1.5 py-0.5 rounded">
              {averagePrice <= 0 ? "-" : `${formatPrice(averagePrice)} $`}
            </span>
          </div>

          {sortMode === "profit" && (
             <div className="flex justify-between items-center pt-2 border-t border-border">
               <span className="text-primary font-semibold">Profit</span>
               <span className="font-mono font-bold text-primary">{formatPrice(getSortValue(data, sortMode))} $</span>
             </div>
          )}
          {sortMode === "margin" && (
             <div className="flex justify-between items-center pt-2 border-t border-border">
               <span className="text-primary font-semibold">Marge</span>
               <span className="font-mono font-bold text-primary">{formatPrice(Math.round(getSortValue(data, sortMode)*100))} %</span>
             </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default function CraftOptimizerDisplay() {
  const { craftingList, setCraftingList } = useCraftOptimizerStore();
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [search, setSearch] = useState("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    });
    
    socket.addEventListener("message", (event) => {
      const message = parseMessageCraftPrice(event.data);
      if (message.type === "update") {
        setCraftingList(message.data);
      }
    });

    socket.addEventListener("close", () => setIsConnected(false));
    socket.addEventListener("error", (error) => console.error("WebSocket error:", error));

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, [setCraftingList]);

  useEffect(() => {
    if (craftingList.length > 0) {
      const firstItem = craftingList[0] as any; 
      if (firstItem.created_at) {
        setLastUpdate(new Date(firstItem.created_at));
      } else {
        setLastUpdate(new Date());
      }
    }
  }, [craftingList]);

  const sortedItemsWithRank = useMemo(() => {
    return craftingList
      .filter(c => c.priceToCraft > 0 && c.totalSold > 0 && c.item.item_name !== "tile-empty-mob-spawner")
      .map(e => computeSortValue(e))
      .sort((a, b) => getSortValue(b, sortMode) - getSortValue(a, sortMode))
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }, [craftingList, sortMode]);

  const filteredItems = useMemo(() => {
    return sortedItemsWithRank.filter(item => 
      search === "" || 
      item.item.us_trad.toLowerCase().includes(search.toLowerCase()) || 
      item.item.fr_trad.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedItemsWithRank, search]);

  useEffect(() => {
    if (containerRef.current && filteredItems.length > 0) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [sortMode, search]); 

  return (
      <>
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Optimiseur de °Craft°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Analysez la rentabilité en temps semi-réel. Données mises à jour régulièrement.
        </PageHeaderDescription>
      </PageHeader>


        <div className="sticky top-20 z-40 mb-8 -mx-4 px-4 md:mx-0 md:px-0">
          <Card className="mx-auto max-w-4xl p-2 backdrop-blur-xl border-border bg-card/80 flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un item..."
                className="w-full rounded-xl bg-background border py-3 pl-10 pr-4 text-sm text-foreground placeholder-secondary-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-[240px]">
              <select 
                className="w-full h-full rounded-xl bg-background border py-3 pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:bg-secondary transition-colors"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="score">Profit pondéré (Score)</option>
                <option value="profit">Profit brut ($)</option>
                <option value="margin">Marge (%)</option>
                <option value="speed">Volume de ventes</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-emerald-400" : "bg-destructive"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-destructive"}`}></span>
              </span>
              <span className="text-secondary-foreground font-medium">
                  {isConnected ? "Flux en direct" : "Déconnecté"}
              </span>
            </div>
            
            <span className="hidden md:inline text-border">|</span>
            
            <span className="text-secondary-foreground">
                Dernière mise à jour : <span className="text-foreground font-mono font-medium">{lastUpdate ? (lastUpdate.toLocaleString()) : "En attente..."}</span>
            </span>
          </div>

          <span className="text-xs text-secondary-foreground font-mono self-end md:self-auto">
             {filteredItems.length} items trouvés
          </span>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <CraftCard key={`${item.item.item_name}-${item.rank}`} data={item} sortMode={sortMode} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-secondary-foreground">
            <p className="text-lg font-medium">Aucun item ne correspond à la recherche.</p>
          </div>
        )}
      </>
  );
}