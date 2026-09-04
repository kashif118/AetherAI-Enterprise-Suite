import type { ID, ISODateString } from "./common";

export type PromptCategory =
  | "engineering"
  | "marketing"
  | "sales"
  | "support"
  | "research"
  | "operations"
  | "legal";

export type PromptVisibility = "private" | "team" | "organization";

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
}

export interface Prompt {
  id: ID;
  title: string;
  description: string;
  body: string;
  category: PromptCategory;
  visibility: PromptVisibility;
  tags: string[];
  variables: PromptVariable[];
  author: { id: ID; name: string; initials: string };
  favorite: boolean;
  usageCount: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
