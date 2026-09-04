import {
  BarChart3,
  Bot,
  FolderKanban,
  Library,
  MessagesSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { listQuickActions } from "@/services/activity.service";
import type { QuickAction } from "@/types";

const ICONS: Record<QuickAction["icon"], LucideIcon> = {
  chat: MessagesSquare,
  workspace: Bot,
  prompt: Library,
  project: FolderKanban,
  team: Users,
  analytics: BarChart3,
};

/** Static configuration, so this renders on the server with no loading state. */
export function QuickActions() {
  const actions = listQuickActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = ICONS[action.icon];
          return (
            <li key={action.id} className="bg-surface">
              <Link
                href={action.href}
                className="flex h-full items-start gap-3 p-4 transition-colors hover:bg-surface-2"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-fg">
                  <Icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-fg">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-fg-muted">
                    {action.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
