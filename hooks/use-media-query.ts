"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. The server snapshot is always `false`, so components
 * must render a layout that is correct before the match is known — which is
 * what the mobile-first Tailwind classes already do.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Matches Tailwind's `lg` breakpoint, where the sidebar becomes permanent. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
