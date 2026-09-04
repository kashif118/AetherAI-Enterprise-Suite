import type { ID, ISODateString } from "./common";

export type ActivityKind =
  | "conversation.created"
  | "project.created"
  | "project.updated"
  | "prompt.published"
  | "member.joined"
  | "member.invited"
  | "workspace.deployed"
  | "billing.updated";

export interface ActivityEvent {
  id: ID;
  kind: ActivityKind;
  actor: { id: ID; name: string; initials: string };
  /** Short sentence describing what happened, e.g. "created project". */
  action: string;
  target: string;
  createdAt: ISODateString;
  href?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "chat" | "workspace" | "prompt" | "project" | "team" | "analytics";
}
