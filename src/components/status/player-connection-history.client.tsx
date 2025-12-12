"use client";

import { AdminShopPeriod, AxisConfig, DataPoint, Dataset } from "@/types";
import { LineGrad } from "../shared/graph-line-renderer.client";
import { ChartContainer } from "../shared/graph.client";
import { TimeSelection } from "../shared/time-selection.client";
import { Card } from "@/components/ui/card";
import { getStatusPaladiumAction, getStatusPaladiumBedrockAction } from "@/lib/api/apiServerAction";
import { useEffect, useState } from "react";
import { GraphLegends } from "../shared/graph-legends.client";

const timeRanges: { key: AdminShopPeriod, label: string }[] = [
  { key: "day", label: "24 heures" },
  { key: "week", label: "1 semaine" },
  { key: "month", label: "1 mois" },
  { key: "season", label: "1 saison" },
];

/**
 * Displays the player count history over a period of times, for both Java and Bedrock
 * Handle period changes
 */
export function PlayerConnectionHistory() {
  const [currentTimeRangePlayerCount, setCurrentTimeRangePlayerCount] = useState<AdminShopPeriod>("day");
  const axes: AxisConfig[] = [
    { id: "x-axis", position: "bottom", type: "date" },
    { id: "y-axis", position: "left", type: "number" },
  ];

  const [data, setData] = useState<Dataset<Date, number>[]>([
    {
      id: "java-status",
      name: "Joueurs en ligne java",
      color: "#ff5e00ff",
      visibility: true,
      stats: [],
      yAxisId: "y-axis"
    },
    {
      id: "bedrock-status",
      name: "Joueurs en ligne bedrock",
      color: "#ff0000ff",
      visibility: true,
      stats: [],
      yAxisId: "y-axis"
    }
  ]);

  function updateDataset(id: "java-status" | "bedrock-status", stats: DataPoint<Date, number>[]) {
    setData(prev =>
      prev.map(ds =>
        ds.id === id
          ? { ...ds, stats: stats }
          : ds
      )
    );
  }

  useEffect(() => {
    getStatusPaladiumAction(currentTimeRangePlayerCount).then(res => {
      const newStats = res.map(e => ({
        x: new Date(e.date),
        y: e.players,
      }));
      updateDataset("java-status", newStats);
    });

    getStatusPaladiumBedrockAction(currentTimeRangePlayerCount).then(res => {
      const newStats = res.map(e => ({
        x: new Date(e.date),
        y: e.players,
      }));
      updateDataset("bedrock-status", newStats);
    });
  }, [currentTimeRangePlayerCount]);

  function toggleVisibility(plt: Dataset<Date, number>) {
    setData(prev =>
      prev.map(e =>
        e.id === plt.id
          ? { ...e, visibility: !e.visibility }
          : e
      )
    );
  }

  function handleHighlight(plt: Dataset<Date, number>) {
    const someDisabled = data.some(plt => !plt.visibility);
    setData(prevData =>
      prevData.map(e => {
        if (someDisabled) {
          return { ...e, visibility: true };
        } else {
          if (e.id === plt.id) {
            return e;
          }

          return { ...e, visibility: false };
        }
      })
    );
  }

  return (
    <Card className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-semibold mb-4">
        Historique de connexion
      </h2>
      <TimeSelection selected={currentTimeRangePlayerCount} callback={setCurrentTimeRangePlayerCount} timeRanges={timeRanges}/>
      <div className="flex flex-row gap-2 w-full h-[500px]">
        <ChartContainer
          className="w-[75%]"
          data={data}
          margin={{ top: 10, right: 0, bottom: 20, left: 50 }}
          axisConfigs={axes}
          renderContent={(props) => <LineGrad {...props} />}
        />
        <GraphLegends data={data} toggleVisibility={toggleVisibility} handleHighlight={handleHighlight} className="w-fit" />
      </div>
    </Card>
  );
}