import { RefreshCw, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  /** One sentence saying what would appear here, and how to make it appear. */
  description: string;
  action?: ReactNode;
  className?: string;
  /** Compact spacing for use inside a card rather than a full page. */
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        compact ? "py-10" : "py-16",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-fg-subtle">
        <Icon aria-hidden className="size-5" />
      </span>
      <p className="mt-4 text-[15px] font-semibold text-fg">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-fg-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Couldn't load this",
  message,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        compact ? "py-10" : "py-16",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl border border-danger/25 bg-danger-soft text-danger-fg">
        <TriangleAlert aria-hidden className="size-5" />
      </span>
      <p className="mt-4 text-[15px] font-semibold text-fg">{title}</p>
      <p className="mt-1.5 max-w-md text-sm text-fg-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw aria-hidden className="size-3.5" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
