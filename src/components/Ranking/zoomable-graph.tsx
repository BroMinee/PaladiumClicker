'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/Ranking/chart-z.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Area,
  AreaChart,
  CartesianGrid, Legend,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import { RankingResponse, rankingResponseSubType } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";

type ZoomableChartProps = {
  data: RankingResponse;
};


const chartConfig = {
  events: {
    label: "value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


const gradientColors = [
  { "color": "#ff9090", "color2": "#ff0000" },
  { "color": "#4600ff", "color2": "#4f00c9" },
  { "color": "#1dff00", "color2": "#00b154" },
  { "color": "#ffa000", "color2": "#c99600" },
  { "color": "#FF55EF", "color2": "#c900c6" },
  { "color": "#00ffba", "color2": "#00c988" },
  { "color": "#c8bfe7", "color2": "#7052d9" },
  { "color": "#ffd300", "color2": "#e6be00" },
  { "color": "#ff0000", "color2": "#c90000" },
  { "color": "#00d4ff", "color2": "#0657ad" }];

export function ZoomableChart({ data: initialData }: ZoomableChartProps) {

  const {data: playerInfo} = usePlayerInfoStore();
  const [data, setData] = useState<any[]>(initialData || []);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any[]>(initialData || []);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const [uniqueUsernames, setUniqueUsernames] = useState<string[]>([]);

  function getUniqueUsernames(data: RankingResponse) {
    const usernames = new Set<string>();
    data.forEach(item => usernames.add(item.username));
    return Array.from(usernames);
  }

  interface transformedDataType {
    [key: string]: { [key: string]: number | string };
  }



  useEffect(() => {
    if (initialData?.length) {


      const transformedData = Object.values(data.reduce((acc, item) => {
        // format the date to DD-MM-YYYY
        const date = new Date(item.date.toString()).toISOString();
        const username = item.username;
        const value = item.value;

        if (!acc[date]) {
          acc[date] = { date};
        }

        acc[date][username] = value;
        acc[date][`${username}_pos`] = item.position;
        return acc;
      }, {} as transformedDataType));

      const uniqueUsernames = getUniqueUsernames(data).sort((a, b) => {
        const lastDay = transformedData[transformedData.length - 1];
        return Number(lastDay[`${a}_pos`]) - Number(lastDay[`${b}_pos`]);
      })
      setUniqueUsernames(uniqueUsernames);

      setData(transformedData);
      setOriginalData(transformedData);
      setStartTime(initialData[0].date);
      setEndTime(initialData[initialData.length - 1].date);
    }
  }, [initialData]);

  const zoomedData = useMemo(() => {
    if (!startTime || !endTime) {
      return data;
    }


    const dataPointsInRange = originalData
      .filter(
      (dataPoint) => startTime <= dataPoint.date && dataPoint.date <= endTime
    );

    // Ensure we have at least two data points for the chart to prevent rendering a single dot
    return dataPointsInRange.length > 1 ? dataPointsInRange : originalData.slice(0, 2);
  }, [startTime, endTime, originalData, data]);

  const maxValue = useMemo(
    () => zoomedData.reduce((max, dataPoint) => Math.max(max, dataPoint[playerInfo?.username] || 0), 0),
    [zoomedData]
  )

  const minValue = useMemo(
    () => zoomedData.reduce((min, dataPoint) => Math.min(min, dataPoint[playerInfo?.username] || 0), Infinity),
    [zoomedData]
  );


  zoomedData.forEach((e) =>
  {
  })


  const DataFormatter = (number: number) => {
    if (number > 1000000000000000000000000)
      return (Math.floor(number / 1000000000000000000000000)).toString() + 'Y';
    else if (number > 1000000000000000000000)
      return (Math.floor(number / 1000000000000000000000)).toString() + 'Z';
    else if (number > 1000000000000000000)
      return (Math.floor(number / 1000000000000000000)).toString() + 'E';
    else if (number > 1000000000000000)
      return (Math.floor(number / 1000000000000000)).toString() + 'P';
    else if (number > 1000000000000) {
      return (Math.floor(number / 1000000000000)).toString() + 'T';
    } else if (number > 1000000000) {
      return (Math.floor(number / 1000000000)).toString() + 'G';
    } else if (number > 1000000) {
      return (Math.floor(number / 1000000)).toString() + 'M';
    } else if (number > 1000) {
      return (Math.floor(number / 1000)).toString() + 'k';
    } else {
      return number.toString();
    }
  }

  const handleMouseDown = (e: any) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort();
      setStartTime(left);
      setEndTime(right);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  const handleReset = () => {
    setStartTime(originalData[0].date);
    setEndTime(originalData[originalData.length - 1].date);
  };

  const handleZoom = (e: React.WheelEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!originalData.length || !chartRef.current) return;

    let zoomFactor = 0.1;
    let direction = 0;
    let clientX = 0;

    if ('deltaY' in e) {
      // Mouse wheel event
      direction = e.deltaY < 0 ? 1 : -1;
      clientX = e.clientX;
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

      if ((e as any).lastTouchDistance) {
        direction = currentDistance > (e as any).lastTouchDistance ? 1 : -1;
      }
      (e as any).lastTouchDistance = currentDistance;

      clientX = (touch1.clientX + touch2.clientX) / 2;
    } else {
      return;
    }

    const currentRange = new Date(endTime || originalData[originalData.length - 1].date).getTime() -
      new Date(startTime || originalData[0].date).getTime();
    const zoomAmount = currentRange * zoomFactor * direction;

    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = clientX - chartRect.left;
    const chartWidth = chartRect.width;
    const mousePercentage = mouseX / chartWidth;

    const currentStartTime = new Date(startTime || originalData[0].date).getTime();
    const currentEndTime = new Date(endTime || originalData[originalData.length - 1].date).getTime();

    const newStartTime = new Date(currentStartTime + zoomAmount * mousePercentage);
    const newEndTime = new Date(currentEndTime - zoomAmount * (1 - mousePercentage));

    setStartTime(newStartTime.toISOString());
    setEndTime(newEndTime.toISOString());
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("fr-FR");
  };



  return (
    <Card className="w-full h-full">
      <CardHeader className="flex-col items-stretch space-y-0 border-b p-0 sm:flex-row hidden sm:flex">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Graphique zoomable</CardTitle>
        </div>
        <div className="flex">
          <div
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l bg-muted/10 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
                        <span className="text-xs text-muted-foreground">
                            Minimum Local
                        </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
                            {minValue.toLocaleString()}
                        </span>
          </div>
          <div
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l bg-muted/10 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
                        <span className="text-xs text-muted-foreground">
                            Maximum Local
                        </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
                            {maxValue.toLocaleString()}
                        </span>
          </div>

        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 h-full sm:h-[calc(100%-150px)]">
        <ChartContainer
          config={chartConfig}
          className="w-full h-full"
        >
          <div className="h-full" onWheel={handleZoom} onTouchMove={handleZoom} ref={chartRef}
               style={{ touchAction: 'none' }}>
            <div className="flex justify-end my-2 sm:mb-4">
              <Button variant="outline" onClick={handleReset} disabled={!startTime && !endTime}
                      className="text-xs sm:text-sm">
              Reset Zoom
              </Button>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={zoomedData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <defs>
                  {gradientColors.map((color, index) => (
                    <linearGradient key={index} id={`top${index + 1}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={color.color}/>
                      <stop offset="100%" stopColor={color.color2}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="4"/>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  minTickGap={16}
                  style={{ userSelect: 'none' }}
                />
                <YAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={DataFormatter}
                  style={{ userSelect: 'none' }}
                  width={45}
                />

                <Legend layout="horizontal" verticalAlign="bottom" align="center" payload={
                  uniqueUsernames.map(
                    (item) => ({
                      id: item,
                      type: "line",
                      value: item,
                      color: gradientColors[uniqueUsernames.indexOf(item) % gradientColors.length].color2,
                    })
                  )
                }
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="w-[150px] sm:w-[200px] font-mono text-xs sm:text-sm"
                      nameKey="value"
                      labelFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent/>}/>
                {/*<Area*/}
                {/*  type="monotone"*/}
                {/*  dataKey="value"*/}
                {/*  stroke={`url(#top1)`}*/}
                {/*  strokeWidth={5}*/}
                {/*  fillOpacity={0}*/}
                {/*  fill="url(#colorEvents)"*/}
                {/*  isAnimationActive={false}*/}
                {/*/>*/}
                {uniqueUsernames.map((username, index) => (
                  <Area
                    key={username + index}
                    dataKey={username}
                    type="monotone"
                    stroke={zoomedData.every((a) => a[username] === zoomedData[0][username]) ? gradientColors[index % gradientColors.length].color2 : `url(#top${index + 1})`}
                    strokeWidth={5}
                    fillOpacity={0}
                    opacity={1}
                  />
                ))}
                {refAreaLeft && refAreaRight && (
                  <ReferenceArea
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                    fill="hsl(var(--foreground))"
                    fillOpacity={0.25}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}