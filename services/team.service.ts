import { organization, teamMembers } from "@/lib/mock/users";
import type { Organization, User, UserRole, UserStatus } from "@/types";
import { request, type RequestOptions } from "./api-client";

export interface TeamQuery {
  search?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
}

export function listTeamMembers(
  query: TeamQuery = {},
  options?: RequestOptions,
): Promise<User[]> {
  return request(() => {
    const term = query.search?.trim().toLowerCase();
    return teamMembers.filter((member) => {
      if (query.role && query.role !== "all" && member.role !== query.role) return false;
      if (query.status && query.status !== "all" && member.status !== query.status) {
        return false;
      }
      if (!term) return true;
      return (
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.jobTitle.toLowerCase().includes(term) ||
        member.department.toLowerCase().includes(term)
      );
    });
  }, options);
}

export function getOrganization(options?: RequestOptions): Promise<Organization> {
  return request(organization, options);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "Full control, including billing and deletion of the workspace.",
  admin: "Manages members, projects, models and policies.",
  member: "Creates projects and conversations, publishes prompts.",
  viewer: "Read-only access to shared projects and analytics.",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};
