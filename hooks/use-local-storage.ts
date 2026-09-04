"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Reads and writes a JSON value in `localStorage`.
 *
 * Backed by `useSyncExternalStore` rather than an effect, so the server render
 * and the hydrating client render agree (both use the initial value) and the
 * stored value is adopted in the render that follows.
 *
 * Every access is guarded: private mode, cleared site data and browsers set to
 * block storage all throw. When storage is unavailable the value still lives in
 * an in-memory mirror for the session.
 */

const memory = new Map<string, string>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function readRaw(key: string): string | null {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) return stored;
  } catch {
    // Storage blocked — fall through to the in-memory mirror.
  }
  return memory.get(key) ?? null;
}

function writeRaw(key: string, raw: string) {
  memory.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // Not persisted, but the session still sees the new value.
  }
  emit(key);
}

function subscribeToKey(key: string, onChange: () => void) {
  const set = listeners.get(key) ?? new Set();
  set.add(onChange);
  listeners.set(key, set);

  // Keep tabs in sync with each other.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * `initialValue` must be stable across renders — a primitive, or a value
 * hoisted out of the component. It participates in memo identity.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToKey(key, onChange),
    [key],
  );

  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [raw, initialValue]);

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(value) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    [key, value],
  );

  return [value, setValue] as const;
}
