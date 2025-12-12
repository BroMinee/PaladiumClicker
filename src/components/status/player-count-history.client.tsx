"use client";

import { AxisConfig, DataPoint, Dataset } from "@/types";
import { LineGrad } from "../shared/graph-line-renderer.client";
import { ChartContainer } from "../shared/graph.client";
import { Card } from "@/components/ui/card";
import { getPlayerCountHistoryPaladiumAction } from "@/lib/api/apiServerAction";
import { useEffect, useState } from "react";

/**
 * Player the graph player count since opening of the season
 */
export function PlayerCountHistory() {
  const axes: AxisConfig[] = [
    { id: "x-axis", position: "bottom", type: "date" },
    { id: "y-axis", position: "left", type: "number" },
  ];
  const [data, setData] = useState<Dataset<Date, number>[]>([
    {
      id: "java-count",
      name: "Joueurs en ligne java",
      color: "#ff5e00ff",
      visibility: true,
      stats: [],
      yAxisId: "y-axis"
    },
  ]);

  function updateDataset(id: "java-count", stats: DataPoint<Date, number>[]) {
    setData(prev =>
      prev.map(ds =>
        ds.id === id
          ? { ...ds, stats: stats }
          : ds
      )
    );
  }

  useEffect(() => {
    getPlayerCountHistoryPaladiumAction().then(res => {
      const newStats = res.map(e => ({
        x: new Date(e.date),
        y: e.player_count,
      }));
      updateDataset("java-count", newStats);
    });
  }, []);

  return (
    <Card className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-semibold mb-4">
        Nombre de joueurs total
      </h2>
      <div className="flex flex-row gap-2 w-full h-[500px]">
        <ChartContainer
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 75 }}
          axisConfigs={axes}
          renderContent={(props) => <LineGrad {...props} />}
        />
      </div>
    </Card>
  );
}
