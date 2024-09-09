'use client'
import dynamic from "next/dynamic";
import { ServerPaladiumStatusResponse } from "@/types";
import { Area, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { getHHMM } from "@/lib/misc.ts";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });

const CustomTooltip = ({ active, payload, label }: any) => {

  if (!payload || payload.length === 0)
    return null;

  if (active && payload && payload.length) {
    return (
      <div className="recharts-tooltip-wrapper bg-secondary rounded-md p-2 ">
        <p className="recharts-tooltip-label text-card-foreground">{`${label}`}</p>
        <ul>
          {payload.map((entry: any, index: number) => {
            return <li key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </li>
          })}
        </ul>
      </div>)
  }
}


const PlotStatusChart = ({ data }: { data: ServerPaladiumStatusResponse[] }) => {
  // TODO: zoomable chart
  // TODO: daily price and not 15min delta
  // TODO: add a line for the average price

  const average = data.reduce((acc, item) => acc + item.players, 0) / data.length;

  const data_clean = data.map((item) => {
    return {
      date: getHHMM(new Date(item.date)),
      players: item.players,
      average: average

    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data_clean}
                 margin={{ top: 30, right: 30, left: 30, bottom: 10 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fe6212" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#fe6212" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Legend layout="horizontal" verticalAlign="top" align="center"/>
        <XAxis dataKey="date"/>
        <YAxis yAxisId="left" domain={[0, (dataMax: number) => Math.round(dataMax * 1.1)]}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Area yAxisId="left" type="monotone" dataKey="players" stroke="#fe6212" fillOpacity={1}
              fill="url(#colorUv)" name="Joueurs"/>
        <ReferenceLine yAxisId="left" type="linear" y={average} stroke="gray" strokeDasharray="3, 3"
                       label={{ position: 'top', value: "Moyenne du jour" }}/>
      </AreaChart>
    </ResponsiveContainer>
  )
    ;
};
export default PlotStatusChart;