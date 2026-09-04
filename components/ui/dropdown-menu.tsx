"use client";

import {
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  /** Rendered as the button that opens the menu. */
  trigger: (props: { isOpen: boolean }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
  align?: "start" | "end";
  /** Menu width; the trigger stays whatever size it is. */
  className?: string;
  label: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  className,
  label,
}: DropdownMenuProps) {
  const { isOpen, toggle, close } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => close(), [close]);
  useClickOutside(containerRef, handleClose, isOpen);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={toggle}
        className="flex items-center rounded-lg"
      >
        {trigger({ isOpen })}
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-[calc(100%+6px)] z-50 min-w-52 animate-scale-in rounded-xl border border-border bg-surface p-1 shadow-lg shadow-black/5 dark:shadow-black/40",
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className,
          )}
        >
          {children({ close: handleClose })}
        </div>
      ) : null}
    </div>
  );
}

const ITEM_CLASS =
  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg";

export function DropdownItem({
  onSelect,
  children,
  className,
  destructive = false,
}: {
  onSelect: () => void;
  children: ReactNode;
  className?: string;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        ITEM_CLASS,
        destructive && "text-danger-fg hover:bg-danger-soft hover:text-danger-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownLink({
  href,
  onSelect,
  children,
  className,
}: {
  href: string;
  onSelect?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className={cn(ITEM_CLASS, className)}
    >
      {children}
    </Link>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
      {children}
    </p>
  );
}
