"use client";

import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
} as const;

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "text-success-fg",
  error: "text-danger-fg",
  warning: "text-warning-fg",
  info: "text-info-fg",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { ...input, id }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {toasts.map((item) => {
          const Icon = VARIANT_ICON[item.variant];
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lg shadow-black/5 dark:shadow-black/40"
            >
              <Icon
                aria-hidden
                className={cn("mt-0.5 size-4.5 shrink-0", VARIANT_STYLES[item.variant])}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-sm text-fg-muted">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="-m-1 rounded-md p-1 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <X aria-hidden className="size-4" />
                <span className="sr-only">Dismiss notification</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
