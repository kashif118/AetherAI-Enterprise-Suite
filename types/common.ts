/** Shapes shared across every domain model. */

/** ISO-8601 timestamp string, e.g. `2026-08-14T09:24:00.000Z`. */
export type ISODateString = string;

export type ID = string;

/**
 * The state machine every async view in the app renders against.
 * Keeping this explicit is what makes loading / empty / error states
 * consistent rather than ad-hoc per page.
 */
export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

/** Envelope returned by every function in `services/`. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export type SortDirection = "asc" | "desc";

export interface QueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export type TrendDirection = "up" | "down" | "flat";

export interface Trend {
  direction: TrendDirection;
  /** Percentage change against the comparison period. */
  percent: number;
  label: string;
  /** Whether an upward move is a good thing for this metric. */
  positiveIsGood: boolean;
}
