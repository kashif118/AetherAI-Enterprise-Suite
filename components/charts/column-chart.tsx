"use client";

import { useState } from "react";
import { useMeasure } from "@/hooks/use-measure";
import { cn, formatCompact } from "@/lib/utils";
import type { CategoryDatum } from "@/types";
import { linearScale, niceTicks, roundedColumnPath } from "./chart-utils";

interface ColumnChartProps {
  data: CategoryDatum[];
  valueFormatter?: (value: number) => string;
  color?: string;
  ariaLabel: string;
  height?: number;
  className?: string;
}

const MARGIN = { top: 12, right: 4, bottom: 34, left: 46 };

/** Vertical columns with a 2px gap between neighbours and a rounded top. */
export function ColumnChart({
  data,
  valueFormatter = formatCompact,
  color = "var(--chart-1)",
  ariaLabel,
  height = 220,
  className,
}: ColumnChartProps) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const max = Math.max(...data.map((datum) => datum.value), 1);
  const ticks = niceTicks(max, 4);
  const domainMax = Math.max(ticks[ticks.length - 1] ?? max, max);
  const y = linearScale([0, domainMax], [innerHeight, 0]);

  const slot = data.length > 0 ? innerWidth / data.length : 0;
  const barWidth = Math.max(slot - 10, 6);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          className="block"
          onPointerLeave={() => setHovered(null)}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="var(--chart-grid)"
                  strokeWidth={1}
                />
                <text
                  x={-10}
                  y={y(tick)}
                  dy="0.32em"
                  textAnchor="end"
                  className="fill-fg-subtle text-[11px] tabular-nums"
                >
                  {valueFormatter(tick)}
                </text>
              </g>
            ))}

            {data.map((datum, index) => {
              const barHeight = Math.max(innerHeight - y(datum.value), 1);
              const x = index * slot + (slot - barWidth) / 2;
              return (
                <g
                  key={datum.label}
                  onPointerEnter={() => setHovered(index)}
                  onPointerDown={() => setHovered(index)}
                >
                  <rect
                    x={index * slot}
                    y={0}
                    width={slot}
                    height={innerHeight}
                    fill="transparent"
                  />
                  <path
                    d={roundedColumnPath(x, y(datum.value), barWidth, barHeight, 4)}
                    fill={color}
                    opacity={hovered === null || hovered === index ? 1 : 0.55}
                    style={{ transition: "opacity 120ms ease" }}
                  />
                  {hovered === index ? (
                    <text
                      x={x + barWidth / 2}
                      y={y(datum.value) - 7}
                      textAnchor="middle"
                      className="fill-fg text-[11px] font-semibold tabular-nums"
                    >
                      {valueFormatter(datum.value)}
                    </text>
                  ) : null}
                  <text
                    x={x + barWidth / 2}
                    y={innerHeight + 17}
                    textAnchor="middle"
                    className="fill-fg-subtle text-[11px]"
                  >
                    {datum.label}
                  </text>
                </g>
              );
            })}

            <line
              x1={0}
              x2={innerWidth}
              y1={innerHeight}
              y2={innerHeight}
              stroke="var(--chart-axis)"
              strokeWidth={1}
            />
          </g>
        </svg>
      ) : (
        <div style={{ height }} />
      )}
    </div>
  );
}
