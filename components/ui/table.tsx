import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Table primitives. The wrapper scrolls horizontally on its own so a wide
 * table never makes the page scroll sideways on mobile.
 */
export function TableWrapper({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("scrollbar-thin w-full overflow-x-auto", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <table
      className={cn("w-full min-w-[640px] border-collapse text-sm", className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-border px-4 py-2.5 text-left text-[12px] font-semibold tracking-wide text-fg-subtle uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className={cn("border-b border-border px-4 py-3 align-middle text-fg", className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr className={cn("transition-colors hover:bg-surface-2", className)} {...props} />
  );
}
