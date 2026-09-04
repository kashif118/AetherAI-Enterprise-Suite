"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { findModel } from "@/lib/mock/models";
import { projects } from "@/lib/mock/projects";
import { CAPABILITY_LABELS, SPEED_LABELS } from "@/services/models.service";
import { cn, formatCompact, formatDate, formatNumber } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationDetailsProps {
  conversation: Conversation | null;
  modelId: string;
  messageCount: number;
  open: boolean;
  onClose: () => void;
}

/** Context rail: which model is answering, on what data, at what cost. */
export function ConversationDetails({
  conversation,
  modelId,
  messageCount,
  open,
  onClose,
}: ConversationDetailsProps) {
  const model = findModel(modelId);
  const project = conversation?.projectId
    ? projects.find((item) => item.id === conversation.projectId)
    : undefined;

  return (
    <aside
      aria-label="Conversation details"
      className={cn(
        "border-l border-border bg-surface",
        // Below xl it behaves as a right-hand drawer; from xl it is permanent.
        "xl:static xl:z-auto xl:block xl:w-72 xl:max-w-none xl:shrink-0 xl:shadow-none",
        open
          ? "fixed inset-y-0 right-0 z-50 w-76 max-w-[85vw] shadow-xl"
          : "hidden",
      )}
    >
      <div className="scrollbar-thin h-full overflow-y-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold tracking-wide text-fg-subtle uppercase">
            Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg xl:hidden"
          >
            <X aria-hidden className="size-4" />
            <span className="sr-only">Close details</span>
          </button>
        </div>

        <dl className="space-y-4 text-[13px]">
          <div>
            <dt className="text-fg-subtle">Conversation</dt>
            <dd className="mt-1 font-medium text-fg">
              {conversation?.title ?? "New conversation"}
            </dd>
          </div>

          <div>
            <dt className="text-fg-subtle">Messages</dt>
            <dd className="mt-1 font-medium text-fg tabular-nums">
              {formatNumber(messageCount)}
            </dd>
          </div>

          {conversation ? (
            <>
              <div>
                <dt className="text-fg-subtle">Tokens used</dt>
                <dd className="mt-1 font-medium text-fg tabular-nums">
                  {formatCompact(conversation.tokensUsed)}
                </dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Started</dt>
                <dd className="mt-1 font-medium text-fg">
                  {formatDate(conversation.createdAt)}
                </dd>
              </div>
            </>
          ) : null}

          <div>
            <dt className="text-fg-subtle">Project</dt>
            <dd className="mt-1">
              {project ? (
                <span className="font-medium text-fg">{project.name}</span>
              ) : (
                <span className="text-fg-muted">Not assigned</span>
              )}
            </dd>
          </div>
        </dl>

        {model ? (
          <section className="mt-6 rounded-lg border border-border bg-surface-2 p-3.5">
            <h3 className="text-[13px] font-semibold text-fg">{model.name}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted">
              {model.description}
            </p>

            <dl className="mt-3 space-y-1.5 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-fg-subtle">Speed</dt>
                <dd className="text-fg">{SPEED_LABELS[model.speed]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-fg-subtle">Context window</dt>
                <dd className="text-fg tabular-nums">
                  {formatCompact(model.contextWindow)} tokens
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-fg-subtle">Input / output</dt>
                <dd className="text-fg tabular-nums">
                  {model.inputCostPerMTok === 0
                    ? "Self-hosted"
                    : `$${model.inputCostPerMTok} / $${model.outputCostPerMTok} per M`}
                </dd>
              </div>
            </dl>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {model.capabilities.map((capability) => (
                <li key={capability}>
                  <Badge tone="neutral">{CAPABILITY_LABELS[capability]}</Badge>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-6 text-[12px] leading-relaxed text-fg-subtle">
          Data policy: prompts and attachments in this workspace are retained for
          90 days and are never used for training.
        </p>
      </div>
    </aside>
  );
}
