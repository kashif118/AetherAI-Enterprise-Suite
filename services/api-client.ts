import { MOCK_LATENCY } from "@/lib/constants";

/**
 * The single seam between the UI and the outside world.
 *
 * Every function in `services/` returns a promise and can reject with
 * `ApiError`, exactly as it would once a backend exists. Today those promises
 * resolve from `lib/mock/*`; to connect a real API, replace the body of
 * `request()` with `fetch()` and delete nothing else — signatures, error
 * handling and every loading/empty/error state in the UI stay as they are.
 */

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = "internal_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export interface RequestOptions {
  /** Simulated round-trip time. Keeps loading states honest in development. */
  latency?: number;
  signal?: AbortSignal;
}

/**
 * Resolves `payload` after a simulated round trip.
 *
 * @example
 * // Once a backend exists this becomes:
 * // const res = await fetch(`${BASE_URL}${path}`, { signal });
 * // if (!res.ok) throw new ApiError(await res.text(), res.status);
 * // return res.json() as Promise<T>;
 */
export async function request<T>(
  payload: T | (() => T),
  { latency = MOCK_LATENCY.normal, signal }: RequestOptions = {},
): Promise<T> {
  await delay(latency);

  if (signal?.aborted) {
    throw new ApiError("Request cancelled", 499, "cancelled");
  }

  return typeof payload === "function" ? (payload as () => T)() : payload;
}

/** Client-side pagination helper shared by the list services. */
export function paginate<T>(items: T[], page = 1, pageSize = 12) {
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    page,
    pageSize,
    total: items.length,
    hasMore: start + slice.length < items.length,
  };
}
