"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonRows } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { formatRelativeTime } from "@/lib/utils";
import { listActivity } from "@/services/activity.service";

export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const load = useCallback(
    (signal: AbortSignal) => listActivity(limit, { signal }),
    [limit],
  );
  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, [limit]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <p className="text-[13px] text-fg-muted">Across the workspace</p>
      </CardHeader>

      {isLoading ? (
        <SkeletonRows count={5} />
      ) : isError ? (
        <ErrorState
          compact
          title="Activity unavailable"
          message={error ?? "Something went wrong."}
          onRetry={refetch}
        />
      ) : isEmpty ? (
        <EmptyState
          compact
          icon={Activity}
          title="Nothing has happened yet"
          description="When your team creates projects, publishes prompts or invites members, it shows up here."
        />
      ) : (
        <ol className="px-5 py-4">
          {data?.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < (data?.length ?? 0) - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-8 bottom-0 left-4 w-px -translate-x-1/2 bg-border"
                />
              ) : null}

              <Avatar
                name={event.actor.name}
                initials={event.actor.initials}
                size="sm"
                className="relative z-10"
              />

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] leading-5 text-fg-muted">
                  <span className="font-medium text-fg">{event.actor.name}</span>{" "}
                  {event.action}{" "}
                  {event.href ? (
                    <Link
                      href={event.href}
                      className="font-medium text-fg hover:text-primary hover:underline"
                    >
                      {event.target}
                    </Link>
                  ) : (
                    <span className="font-medium text-fg">{event.target}</span>
                  )}
                </p>
                <p className="mt-0.5 text-[12px] text-fg-subtle">
                  {formatRelativeTime(event.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
