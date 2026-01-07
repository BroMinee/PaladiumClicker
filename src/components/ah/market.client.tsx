"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Dataset, AxisConfig, OptionType } from "@/types";
import { ChartContainer } from "@/components/shared/graph.client";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { SearchBar } from "@/components/craft1/craft-recipe.client";
import { useItemsStore } from "@/stores/use-items-store";
import { useMarketStore } from "@/stores/use-market-store";
import { Card } from "@/components/ui/card";
import { MarketOfferCard } from "../shared/market-sell-cart.client";
import { RenderPressure, RenderPriceVolume } from "../shared/graph-line-renderer.client";
import { GiStoneCrafting } from "react-icons/gi";
import { safeJoinPaths, textFormatting } from "@/lib/misc";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "../ui/page";

const PLACEHOLDER_ITEM: OptionType = {
  value: "placeholder",
  label: "",
  label2: "Aperçu du marché",
  img: "unknown.webp"
};

/**
 * Market page showing item sales history and listings, using graphs to visualize data and pagination for listings.
 */
export default function MarketPage() {
  const { allItems, selectedItem, setSelectedItem } = useItemsStore();
  const { currentListings, marketHistory } = useMarketStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6 * 2; // 6 columns, 2 rows

  const axisConfigs: AxisConfig[] = useMemo(() => [
    { id: "x-axis", position: "bottom", type: "date", color: "#9ca3af" },
    { id: "left", position: "left", type: "number", label: "Prix", color: "#22c55e" }, // : '#6b7280'
    { id: "right", position: "right", type: "number", label: "Ventes", color: "#60a5fa" },
  ], []);

  const axisPressureConfigs: AxisConfig[] = useMemo(() => [
    { id: "x-axis", position: "bottom", type: "date", color: "#9ca3af" },
    { id: "left", position: "left", type: "number", color: "#a855f7" },
  ], []);

  const displayItem = selectedItem ?? PLACEHOLDER_ITEM;
  const displayListings = useMemo(
    () => (selectedItem ? currentListings : []),
    [selectedItem, currentListings]
  );

  const handleSelectItem = async (item: OptionType) => {
    setSelectedItem(item);
    setSearchQuery("");
    setIsDialogOpen(false);
    setCurrentPage(1);
  };

  const { priceVolumeDatasets, pressureDatasets } = useMemo(() => {
    const priceDs: Dataset<Date, number> = {
      id: "price", name: "Prix ($)", color: axisConfigs.find(e => e.id === "left")!.color!, visibility: true, yAxisId: "left",
      stats: marketHistory.map(d => ({ x: new Date(d.date), y: d.price / d.sells }))
    };
    const volumeDs: Dataset<Date, number> = {
      id: "volume", name: "Ventes", color: "#3b82f6", visibility: true, yAxisId: "right",
      stats: marketHistory.map(d => ({ x: new Date(d.date), y: d.quantity }))
    };
    const pressureDs: Dataset<Date, number> = {
      id: "pressure", name: "Pression", color: axisPressureConfigs.find(e => e.id === "left")!.color!, visibility: true, yAxisId: "left",
      stats: marketHistory.map(d => ({ x: new Date(d.date), y: d.price / d.sells * d.quantity / 10000 })) // TODO relal pressure
    };

    return {
      priceVolumeDatasets: [priceDs, volumeDs],
      pressureDatasets: [pressureDs],
    };
  }, [marketHistory, axisConfigs, axisPressureConfigs]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return allItems;
    }
    return allItems.filter(i =>
      i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.label2.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  const currentStats = useMemo(() => {
    if (!marketHistory.length) {
      return null;
    }
    const last = marketHistory[marketHistory.length - 1];

    let trend = { percent: 0, isUp: true };
    if (marketHistory.length >= 8) {
      const weekAgo = marketHistory[marketHistory.length - 8];
      const diff = (last.price / last.sells) - (weekAgo.price / weekAgo.sells);
      trend = {
        percent: Math.abs(parseFloat(((diff / weekAgo.price) * 100).toFixed(1))),
        isUp: diff >= 0
      };
    }
    return { price: last.price / last.sells, volume: last.quantity, trend };
  }, [marketHistory]);

  const paginatedListings = useMemo(() => {
    const sorted = [...displayListings].sort((a, b) => a.price - b.price);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [displayListings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(displayListings.length / itemsPerPage);

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting(`Historique de vente au market ${selectedItem ? ` de °${selectedItem.label}°` : ""}`)}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Consultez l'historique des prix et des ventes, ainsi que les offres en cours pour n'importe quel objet."}
        </PageHeaderDescription>
      </PageHeader>

      <h1 className="text-4xl font-bold mb-4">
        
      </h1>
      <Card>
        <>
          <section className={"grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"}>
            <div className="lg:col-span-1 bg-background/50 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 h-full relative">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div
                    className="w-32 h-32 bg-card/50 rounded-full flex items-center justify-center border-2 border-secondary mb-2 relative overflow-hidden group shadow-lg shadow-orange-900/10 cursor-pointer hover:border-orange-500 transition-colors"
                    title={"Changer d'objet"}
                  >
                    <UnOptimizedImage
                      src={safeJoinPaths("AH_img", displayItem.img)}
                      alt={displayItem.label}
                      className={"w-20 h-20 pixelated transform group-hover:scale-110 transition-transform duration-300"}
                      width={0} height={0}
                    />
                    <div className={`absolute inset-0 bg-black/40 ${"opacity-0 group-hover:opacity-100"} flex items-center justify-center transition-opacity`}>
                      <Search size={24} className="" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-background border-gray-800 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Rechercher un objet</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <SearchBar
                      searchTerm={searchQuery}
                      setSearchTerm={setSearchQuery}
                      isSearchFocused={true}
                      setIsSearchFocused={() => { }}
                      filteredItems={filteredItems}
                      onSelectItem={handleSelectItem}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <h2 className="text-2xl font-bold text-center">
                {displayItem.label}
              </h2>
              <span className="text-xs text-gray-500 bg-card px-2 py-1 rounded">{displayItem.label2}</span>

              {currentStats && (
                <div className="w-full grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-card/60 p-3 rounded-lg border border-secondary text-center flex flex-col justify-between">
                    <span className="text-[10px] text-card-foreground uppercase tracking-wide">Prix Actuel</span>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1 my-1 ${"text-green-400"}`}>
                      {currentStats.price.toFixed(1)} <DollarSign size={14} />
                    </div>

                    <div className={`flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${currentStats.trend.isUp ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                      {currentStats.trend.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span>{currentStats.trend.percent}% (7j)</span>
                    </div>

                  </div>

                  <div className="bg-card/60 p-3 rounded-lg border border-secondary text-center flex flex-col justify-center">
                    <span className="text-[10px] text-card-foreground uppercase tracking-wide">Ventes du jour</span>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1 mt-1 ${"text-blue-400"}`}>
                      {currentStats.volume} <Package size={14} />
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1">Vol. Total</span>
                  </div>
                </div>
              )}

              <Link
                href={`/craft1?item=${displayItem.value}`}
                className={"w-full mt-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary-darker py-2.5 rounded-lg font-semibold transition-all shadow-md shadow-indigo-900/20 active:scale-95 group/btn"}
              >
                <GiStoneCrafting size={24} className="group-hover/btn:rotate-12 transition-transform"/>
                Voir le Craft
              </Link>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-background/50 border border-gray-800 rounded-xl p-4 relative overflow-hidden">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className={"text-orange-500"} />
                  Historique Prix & Ventes
                </h3>
                <div className="h-[220px] w-full">
                  <ChartContainer
                    data={priceVolumeDatasets}
                    axisConfigs={axisConfigs}
                    renderContent={RenderPriceVolume}
                    margin={{ top: 10, right: 60, bottom: 20, left: 60 }}
                  />
                </div>
              </div>
              <div className="bg-background/50 border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp size={16} className={"text-purple-500"} />
                    Indice de Pression (Prix x Ventes)
                  </h3>
                </div>
                <div className="h-[120px] w-full">
                  <ChartContainer
                    data={pressureDatasets}
                    axisConfigs={axisPressureConfigs}
                    renderContent={RenderPressure}
                    margin={{ top: 10, right: 10, bottom: 20, left: 60 }}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-800 my-8"></div>

          <section id="listings" className={"animate-in fade-in slide-in-from-bottom-8 duration-700"}>
            <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Offres en cours
                </h3>
                <p className="text-sm text-card-foreground mt-1 flex items-center gap-2">
                  {(
                    <>Trié du moins cher au plus cher</>
                  )}
                </p>
              </div>
              <div className='flex gap-2'>
                <span className="text-sm text-card-foreground bg-background px-3 py-1 rounded border">
                  {currentListings.reduce((acc,e) => acc + e.quantity, 0)} en vente
                </span>
                <span className="text-sm text-card-foreground bg-background px-3 py-1 rounded border">
                  {displayListings.length} offres
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 min-h-[300px]">
              {paginatedListings.map((listing, index) => (
                <MarketOfferCard
                  key={listing.name + "-" + index}
                  offer={listing}
                  itemName={selectedItem?.value ?? ""}
                />
              ))}
            </div>

            {currentListings.length > itemsPerPage && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-card border border-secondary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium text-card-foreground">
                  Page <span className="">{currentPage}</span> sur <span className="">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-card border border-secondary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </section>
        </>
      </Card>
    </>
  );
}