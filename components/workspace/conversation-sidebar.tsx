"use client";

import {
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  SearchX,
  Trash2,
  X,
} from "lucide-react";
import { useMemo } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { modelName } from "@/lib/mock/models";
import { cn, formatRelativeTime, relativeDayBucket } from "@/lib/utils";
import type { Conversation } from "@/types";

const BUCKET_ORDER = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Previous 30 days",
  "Older",
] as const;

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRetry: () => void;
  /** Mobile drawer state; the panel is permanent from `lg` up. */
  open: boolean;
  onClose: () => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  search,
  onSearchChange,
  isLoading,
  isError,
  error,
  onRetry,
  open,
  onClose,
}: ConversationSidebarProps) {
  const { toast } = useToast();

  const grouped = useMemo(() => {
    const pinned = conversations.filter((conversation) => conversation.pinned);
    const rest = conversations.filter((conversation) => !conversation.pinned);

    const buckets = new Map<string, Conversation[]>();
    for (const conversation of rest) {
      const bucket = relativeDayBucket(conversation.updatedAt);
      buckets.set(bucket, [...(buckets.get(bucket) ?? []), conversation]);
    }

    return [
      ...(pinned.length ? [["Pinned", pinned] as const] : []),
      ...BUCKET_ORDER.filter((bucket) => buckets.has(bucket)).map(
        (bucket) => [bucket, buckets.get(bucket)!] as const,
      ),
    ];
  }, [conversations]);

  const notImplemented = (action: string) =>
    toast({
      variant: "info",
      title: `${action} isn't wired up yet`,
      description: "This build is front-end only — no conversation store exists.",
    });

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-overlay transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Conversations"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex min-h-0 w-76 max-w-[85vw] flex-col border-r border-border bg-surface transition-transform duration-200 lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border p-3">
          <Button className="flex-1" onClick={onNew}>
            <MessageSquarePlus aria-hidden className="size-4" />
            New conversation
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-fg-subtle hover:bg-surface-2 hover:text-fg lg:hidden"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close conversations</span>
          </button>
        </div>

        <div className="border-b border-border p-3">
          <SearchInput
            label="Search conversations"
            placeholder="Search conversations…"
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <ul className="space-y-1 p-1">
              {Array.from({ length: 7 }, (_, index) => (
                <li key={index} className="space-y-2 rounded-lg p-2.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <ErrorState
              compact
              title="Couldn't load conversations"
              message={error ?? "Something went wrong."}
              onRetry={onRetry}
            />
          ) : conversations.length === 0 ? (
            search ? (
              <EmptyState
                compact
                icon={SearchX}
                title="No matches"
                description={`Nothing matched “${search}”. Try a different word, or clear the search.`}
              />
            ) : (
              <EmptyState
                compact
                icon={MessageSquarePlus}
                title="No conversations yet"
                description="Start one and it will be saved here, grouped by when you last used it."
              />
            )
          ) : (
            grouped.map(([label, items]) => (
              <section key={label} className="mb-3 last:mb-0">
                <h3 className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">
                  {label}
                </h3>
                <ul className="space-y-0.5">
                  {items.map((conversation) => {
                    const active = conversation.id === activeId;
                    return (
                      <li key={conversation.id} className="group relative">
                        <button
                          type="button"
                          onClick={() => onSelect(conversation.id)}
                          aria-current={active ? "true" : undefined}
                          className={cn(
                            "w-full rounded-lg py-2 pr-9 pl-2.5 text-left transition-colors",
                            active
                              ? "bg-primary-soft"
                              : "hover:bg-surface-2",
                          )}
                        >
                          <span className="flex items-center gap-1.5">
                            {conversation.pinned ? (
                              <Pin
                                aria-hidden
                                className="size-3 shrink-0 text-primary"
                              />
                            ) : null}
                            <span
                              className={cn(
                                "truncate text-[13px] font-medium",
                                active ? "text-primary-soft-fg" : "text-fg",
                              )}
                            >
                              {conversation.title}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] text-fg-muted">
                            {conversation.preview || "No messages yet"}
                          </span>
                          <span className="mt-1 flex items-center gap-2 text-[11px] text-fg-subtle">
                            <span className="truncate">
                              {modelName(conversation.modelId)}
                            </span>
                            <span aria-hidden>·</span>
                            <span className="shrink-0">
                              {formatRelativeTime(conversation.updatedAt)}
                            </span>
                          </span>
                        </button>

                        <span className="absolute top-1.5 right-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                          <DropdownMenu
                            label={`Actions for ${conversation.title}`}
                            className="w-44"
                            trigger={() => (
                              <span className="inline-flex size-7 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-fg">
                                <MoreHorizontal aria-hidden className="size-4" />
                              </span>
                            )}
                          >
                            {({ close }) => (
                              <>
                                <DropdownItem
                                  onSelect={() => {
                                    notImplemented(
                                      conversation.pinned ? "Unpin" : "Pin",
                                    );
                                    close();
                                  }}
                                >
                                  {conversation.pinned ? (
                                    <PinOff aria-hidden className="size-4" />
                                  ) : (
                                    <Pin aria-hidden className="size-4" />
                                  )}
                                  {conversation.pinned ? "Unpin" : "Pin"}
                                </DropdownItem>
                                <DropdownItem
                                  onSelect={() => {
                                    notImplemented("Rename");
                                    close();
                                  }}
                                >
                                  <Pencil aria-hidden className="size-4" />
                                  Rename
                                </DropdownItem>
                                <DropdownSeparator />
                                <DropdownItem
                                  destructive
                                  onSelect={() => {
                                    notImplemented("Delete");
                                    close();
                                  }}
                                >
                                  <Trash2 aria-hidden className="size-4" />
                                  Delete
                                </DropdownItem>
                              </>
                            )}
                          </DropdownMenu>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
