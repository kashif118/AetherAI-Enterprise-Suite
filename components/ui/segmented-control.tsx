"use client";

import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Optional count shown after the label, e.g. a result total. */
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  /** Names the group for screen readers, e.g. "Time range". */
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A row of mutually exclusive filters. Used for time ranges and status
 * filters — not for switching page content, which uses `Tabs`.
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[7px] font-medium whitespace-nowrap transition-colors duration-150",
              size === "sm" ? "h-7 px-2.5 text-[13px]" : "h-8 px-3 text-sm",
              selected
                ? "bg-surface text-fg shadow-sm"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] tabular-nums",
                  selected ? "bg-surface-3 text-fg-muted" : "text-fg-subtle",
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
