"use client";
import React from "react";
import * as d3 from "d3";
import { ChartRendererProps, AxisDomain, DataPoint } from "@/types";

/**
 * Render a simple Line
 */
export const LineRenderer = <TX extends AxisDomain, TY extends number>({
  data,
  scales
}: ChartRendererProps<TX, TY>) => {

  const xScale = scales["x-axis"];
  const yScale = scales["y-axis"];

  const lineGenerator = d3.line<DataPoint<TX, TY>>()
    .x((d) => (xScale as any)(d.x))
    .y((d) => (yScale as any)(d.y))
    .curve(d3.curveMonotoneX);

  return (
    <>
      {data.map((dataset) => (
        <path
          key={dataset.id}
          d={lineGenerator(dataset.stats) || ""}
          fill="none"
          stroke={dataset.color}
          strokeWidth={5}
        />
      ))}
    </>
  );
};

/**
 * Render only the dots
 */
export const ScatterRenderer = <TX extends AxisDomain, TY extends number>({
  data,
  scales,
}: ChartRendererProps<TX, TY>) => {
  const xScale = scales["x-axis"];
  const yScale = scales["y-axis"];
  return (
    <>
      {data.map((dataset) => (
        <g key={dataset.id} fill={dataset.color}>
          {dataset.stats.map((point, i) => (
            <circle
              key={i}
              cx={(xScale as any)(point.x)}
              cy={(yScale as any)(point.y)}
              r={5}
              style={{ transition: "cx 0.1s, cy 0.1s" }}
            />
          ))}
        </g>
      ))}
    </>
  );
};

/**
 * Render multi line
 */
export const MultiAxisLineRenderer = <TX extends AxisDomain, TY extends number>({
  data,
  scales,
}: ChartRendererProps<TX, TY>) => {

  const xScale = scales["x-axis"];

  return (
    <>
      {data.map((dataset) => {
        const yScale = scales[dataset.yAxisId];

        if (!xScale || !yScale) {
          return null;
        }

        const lineGenerator = d3.line<DataPoint<TX, TY>>()
          .x((d) => (xScale as any)(d.x))
          .y((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        return (
          <path
            key={dataset.id}
            d={lineGenerator(dataset.stats) || ""}
            fill="none"
            stroke={dataset.color}
            strokeWidth={2}
          />
        );
      })}
    </>
  );
};

/**
 * Render a line with a linear gradient under
 */
export const LineGrad = <TX extends AxisDomain, TY extends number>({
  data,
  scales,
}: ChartRendererProps<TX, TY>) => {
  const xScale = scales["x-axis"];

  if (!xScale) {
    return null;
  }

  return (
    <>
      {data.map((dataset) => {
        const yScale = scales[dataset.yAxisId];
        if (!yScale) {
          return null;
        }

        const lineGenerator = d3.line<DataPoint<TX, TY>>()
          .x((d) => (xScale as any)(d.x))
          .y((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        const areaGenerator = d3.area<DataPoint<TX, TY>>()
          .x((d) => (xScale as any)(d.x))
          .y0(yScale.range()[0])
          .y1((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        const gradientId = `gradient-${dataset.id}`;

        return (
          <React.Fragment key={dataset.id}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dataset.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={dataset.color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <path
              d={areaGenerator(dataset.stats) || ""}
              fill={`url(#${gradientId})`}
              stroke="none"
              style={{ transition: "d 0.2s ease" }}
            />

            <path
              d={lineGenerator(dataset.stats) || ""}
              fill="none"
              stroke={dataset.color}
              strokeWidth={3}
              style={{ transition: "d 0.2s ease" }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * Render price and volume graph (Market only)
 */
export const RenderPriceVolume = (props: ChartRendererProps<Date, number>) => {
  const { data, scales, height } = props;
  const xScale = scales["x-axis"] as d3.ScaleTime<number, number>;
  const yScalePrice = scales["left"] as d3.ScaleLinear<number, number>;
  const yScaleVol = scales["right"] as d3.ScaleLinear<number, number>;

  const areaGenerator = d3.area<DataPoint<Date, number>>()
    .x(d => xScale(d.x))
    .y0(height)
    .y1(d => yScalePrice(d.y))
    .curve(d3.curveMonotoneX);

  const volumeStats = data.find(d => d.id === "volume")?.stats || [];

  let barWidth = 6;
  if (volumeStats.length > 1) {
    const x0 = xScale(volumeStats[0].x);
    const x1 = xScale(volumeStats[1].x);
    barWidth = Math.min(Math.abs(x1 - x0), 100);
  }

  const gap = 1;
  const finalWidth = Math.max(1, barWidth - gap);

  return (
    <>
      {volumeStats.map((p, i) => {
        const x = xScale(p.x);
        const y = yScaleVol(p.y);
        const barHeight = Math.max(0, height - y);

        return (
          <rect
            key={`vol-${i}`}
            x={x - (finalWidth / 2)}
            y={y}
            width={finalWidth}
            height={barHeight}
            fill="#3b82f6"
            opacity={0.3}
            rx={5}
          />
        );
      })}

      {(() => {
        const priceStats = data.find(d => d.id === "price")?.stats;
        if (!priceStats) {
          return null;
        }
        return <path d={areaGenerator(priceStats) || ""} fill="url(#colorPrice)" stroke="#22c55e" strokeWidth={2} />;
      })()}

      <defs>
        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};

/**
 * Render pressure graph (Market only)
 */
export const RenderPressure = (props: ChartRendererProps<Date, number>) => {
  const { data, scales } = props;
  const xScale = scales["x-axis"] as d3.ScaleTime<number, number>;
  const yScale = scales["left"] as d3.ScaleLinear<number, number>;
  const lineGenerator = d3.line<DataPoint<Date, number>>().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveMonotoneX);
  const stats = data.find(d => d.id === "pressure")?.stats;
  if (!stats) {
    return null;
  }
  return <path d={lineGenerator(stats) || ""} fill="none" stroke="#a855f7" strokeWidth={2} strokeOpacity={1} />;
};