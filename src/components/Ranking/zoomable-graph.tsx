'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/Ranking/chart-z.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ProfilSectionEnum, RankingResponse, RankingType } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { formatPrice, generateProfilUrl, generateRankingUrl } from "@/lib/misc.ts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input.tsx";
import { FaSearch } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";

type ZoomableChartProps = {
  data: RankingResponse;
  rankingType?: RankingType;
  profil: boolean;
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

export function ZoomableChart({ data: initialData, rankingType, profil }: ZoomableChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();


  const { data: playerInfo } = usePlayerInfoStore();
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const [opacity, setOpacity] = useState<{ [key: string]: number }>({});


  const [uniqueUsernames, setUniqueUsernames] = useState<string[]>([]);

  function getUniqueUsernames(data: RankingResponse) {
    const usernames = new Set<string>();
    data.forEach(item => usernames.add(item.username));
    return Array.from(usernames);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    let usernames = new Set<string>();

    const u = formData.get("username");
    if (u) {
      usernames.add(u.toString());
    }

    const us = searchParams.get('usernames');
    if (us) {
      for (const u of us.split(',')) {
        usernames.add(u);
      }
    }

    document.getElementById("username")?.setAttribute("innerHTML", "");
    if (profil) {
      if (playerInfo)
        router.push(generateProfilUrl(playerInfo.username, ProfilSectionEnum.Classement, rankingType, Array.from(usernames).sort()), { scroll: false });
    }
    else {
      const searchParamsNoUsername = searchParams.get('noUsernames');
      const noUsernames: string[] = searchParamsNoUsername ? searchParamsNoUsername.split(",") : [];

      if (u) {
        const indexToRemove = noUsernames.findIndex((e) => e.toLowerCase() === u.toString().toLowerCase());

        if (indexToRemove !== -1)
          noUsernames.splice(indexToRemove, 1);
      }

      router.push(generateRankingUrl(rankingType, Array.from(usernames).sort(), noUsernames), { scroll: false });
    }
  }

  function handleRemoveUsername(username: string) {
    let usernames = new Set<string>();

    const us = searchParams.get('usernames');
    if (us) {
      for (const u of us.split(',')) {
        usernames.add(u);
      }
    }

    if (profil) {
      if (playerInfo)
        router.push(generateProfilUrl(playerInfo.username, ProfilSectionEnum.Classement, rankingType, Array.from(usernames).filter((e) => e.toLowerCase() !== username.toLowerCase()).sort()), { scroll: false });
    } else {
      const searchParamsNoUsername = searchParams.get('noUsernames');
      const noUsernames: string[] = searchParamsNoUsername ? searchParamsNoUsername.split(',') : [];
      noUsernames.push(username);
      router.push(generateRankingUrl(rankingType, Array.from(usernames).filter((e) => e.toLowerCase() !== username.toLowerCase()).sort(), noUsernames), { scroll: false });

    }
  }

  useEffect(() => {
    const opacityInit = uniqueUsernames.reduce((acc, username) => {
      acc[username] = 1;
      return acc;
    }, {} as { [key: string]: number })
    setOpacity(opacityInit);
  }, [uniqueUsernames]);

  const CustomTooltip = ({ active, payload, label }: any) => {

    if (!payload || payload.length === 0)
      return null;


    if (active && payload && payload.length) {

      const payloadOrder = payload.sort((a: any, b: any) => a.payload[`${a.name}_pos`] - b.payload[`${b.name}_pos`]);
      const date = new Date(label);

      const dateDDMMYYYY = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const dateDDMMYYYYHHMM = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours < 10 ? `0${hours}` : hours}h${minutes < 10 ? `0${minutes}` : minutes}`;

      return (
        <div className="bg-secondary rounded-md p-2 ">
          <p
            className="text-card-foreground">{`Date : ${rankingType !== RankingType.vote ? dateDDMMYYYY : dateDDMMYYYYHHMM }`}</p>
          {payloadOrder.map((entry: any) => {
            const index = uniqueUsernames.indexOf(entry.name);
            const gradientStart = gradientColors[index % gradientColors.length].color;
            const gradientEnd = gradientColors[index % gradientColors.length].color2;
            const position = entry.payload[`${entry.name}_pos`];
            return <div key={`item-${index}`}>
              <h3 className="bg-clip-text text-transparent drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                  style={{ backgroundImage: `linear-gradient(45deg, ${gradientStart} 0%, ${gradientEnd} 100%)` }}>
                <span>{`Top #${position} -`}{" "}</span>
                <span className="font-bold">{entry.name}</span>
                <span className="font-semibold">{` : ${formatPrice(entry.value)}`}</span>
              </h3>
            </div>
          })}
        </div>
      );
    }
    return null;
  };

  const handleMouseEnterLegends = (o: Payload) => {
    const { value } = o;
    // set op to 0.5 for every other key
    const copy_op = { ...opacity };
    for (const key in copy_op) {
      if (key !== value) {
        copy_op[key] = 0.1;
      }
    }

    setOpacity(copy_op);
  };

  const handleMouseLeaveLegends = () => {
    const copy_op = { ...opacity };
    for (const key in copy_op) {
      copy_op[key] = 1;
    }

    setOpacity(copy_op);
  };

  const handleMouseClickLegends = (o: Payload) => {
    const { value } = o;
    if (value !== "valeur manquante")
      router.push(generateProfilUrl(value, ProfilSectionEnum.Classement, rankingType), { scroll: false });
  };

  interface transformedDataType {
    [key: string]: { [key: string]: number | string };
  }


  useEffect(() => {

    const transformedData = Object.values(initialData.reduce((acc, item) => {
      // format the date to DD-MM-YYYY
      const date = rankingType !== RankingType.vote ? new Date(item.date.toString()).toISOString() : item.date;
      const username = item.username;
      const value = item.value;

      if (!acc[date]) {
        acc[date] = { date };
      }

      acc[date][username] = value;
      acc[date][`${username}_pos`] = item.position;
      return acc;
    }, {} as transformedDataType));

    const uniqueUsernames = getUniqueUsernames(initialData).sort((a, b) => {
      const lastDay = transformedData[transformedData.length - 1];
      return Number(lastDay[`${a}_pos`]) - Number(lastDay[`${b}_pos`]);
    });

    let usernames = new Set<string>(uniqueUsernames);
    let usernames_lower = new Set<string>(uniqueUsernames.map((u) => u.toLowerCase()));

    const us = searchParams.get('usernames');
    if (us) {
      for (const u of us.split(',')) {
        if (!usernames_lower.has(u.toLowerCase())) {
          usernames_lower.add(u.toLowerCase());
          usernames.add(u);
        }
      }
    }

    usernames.delete("valeur manquante");


    setUniqueUsernames(Array.from(usernames));
    setOriginalData(transformedData);
    if (initialData.length > 0) {
      setStartTime(initialData[0].date);
      const endDate = new Date(initialData[initialData.length - 1].date);
      endDate.setDate(endDate.getDate() + 1);
      setEndTime(endDate.toISOString());
    }
  }, [initialData]);

  const zoomedData = useMemo(() => {
    if (!startTime || !endTime) {
      return originalData;
    }


    const dataPointsInRange = originalData
      .filter(
        (dataPoint) => startTime <= dataPoint.date && dataPoint.date <= endTime
      );

    // Ensure we have at least two data points for the chart to prevent rendering a single dot
    return dataPointsInRange.length > 1 ? dataPointsInRange : originalData.slice(0, 2);
  }, [startTime, endTime, originalData]);

  const maxValue = useMemo(
    () => zoomedData.reduce((max, dataPoint) => {
      return Math.max(max, Math.max(...uniqueUsernames.map(username => Number(dataPoint[username])).filter(e => isFinite(e))));
    }, -Infinity),
    [uniqueUsernames, zoomedData]
  )

  const minValue = useMemo(
    () => zoomedData.reduce((min, dataPoint) => {
      return Math.min(min, Math.min(...uniqueUsernames.map(username => Number(dataPoint[username])).filter(e => isFinite(e))));
    }, Infinity),
    [uniqueUsernames, zoomedData]
  );


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

    const currentRange = new Date(endTime ?? originalData[originalData.length - 1].date).getTime() -
      new Date(startTime ?? originalData[0].date).getTime();
    const zoomAmount = currentRange * zoomFactor * direction;

    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = clientX - chartRect.left;
    const chartWidth = chartRect.width;
    const mousePercentage = mouseX / chartWidth;

    const currentStartTime = new Date(startTime ?? originalData[0].date).getTime();
    const currentEndTime = new Date(endTime ?? originalData[originalData.length - 1].date).getTime();

    const newStartTime = new Date(currentStartTime + zoomAmount * mousePercentage);
    const newEndTime = new Date(currentEndTime - zoomAmount * (1 - mousePercentage));

    setStartTime(newStartTime.toISOString());
    setEndTime(newEndTime.toISOString());
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dateDDMMYYYYHHMM = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours < 10 ? `0${hours}` : hours}h${minutes < 10 ? `0${minutes}` : minutes}`;
    return rankingType !== RankingType.vote ? date.toLocaleDateString("fr-FR") : dateDDMMYYYYHHMM;
  };


  return (
    <Card className="w-full h-full">
      <CardHeader className="flex-col items-stretch space-y-0 border-b p-0 sm:flex-row hidden sm:flex">
        <div className="flex flex-1 flex-row justify-start gap-1 px-6 py-5 sm:py-6">
          <Button variant="outline" onClick={handleReset} disabled={!startTime && !endTime}>
            Reset Zoom
          </Button>
          <Button variant="outline" onClick={() => setIsAnimated(!isAnimated)}>
            {!isAnimated ? "Activer les animations" : "Désactiver les animations"}
          </Button>
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
      <CardContent className="sm:flex flex-row px-2 sm:p-6 h-full sm:h-[calc(100%-100px)] hidden">
        <ChartContainer
          config={chartConfig}
          className=" h-full w-3/4"
        >
          <div className="h-full" onWheel={handleZoom} onTouchMove={handleZoom} ref={chartRef}
               style={{ touchAction: 'none' }}>
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
                  domain={[minValue, maxValue]}
                  width={45}
                />
                <Tooltip content={<CustomTooltip/>}/>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" height={45} payload={
                  uniqueUsernames.map(
                    (item) => ({
                      id: item,
                      type: "line",
                      value: item,
                      color: gradientColors[uniqueUsernames.indexOf(item) % gradientColors.length].color2,
                    })
                  )
                }
                        onMouseEnter={handleMouseEnterLegends} onMouseLeave={handleMouseLeaveLegends}
                        onClick={handleMouseClickLegends}
                />

                {/*<ChartTooltip*/}
                {/*  cursor={false}*/}
                {/*  content={*/}
                {/*    <ChartTooltipContent*/}
                {/*      className="w-[150px] sm:w-[200px] font-mono text-xs sm:text-sm"*/}
                {/*      nameKey="value"*/}
                {/*      labelFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}*/}
                {/*    />*/}
                {/*  }*/}
                {/*/>*/}
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
                    opacity={opacity[username] ?? 1}
                    isAnimationActive={isAnimated}
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
        <div className="w-1/4 p-4">
          <h3 className="text-lg font-bold mb-2">Usernames</h3>
          <form onSubmit={onSubmit}>
            <div className="relative">
              <Input
                type="text"
                id="username"
                name="username"
                className={"bg-background"}
                placeholder={"Entre un pseudo"}
              />
              <Button
                id="pseudo-submit"
                type="submit"
                className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
                variant="ghost"
                size="icon"
              >
                <FaSearch/>
              </Button>
            </div>
          </form>
          <ScrollArea className="h-96">
            <ul className="mt-2 mr-3">
              {uniqueUsernames.map((username, index) => (
                <li key={username} className="flex justify-between items-center mb-2"
                    style={{ color: gradientColors[index % gradientColors.length].color2 }}>
                  <span>{username}</span>
                  <Button variant="outline" size="sm"
                          disabled={profil && username.toLowerCase() === playerInfo?.username.toLowerCase()}
                          onClick={() => handleRemoveUsername(username)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="vertical"/>
          </ScrollArea>
        </div>
      </CardContent>
      <CardHeader className="sm:hidden flex">Passe ton écran à l&apos;horizontal</CardHeader>
    </Card>
  )
}