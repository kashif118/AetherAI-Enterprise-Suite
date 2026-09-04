"use client";

import { ArrowUpRight, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { AvatarGroup } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SkeletonRows } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { formatRelativeTime } from "@/lib/utils";
import { getRecentProjects } from "@/services/projects.service";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

export function RecentProjects() {
  const load = useCallback(
    (signal: AbortSignal) => getRecentProjects(4, { signal }),
    [],
  );
  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent projects</CardTitle>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
        >
          All projects
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </CardHeader>

      {isLoading ? (
        <SkeletonRows count={4} />
      ) : isError ? (
        <ErrorState
          compact
          title="Projects unavailable"
          message={error ?? "Something went wrong."}
          onRetry={refetch}
        />
      ) : isEmpty ? (
        <EmptyState
          compact
          icon={FolderPlus}
          title="No projects yet"
          description="Projects group conversations, members and budgets. Create one to get started."
          action={
            <ButtonLink href="/projects" size="sm">
              Create a project
            </ButtonLink>
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {data?.map((project) => (
            <li key={project.id}>
              <Link
                href="/projects"
                className="block px-5 py-4 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-medium text-fg">
                    {project.name}
                  </p>
                  <ProjectStatusBadge status={project.status} />
                </div>

                <p className="mt-1 line-clamp-1 text-[13px] text-fg-muted">
                  {project.description}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <Progress
                    label={`${project.name} progress`}
                    value={project.progress}
                    size="sm"
                    className="flex-1"
                  />
                  <span className="w-9 shrink-0 text-right text-[12px] font-medium text-fg-muted tabular-nums">
                    {project.progress}%
                  </span>
                  <AvatarGroup people={project.members} max={3} size="xs" />
                </div>

                <p className="mt-2 text-[12px] text-fg-subtle">
                  Updated {formatRelativeTime(project.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
