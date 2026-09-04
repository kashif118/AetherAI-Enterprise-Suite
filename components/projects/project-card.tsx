import { CalendarDays, MessagesSquare, Zap } from "lucide-react";
import { AvatarGroup } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCompact, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectStatusBadge } from "./project-status-badge";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <Card
      interactive
      className={cn("flex h-full flex-col p-5", className)}
      as="article"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] leading-6 font-semibold text-fg">
          {project.name}
        </h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
        {project.description}
      </p>

      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[12px] text-fg-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <Progress
          label={`${project.name} progress`}
          displayLabel="Progress"
          value={project.progress}
          showLabel
          valueText={`${project.progress}%`}
          size="sm"
        />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-[12px]">
        <div>
          <dt className="flex items-center gap-1 text-fg-subtle">
            <MessagesSquare aria-hidden className="size-3.5" />
            Chats
          </dt>
          <dd className="mt-0.5 font-medium text-fg tabular-nums">
            {formatCompact(project.conversationCount)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-fg-subtle">
            <Zap aria-hidden className="size-3.5" />
            Tokens
          </dt>
          <dd className="mt-0.5 font-medium text-fg tabular-nums">
            {formatCompact(project.tokensUsed)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-fg-subtle">
            <CalendarDays aria-hidden className="size-3.5" />
            {project.dueAt ? "Due" : "Updated"}
          </dt>
          <dd className="mt-0.5 font-medium text-fg">
            {project.dueAt
              ? formatDate(project.dueAt, false)
              : formatRelativeTime(project.updatedAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        <AvatarGroup people={project.members} />
        <span className="text-[12px] text-fg-subtle">
          Updated {formatRelativeTime(project.updatedAt)}
        </span>
      </div>
    </Card>
  );
}
