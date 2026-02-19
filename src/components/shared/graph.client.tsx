"use client";

import { Dataset, AxisConfig, ChartRendererProps, AnyScale, AxisDomain, TooltipData } from "@/types";
import React, { useEffect, useRef, useMemo, useState, useCallback, RefObject } from "react";
import * as d3 from "d3";

import "./graph.css";
import { formatPrice, orderBy } from "@/lib/misc";
import { cn } from "@/lib/utils";

/**
 * Render the tooltip
 */
export const Tooltip = <TY extends AxisDomain>({ tooltipData, containerWidth }: { tooltipData: TooltipData<TY> | null, containerWidth: number }) => {
  if (!tooltipData || !tooltipData.content) {
    return null;
  }

  // Seuil arbitraire
  const isRightSide = tooltipData.x > (containerWidth * 0.6);

  const xPosition = isRightSide ? tooltipData.x - 15 : tooltipData.x + 15;

  const transformStyle = `translate(${xPosition}px, ${tooltipData.y}px) ${isRightSide ? "translateX(-100%)" : ""}`;

  return (
    <div
      className="bg-background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        transform: transformStyle,
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 10,
        fontSize: "12px",
        minWidth: "150px",
        transition: "transform 0.1s ease-out"
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px", borderBottom: "1px solid #eee", paddingBottom: "3px" }}>
        {tooltipData.content.label}
      </div>
      {tooltipData.content.values.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: v.color, marginRight: "6px" }}></span>
          <span style={{ flex: 1 }}>{v.name}:</span>
          <strong className="pl-2">{typeof v.value === "number" ? formatPrice(v.value) : (v.value instanceof Date ? v.value.toLocaleDateString() : v.value)}</strong>
        </div>
      ))}
    </div>
  );
};

/**
 * Listen for window resize
 */
export const useResizeObserver = (ref: RefObject<HTMLElement | null>): DOMRectReadOnly | null => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
};

const createScale = (type: "date" | "number", range: [number, number]) => {
  switch (type) {
  case "date": return d3.scaleTime().range(range);
  case "number": return d3.scaleLinear().range(range);
  default: return d3.scaleLinear().range(range);
  }
};

interface ChartContainerProps<TX extends AxisDomain, TY extends AxisDomain> {
  data: Dataset<TX, TY>[];
  axisConfigs: AxisConfig[];
  renderContent: (props: ChartRendererProps<TX, TY>) => React.ReactNode;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
}

type InterpolatedSegment = {
  id: string;
  name: string;
  color: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

const bisectDate = d3.bisector((d: any) => d.x).left;

/**
 * Display a graph using d3 library
 * Listen for zoom event
 * Listen for mouse hover for tooltip content
 */
export const ChartContainer = <TX extends AxisDomain, TY extends AxisDomain>({
  data,
  axisConfigs,
  renderContent,
  margin = { top: 20, right: 60, bottom: 30, left: 60 },
  className,
}: ChartContainerProps<TX, TY>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(containerRef);
  const zoomRectRef = useRef<SVGRectElement>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [shouldAnimateContent, setShouldAnimateContent] = useState(true);

  const [tooltip, setTooltip] = useState<TooltipData<TY> | null>(null);
  const clipPathId = useMemo(() => `chart-clip-${Math.random().toString(36)}`, []);
  const [activeScreenX, setActiveScreenX] = useState<number | null>(null);
  const [activePoints, setActivePoints] = useState<Array<{name: string; color: string; x: number; y: number;}>>([]);
  const animRef = useRef<{ id: number | null; start: number; from: number; to: number; duration: number; segments: InterpolatedSegment[] } | null>(null);

  const hasVisibleData = useMemo(() => {
    return data.some(d => d.visibility && d.stats.length > 0);
  }, [data]);

  useEffect(() => {
    setZoomTransform(d3.zoomIdentity);
  }, [data]);

  useEffect(() => {
    setShouldAnimateContent(true);
    const rafId = requestAnimationFrame(() => {
      setShouldAnimateContent(false);
    });
    return () => cancelAnimationFrame(rafId);
  }, [data]);

  const width = dimensions ? dimensions.width - margin.left - margin.right : 0;
  const height = dimensions ? dimensions.height - margin.top - margin.bottom : 0;

  const domains = useMemo(() => {
    const domainsMap: Record<string, any[]> = {};
    axisConfigs.forEach(cfg => domainsMap[cfg.id] = []);
    data.filter(d => d.visibility).forEach(dataset => {
      const xValues = dataset.stats.map(s => s.x);
      const yValues = dataset.stats.map(s => s.y);
      if (domainsMap[dataset.yAxisId]) {
        domainsMap[dataset.yAxisId].push(...yValues);
      }
      if (domainsMap["x-axis"]) {
        domainsMap["x-axis"].push(...xValues);
      }
    });
    const result: Record<string, any[]> = {};
    axisConfigs.forEach(cfg => {
      const values = domainsMap[cfg.id];
      const extent = d3.extent(values);
      // Add 2% on top to avoid clipping the graph curve
      if(typeof extent[1] === "number" && cfg.position === "left" || cfg.position === "right") {
        extent[1] += (extent[1] - extent[0])*0.02;
      }
      result[cfg.id] = cfg.position === "bottom" || cfg.position === "top"
        ? extent : [0, extent[1] || 100];
    });
    return result;
  }, [data, axisConfigs]);

  const scales = useMemo(() => {
    if (!width || !height) {
      return {};
    }
    const newScales: Record<string, AnyScale> = {};
    axisConfigs.forEach((cfg) => {
      const range: [number, number] = (cfg.position === "left" || cfg.position === "right") ? [height, 0] : [0, width];
      const scale = createScale(cfg.type, range).domain(domains[cfg.id]);
      newScales[cfg.id] = scale as any;
    });
    return newScales;
  }, [width, height, axisConfigs, domains]);

  useEffect(() => {
    if (!zoomRectRef.current || !width || !height || data.length === 0) {
      return;
    }
    const zoom = d3.zoom<SVGRectElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", (e) => setZoomTransform(e.transform));
    // Remove previous zoom handlers to avoid multiple bindings, it doesn't seem to be the case in the navigator but it's safer
    d3.select(zoomRectRef.current).on(".zoom", null);
    d3.select(zoomRectRef.current).call(zoom);
  }, [width, height, data]);

  useEffect(() => {
    if (!svgRef.current || !dimensions) return;
    const g = svgRef.current.querySelector('.chart-appear') as SVGGElement | null;
    if (!g) return;
    g.removeAttribute('data-appear');
    requestAnimationFrame(() => {
      g.setAttribute('data-appear', '1');
    });
  }, [dimensions, data]);

  useEffect(() => {
    if (!tooltip || activeScreenX == null) return;
    setTooltip(prev => prev ? { ...prev, x: activeScreenX + margin.left } : prev);
  }, [activeScreenX, margin.left]);

  const finalScales = useMemo(() => ({ ...scales }), [scales]);
  const xAxisConfig = axisConfigs.find(c => c.position === "bottom");
  if (xAxisConfig && finalScales[xAxisConfig.id]) {
    if ("rescaleX" in zoomTransform) {
      finalScales[xAxisConfig.id] = zoomTransform.rescaleX(scales[xAxisConfig.id] as any);
    }
  }

  useEffect(() => {
    return () => {
      if (animRef.current && animRef.current.id !== null) {
        cancelAnimationFrame(animRef.current.id);
        animRef.current = null;
      }
    };
  }, [data, finalScales, width, height, margin.left]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGRectElement>) => {
    const xScale = finalScales["x-axis"];
    if (!xScale || !width || !height) {
      return;
    }

    const [mouseX] = d3.pointer(event);

    let rawXValue: any;
    if ("invert" in xScale) {
      rawXValue = (xScale as any).invert(mouseX);
    } else {
      return;
    }

    const visibleData = data.filter(d => d.visibility);
    if (visibleData.length === 0) {
      return;
    }

    const refDataset = visibleData[0];
    const idx = bisectDate(refDataset.stats, rawXValue, 1);
    const d0 = refDataset.stats[idx - 1];
    const d1 = refDataset.stats[idx];

    let closestPoint = d0;
    if (d1 && d0) {
      closestPoint = (rawXValue as any) - (d0.x as any) > (d1.x as any) - (rawXValue as any) ? d1 : d0;
    } else if (d1) {
      closestPoint = d1;
    }

    if (!closestPoint) {
      setTooltip(null);
      return;
    }

    const snappedXValue = closestPoint.x;
    const tooltipValues: { name: string; value: TY; color: string; }[] = [];

    visibleData.forEach(dataset => {
      const point = dataset.stats.find(s => {
        if (s.x instanceof Date && snappedXValue instanceof Date) {
          return s.x.getTime() === snappedXValue.getTime();
        }
        return s.x === snappedXValue;
      });

      if (point) {
        tooltipValues.push({
          name: dataset.name,
          value: point.y,
          color: dataset.color
        });
      }
    });

    const xScreenPosition = (xScale as any)(snappedXValue);

    const label = snappedXValue instanceof Date
      ? `${snappedXValue.toLocaleDateString()} - ${snappedXValue.toLocaleTimeString()}`
      : String(snappedXValue);

    setTooltip({
      x: xScreenPosition + margin.left,
      y: event.nativeEvent.offsetY,
      content: {
        label,
        values: orderBy(tooltipValues, (e) => e.value, "desc")
      }
    });

    const segments: InterpolatedSegment[] = visibleData.map(dataset => {
      const idx2 = bisectDate(dataset.stats, snappedXValue, 1);
      const p0 = dataset.stats[idx2 - 1] || dataset.stats[0];
      const p1 = dataset.stats[idx2] || dataset.stats[dataset.stats.length - 1];
      const x0 = (xScale as any)(p0.x);
      const x1 = (xScale as any)(p1.x);
      const yScale = finalScales[dataset.yAxisId] as any;
      const y0 = yScale(p0.y);
      const y1 = yScale(p1.y);
      return { id: dataset.id, name: dataset.name, color: dataset.color, x0, x1, y0, y1 };
    });

    const targetX = xScreenPosition;
    const fromX = activeScreenX ?? targetX;
    if (animRef.current && animRef.current.id) {
      cancelAnimationFrame(animRef.current.id);
    }
    const duration = 300;
    const start = performance.now();
    animRef.current = { id: null, start, from: fromX, to: targetX, duration, segments };

    const step = (ts: number) => {
      if (!animRef.current) return;
      const { start, from, to, duration, segments } = animRef.current;
      const t = Math.min(1, (ts - start) / duration);
      const eased = d3.easeCubic(t);
      const curX = from + (to - from) * eased;

      const pts = segments.map(s => {
        const { x0, x1, y0, y1 } = s;
        let localT = 0;
        if (x1 !== x0) {
          localT = (curX - x0) / (x1 - x0);
        }
        localT = Math.max(0, Math.min(1, localT));
        const y = y0 + (y1 - y0) * localT;
        return { name: s.name, color: s.color, x: curX, y };
      });

      setActiveScreenX(curX);
      setActivePoints(pts);

      if (t < 1) {
        animRef.current!.id = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    };

    animRef.current.id = requestAnimationFrame(step);

  }, [data, finalScales, width, height, margin.left]);

  const handleMouseLeave = () => {
    setTooltip(null);
    setActiveScreenX(null);
    setActivePoints([]);
    if (animRef.current && animRef.current.id) {
      cancelAnimationFrame(animRef.current.id);
      animRef.current = null;
    }
  };

  if (!dimensions) {
    return <div ref={containerRef} className={cn("w-full h-full", className)}/>;
  }

  if (!hasVisibleData) {
    return (
      <div ref={containerRef} className={cn("w-full h-full flex items-center justify-center", className)}>
        <p className="text-muted-foreground font-semibold text-lg">Aucune donnée à afficher</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("w-full h-fit", className)} style={{ position: "relative" }} >
      <Tooltip tooltipData={tooltip} containerWidth={width} />

      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="overflow-visible w-full">
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {axisConfigs.map(config => (
            <Axis key={config.id} config={config} scale={finalScales[config.id]} width={width} height={height} />
          ))}

          <defs>
            <clipPath id={clipPathId}>
              <rect x={0} y={0} width={width} height={height} />
            </clipPath>
          </defs>

          <g clipPath={`url(#${clipPathId})`} className="chart-appear">
            {renderContent({
              data: data.filter(d => d.visibility),
              scales: finalScales,
              width,
              height,
              animate: shouldAnimateContent
            })}
          </g>

          <rect
            ref={zoomRectRef}
            width={width}
            height={height}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          />

          {/* vertical line is rendered using animated transform (activeScreenX) to avoid duplication */}

          {activeScreenX && (() => {
            const xScreen = activeScreenX;

            return (
              <>
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={height}
                  stroke="#ccc"
                  strokeDasharray="4 4"
                  pointerEvents="none"
                  style={{
                    transform: `translateX(${xScreen}px)`,
                    transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)'
                  }}
                />

                {activePoints.map((pt, idx) => (
                  <g key={pt.name + idx}>
                    <line
                      x1={0}
                      x2={width}
                      y1={0}
                      y2={0}
                      stroke={pt.color}
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      opacity={0.6}
                      pointerEvents="none"
                      style={{
                        transform: `translateY(${pt.y}px)`,
                        transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)'
                      }}
                    />

                    <circle
                      cx={0}
                      cy={0}
                      r={5}
                      fill={pt.color}
                      stroke="white"
                      strokeWidth={2}
                      pointerEvents="none"
                      style={{
                        transform: `translate(${xScreen}px, ${pt.y}px)`,
                        transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)'
                      }}
                    />
                  </g>
                ))}
              </>
            );
          })()}

        </g>
      </svg>
    </div>
  );
};

const Axis = ({ config, scale, width, height }: { config: AxisConfig, scale: AnyScale, width: number, height: number }) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!ref.current || !scale) {
      return;
    }

    const format = d3.timeFormat("%Hh%M %m-%d");

    let axisGenerator;
    switch (config.position) {
    case "left": axisGenerator = d3.axisLeft(scale as any); break;
    case "right": axisGenerator = d3.axisRight(scale as any); break;
    case "bottom":
      axisGenerator = d3.axisBottom(scale as any)
        .tickFormat(config.type === "date" ? (format as any) : null);
      break;
    case "top": axisGenerator = d3.axisTop(scale as any); break;
    }

    const group = d3.select(ref.current);
    group.call(axisGenerator as any);

    const ticks = group.selectAll<SVGGElement, unknown>(".tick");
    const isHorizontal = config.position === "bottom" || config.position === "top";

    const textsNode = ticks.nodes().map(tick => {
      const text = tick.querySelector("text");
      if (!text) {
        return null;
      }
      return {
        tick,
        rect: text.getBoundingClientRect()
      };
    }).filter((item) => item !== null && item.rect.width !== 0 && item.rect.height !== 0) as Array<{ tick: SVGGElement; rect: DOMRect }>;

    textsNode.sort((a, b) => {
      return isHorizontal
        ? a.rect.left - b.rect.left
        : a.rect.top - b.rect.top;
    });

    let lastEnd = -Infinity;
    const padding = (textsNode.at(0)?.rect.width ?? 0) * 0.1;

    textsNode.forEach(({ tick, rect }) => {
      const start = isHorizontal ? rect.left : rect.top;
      const end = isHorizontal ? rect.right : rect.bottom;

      if (start < lastEnd + padding) {
        tick.remove();
      } else {
        lastEnd = end;
      }
    });

    if (config.color) {
      group.selectAll("line").attr("stroke", config.color);
      group.selectAll("text").attr("fill", config.color);
      group.selectAll("path").attr("stroke", config.color);
    }
  }, [scale, config]);

  let transform = "";
  if (config.position === "bottom") {
    transform = `translate(0, ${height})`;
  }
  if (config.position === "right") {
    transform = `translate(${width}, 0)`;
  }

  return <g ref={ref} transform={transform} />;
};