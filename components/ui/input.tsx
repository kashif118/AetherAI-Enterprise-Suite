import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const controlBase =
  "w-full rounded-lg border bg-surface text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-fg-subtle";

export const controlBorder =
  "border-border hover:border-border-strong focus:border-primary focus-visible:outline-none focus:ring-2 focus:ring-primary/25";

export const controlInvalid =
  "border-danger focus:border-danger focus:ring-danger/25";

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  invalid?: boolean;
  /** Icon rendered inside the field, on the leading edge. */
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function Input({
  className,
  invalid,
  leading,
  trailing,
  ...props
}: InputProps) {
  const control = (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        invalid ? controlInvalid : controlBorder,
        "h-9.5 px-3",
        leading && "pl-9",
        trailing && "pr-9",
        className,
      )}
      {...props}
    />
  );

  if (!leading && !trailing) return control;

  return (
    <div className="relative">
      {leading ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-subtle"
        >
          {leading}
        </span>
      ) : null}
      {control}
      {trailing ? (
        <span className="absolute inset-y-0 right-2.5 flex items-center text-fg-subtle">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        invalid ? controlInvalid : controlBorder,
        "min-h-24 resize-y px-3 py-2 leading-6",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: ComponentPropsWithoutRef<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          controlBase,
          invalid ? controlInvalid : controlBorder,
          "h-9.5 cursor-pointer appearance-none pr-9 pl-3",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-subtle"
      >
        <path
          d="m6 8 4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
