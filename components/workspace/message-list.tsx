"use client";

import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import type { Message } from "@/types";
import { ConversationStarters } from "./conversation-starters";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRetry: () => void;
  onStarterSelect: (prompt: string) => void;
  /** Bumped whenever a new message arrives, to trigger the scroll. */
  scrollKey: string | number;
}

export function MessageList({
  messages,
  isLoading,
  isError,
  error,
  onRetry,
  onStarterSelect,
  scrollKey,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [scrollKey]);

  if (isLoading) {
    return (
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <ErrorState
          title="Couldn't load this conversation"
          message={error ?? "Something went wrong."}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="scrollbar-thin flex min-h-0 flex-1 overflow-y-auto">
        <ConversationStarters onSelect={onStarterSelect} />
      </div>
    );
  }

  return (
    <div className="scrollbar-thin min-h-0 flex-1 divide-y divide-border overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} className="h-4" />
    </div>
  );
}
