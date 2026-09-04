"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `handler` on a pointer press outside `ref`, or on Escape.
 * Used by every dismissible surface so the behaviour is identical across them.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current;
      if (!node || node.contains(event.target as Node)) return;
      handler();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, handler, enabled]);
}
