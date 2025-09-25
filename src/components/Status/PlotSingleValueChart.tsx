'use client';
import { ValueHistory } from "@/types";
import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { formatPrice } from "@/lib/misc.ts";


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
              {entry.name}: {formatPrice(entry.value)}
            </li>;
          })}
        </ul>
      </div>);
  }
};

export const PlotSingleValueChart = ({ data, labelName, className }: { data: ValueHistory, labelName: string, className?: string }) => {
  const data_clean = data.map((item) => {
    return {
      date: new Date(item.date).toLocaleDateString(),
      value: item.value,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%" className={className ?? ""} id={`graph-${labelName.replaceAll(" ", "-").toLowerCase()}-plot`}>
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
        <Area yAxisId="left" type="monotone" dataKey="value" stroke="#fe6212" fillOpacity={1}
              fill="url(#colorUv)" name={labelName}/>
      </AreaChart>
    </ResponsiveContainer>);
};