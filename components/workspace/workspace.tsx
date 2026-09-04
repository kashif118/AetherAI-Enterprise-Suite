"use client";

import { Info, PanelLeft } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { useAsync } from "@/hooks/use-async";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDisclosure } from "@/hooks/use-disclosure";
import { defaultModelId, modelName } from "@/lib/mock/models";
import { toErrorMessage } from "@/services/api-client";
import {
  listConversations,
  listMessages,
  sendMessage,
} from "@/services/conversations.service";
import type { Message } from "@/types";
import { ConversationDetails } from "./conversation-details";
import { ConversationSidebar } from "./conversation-sidebar";
import { MessageList } from "./message-list";
import { PromptInput, type PendingAttachment } from "./prompt-input";
import { PromptPickerModal } from "./prompt-picker-modal";

interface WorkspaceProps {
  /** "workspace" shows the details rail; "chat" is the stripped-back view. */
  variant?: "workspace" | "chat";
}

/** Per-thread composer state, so switching threads doesn't leak a draft. */
interface ThreadState {
  conversationId: string | null;
  draft: string;
  modelId: string | null;
  messages: Message[];
}

const EMPTY_THREAD: ThreadState = {
  conversationId: null,
  draft: "",
  modelId: null,
  messages: [],
};

export function Workspace({ variant = "workspace" }: WorkspaceProps) {
  const { toast } = useToast();
  const drawer = useDisclosure(false);
  const details = useDisclosure(false);
  const promptPicker = useDisclosure(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadState>(EMPTY_THREAD);
  const [sending, setSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadConversations = useCallback(
    (signal: AbortSignal) =>
      listConversations({ search: debouncedSearch }, { signal }),
    [debouncedSearch],
  );
  const conversationsState = useAsync(loadConversations, [debouncedSearch]);
  const conversations = useMemo(
    () => conversationsState.data ?? [],
    [conversationsState.data],
  );

  // The active thread is derived, not stored: until the user picks one, it is
  // simply the first in the list. No effect is needed to "select" it.
  const activeId = selectedId ?? conversations[0]?.id ?? null;

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId],
  );

  const loadMessages = useCallback(
    (signal: AbortSignal) =>
      activeId ? listMessages(activeId, { signal }) : Promise.resolve([]),
    [activeId],
  );
  const messagesState = useAsync(loadMessages, [activeId]);

  // Composer state belongs to one thread; anything held for a different thread
  // is discarded on read rather than cleared in an effect.
  const current = thread.conversationId === activeId ? thread : EMPTY_THREAD;
  const draft = current.draft;
  const modelId =
    current.modelId ?? activeConversation?.modelId ?? defaultModelId;

  const patchThread = useCallback(
    (patch: Partial<ThreadState>) =>
      setThread((previous) => {
        const base =
          previous.conversationId === activeId
            ? previous
            : { ...EMPTY_THREAD, conversationId: activeId };
        return { ...base, ...patch, conversationId: activeId };
      }),
    [activeId],
  );

  const setDraft = useCallback(
    (value: string) => patchThread({ draft: value }),
    [patchThread],
  );

  const messages = useMemo(
    () => [...(messagesState.data ?? []), ...current.messages],
    [messagesState.data, current.messages],
  );

  const startNewConversation = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSelectedId(null);
    setThread(EMPTY_THREAD);
    setSending(false);
    drawer.close();
    toast({
      variant: "info",
      title: "New conversation",
      description: "Nothing is saved until a backend is connected.",
    });
  };

  const handleSubmit = async (attachments: PendingAttachment[]) => {
    const content = draft.trim();
    if (!content || sending) return;

    const conversationId = activeId ?? "cnv_draft";
    const stamp = Date.now();

    const userMessage: Message = {
      id: `msg_local_${stamp}`,
      conversationId,
      role: "user",
      content,
      status: "complete",
      createdAt: new Date().toISOString(),
      attachments: attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
        mimeType: attachment.mimeType,
      })),
    };

    const placeholderId = `msg_local_${stamp}_pending`;
    const placeholder: Message = {
      id: placeholderId,
      conversationId,
      role: "assistant",
      content: "",
      status: "streaming",
      createdAt: new Date().toISOString(),
      modelId,
    };

    patchThread({
      draft: "",
      messages: [...current.messages, userMessage, placeholder],
    });
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const replacePlaceholder = (replacement: Message) =>
      setThread((previous) => ({
        ...previous,
        messages: previous.messages.map((message) =>
          message.id === placeholderId ? replacement : message,
        ),
      }));

    try {
      const reply = await sendMessage(
        { conversationId, content, modelId },
        { signal: controller.signal, latency: 1100 },
      );
      replacePlaceholder(reply);
    } catch (error) {
      const message = toErrorMessage(error);
      replacePlaceholder({ ...placeholder, status: "error", errorMessage: message });
      toast({ variant: "error", title: "Couldn't send that", description: message });
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    setThread((previous) => ({
      ...previous,
      messages: previous.messages.map((message) =>
        message.status === "streaming"
          ? {
              ...message,
              status: "error" as const,
              errorMessage: "You stopped this response before it finished.",
            }
          : message,
      ),
    }));
  };

  return (
    <div className="flex min-h-0 flex-1">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setSelectedId(id);
          drawer.close();
        }}
        onNew={startNewConversation}
        search={search}
        onSearchChange={setSearch}
        isLoading={conversationsState.isLoading}
        isError={conversationsState.isError}
        error={conversationsState.error}
        onRetry={conversationsState.refetch}
        open={drawer.isOpen}
        onClose={drawer.close}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sm:px-6">
          <button
            type="button"
            onClick={drawer.open}
            className="-ml-1.5 rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
          >
            <PanelLeft aria-hidden className="size-4.5" />
            <span className="sr-only">Open conversations</span>
          </button>

          <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
            {activeConversation?.title ?? "New conversation"}
          </h1>

          <Badge tone="neutral">{modelName(modelId)}</Badge>

          {variant === "workspace" ? (
            <button
              type="button"
              onClick={details.toggle}
              aria-expanded={details.isOpen}
              className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg xl:hidden"
            >
              <Info aria-hidden className="size-4.5" />
              <span className="sr-only">Conversation details</span>
            </button>
          ) : null}
        </div>

        <MessageList
          messages={messages}
          isLoading={messagesState.isLoading}
          isError={messagesState.isError}
          error={messagesState.error}
          onRetry={messagesState.refetch}
          onStarterSelect={setDraft}
          scrollKey={`${activeId}-${messages.length}-${sending}`}
        />

        <PromptInput
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          modelId={modelId}
          onModelChange={(value) => patchThread({ modelId: value })}
          busy={sending}
          onStop={handleStop}
          onOpenPromptLibrary={promptPicker.open}
        />
      </div>

      {variant === "workspace" ? (
        <ConversationDetails
          conversation={activeConversation}
          modelId={modelId}
          messageCount={messages.length}
          open={details.isOpen}
          onClose={details.close}
        />
      ) : null}

      <PromptPickerModal
        open={promptPicker.isOpen}
        onClose={promptPicker.close}
        onInsert={(body) => setDraft(draft ? `${draft}\n\n${body}` : body)}
      />
    </div>
  );
}
