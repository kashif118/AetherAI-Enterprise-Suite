"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reports the rendered width of an element.
 *
 * The SVG charts draw at real pixel sizes rather than scaling a fixed viewBox,
 * so strokes stay 2px and labels stay 11px at every breakpoint.
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
