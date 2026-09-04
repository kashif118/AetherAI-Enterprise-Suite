"use client";

import { ArrowUpRight, MessageSquarePlus, Pin } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonRows } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { modelName } from "@/lib/mock/models";
import { formatCompact, formatRelativeTime } from "@/lib/utils";
import { getRecentConversations } from "@/services/conversations.service";

export function RecentConversations() {
  const load = useCallback(
    (signal: AbortSignal) => getRecentConversations(5, { signal }),
    [],
  );
  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent conversations</CardTitle>
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
        >
          Open workspace
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </CardHeader>

      {isLoading ? (
        <SkeletonRows count={5} />
      ) : isError ? (
        <ErrorState
          compact
          title="Conversations unavailable"
          message={error ?? "Something went wrong."}
          onRetry={refetch}
        />
      ) : isEmpty ? (
        <EmptyState
          compact
          icon={MessageSquarePlus}
          title="No conversations yet"
          description="Start one in the workspace and it will show up here."
          action={
            <ButtonLink href="/workspace" size="sm">
              Start a conversation
            </ButtonLink>
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {data?.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href="/workspace"
                className="block px-5 py-3.5 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center gap-2">
                  {conversation.pinned ? (
                    <Pin aria-hidden className="size-3.5 shrink-0 text-primary" />
                  ) : null}
                  <p className="truncate text-sm font-medium text-fg">
                    {conversation.title}
                  </p>
                </div>

                <p className="mt-1 line-clamp-1 text-[13px] text-fg-muted">
                  {conversation.preview}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-subtle">
                  <Badge tone="neutral">{modelName(conversation.modelId)}</Badge>
                  <span className="tabular-nums">
                    {conversation.messageCount} messages
                  </span>
                  <span className="tabular-nums">
                    {formatCompact(conversation.tokensUsed)} tokens
                  </span>
                  <span>{formatRelativeTime(conversation.updatedAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
