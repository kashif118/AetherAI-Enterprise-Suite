import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* Numbers                                                                     */
/* -------------------------------------------------------------------------- */

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

/** 1_240_000 → "1.24M". Used anywhere space is tight (stat tiles, axes). */
export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value < 10_000 ? 1 : 2,
  }).format(value);
}

export function formatCurrency(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number, maximumFractionDigits = 1) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value)}%`;
}

/** Milliseconds → "1.2s" / "840ms". */
export function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)}s`;
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Fixed "current time" for the mock dataset.
 *
 * Relative timestamps are rendered on the server and again on the client, so a
 * live `Date.now()` would produce a hydration mismatch. Anchoring the whole
 * mock dataset to one constant keeps both renders identical. When a real API is
 * connected, swap this for `Date.now()` and the formatters below keep working.
 */
export const MOCK_NOW = new Date("2026-09-04T14:30:00.000Z");

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

/** "3 hours ago", "yesterday", "in 2 days". */
export function formatRelativeTime(
  date: string | Date,
  now: Date = MOCK_NOW,
): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diff = target.getTime() - now.getTime();
  const abs = Math.abs(diff);

  if (abs < 45 * 1000) return "just now";

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (abs >= ms) {
      return relativeFormatter.format(Math.round(diff / ms), unit);
    }
  }
  return relativeFormatter.format(Math.round(diff / 1000), "second");
}

export function formatDate(date: string | Date, withYear = true) {
  const target = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(target);
}

export function formatTime(date: string | Date) {
  const target = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(target);
}

/** Groups conversations into the buckets the workspace sidebar renders. */
export function relativeDayBucket(
  date: string | Date,
  now: Date = MOCK_NOW,
): "Today" | "Yesterday" | "Previous 7 days" | "Previous 30 days" | "Older" {
  const target = typeof date === "string" ? new Date(date) : date;
  const days = Math.floor(
    (now.getTime() - target.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return "Previous 7 days";
  if (days < 30) return "Previous 30 days";
  return "Older";
}

/* -------------------------------------------------------------------------- */
/* Text                                                                        */
/* -------------------------------------------------------------------------- */

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Deterministic pseudo-random in [0, 1) — keeps generated mock data stable. */
export function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
