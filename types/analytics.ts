import type { ISODateString, Trend } from "./common";

export type MetricFormat = "number" | "currency" | "percent" | "compact" | "duration";

export interface MetricSummary {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  trend: Trend;
  /** Sparkline series, oldest → newest. */
  history: number[];
  helpText?: string;
}

/** One point on a time axis; `series` keys map to chart slot order. */
export interface TimeSeriesPoint {
  date: ISODateString;
  series: Record<string, number>;
}

export interface TimeSeries {
  /** Keys in fixed slot order — chart colours are assigned from this order. */
  keys: string[];
  labels: Record<string, string>;
  points: TimeSeriesPoint[];
}

export interface CategoryDatum {
  label: string;
  value: number;
}

export type AnalyticsRange = "7d" | "30d" | "90d" | "12m";

export interface AnalyticsOverview {
  range: AnalyticsRange;
  metrics: MetricSummary[];
  usageOverTime: TimeSeries;
  requestsByModel: CategoryDatum[];
  spendByTeam: CategoryDatum[];
  latencyByModel: CategoryDatum[];
  adoption: { label: string; value: number; total: number }[];
}
