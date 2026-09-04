import { cn } from "@/lib/utils";
import { linearScale, svgPath } from "./chart-utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Fills the area under the line at low opacity. */
  filled?: boolean;
  className?: string;
}

/**
 * Trend shape only — no axes, no labels. The number it accompanies carries the
 * value, so the sparkline is decorative and hidden from assistive tech.
 */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  color = "var(--chart-1)",
  filled = true,
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const x = linearScale([0, data.length - 1], [1, width - 1]);
  const y = linearScale([min, max === min ? min + 1 : max], [height - 2, 2]);

  const points = data.map((value, index) => ({ x: x(index), y: y(value) }));
  const line = svgPath(points);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      className={cn("shrink-0 overflow-visible", className)}
    >
      {filled ? (
        <path
          d={`${line} L${width - 1} ${height} L1 ${height} Z`}
          fill={color}
          opacity={0.12}
        />
      ) : null}
      <path
        d={line}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
