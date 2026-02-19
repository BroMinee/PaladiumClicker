"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartRendererProps, AxisDomain, DataPoint } from "@/types";

/**
 * Render a simple Line
 */
export const LineRenderer = <TX extends AxisDomain, TY extends number>({
  data,
  scales,
  animate = true,
}: ChartRendererProps<TX, TY>) => {
  const xScale = scales["x-axis"];

  return (
    <>
      {data.map((dataset, i) => {
        // choose y-scale: prefer dataset.yAxisId, then 'y-axis', then any other available scale
        let yScale: any = undefined;
        if ((dataset as any).yAxisId && (scales as any)[(dataset as any).yAxisId]) {
          yScale = (scales as any)[(dataset as any).yAxisId];
        } else if ((scales as any)["y-axis"]) {
          yScale = (scales as any)["y-axis"];
        } else {
          for (const k of Object.keys(scales)) {
            if (k === "x-axis") continue;
            yScale = (scales as any)[k];
            if (yScale) break;
          }
        }

        if (!xScale || !yScale || typeof yScale !== "function") {
          return null;
        }

        const lineGenerator = d3.line<DataPoint<TX, TY>>()
          .defined((d) => d.y != null && !Number.isNaN(d.y as unknown as number))
          .x((d) => (xScale as any)(d.x))
          .y((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        return (
          <AnimatedPath
            key={dataset.id}
            d={lineGenerator(dataset.stats) || ""}
            fill="none"
            stroke={dataset.color}
            strokeWidth={5}
            animate={animate}
            delay={i * 140}
          />
        );
      })}
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
  animate = true,
}: ChartRendererProps<TX, TY>) => {

  const xScale = scales["x-axis"];

  return (
    <>
      {data.map((dataset, i) => {
        const yScale = scales[dataset.yAxisId];

        if (!xScale || !yScale) {
          return null;
        }

        const lineGenerator = d3.line<DataPoint<TX, TY>>()
          .defined((d) => !isNaN(d.y) && d.y !== null)
          .x((d) => (xScale as any)(d.x))
          .y((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        return (
          <AnimatedPath
            key={dataset.id}
            d={lineGenerator(dataset.stats) || ""}
            fill="none"
            stroke={dataset.color}
            strokeWidth={2}
            animate={animate}
            delay={i * 120}
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
  animate = true,
}: ChartRendererProps<TX, TY>) => {
  const xScale = scales["x-axis"];

  if (!xScale) {
    return null;
  }

  return (
    <>
      {data.map((dataset, i) => {
        const yScale = scales[dataset.yAxisId];
        if (!yScale) {
          return null;
        }

        const lineGenerator = d3.line<DataPoint<TX, TY>>()
          .defined((d) => !isNaN(d.y) && d.y !== null)
          .x((d) => (xScale as any)(d.x))
          .y((d) => (yScale as any)(d.y))
          .curve(d3.curveMonotoneX);

        const areaGenerator = d3.area<DataPoint<TX, TY>>()
          .defined((d) => !isNaN(d.y) && d.y !== null)
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

            {(() => {
              const areaDelay = i * 120;
              const areaDraw = 900;
              const strokeDelay = areaDelay; // start stroke same time as area to sync appearance
              return (
                <>
                  <AnimatedArea
                    d={areaGenerator(dataset.stats) || ""}
                    fill={`url(#${gradientId})`}
                    fillOpacityTarget={0.6}
                    animate={animate}
                    delay={areaDelay}
                    drawDuration={areaDraw}
                  />

                  <AnimatedPath
                    d={lineGenerator(dataset.stats) || ""}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth={1}
                    animate={animate}
                    delay={strokeDelay}
                    drawDuration={areaDraw}
                  />
                </>
              );
            })()}
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
  const { data, scales, height, animate = true } = props;
  const xScale = scales["x-axis"] as d3.ScaleTime<number, number>;
  const yScalePrice = scales["left"] as d3.ScaleLinear<number, number>;
  const yScaleVol = scales["right"] as d3.ScaleLinear<number, number>;

  const areaGenerator = d3.area<DataPoint<Date, number>>()
    .defined((d) => !isNaN(d.y) && d.y !== null)
    .x(d => xScale(d.x))
    .y0(height)
    .y1(d => yScalePrice(d.y))
    .curve(d3.curveMonotoneX);

  const volumeStats = data.find(d => d.id === "volume")?.stats || [];

  let minDiff = Number.MAX_VALUE;
  if (volumeStats.length > 1) {
    for (let i = 1; i < volumeStats.length; i++) {
      const x0 = xScale(volumeStats[i - 1].x);
      const x1 = xScale(volumeStats[i].x);
      const diff = Math.abs(x1 - x0);
      if (diff < minDiff) {
        minDiff = diff;
      }
    }
  }

  if (minDiff === Number.MAX_VALUE) {
    minDiff = 50;
  }
  minDiff = Math.min(minDiff, 100);

  const gap = Math.max(1, minDiff * 0.1);
  const finalWidth = Math.max(1, minDiff - gap);

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
            className={animate ? "bar" : undefined}
            rx={5}
            style={{
              transformOrigin: `${x}px ${y + barHeight}px`,
              transitionDelay: `${i * 30}ms`
            }}
          />
        );
      })}

      {(() => {
        const priceStats = data.find(d => d.id === "price")?.stats;
        if (!priceStats) {
          return null;
        }
        const lineGenerator = d3.line<DataPoint<Date, number>>()
          .x(d => xScale(d.x))
          .y(d => yScalePrice(d.y))
          .curve(d3.curveMonotoneX);

        return (
          <>
            {(() => {
              const areaDelay = 60;
              const areaDraw = 1200;
              const strokeDelay = areaDelay; // sync start with area
              return (
                <>
                  <AnimatedArea d={areaGenerator(priceStats) || ""} fill="url(#colorPrice)" fillOpacityTarget={0.3} animate={animate} delay={areaDelay} drawDuration={areaDraw} />
                  <AnimatedPath d={lineGenerator(priceStats) || ""} fill="none" stroke="#22c55e" strokeWidth={2} animate={animate} delay={strokeDelay} drawDuration={areaDraw} />
                </>
              );
            })()}
          </>
        );
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
  const { data, scales, animate = true } = props;
  const xScale = scales["x-axis"] as d3.ScaleTime<number, number>;
  const yScale = scales["left"] as d3.ScaleLinear<number, number>;
  const lineGenerator = d3.line<DataPoint<Date, number>>()
    .defined((d) => !isNaN(d.y) && d.y !== null)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);
  const stats = data.find(d => d.id === "pressure")?.stats;
  if (!stats) {
    return null;
  }
  return <AnimatedPath d={lineGenerator(stats) || ""} fill="none" stroke="#a855f7" strokeWidth={2} strokeOpacity={1} animate={animate} />;
};

type AnimatedPathProps = React.SVGProps<SVGPathElement> & { animate?: boolean; fillOpacityTarget?: number; delay?: number; drawDuration?: number };

const AnimatedPath = (props: AnimatedPathProps) => {
  const { d, animate = true, fillOpacityTarget = 1, style, delay = 0, drawDuration = 1400, fill, ...rest } = props;
  const ref = useRef<SVGPathElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const path = ref.current;
    if (!path || !d) return;

    path.style.transition = "none";
    if (!fill || fill === "none") {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      if (!animate) {
        path.style.opacity = "1";
        path.style.strokeDashoffset = "0";
        return;
      }
      path.style.opacity = "0";
      path.style.strokeDashoffset = `${length}`;
    } else if (!animate) {
      path.style.opacity = String(fillOpacityTarget);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      try {
        if (!fill || fill === "none") {
          path.style.transition = `stroke-dashoffset ${drawDuration}ms cubic-bezier(.2,.8,.2,1), opacity 420ms ease`;
          path.style.opacity = '1';
          requestAnimationFrame(() => {
            path.style.strokeDashoffset = '0';
          });
        } else {
          path.style.transition = `opacity 420ms ease ${0}ms`;
          path.style.opacity = String(fillOpacityTarget);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("AnimatedPath animation error:", error);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [d, delay, drawDuration, fill, fillOpacityTarget, animate]);

  return <path ref={ref} d={d} style={{ opacity: 0, ...style }} {...rest} />;
};

type AnimatedAreaProps = {
  d: string;
  fill?: string;
  animate?: boolean;
  delay?: number;
  drawDuration?: number;
  fillOpacityTarget?: number;
};

const AnimatedArea = ({ d, fill = "#22c55e", animate = true, delay = 0, drawDuration = 1200, fillOpacityTarget = 0.35 }: AnimatedAreaProps) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const maskRectRef = useRef<SVGRectElement | null>(null);
  const maskIdRef = useRef<string>(`animated-area-mask-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const rect = maskRectRef.current;
    const path = pathRef.current;
    if (!rect || !path) return;

    // compute bounding box of the path to size the mask rect in px
    const bbox = path.getBBox();
    rect.setAttribute('x', String(bbox.x));
    rect.setAttribute('y', String(bbox.y));
    rect.setAttribute('width', String(bbox.width));
    rect.setAttribute('height', String(bbox.height));

    // initial state: collapsed mask from left
    rect.style.transformOrigin = `${bbox.x}px ${bbox.y + bbox.height / 2}px`;
    rect.style.transition = 'none';
    if (!animate) {
      rect.style.transform = 'scaleX(1)';
      path.style.opacity = String(fillOpacityTarget);
      return;
    }

    rect.style.transform = 'scaleX(0)';
    path.style.opacity = '0';

    const t = window.setTimeout(() => {
      rect.style.transition = `transform ${drawDuration}ms cubic-bezier(.2,.8,.2,1)`;
      rect.style.transform = 'scaleX(1)';
      // fade in fill slightly after mask starts
      path.style.transition = `opacity 360ms ease ${Math.min(200, drawDuration / 6)}ms`;
      path.style.opacity = String(fillOpacityTarget);
    }, delay);

    return () => clearTimeout(t);
  }, [d, delay, drawDuration, fillOpacityTarget, animate]);

  return (
    <>
      <defs>
        <mask id={maskIdRef.current} maskUnits="userSpaceOnUse">
          <rect ref={maskRectRef} x={0} y={0} width="100%" height="100%" fill="#fff" />
        </mask>
      </defs>
      <path ref={pathRef} d={d} fill={fill} stroke="none" mask={`url(#${maskIdRef.current})`} />
    </>
  );
};