import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  as: Component = "div",
  interactive = false,
  ...props
}: ComponentPropsWithoutRef<"div"> & { as?: ElementType; interactive?: boolean }) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-border bg-surface",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-150 hover:border-border-strong hover:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  as: Component = "h2",
  ...props
}: ComponentPropsWithoutRef<"h2"> & { as?: ElementType }) {
  return (
    <Component
      className={cn("text-[15px] leading-6 font-semibold text-fg", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-sm text-fg-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}
