"use client";

import {
  Check,
  Copy,
  Paperclip,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { modelName } from "@/lib/mock/models";
import { currentUser } from "@/lib/mock/users";
import { cn, formatBytes, formatNumber, formatTime } from "@/lib/utils";
import type { Message } from "@/types";
import { Markdown } from "./markdown";
import { TypingIndicator } from "./typing-indicator";

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const { copied, copy } = useCopyToClipboard();
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "group flex animate-fade-in gap-3 px-4 py-5 sm:px-6",
        isUser ? "bg-transparent" : "bg-surface-2/50",
      )}
    >
      <div className="shrink-0">
        {isUser ? (
          <Avatar name={currentUser.name} initials={currentUser.initials} size="sm" />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-surface">
            <LogoMark className="size-5" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <header className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold text-fg">
            {isUser ? currentUser.name : modelName(message.modelId ?? "")}
          </span>
          <time
            dateTime={message.createdAt}
            className="text-[12px] text-fg-subtle tabular-nums"
          >
            {formatTime(message.createdAt)}
          </time>
          {message.tokens ? (
            <span className="text-[12px] text-fg-subtle tabular-nums">
              · {formatNumber(message.tokens)} tokens
            </span>
          ) : null}
        </header>

        {message.status === "error" ? (
          <div
            role="alert"
            className="flex gap-2.5 rounded-lg border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger-fg"
          >
            <TriangleAlert aria-hidden className="mt-px size-4 shrink-0" />
            <div className="min-w-0">
              <p>{message.errorMessage ?? "The request failed."}</p>
              {onRetry ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2.5"
                  onClick={onRetry}
                >
                  <RefreshCw aria-hidden className="size-3.5" />
                  Retry
                </Button>
              ) : null}
            </div>
          </div>
        ) : message.status === "streaming" ? (
          <TypingIndicator />
        ) : isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-fg">
            {message.content}
          </p>
        ) : (
          <Markdown content={message.content} />
        )}

        {message.attachments?.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5"
              >
                <Paperclip aria-hidden className="size-3.5 text-fg-subtle" />
                <span className="max-w-40 truncate text-[13px] text-fg">
                  {attachment.name}
                </span>
                <span className="text-[12px] text-fg-subtle tabular-nums">
                  {formatBytes(attachment.size)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {!isUser && message.status === "complete" ? (
          <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => copy(message.content)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg"
            >
              {copied ? (
                <Check aria-hidden className="size-3.5 text-success-fg" />
              ) : (
                <Copy aria-hidden className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              aria-pressed={feedback === "up"}
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={cn(
                "rounded-md p-1.5 transition-colors hover:bg-surface-3",
                feedback === "up" ? "text-success-fg" : "text-fg-subtle hover:text-fg",
              )}
            >
              <ThumbsUp aria-hidden className="size-3.5" />
              <span className="sr-only">Helpful</span>
            </button>
            <button
              type="button"
              aria-pressed={feedback === "down"}
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={cn(
                "rounded-md p-1.5 transition-colors hover:bg-surface-3",
                feedback === "down" ? "text-danger-fg" : "text-fg-subtle hover:text-fg",
              )}
            >
              <ThumbsDown aria-hidden className="size-3.5" />
              <span className="sr-only">Not helpful</span>
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
