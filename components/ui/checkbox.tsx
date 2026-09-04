"use client";

import { Check } from "lucide-react";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: ReactNode;
  hint?: string;
}

export function Checkbox({ label, hint, className, ...props }: CheckboxProps) {
  const id = useId();

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="relative flex items-center">
        <input
          id={id}
          type="checkbox"
          className="peer size-4.5 cursor-pointer appearance-none rounded-[5px] border border-border-strong bg-surface transition-colors checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <Check
          aria-hidden
          className="pointer-events-none absolute left-0.5 size-3.5 text-primary-fg opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
      <span className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm text-fg">
          {label}
        </label>
        {hint ? <p className="mt-0.5 text-[13px] text-fg-muted">{hint}</p> : null}
      </span>
    </div>
  );
}
