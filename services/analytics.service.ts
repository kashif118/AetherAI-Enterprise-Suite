import { MOCK_LATENCY } from "@/lib/constants";
import { getAnalyticsOverview } from "@/lib/mock/analytics";
import type { AnalyticsOverview, AnalyticsRange } from "@/types";
import { request, type RequestOptions } from "./api-client";

export function getOverview(
  range: AnalyticsRange = "30d",
  options?: RequestOptions,
): Promise<AnalyticsOverview> {
  return request(() => getAnalyticsOverview(range), {
    latency: MOCK_LATENCY.normal,
    ...options,
  });
}

/** The dashboard shows a trimmed version of the same payload. */
export function getDashboardSummary(options?: RequestOptions) {
  return request(() => {
    const overview = getAnalyticsOverview("30d");
    return {
      metrics: overview.metrics.slice(0, 4),
      usageOverTime: overview.usageOverTime,
      requestsByModel: overview.requestsByModel,
    };
  }, options);
}
