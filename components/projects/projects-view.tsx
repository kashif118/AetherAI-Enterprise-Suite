"use client";

import { FolderPlus, Plus, SearchX } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDisclosure } from "@/hooks/use-disclosure";
import { projects as allProjects } from "@/lib/mock/projects";
import { listProjects } from "@/services/projects.service";
import type { ProjectStatus } from "@/types";
import { NewProjectModal } from "./new-project-modal";
import { ProjectCard } from "./project-card";

type StatusFilter = ProjectStatus | "all";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "review", label: "In review" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

export function ProjectsView() {
  const newProject = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState("updated");

  const debouncedSearch = useDebouncedValue(search, 250);

  // Counts come from the full set so the tabs don't change as you filter.
  const counts = useMemo(() => {
    const map = new Map<StatusFilter, number>([["all", allProjects.length]]);
    for (const project of allProjects) {
      map.set(project.status, (map.get(project.status) ?? 0) + 1);
    }
    return map;
  }, []);

  const load = useCallback(
    (signal: AbortSignal) =>
      listProjects(
        { search: debouncedSearch, status, sortBy, pageSize: 24 },
        { signal },
      ),
    [debouncedSearch, status, sortBy],
  );

  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, [
    debouncedSearch,
    status,
    sortBy,
  ]);

  const hasFilters = Boolean(debouncedSearch) || status !== "all";

  return (
    <>
      <PageHeader
        title="Projects"
        description="Group conversations, members and budgets. Every project has an owner and a spend line."
        actions={
          <Button onClick={newProject.open}>
            <Plus aria-hidden className="size-4" />
            New project
          </Button>
        }
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedControl
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS.map((option) => ({
              ...option,
              count: counts.get(option.value) ?? 0,
            }))}
            className="max-w-full overflow-x-auto"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput
              label="Search projects"
              placeholder="Search projects…"
              value={search}
              onChange={setSearch}
              className="sm:w-64"
            />
            <label className="sr-only" htmlFor="project-sort">
              Sort by
            </label>
            <Select
              id="project-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="sm:w-48"
            >
              <option value="updated">Recently updated</option>
              <option value="name">Name A–Z</option>
              <option value="progress">Progress</option>
              <option value="tokens">Token usage</option>
            </Select>
          </div>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-3/4" />
              <Skeleton className="mt-5 h-2 w-full" />
              <Skeleton className="mt-5 h-10 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-border bg-surface">
          <ErrorState
            title="Couldn't load projects"
            message={error ?? "Something went wrong."}
            onRetry={refetch}
          />
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border border-border bg-surface">
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No projects match"
              description="Nothing matches those filters. Try another status, or clear the search."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={FolderPlus}
              title="No projects yet"
              description="Projects give work a boundary: members, models and a budget that someone owns."
              action={
                <Button size="sm" onClick={newProject.open}>
                  Create your first project
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <>
          <p className="mb-3 text-[13px] text-fg-muted" aria-live="polite">
            {data?.total} project{data?.total === 1 ? "" : "s"}
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.items.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </>
      )}

      <NewProjectModal open={newProject.isOpen} onClose={newProject.close} />
    </>
  );
}
