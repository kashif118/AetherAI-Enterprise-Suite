/**
 * Small helpers shared by the hand-built SVG charts.
 *
 * Charts are drawn directly rather than pulled from a charting library: the
 * product needs four chart forms, all of them simple, and this keeps the
 * bundle free of a ~500 kB dependency while giving exact control over the
 * mark specs (thin marks, rounded data ends, surface gaps).
 */

/** Categorical slots, in fixed order. Never cycled — a 5th series folds to "Other". */
export const SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const;

export function seriesColor(slot: number) {
  return SERIES_COLORS[slot % SERIES_COLORS.length];
}

export interface Scale {
  (value: number): number;
}

export function linearScale(
  domain: [number, number],
  range: [number, number],
): Scale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** "Nice" axis ticks — at most `count`, landing on 1/2/5 × 10ⁿ. */
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const rough = max / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const step =
    (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;

  const ticks: number[] = [];
  for (let value = 0; value <= max + step * 0.001; value += step) {
    ticks.push(value);
  }
  return ticks;
}

export function svgPath(points: { x: number; y: number }[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

/**
 * Horizontal bar with a 4px rounded data end, anchored square to the baseline.
 * Falls back to a plain rect when the bar is shorter than the radius.
 */
export function roundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 4,
) {
  const r = Math.min(radius, width, height / 2);
  if (r <= 0) return `M${x} ${y}h${width}v${height}h${-width}z`;
  return [
    `M${x} ${y}`,
    `H${x + width - r}`,
    `A${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V${y + height - r}`,
    `A${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H${x}`,
    "Z",
  ].join(" ");
}

/** Vertical column with a rounded top, anchored square to the baseline. */
export function roundedColumnPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 4,
) {
  const r = Math.min(radius, height, width / 2);
  if (r <= 0) return `M${x} ${y}h${width}v${height}h${-width}z`;
  return [
    `M${x} ${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    `H${x + width - r}`,
    `A${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V${y + height}`,
    `H${x}`,
    "Z",
  ].join(" ");
}
