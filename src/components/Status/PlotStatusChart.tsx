"use client";
import dynamic from "next/dynamic";
import { ServerPaladiumStatusResponse, StatusPeriod } from "@/types";
import { Area, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0]?.payload;
  const readableDate = dataPoint ? dataPoint.dateLabel : new Date(label).toLocaleDateString() + " - " + new Date(label).toLocaleTimeString();

  if (active && payload && payload.length) {
    return (
      <div className="recharts-tooltip-wrapper bg-secondary rounded-md p-2 ">
        <p className="recharts-tooltip-label text-card-foreground">{`${readableDate}`}</p>
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
 * Displays the average player counts on the server.
 *
 * @param data Array of server status objects, each with `date` and `players`.
 * @param periode The period for the chart, one of "day", "week", "month", or "season".
 *
 * The chart shows the number of players over time and includes a reference line
 * representing the average player count for the selected period.
 */
export const PlotStatusChart = ({ data, periode }: { data: ServerPaladiumStatusResponse[], periode: StatusPeriod }) => {
  // TODO: zoomable chart
  // TODO: daily price and not 15min delta
  // TODO: add a line for the average price

  const average = data.reduce((acc, item) => acc + item.players, 0) / data.length;

  const data_clean = data.map((item) => {
    const dateObj = new Date(item.date);
    return {
      dateValue: dateObj.getTime(),
      dateLabel: dateObj.toLocaleDateString() + " - " + dateObj.toLocaleTimeString(),
      players: item.players,
      average: average
    };
  });

  const dateFormatter = (tick: number) => {
    return new Date(tick).toLocaleDateString() + " - " + new Date(tick).toLocaleTimeString();
  };

  const convert = (periode: StatusPeriod) => {
    switch (periode) {
    case "day":
      return "du jour";
    case "week":
      return "de la semaine";
    case "month":
      return "du mois";
    case "season":
      return "de la saison";
    }
  };
  const moyenneText = convert(periode);
  const minDate = Math.min(...data_clean.map(d => d.dateValue));
  const maxDate = Math.max(...data_clean.map(d => d.dateValue));

  return (
    <ResponsiveContainer width="100%" height="100%" id="graph-status-plot">
      <AreaChart data={data_clean}
        margin={{ top: 30, right: 30, left: 30, bottom: 10 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fe6212" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#fe6212" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Legend layout="horizontal" verticalAlign="top" align="center"/>
        <XAxis
          dataKey="dateValue"
          type="number"
          tickFormatter={dateFormatter}
          domain={[minDate, maxDate]}
        />
        <YAxis yAxisId="left" domain={[0, (dataMax: number) => Math.round(dataMax * 1.1)]}/>
        <Tooltip content={<CustomTooltip/>}/>
        <Area yAxisId="left" type="monotone" dataKey="players" stroke="#fe6212" fillOpacity={1}
          isAnimationActive={periode !== "season"}
          fill="url(#colorUv)" name="Joueurs"/>
        <ReferenceLine yAxisId="left" type="linear" y={average} stroke="gray" strokeDasharray="3, 3"
          label={{ position: "top", value: `Moyenne ${moyenneText}` }}/>
      </AreaChart>
    </ResponsiveContainer>
  );
};