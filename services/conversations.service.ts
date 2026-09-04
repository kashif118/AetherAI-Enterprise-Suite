import { MOCK_LATENCY } from "@/lib/constants";
import {
  conversations,
  messagesFor,
} from "@/lib/mock/conversations";
import type { Conversation, Message } from "@/types";
import { request, type RequestOptions } from "./api-client";

export interface ConversationQuery {
  search?: string;
  projectId?: string;
}

export function listConversations(
  query: ConversationQuery = {},
  options?: RequestOptions,
): Promise<Conversation[]> {
  return request(() => {
    const term = query.search?.trim().toLowerCase();
    return conversations
      .filter((conversation) => {
        if (query.projectId && conversation.projectId !== query.projectId) {
          return false;
        }
        if (!term) return true;
        return (
          conversation.title.toLowerCase().includes(term) ||
          conversation.preview.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, options);
}

export function getRecentConversations(limit = 5, options?: RequestOptions) {
  return request(
    () =>
      [...conversations]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, limit),
    options,
  );
}

export function getConversation(id: string, options?: RequestOptions) {
  return request(
    () => conversations.find((conversation) => conversation.id === id) ?? null,
    options,
  );
}

export function listMessages(
  conversationId: string,
  options?: RequestOptions,
): Promise<Message[]> {
  return request(() => messagesFor(conversationId), {
    latency: MOCK_LATENCY.fast,
    ...options,
  });
}

/**
 * Canned assistant replies.
 *
 * The workspace deliberately does **not** call a model — it echoes a
 * structured response so the streaming, loading and error states can be
 * exercised end to end. Replace this with the real completions endpoint.
 */
const CANNED_REPLIES = [
  `I can work with that. Here's how I'd approach it:

1. **Start with the constraint that actually binds.** Most of the options below are cheap to reverse; the data model is not, so decide that first.
2. **Keep the seam narrow.** One module owns the boundary, everything else talks to it through a typed interface.
3. **Make the failure visible.** A silent fallback here would hide exactly the case you need to see.

Want me to sketch the interface, or work through the trade-offs first?`,
  `Two things stand out.

The first is scope: what you've described covers three separate concerns, and bundling them means none of them can ship independently. Splitting them costs you one afternoon of plumbing and buys back a lot of freedom later.

The second is the edge case you didn't mention — what happens when the input is empty. Right now that path is undefined, and it's the one users hit first.

I'd fix the second before touching the first.`,
  `Here's a draft. I've kept it deliberately plain — you can add warmth once the structure is right.

> The change takes effect on 1 October. Existing workspaces keep their current limits until renewal, so nothing changes for you before then. If you need the higher limit sooner, reply here and we'll move you across.

Three notes on the choices I made: the date leads because it's the only thing most readers need; there's no apology, because nothing has gone wrong; and the action is a reply rather than a link, because the link would go to a form nobody fills in.`,
];

export interface SendMessageInput {
  conversationId: string;
  content: string;
  modelId: string;
  attachments?: { name: string; size: number; mimeType: string }[];
}

let replyCursor = 0;

export function sendMessage(
  input: SendMessageInput,
  options?: RequestOptions,
): Promise<Message> {
  return request(() => {
    if (input.content.trim().toLowerCase() === "/error") {
      // A deterministic way to see the error state in the UI.
      throw new Error(
        "The model provider returned 503. Your message was not sent — retry, or switch to another model.",
      );
    }

    const reply = CANNED_REPLIES[replyCursor % CANNED_REPLIES.length];
    replyCursor += 1;

    return {
      id: `msg_${Date.now()}`,
      conversationId: input.conversationId,
      role: "assistant" as const,
      content: reply,
      status: "complete" as const,
      createdAt: new Date().toISOString(),
      modelId: input.modelId,
      tokens: Math.round(reply.length / 3.6),
    };
  }, options);
}

export function createConversation(
  modelId: string,
  options?: RequestOptions,
): Promise<Conversation> {
  return request(
    () => ({
      id: `cnv_${Date.now()}`,
      title: "New conversation",
      preview: "",
      modelId,
      messageCount: 0,
      tokensUsed: 0,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    { latency: MOCK_LATENCY.fast, ...options },
  );
}
