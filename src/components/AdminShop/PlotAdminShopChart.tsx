'use client'
import dynamic from "next/dynamic";
import { AdminShopItemDetail } from "@/types";
import { Area, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { getDDHHMMSS } from "@/lib/misc.ts";

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


const PlotAdminShopChart = ({ data }: { data: AdminShopItemDetail[] }) => {
  // TODO: zoomable chart
  // TODO: daily price and not 15min delta
  // TODO: add a line for the average price


  // print the date in DD/MM/YYYY - HH:MM:SS

  const data_clean = data.map((item) => {
    return {
      date: getDDHHMMSS(new Date(item.date)),
      sellPrice: item.sellPrice,
      buyPrice: item.buyPrice,
    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data_clean}
                 margin={{ top: 30, right: 30, left: 30, bottom: 10 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>

        </defs>
        <Legend layout="horizontal" verticalAlign="top" align="center"/>
        <XAxis dataKey="date"/>
        <YAxis yAxisId="left"
               domain={[(dataMin: number) => parseFloat((dataMin * 0.9).toFixed(2)), (dataMax: number) => parseFloat((dataMax * 1.1).toFixed(2))]}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Area yAxisId="left" type="monotone" dataKey="sellPrice" name="Prix vente" stroke="#8884d8" fillOpacity={1}
              fill="url(#colorUv)"/>
      </AreaChart>
    </ResponsiveContainer>
  )
    ;
};
export default PlotAdminShopChart;