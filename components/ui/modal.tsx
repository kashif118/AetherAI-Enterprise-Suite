"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/**
 * Modal dialog with focus containment, Escape to close and background scroll
 * lock. Rendered inline rather than in a portal — no ancestor in this app
 * creates a stacking or overflow context that would clip it.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog once it is on screen. A control marked
    // `data-autofocus` wins over the first focusable element.
    const timer = window.setTimeout(() => {
      const panel = panelRef.current;
      const preferred = panel?.querySelector<HTMLElement>("[data-autofocus]");
      const first = panel?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      (preferred ?? first ?? panel)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-overlay backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[90vh] w-full animate-slide-up flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl shadow-black/20 sm:rounded-2xl",
          SIZES[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-fg-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-m-1.5 rounded-lg p-1.5 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X aria-hidden className="size-4.5" />
            <span className="sr-only">Close dialog</span>
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-2 px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
