'use client'
import dynamic from "next/dynamic";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });



import { AhItemHistory } from "@/types";
import { Area, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";



const Charts = ({data} : {data: AhItemHistory[]}) => {
  const data_clean = data.map((item) => {
    return {
      date: item.date,
      price: item.price / item.sells,
      quantity: item.quantity
    }
  });
  return (
    <ResponsiveContainer width="95%" height={400}>
        <AreaChart data={data_clean}
                   margin={{ top: 30, right: 30, left: 30, bottom: 10 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Legend layout="horizontal" verticalAlign="top" align="center" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left"/>
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Area yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
          <Area yAxisId="right" type="monotone" dataKey="quantity" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
    </ResponsiveContainer>
  );
};
export default Charts;