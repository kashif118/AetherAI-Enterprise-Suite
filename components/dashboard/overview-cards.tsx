"use client";

import { useCallback } from "react";
import { SkeletonCardGrid } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { getDashboardSummary } from "@/services/analytics.service";
import { StatCard } from "./stat-card";

export function OverviewCards() {
  const load = useCallback(
    (signal: AbortSignal) => getDashboardSummary({ signal }),
    [],
  );
  const { data, isLoading, isError, error, refetch } = useAsync(load, []);

  if (isLoading) return <SkeletonCardGrid count={4} />;

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <ErrorState
          compact
          title="Usage statistics unavailable"
          message={error ?? "Something went wrong."}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data?.metrics.map((metric) => (
        <StatCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
