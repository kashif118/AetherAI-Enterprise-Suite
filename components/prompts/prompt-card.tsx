import { Star, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatNumber, titleCase } from "@/lib/utils";
import type { Prompt } from "@/types";

const VISIBILITY_LABEL: Record<Prompt["visibility"], string> = {
  private: "Private",
  team: "Team",
  organization: "Organisation",
};

export function PromptCard({
  prompt,
  onOpen,
}: {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
}) {
  return (
    <Card interactive className="h-full" as="article">
      <button
        type="button"
        onClick={() => onOpen(prompt)}
        className="flex h-full w-full flex-col p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] leading-6 font-semibold text-fg">
            {prompt.title}
          </h3>
          {prompt.favorite ? (
            <Star
              aria-hidden
              className="size-4 shrink-0 fill-warning text-warning"
            />
          ) : null}
          <span className="sr-only">
            {prompt.favorite ? "Favourited" : ""}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
          {prompt.description}
        </p>

        <pre
          className={cn(
            "mt-4 line-clamp-3 rounded-lg border border-border bg-surface-2 p-2.5",
            "font-mono text-[12px] leading-relaxed break-words whitespace-pre-wrap text-fg-muted",
          )}
        >
          {prompt.body}
        </pre>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="primary">{titleCase(prompt.category)}</Badge>
          <Badge tone="neutral">
            <Users aria-hidden className="size-3" />
            {VISIBILITY_LABEL[prompt.visibility]}
          </Badge>
          {prompt.variables.length > 0 ? (
            <Badge tone="neutral">
              {prompt.variables.length} variable
              {prompt.variables.length === 1 ? "" : "s"}
            </Badge>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="flex items-center gap-2">
            <Avatar
              name={prompt.author.name}
              initials={prompt.author.initials}
              size="xs"
            />
            <span className="truncate text-[12px] text-fg-muted">
              {prompt.author.name}
            </span>
          </span>
          <span className="shrink-0 text-[12px] text-fg-subtle tabular-nums">
            {formatNumber(prompt.usageCount)} uses
          </span>
        </div>
      </button>
    </Card>
  );
}
