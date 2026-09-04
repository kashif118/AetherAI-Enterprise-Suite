import type { ID, ISODateString } from "./common";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export type UserStatus = "active" | "invited" | "suspended";

export interface User {
  id: ID;
  name: string;
  email: string;
  /** Two-letter fallback rendered when no avatar image exists. */
  initials: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  jobTitle: string;
  department: string;
  location: string;
  timezone: string;
  bio?: string;
  joinedAt: ISODateString;
  lastActiveAt: ISODateString;
}

export interface Session {
  user: User;
  organization: Organization;
}

export type PlanTier = "starter" | "growth" | "enterprise";

export interface Organization {
  id: ID;
  name: string;
  slug: string;
  plan: PlanTier;
  seats: { used: number; total: number };
  /** Monthly token allowance in whole tokens. */
  tokenQuota: number;
  tokensUsed: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  company: string;
  password: string;
  acceptedTerms: boolean;
}
