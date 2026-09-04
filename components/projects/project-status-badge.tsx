import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types";

const STATUS: Record<ProjectStatus, { label: string; tone: BadgeTone }> = {
  active: { label: "Active", tone: "success" },
  review: { label: "In review", tone: "warning" },
  paused: { label: "Paused", tone: "neutral" },
  archived: { label: "Archived", tone: "neutral" },
};

export const PROJECT_STATUS_LABELS = STATUS;

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS[status];
  return (
    <Badge tone={config.tone} dot>
      {config.label}
    </Badge>
  );
}
