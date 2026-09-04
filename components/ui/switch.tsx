"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Hide the visible label but keep it as the accessible name. */
  hideLabel?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  hideLabel = false,
  className,
}: SwitchProps) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "border-transparent bg-primary"
          : "border-border-strong bg-surface-3",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-150",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );

  if (hideLabel) return <span className={className}>{control}</span>;

  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[13px] text-fg-muted">{description}</span>
        ) : null}
      </span>
      {control}
    </div>
  );
}
