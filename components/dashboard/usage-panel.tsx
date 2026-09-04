"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { BarChart } from "@/components/charts/bar-chart";
import { StackedAreaChart } from "@/components/charts/stacked-area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { getDashboardSummary } from "@/services/analytics.service";

/** Usage over time plus the model split — the dashboard's analytics slice. */
export function UsagePanel() {
  const load = useCallback(
    (signal: AbortSignal) => getDashboardSummary({ signal }),
    [],
  );
  const { data, isLoading, isError, error, refetch } = useAsync(load, []);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>AI usage</CardTitle>
            <p className="mt-0.5 text-[13px] text-fg-muted">
              Requests per day by model, last 30 days
            </p>
          </div>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
          >
            Full analytics
            <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-[260px] w-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : isError ? (
            <ErrorState
              compact
              title="Chart unavailable"
              message={error ?? "Something went wrong."}
              onRetry={refetch}
            />
          ) : data ? (
            <StackedAreaChart
              series={data.usageOverTime}
              ariaLabel="Requests per day by model over the last 30 days"
            />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Requests by model</CardTitle>
            <p className="mt-0.5 text-[13px] text-fg-muted">Last 30 days</p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-3 w-full" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              compact
              title="Breakdown unavailable"
              message={error ?? "Something went wrong."}
              onRetry={refetch}
            />
          ) : data ? (
            <BarChart
              data={data.requestsByModel}
              ariaLabel="Requests by model over the last 30 days"
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
