import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-shimmer rounded-md bg-surface-3", className)}
    />
  );
}

/** Placeholder for a block of text; `lines` mirrors the real paragraph length. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/**
 * Skeletons mirror the layout they replace so the page does not jump when the
 * data lands. Each list/grid below matches its real counterpart's geometry.
 */
export function SkeletonCardGrid({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-border bg-surface p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-7 w-28" />
          <Skeleton className="mt-3 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-5 py-3.5">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}
