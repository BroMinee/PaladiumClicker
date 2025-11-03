"use client";
import dynamic from "next/dynamic";
import { AdminShopItemDetail, AdminShopPeriod } from "@/types";
import { Area, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });

const CustomTooltip = ({ active, payload, label }: any) => {

  if (!payload || payload.length === 0) {
    return null;
  }

  if (active && payload && payload.length) {
    return (
      <div className="recharts-tooltip-wrapper bg-secondary rounded-md p-2 ">
        <p className="recharts-tooltip-label text-card-foreground">{`${label}`}</p>
        <ul>
          {payload.map((entry: any, index: number) => {
            return <li key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </li>;
          })}
        </ul>
      </div>);
  }
};

/**
 * Component that display the admin-shop price history
 * @param data - The admin-shop price history
 * @param webhook - Boolean, if true display a horizontal line corresponding to the webhook alert price.
 * @param periode - The current period used in the graph display.
 */
const PlotAdminShopChart = ({ data, periode, webhook = false }: {
  data: AdminShopItemDetail[],
  webhook?: boolean,
  periode: AdminShopPeriod
}) => {
  // TODO: zoomable chart
  // TODO: daily price and not 15min delta
  // TODO: add a line for the average price
  const { threshold } = useWebhookStore();

  // print the date in DD/MM/YYYY - HH:MM:SS

  const data_clean = data.map((item) => {
    return {
      date: new Date(item.date).toLocaleDateString() + " - " + new Date(item.date).toLocaleTimeString(),
      sellPrice: Math.round(item.sellPrice * 100) / 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%"
      id="graph-adminshop-plot"
    >
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
        <Area yAxisId="left" type="monotone" dataKey="sellPrice" name="Prix de vente" stroke="#8884d8" fillOpacity={1}
          isAnimationActive={periode !== "season"}
          fill="url(#colorUv)"
          id="curve-price-adminshop"
        />
        {
          webhook && <ReferenceLine
            y={threshold}
            yAxisId="left"
            stroke="red"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: "Alerte",
              position: "left",
              fill: "red",
            }}
          />
        }
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default PlotAdminShopChart;