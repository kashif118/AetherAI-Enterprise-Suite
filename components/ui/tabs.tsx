"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: TabItem<T>[];
  label: string;
  className?: string;
}

/**
 * WAI-ARIA tab list with arrow-key roving focus. Panels are rendered by the
 * caller and must carry `id={tabPanelId(value)}` plus
 * `aria-labelledby={tabId(value)}`.
 */
export function Tabs<T extends string>({
  value,
  onChange,
  items,
  label,
  className,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = items.findIndex((item) => item.value === value);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;

    event.preventDefault();
    onChange(items[next].value);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    buttons?.[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "scrollbar-thin -mb-px flex gap-1 overflow-x-auto border-b border-border",
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            id={tabId(item.value)}
            aria-selected={selected}
            aria-controls={tabPanelId(item.value)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150",
              selected
                ? "border-primary text-fg"
                : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export const tabId = (value: string) => `tab-${value}`;
export const tabPanelId = (value: string) => `tabpanel-${value}`;

export function TabPanel({
  value,
  active,
  children,
  className,
}: {
  value: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={tabPanelId(value)}
      aria-labelledby={tabId(value)}
      tabIndex={0}
      className={cn("animate-fade-in focus-visible:outline-none", className)}
    >
      {children}
    </div>
  );
}
