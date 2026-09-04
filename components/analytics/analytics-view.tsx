"use client";

import { BarChart3, Download, LineChart } from "lucide-react";
import { useCallback, useState } from "react";
import { BarChart } from "@/components/charts/bar-chart";
import { ColumnChart } from "@/components/charts/column-chart";
import { StackedAreaChart } from "@/components/charts/stacked-area-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton, SkeletonCardGrid } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { ANALYTICS_RANGES, RANGE_LABELS } from "@/lib/mock/analytics";
import { TOKEN_PRICE_NOTE } from "@/lib/constants";
import { formatCurrency, formatDuration, formatPercent } from "@/lib/utils";
import { getOverview } from "@/services/analytics.service";
import type { AnalyticsRange } from "@/types";
import { UsageTable } from "./usage-table";

export function AnalyticsView() {
  const { toast } = useToast();
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [view, setView] = useState<"chart" | "table">("chart");

  const load = useCallback(
    (signal: AbortSignal) => getOverview(range, { signal }),
    [range],
  );
  const { data, isLoading, isError, error, refetch } = useAsync(load, [range]);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Adoption, spend and model performance across the workspace. Figures update hourly."
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                variant: "info",
                title: "Export needs a backend",
                description:
                  "CSV export streams from the analytics service, which isn't connected in this build.",
              })
            }
          >
            <Download aria-hidden className="size-4" />
            Export CSV
          </Button>
        }
      >
        <SegmentedControl
          label="Time range"
          value={range}
          onChange={setRange}
          options={ANALYTICS_RANGES.map((value) => ({
            value,
            label: RANGE_LABELS[value],
          }))}
        />
      </PageHeader>

      {isError ? (
        <div className="rounded-xl border border-border bg-surface">
          <ErrorState
            title="Couldn't load analytics"
            message={error ?? "Something went wrong."}
            onRetry={refetch}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <SkeletonCardGrid count={6} className="xl:grid-cols-3" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data?.metrics.map((metric) => (
                <StatCard key={metric.id} metric={metric} />
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Requests over time</CardTitle>
                <p className="mt-0.5 text-[13px] text-fg-muted">
                  Stacked by model · {RANGE_LABELS[range]}
                </p>
              </div>
              <SegmentedControl
                size="sm"
                label="Chart or table view"
                value={view}
                onChange={setView}
                options={[
                  { value: "chart", label: "Chart" },
                  { value: "table", label: "Table" },
                ]}
              />
            </CardHeader>
            <CardContent className={view === "table" ? "p-0" : undefined}>
              {isLoading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : data ? (
                view === "chart" ? (
                  <StackedAreaChart
                    series={data.usageOverTime}
                    height={280}
                    ariaLabel={`Requests over time by model, ${RANGE_LABELS[range]}`}
                  />
                ) : (
                  <UsageTable series={data.usageOverTime} />
                )
              ) : (
                <EmptyState
                  compact
                  icon={LineChart}
                  title="No usage in this period"
                  description="Nothing was sent to a model in the selected range."
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Requests by model</CardTitle>
                  <p className="mt-0.5 text-[13px] text-fg-muted">
                    Where the volume actually goes
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton rows={5} />
                ) : data ? (
                  <BarChart
                    data={data.requestsByModel}
                    ariaLabel="Requests by model"
                  />
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Spend by team</CardTitle>
                  <p className="mt-0.5 text-[13px] text-fg-muted">
                    {TOKEN_PRICE_NOTE}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton rows={6} />
                ) : data ? (
                  <BarChart
                    data={data.spendByTeam}
                    color="var(--chart-2)"
                    valueFormatter={(value) => formatCurrency(value, 0)}
                    ariaLabel="Estimated spend by team"
                  />
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Median latency by model</CardTitle>
                  <p className="mt-0.5 text-[13px] text-fg-muted">
                    p50 time to first token
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[220px] w-full" />
                ) : data ? (
                  <ColumnChart
                    data={data.latencyByModel.map((datum) => ({
                      ...datum,
                      label: datum.label.replace(/^(Aether|Northwind)\s/, ""),
                    }))}
                    color="var(--chart-3)"
                    valueFormatter={formatDuration}
                    ariaLabel="Median latency by model"
                  />
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Adoption by department</CardTitle>
                  <p className="mt-0.5 text-[13px] text-fg-muted">
                    Members who ran at least one request
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton rows={6} />
                ) : data ? (
                  <ul className="space-y-4">
                    {data.adoption.map((row) => {
                      const percent = (row.value / row.total) * 100;
                      return (
                        <li key={row.label}>
                          <Progress
                            label={`${row.label} adoption`}
                            value={row.value}
                            max={row.total}
                            showLabel
                            valueText={`${row.value} of ${row.total} · ${formatPercent(percent, 0)}`}
                            tone={percent < 45 ? "warning" : "primary"}
                            size="sm"
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Where this comes from</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-[13px] leading-relaxed text-fg-muted">
              <p className="flex items-start gap-2">
                <BarChart3 aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                <span>
                  Every figure on this page is generated from a fixed seed in{" "}
                  <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[12px]">
                    lib/mock/analytics.ts
                  </code>{" "}
                  so the charts are stable between renders. Swap{" "}
                  <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[12px]">
                    services/analytics.service.ts
                  </code>{" "}
                  for a real endpoint and this page needs no other change — the
                  payload shape is already the one it consumes.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function ChartSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-3 w-28 shrink-0" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}
