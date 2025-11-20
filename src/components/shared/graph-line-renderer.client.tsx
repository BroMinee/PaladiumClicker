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
          strokeWidth={2}
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