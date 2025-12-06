"use client";
import React, { useEffect, useState } from "react";
import { AdminShopItem, AdminShopPeriod, AxisConfig, Dataset } from "@/types";
import { ChartContainer } from "@/components/shared/graph.client";
import { LineGrad } from "@/components/shared/graph-line-renderer.client";
import { Button } from "@/components/ui/button-v2";
import { cn } from "@/lib/utils";
import { GroupedSpanContainer } from "@/components/shared/group-span-container";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { adminShopItemToUserFriendlyText, getImagePathFromAdminShopType } from "@/lib/misc";
import { constants } from "@/lib/constants";
import { getAdminShopHistoryServerAction } from "@/lib/api/apiServerAction";

const timeRanges: { key: AdminShopPeriod, label: string }[] = [
  { key: "day", label: "24 heures" },
  { key: "week", label: "1 semaine" },
  { key: "month", label: "1 mois" },
  { key: "season", label: "1 saison" },
];

/**
 * [Admin-shop page](http://palatracker.bromine.fr/admin-shop)
 */
export default function AdminShopHistoryPage() {
  const [currentItem, setCurrentItem] = useState<AdminShopItem>(constants.adminShopItemsAvailable[0]);
  const [currentTimeRange, setCurrentTimeRange] = useState<AdminShopPeriod>("season");
  const axes: AxisConfig[] = [
    { id: "x-axis", position: "bottom", type: "date" },
    { id: "y-axis", position: "left", type: "number" },
  ];

  const [datasets, setDatasets] = useState<Dataset<Date, number>[]>([]);

  useEffect(() => {
    getAdminShopHistoryServerAction(currentItem, currentTimeRange).then(res => {
      setDatasets([{
        id: currentItem,
        name: currentItem,
        color: "#ff5e00ff",
        visibility: true,
        stats: res.map((e) => {
          return {
            x: new Date(e.date),
            y: e.sellPrice,
          };
        }),
        yAxisId: "y-axis"
      }]);

    });
  }, [currentItem, currentTimeRange]);

  return (
    <>

      <h1 className="text-4xl font-bold mb-4">
        Historique de l&apos;Admin-Shop
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Choisir un item
        </label>
        <div className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-16 gap-6">
          {constants.adminShopItemsAvailable.map((value: AdminShopItem) => (
            <GroupedSpanContainer group={adminShopItemToUserFriendlyText(value)} className="w-16 h-16 p-1" key={value + "-groupSpanContainer"}>
              <Button
                variant="primary"
                key={value + "-button"}
                onClick={() => setCurrentItem(value)}
                className={cn("w-full h-full p-2 text-sm font-semibold rounded transition-colors",
                  currentItem === value
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-[#282a2c]")}
              >
                <UnOptimizedImage src={getImagePathFromAdminShopType(value)} alt={value} width={0} height={0} className="w-full h-full pixelated"/>
              </Button>
            </GroupedSpanContainer>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Plage de temps
        </label>
        <div className="flex flex-wrap gap-2 rounded-lg bg-gray-900 p-2 max-w-md">
          {timeRanges.map(range => (
            <Button
              key={range.key}
              onClick={() => setCurrentTimeRange(range.key)}
              variant="primary" className={cn("text-white font-bold py-2 px-4 rounded transition-colors", currentTimeRange === range.key ? "bg-primary text-white" : "bg-gray-700")}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-xl relative">
        <h2 className="text-2xl font-semibold mb-4">
          Prix de vente de: <span className="text-primary">{adminShopItemToUserFriendlyText(currentItem)}</span>
        </h2>
        <div className="w-full h-[500px]">
          <ChartContainer
            data={datasets}
            axisConfigs={axes}
            renderContent={(props) => <LineGrad {...props} />}
          />
        </div>
      </div>

    </>
  );
}