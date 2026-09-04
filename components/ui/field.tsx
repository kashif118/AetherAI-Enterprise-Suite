import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  /** Rendered under the control; replaced by `error` when one is present. */
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /** Receives the ids the control must wire up for accessibility. */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/**
 * Wraps a control with its label, hint and error message, and connects them
 * with `aria-describedby` / `aria-invalid` so every form in the app is
 * accessible without each page repeating the wiring.
 */
export function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-danger-fg">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p id={errorId} role="alert" className="text-[13px] text-danger-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[13px] text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
