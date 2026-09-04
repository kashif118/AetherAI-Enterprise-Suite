import { activityEvents, quickActions } from "@/lib/mock/activity";
import type { ActivityEvent, QuickAction } from "@/types";
import { request, type RequestOptions } from "./api-client";

export function listActivity(
  limit = 8,
  options?: RequestOptions,
): Promise<ActivityEvent[]> {
  return request(() => activityEvents.slice(0, limit), options);
}

export function listQuickActions(): QuickAction[] {
  // Static configuration, not remote data — no request wrapper needed.
  return quickActions;
}
