import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { formatMetric, trendTone } from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { MetricSummary } from "@/types";

const TONE_CLASS = {
  positive: "text-success-fg",
  negative: "text-danger-fg",
  neutral: "text-fg-muted",
} as const;

/** The arrow states which way the number moved; the colour states whether
 *  that is good news. "Spend up 9.7%" points up and reads red. */
const DIRECTION_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

/**
 * A stat tile: the number is the headline, the sparkline is shape only, and
 * the delta states its direction in words as well as colour.
 */
export function StatCard({
  metric,
  className,
}: {
  metric: MetricSummary;
  className?: string;
}) {
  const tone = trendTone(metric.trend.direction, metric.trend.positiveIsGood);
  const Icon = DIRECTION_ICON[metric.trend.direction];
  const directionWord =
    metric.trend.direction === "flat"
      ? "unchanged"
      : metric.trend.direction === "up"
        ? "up"
        : "down";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-fg-muted">{metric.label}</p>
        <Sparkline
          data={metric.history}
          width={72}
          height={24}
          color={tone === "negative" ? "var(--chart-2)" : "var(--chart-1)"}
        />
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">
        {formatMetric(metric.value, metric.format)}
      </p>

      <p className={cn("mt-2 flex items-center gap-1 text-[13px]", TONE_CLASS[tone])}>
        <Icon aria-hidden className="size-3.5" />
        <span className="font-medium">
          {directionWord} {metric.trend.percent}%
        </span>
        <span className="text-fg-subtle">{metric.trend.label}</span>
      </p>

      {metric.helpText ? (
        <p className="mt-2 text-[12px] leading-relaxed text-fg-subtle">
          {metric.helpText}
        </p>
      ) : null}
    </div>
  );
}
