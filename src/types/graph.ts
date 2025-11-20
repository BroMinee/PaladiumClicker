import * as d3 from "d3";

export type AxisDomain = number | Date | string;

export type AxisPosition = "left" | "right" | "bottom" | "top";

export interface AxisConfig {
  id: string;
  position: AxisPosition;
  type: "date" | "number" | "category";
  label?: string;
  color?: string;
}

export interface DataPoint<TX extends AxisDomain, TY extends AxisDomain> {
  x: TX;
  y: TY;
}

export interface Dataset<TX extends AxisDomain, TY extends AxisDomain> {
  id: string;
  name: string;
  color: string;
  visibility: boolean;
  yAxisId: string;
  xAxisId?: string;
  stats: DataPoint<TX, TY>[];
}

export interface ChartRendererProps<TX extends AxisDomain, TY extends AxisDomain> {
  data: Dataset<TX, TY>[];
  scales: Record<string, AnyScale>;
  width: number;
  height: number;
}

export type AnyScale =
  | d3.ScaleTime<number, number>
  | d3.ScaleLinear<number, number>
  | d3.ScaleBand<string>;

export interface TooltipData {
  x: number;
  y: number;
  content: {
    label: string;
    values: {
      name: string;
      value: string | number;
      color: string
    }[];
  } | null;
}