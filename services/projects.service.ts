import { projects } from "@/lib/mock/projects";
import type { Paginated, Project, ProjectStatus, QueryOptions } from "@/types";
import { paginate, request, type RequestOptions } from "./api-client";

export interface ProjectQuery extends QueryOptions {
  status?: ProjectStatus | "all";
}

function matches(project: Project, query: ProjectQuery) {
  const term = query.search?.trim().toLowerCase();
  const statusOk =
    !query.status || query.status === "all" || project.status === query.status;
  if (!statusOk) return false;
  if (!term) return true;
  return (
    project.name.toLowerCase().includes(term) ||
    project.description.toLowerCase().includes(term) ||
    project.tags.some((tag) => tag.includes(term))
  );
}

export function listProjects(
  query: ProjectQuery = {},
  options?: RequestOptions,
): Promise<Paginated<Project>> {
  return request(() => {
    const filtered = projects.filter((project) => matches(project, query));
    const sorted = [...filtered].sort((a, b) => {
      if (query.sortBy === "name") return a.name.localeCompare(b.name);
      if (query.sortBy === "progress") return b.progress - a.progress;
      if (query.sortBy === "tokens") return b.tokensUsed - a.tokensUsed;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return paginate(sorted, query.page ?? 1, query.pageSize ?? 12);
  }, options);
}

export function getRecentProjects(limit = 4, options?: RequestOptions) {
  return request(
    () =>
      [...projects]
        .filter((project) => project.status !== "archived")
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, limit),
    options,
  );
}

export function getProject(id: string, options?: RequestOptions) {
  return request(
    () => projects.find((project) => project.id === id) ?? null,
    options,
  );
}
