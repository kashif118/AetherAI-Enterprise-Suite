import type { ID, ISODateString } from "./common";
import type { User } from "./user";

export type ProjectStatus = "active" | "paused" | "review" | "archived";

export type ProjectVisibility = "private" | "team" | "organization";

export interface Project {
  id: ID;
  name: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  /** 0–100. */
  progress: number;
  tags: string[];
  members: Pick<User, "id" | "name" | "initials" | "avatarUrl">[];
  conversationCount: number;
  tokensUsed: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  dueAt?: ISODateString;
}
