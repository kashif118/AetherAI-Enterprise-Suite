"use client";

import { useEffect } from "react";

interface HotkeyOptions {
  /** Require Cmd on macOS / Ctrl elsewhere. */
  meta?: boolean;
  shift?: boolean;
  enabled?: boolean;
}

/**
 * Binds a global shortcut. Ignores presses while the user is typing, unless
 * the binding uses a modifier.
 */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  { meta = false, shift = false, enabled = true }: HotkeyOptions = {},
) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(event.metaKey || event.ctrlKey)) return;
      if (!meta && (event.metaKey || event.ctrlKey)) return;
      if (shift !== event.shiftKey) return;

      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing && !meta) return;

      event.preventDefault();
      handler(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, shift, enabled]);
}
