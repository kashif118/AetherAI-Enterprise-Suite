import type { MetricFormat } from "@/types";
import {
  formatCompact,
  formatCurrency,
  formatDuration,
  formatNumber,
  formatPercent,
} from "./utils";

export function formatMetric(value: number, format: MetricFormat) {
  switch (format) {
    case "currency":
      return formatCurrency(value, value >= 1000 ? 0 : 2);
    case "percent":
      return formatPercent(value);
    case "compact":
      return formatCompact(value);
    case "duration":
      return formatDuration(value);
    default:
      return formatNumber(value);
  }
}

/**
 * Whether a trend should read as good news. "Spend up 9%" is not an
 * improvement even though the arrow points the same way as "requests up 9%".
 */
export function trendTone(
  direction: "up" | "down" | "flat",
  positiveIsGood: boolean,
): "positive" | "negative" | "neutral" {
  if (direction === "flat") return "neutral";
  const isUp = direction === "up";
  return isUp === positiveIsGood ? "positive" : "negative";
}
