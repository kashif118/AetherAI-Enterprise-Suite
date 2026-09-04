import { cn } from "@/lib/utils";

export interface LegendEntry {
  key: string;
  label: string;
  color: string;
  value?: string;
}

/**
 * A legend is present for every chart with two or more series, so identity is
 * never carried by colour alone. Text stays in ink tokens; only the swatch is
 * coloured.
 */
export function ChartLegend({
  entries,
  className,
}: {
  entries: LegendEntry[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {entries.map((entry) => (
        <li key={entry.key} className="flex items-center gap-2 text-[13px]">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-fg-muted">{entry.label}</span>
          {entry.value ? (
            <span className="font-medium text-fg tabular-nums">{entry.value}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
