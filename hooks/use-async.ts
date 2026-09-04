"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import { toErrorMessage } from "@/services/api-client";
import type { AsyncState } from "@/types";

export interface UseAsyncResult<T> extends AsyncState<T> {
  isLoading: boolean;
  isError: boolean;
  /** True once the request has resolved and the payload is empty. */
  isEmpty: boolean;
  refetch: () => void;
}

interface Settled<T> {
  /** Which set of deps this result belongs to. */
  key: string;
  data: T | null;
  error: string | null;
}

function isEmptyPayload(data: unknown) {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === "object" && "items" in (data as Record<string, unknown>)) {
    return (data as { items: unknown[] }).items.length === 0;
  }
  return false;
}

/**
 * Runs an async factory and exposes the loading / empty / error triad every
 * data-driven view in this app renders against.
 *
 * Loading is *derived*, not set: the resolved value is stored alongside the
 * deps it belongs to, so any render whose deps don't match the stored result
 * is a loading render. That keeps the effect free of synchronous state updates
 * and makes it impossible to show one filter's data under another's label.
 *
 * `deps` must be primitives — they are serialised to identify a result.
 */
export function useAsync<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  options: { immediate?: boolean } = {},
): UseAsyncResult<T> {
  const { immediate = true } = options;

  const [nonce, setNonce] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  // Identifies this request. Cheap to recompute each render, and a plain
  // string, so the effect below has exactly one stable dependency.
  const key = [nonce, ...deps.map(String)].join("|");

  const factoryRef = useRef(factory);
  useEffect(() => {
    factoryRef.current = factory;
  });

  useEffect(() => {
    if (!immediate) return;

    const controller = new AbortController();

    factoryRef
      .current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSettled({ key, data, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({ key, data: null, error: toErrorMessage(error) });
      });

    return () => controller.abort();
  }, [key, immediate]);

  const refetch = useCallback(() => setNonce((value) => value + 1), []);

  const current = settled?.key === key ? settled : null;
  const status: AsyncState<T>["status"] = !immediate
    ? "idle"
    : current === null
      ? "loading"
      : current.error
        ? "error"
        : "success";

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    status,
    isLoading: status === "loading",
    isError: status === "error",
    isEmpty: status === "success" && isEmptyPayload(current?.data),
    refetch,
  };
}
