"use client";

import { useMemo, useState } from "react";
import { useMeasure } from "@/hooks/use-measure";
import { formatCompact, formatDate } from "@/lib/utils";
import type { TimeSeries } from "@/types";
import { linearScale, niceTicks, seriesColor, svgPath } from "./chart-utils";
import { ChartLegend } from "./chart-legend";

interface StackedAreaChartProps {
  series: TimeSeries;
  height?: number;
  valueFormatter?: (value: number) => string;
  /** Names the chart for screen readers; the visible title lives in the card. */
  ariaLabel: string;
  className?: string;
}

const MARGIN = { top: 12, right: 14, bottom: 26, left: 46 };

export function StackedAreaChart({
  series,
  height = 260,
  valueFormatter = formatCompact,
  ariaLabel,
  className,
}: StackedAreaChartProps) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const { totals, max, bands, xScale, yScale, ticks } = useMemo(() => {
    const totalsPerPoint = series.points.map((point) =>
      series.keys.reduce((sum, key) => sum + (point.series[key] ?? 0), 0),
    );
    const maxTotal = Math.max(...totalsPerPoint, 1);
    const tickValues = niceTicks(maxTotal, 4);
    const domainMax = Math.max(tickValues[tickValues.length - 1] ?? maxTotal, maxTotal);

    const x = linearScale([0, Math.max(series.points.length - 1, 1)], [0, innerWidth]);
    const y = linearScale([0, domainMax], [innerHeight, 0]);

    // Cumulative stacking, slot order preserved.
    const offsets = new Array(series.points.length).fill(0) as number[];
    const stacked = series.keys.map((key, slot) => {
      const upper = series.points.map((point, index) => {
        offsets[index] += point.series[key] ?? 0;
        return { x: x(index), y: y(offsets[index]), value: offsets[index] };
      });
      const lower = series.points.map((point, index) => ({
        x: x(index),
        y: y(offsets[index] - (point.series[key] ?? 0)),
      }));

      const back = [...lower]
        .reverse()
        .map((point) => `L${point.x} ${point.y}`)
        .join(" ");

      return {
        key,
        slot,
        color: seriesColor(slot),
        area: `${svgPath(upper)} ${back} Z`,
        top: svgPath(upper),
      };
    });

    return {
      totals: totalsPerPoint,
      max: domainMax,
      bands: stacked,
      xScale: x,
      yScale: y,
      ticks: tickValues,
    };
  }, [series, innerWidth, innerHeight]);

  const xLabelIndices = useMemo(() => {
    const count = series.points.length;
    if (count <= 1) return [0];
    const step = Math.max(1, Math.round(count / 5));
    const indices: number[] = [];
    for (let index = 0; index < count; index += step) indices.push(index);
    if (indices[indices.length - 1] !== count - 1) indices.push(count - 1);
    return indices;
  }, [series.points.length]);

  const handleMove = (event: React.PointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / (bounds.width || 1);
    const index = Math.round(ratio * (series.points.length - 1));
    setHovered(Math.max(0, Math.min(series.points.length - 1, index)));
  };

  const activePoint = hovered !== null ? series.points[hovered] : null;
  const tooltipLeft = hovered !== null ? MARGIN.left + xScale(hovered) : 0;

  const legendEntries = series.keys.map((key, slot) => ({
    key,
    label: series.labels[key] ?? key,
    color: seriesColor(slot),
  }));

  return (
    <div className={className}>
      <div ref={ref} className="relative w-full">
        {width > 0 ? (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel}
            className="block overflow-visible"
            onPointerLeave={() => setHovered(null)}
          >
            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={0}
                    x2={innerWidth}
                    y1={yScale(tick)}
                    y2={yScale(tick)}
                    stroke="var(--chart-grid)"
                    strokeWidth={1}
                  />
                  <text
                    x={-10}
                    y={yScale(tick)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-fg-subtle text-[11px] tabular-nums"
                  >
                    {valueFormatter(tick)}
                  </text>
                </g>
              ))}

              {bands.map((band) => (
                <g key={band.key}>
                  <path d={band.area} fill={band.color} />
                  {/* 2px surface gap keeps adjacent fills legibly separate. */}
                  <path
                    d={band.top}
                    fill="none"
                    stroke="var(--surface)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                </g>
              ))}

              <line
                x1={0}
                x2={innerWidth}
                y1={innerHeight}
                y2={innerHeight}
                stroke="var(--chart-axis)"
                strokeWidth={1}
              />

              {xLabelIndices.map((index) => (
                <text
                  key={index}
                  x={xScale(index)}
                  y={innerHeight + 17}
                  textAnchor={
                    index === 0
                      ? "start"
                      : index === series.points.length - 1
                        ? "end"
                        : "middle"
                  }
                  className="fill-fg-subtle text-[11px]"
                >
                  {formatDate(series.points[index].date, false)}
                </text>
              ))}

              {hovered !== null ? (
                <g pointerEvents="none">
                  <line
                    x1={xScale(hovered)}
                    x2={xScale(hovered)}
                    y1={0}
                    y2={innerHeight}
                    stroke="var(--fg-subtle)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={xScale(hovered)}
                    cy={yScale(totals[hovered])}
                    r={4}
                    fill="var(--fg)"
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                </g>
              ) : null}

              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
                onPointerMove={handleMove}
                onPointerDown={handleMove}
              />
            </g>
          </svg>
        ) : (
          <div style={{ height }} />
        )}

        {activePoint && hovered !== null ? (
          <div
            role="status"
            className="pointer-events-none absolute top-2 z-10 w-48 rounded-lg border border-border bg-surface p-2.5 text-[13px] shadow-lg shadow-black/5 dark:shadow-black/40"
            style={{
              left: Math.max(
                0,
                Math.min(tooltipLeft - 96, Math.max(width - 192, 0)),
              ),
            }}
          >
            <p className="mb-1.5 font-medium text-fg">
              {formatDate(activePoint.date)}
            </p>
            <ul className="space-y-1">
              {series.keys.map((key, slot) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: seriesColor(slot) }}
                    />
                    <span className="truncate text-fg-muted">
                      {series.labels[key] ?? key}
                    </span>
                  </span>
                  <span className="font-medium text-fg tabular-nums">
                    {valueFormatter(activePoint.series[key] ?? 0)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 border-t border-border pt-1">
                <span className="text-fg-muted">Total</span>
                <span className="font-semibold text-fg tabular-nums">
                  {valueFormatter(totals[hovered])}
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <ChartLegend entries={legendEntries} className="mt-4" />
      <p className="sr-only">
        Peak total in this period: {valueFormatter(Math.max(...totals))}. Axis
        maximum {valueFormatter(max)}.
      </p>
    </div>
  );
}
