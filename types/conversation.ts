import type { ID, ISODateString } from "./common";

export type ModelProvider = "aether" | "openai-compatible" | "self-hosted";

export type ModelSpeed = "fastest" | "balanced" | "deep";

export interface AIModel {
  id: ID;
  name: string;
  shortName: string;
  provider: ModelProvider;
  description: string;
  contextWindow: number;
  speed: ModelSpeed;
  /** Cost per million input tokens, in USD. */
  inputCostPerMTok: number;
  outputCostPerMTok: number;
  capabilities: ("vision" | "tools" | "code" | "reasoning" | "long-context")[];
  recommended?: boolean;
}

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "complete" | "streaming" | "error";

export interface MessageAttachment {
  id: ID;
  name: string;
  /** Size in bytes. */
  size: number;
  mimeType: string;
}

export interface Message {
  id: ID;
  conversationId: ID;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: ISODateString;
  modelId?: ID;
  tokens?: number;
  attachments?: MessageAttachment[];
  /** Present when `status === "error"`. */
  errorMessage?: string;
}

export interface Conversation {
  id: ID;
  title: string;
  /** First line of the last message, for the sidebar preview. */
  preview: string;
  modelId: ID;
  projectId?: ID;
  messageCount: number;
  tokensUsed: number;
  pinned: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
