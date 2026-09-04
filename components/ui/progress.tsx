import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  /** Accessible name — always present, even when no label is shown. */
  label: string;
  /** Shown above the bar. Falls back to `label`. */
  displayLabel?: string;
  showLabel?: boolean;
  valueText?: string;
  tone?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

const TONES = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export function Progress({
  value,
  max = 100,
  label,
  displayLabel,
  showLabel = false,
  valueText,
  tone = "primary",
  size = "md",
  className,
}: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {showLabel ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[13px] text-fg-muted">{displayLabel ?? label}</span>
          <span className="text-[13px] font-medium text-fg tabular-nums">
            {valueText ?? `${Math.round(percent)}%`}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={valueText}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-3",
          size === "sm" ? "h-1.5" : "h-2",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", TONES[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
