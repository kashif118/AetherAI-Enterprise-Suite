"use client";

import { useState } from "react";
import { cn, formatCompact } from "@/lib/utils";
import type { CategoryDatum } from "@/types";

interface BarChartProps {
  data: CategoryDatum[];
  valueFormatter?: (value: number) => string;
  /** Single-hue by default: these bars encode magnitude, not identity. */
  color?: string;
  ariaLabel: string;
  className?: string;
}

/**
 * Horizontal bars for ranked categories, built from block elements so the
 * 4px rounded data end stays a true 4px at any width. Every bar carries a
 * direct value label — which is also the relief for the light-mode contrast
 * warning on the lighter chart hues.
 */
export function BarChart({
  data,
  valueFormatter = formatCompact,
  color = "var(--chart-1)",
  ariaLabel,
  className,
}: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((datum) => datum.value), 1);

  return (
    <ul aria-label={ariaLabel} className={cn("space-y-3", className)}>
      {data.map((datum, index) => {
        const percent = Math.max((datum.value / max) * 100, 1);
        return (
          <li
            key={datum.label}
            onPointerEnter={() => setHovered(index)}
            onPointerLeave={() => setHovered(null)}
            className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,9.5rem)_1fr_auto]"
          >
            <span className="truncate text-[13px] text-fg-muted" title={datum.label}>
              {datum.label}
            </span>

            <span className="h-3 min-w-0 overflow-hidden rounded-[3px] bg-surface-3">
              <span
                className="block h-full rounded-l-[2px] rounded-r-[4px] transition-[width,opacity] duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: color,
                  opacity: hovered === null || hovered === index ? 1 : 0.5,
                }}
              />
            </span>

            <span className="w-14 text-right text-[13px] font-medium text-fg tabular-nums">
              {valueFormatter(datum.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
