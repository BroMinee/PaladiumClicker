'use client'
import dynamic from "next/dynamic";
import { RankingResponse } from "@/types";
import { Area, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { formatPrice } from "@/lib/misc.ts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });


const PlotRankingChart = ({ data, offset }: { data: RankingResponse, offset: number }) => {
  function getUniqueUsernames(data: any[]) {
    const usernames = new Set<string>();
    data.forEach(item => usernames.add(item.username));
    return Array.from(usernames);
  }

  interface transformedDataType {
    [key: string]: { [key: string]: number | string };
  }

  const transformedData = Object.values(data.reduce((acc, item) => {

    const date = item.date.toString();
    const username = item.username;
    const value = item.value;

    if (!acc[date]) {
      acc[date] = { date };
    }

    acc[date][username] = value;
    acc[date][`${username}_pos`] = item.position;
    return acc;
  }, {} as transformedDataType));

  const uniqueUsernames = getUniqueUsernames(data);


  const CustomTooltip = ({ active, payload, label }: any) => {

    if (!payload || payload.length === 0)
      return null;


    if (active && payload && payload.length) {

      const payloadOrder = payload.sort((a: any, b: any) => a.payload[`${a.name}_pos`] - b.payload[`${b.name}_pos`]);

      return (
        <div className="bg-secondary rounded-md p-2 ">
          <p className="text-card-foreground">{`Date : ${label}`}</p>
          {payloadOrder.map((entry: any) => {
            const index = uniqueUsernames.indexOf(entry.name);
            const gradientStart = gradientColors[index].color;
            const gradientEnd = gradientColors[index].color2;
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


  const opacityInit = uniqueUsernames.reduce((acc, username) => {
    acc[username] = 1;
    return acc;
  }, {} as { [key: string]: number });

  const [opacity, setOpacity] = React.useState(opacityInit);

  const handleMouseEnterLegends = (o : Payload) => {
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

  const handleMouseClickLegends = (o : Payload) => {
    const { value } = o;
    alert(`clicked on ${value} (legends)`);
  };


  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={transformedData}
                 margin={{ top: 20, right: 20, left: 30, bottom: 10 }}>
        <defs>
          {gradientColors.map((color, index) => (
            <linearGradient key={index} id={`top${index + 1}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color.color}/>
              <stop offset="100%" stopColor={color.color2}/>
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip content={<CustomTooltip offset={offset}/>}/>
        <Legend layout="horizontal" verticalAlign="bottom" align="center" payload={
          uniqueUsernames.map(
            (item) => ({
              id: item,
              type: "line",
              value: item,
              color: gradientColors[uniqueUsernames.indexOf(item)].color2,
            })
          )
        }
                onMouseEnter={handleMouseEnterLegends} onMouseLeave={handleMouseLeaveLegends}
                onClick={handleMouseClickLegends}
        />

        {uniqueUsernames.map((username, index) => (
          <Area
            key={username + index}
            dataKey={username}
            type="monotone"
            stroke={transformedData.every((a) => a[username] === transformedData[0][username]) ? gradientColors[index].color2 : `url(#top${index + 1})`}
            strokeWidth={5}
            fillOpacity={0}
            opacity={opacity[username] || 1}

          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default PlotRankingChart;