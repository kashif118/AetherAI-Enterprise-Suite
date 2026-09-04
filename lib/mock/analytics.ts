import type {
  AnalyticsOverview,
  AnalyticsRange,
  MetricSummary,
  TimeSeries,
} from "@/types";
import { MOCK_NOW, seededRandom } from "@/lib/utils";

const SERIES_KEYS = ["nova", "flux", "swift", "codex"] as const;

const SERIES_LABELS: Record<string, string> = {
  nova: "Aether Nova 2",
  flux: "Aether Flux",
  swift: "Aether Swift",
  codex: "Aether Codex",
};

/** Baseline daily request volume per model, before seasonality and noise. */
const SERIES_BASE: Record<string, number> = {
  nova: 5_600,
  flux: 12_400,
  swift: 8_900,
  codex: 6_100,
};

const RANGE_CONFIG: Record<
  AnalyticsRange,
  { buckets: number; stepDays: number; label: string; comparison: string }
> = {
  "7d": { buckets: 7, stepDays: 1, label: "Last 7 days", comparison: "vs previous 7 days" },
  "30d": { buckets: 30, stepDays: 1, label: "Last 30 days", comparison: "vs previous 30 days" },
  "90d": { buckets: 45, stepDays: 2, label: "Last 90 days", comparison: "vs previous 90 days" },
  "12m": { buckets: 12, stepDays: 30, label: "Last 12 months", comparison: "vs previous year" },
};

export const RANGE_LABELS: Record<AnalyticsRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Deterministic synthetic usage. A real implementation would hit
 * `GET /v1/analytics/usage?range=…`; the shape returned here is the shape the
 * charts already consume, so only the fetch changes.
 */
function buildUsageSeries(range: AnalyticsRange): TimeSeries {
  const { buckets, stepDays } = RANGE_CONFIG[range];
  const scale = stepDays * (range === "12m" ? 30 : 1);

  const points = Array.from({ length: buckets }, (_, index) => {
    const date = new Date(
      MOCK_NOW.getTime() - (buckets - 1 - index) * stepDays * DAY_MS,
    );
    const weekday = date.getUTCDay();
    // Weekends are quiet for an internal enterprise tool.
    const weekendFactor = range === "12m" ? 1 : weekday === 0 || weekday === 6 ? 0.42 : 1;
    // Gentle adoption growth across the window.
    const growth = 0.82 + (index / Math.max(buckets - 1, 1)) * 0.36;

    const series = SERIES_KEYS.reduce<Record<string, number>>((acc, key, slot) => {
      const noise = 0.86 + seededRandom(index * 7 + slot * 31 + 3) * 0.28;
      acc[key] = Math.round(
        SERIES_BASE[key] * scale * weekendFactor * growth * noise,
      );
      return acc;
    }, {});

    return { date: date.toISOString(), series };
  });

  return {
    keys: [...SERIES_KEYS],
    labels: SERIES_LABELS,
    points,
  };
}

function totalFor(series: TimeSeries) {
  return series.points.reduce(
    (sum, point) =>
      sum + series.keys.reduce((inner, key) => inner + (point.series[key] ?? 0), 0),
    0,
  );
}

function historyFor(series: TimeSeries, take = 14) {
  return series.points
    .slice(-take)
    .map((point) =>
      series.keys.reduce((sum, key) => sum + (point.series[key] ?? 0), 0),
    );
}

function buildMetrics(range: AnalyticsRange, series: TimeSeries): MetricSummary[] {
  const requests = totalFor(series);
  const comparison = RANGE_CONFIG[range].comparison;
  const history = historyFor(series);

  return [
    {
      id: "requests",
      label: "Total requests",
      value: requests,
      format: "compact",
      trend: { direction: "up", percent: 18.4, label: comparison, positiveIsGood: true },
      history,
      helpText: "Completed model calls across every workspace.",
    },
    {
      id: "tokens",
      label: "Tokens processed",
      value: Math.round(requests * 1_820),
      format: "compact",
      trend: { direction: "up", percent: 22.1, label: comparison, positiveIsGood: true },
      history: history.map((value) => value * 1_820),
      helpText: "Input and output tokens combined.",
    },
    {
      id: "spend",
      label: "Estimated spend",
      value: Math.round(requests * 0.0094 * 100) / 100,
      format: "currency",
      trend: { direction: "up", percent: 9.7, label: comparison, positiveIsGood: false },
      history: history.map((value) => value * 0.0094),
      helpText: "Indicative, from list pricing. Excludes self-hosted models.",
    },
    {
      id: "latency",
      label: "Median latency",
      value: 1_240,
      format: "duration",
      trend: { direction: "down", percent: 12.3, label: comparison, positiveIsGood: false },
      history: [1580, 1520, 1470, 1495, 1410, 1380, 1360, 1330, 1305, 1290, 1270, 1258, 1249, 1240],
      helpText: "p50 time to first token across all models.",
    },
    {
      id: "active-users",
      label: "Active users",
      value: 167,
      format: "number",
      trend: { direction: "up", percent: 6.2, label: comparison, positiveIsGood: true },
      history: [131, 138, 142, 140, 149, 153, 151, 158, 160, 159, 163, 164, 166, 167],
      helpText: "Members who ran at least one request in the period.",
    },
    {
      id: "success-rate",
      label: "Success rate",
      value: 99.2,
      format: "percent",
      trend: { direction: "flat", percent: 0.1, label: comparison, positiveIsGood: true },
      history: [98.9, 99.0, 99.1, 98.8, 99.2, 99.3, 99.1, 99.2, 99.4, 99.2, 99.1, 99.3, 99.2, 99.2],
      helpText: "Requests that completed without a retryable error.",
    },
  ];
}

export function getAnalyticsOverview(range: AnalyticsRange): AnalyticsOverview {
  const usageOverTime = buildUsageSeries(range);
  const requests = totalFor(usageOverTime);

  return {
    range,
    metrics: buildMetrics(range, usageOverTime),
    usageOverTime,
    requestsByModel: [
      { label: "Aether Flux", value: Math.round(requests * 0.37) },
      { label: "Aether Swift", value: Math.round(requests * 0.26) },
      { label: "Aether Codex", value: Math.round(requests * 0.21) },
      { label: "Aether Nova 2", value: Math.round(requests * 0.13) },
      { label: "Northwind Atlas 1", value: Math.round(requests * 0.03) },
    ],
    spendByTeam: [
      { label: "Platform Engineering", value: 18_420 },
      { label: "Data & Insights", value: 14_960 },
      { label: "Product Engineering", value: 11_240 },
      { label: "Customer Engineering", value: 7_880 },
      { label: "Legal & Risk", value: 4_310 },
      { label: "Marketing", value: 2_140 },
    ],
    latencyByModel: [
      { label: "Aether Swift", value: 420 },
      { label: "Aether Flux", value: 980 },
      { label: "Aether Codex", value: 1_640 },
      { label: "Northwind Atlas 1", value: 2_180 },
      { label: "Aether Nova 2", value: 3_260 },
    ],
    adoption: [
      { label: "Platform Engineering", value: 46, total: 52 },
      { label: "Product Engineering", value: 38, total: 49 },
      { label: "Data & Insights", value: 31, total: 34 },
      { label: "Customer Engineering", value: 27, total: 41 },
      { label: "Legal & Risk", value: 16, total: 28 },
      { label: "Marketing", value: 9, total: 24 },
    ],
  };
}

export const ANALYTICS_RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "12m"];
