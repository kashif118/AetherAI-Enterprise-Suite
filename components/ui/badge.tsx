import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-fg-muted border-border",
  primary: "bg-primary-soft text-primary-soft-fg border-transparent",
  success: "bg-success-soft text-success-fg border-transparent",
  warning: "bg-warning-soft text-warning-fg border-transparent",
  danger: "bg-danger-soft text-danger-fg border-transparent",
  info: "bg-info-soft text-info-fg border-transparent",
};

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
  /**
   * Renders a small filled dot before the label. Status is never carried by
   * colour alone — the label always states the value in words.
   */
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden className="size-1.5 rounded-full bg-current opacity-80" />
      ) : null}
      {children}
    </span>
  );
}
