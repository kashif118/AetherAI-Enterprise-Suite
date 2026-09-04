"use client";

import { MoreHorizontal, SearchX, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { SkeletonRows } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Table, TableWrapper, Td, Th, Tr } from "@/components/ui/table";
import { useAsync } from "@/hooks/use-async";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDisclosure } from "@/hooks/use-disclosure";
import { organization, teamMembers } from "@/lib/mock/users";
import { formatRelativeTime } from "@/lib/utils";
import {
  listTeamMembers,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  STATUS_LABELS,
} from "@/services/team.service";
import type { User, UserRole, UserStatus } from "@/types";
import { InviteModal } from "./invite-modal";

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: "success",
  invited: "info",
  suspended: "danger",
};

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  owner: "primary",
  admin: "primary",
  member: "neutral",
  viewer: "neutral",
};

export function TeamView() {
  const { toast } = useToast();
  const invite = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<UserStatus | "all">("all");

  const debouncedSearch = useDebouncedValue(search, 250);

  const load = useCallback(
    (signal: AbortSignal) =>
      listTeamMembers({ search: debouncedSearch, role, status }, { signal }),
    [debouncedSearch, role, status],
  );

  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, [
    debouncedSearch,
    role,
    status,
  ]);

  const summary = useMemo(
    () => ({
      total: teamMembers.length,
      active: teamMembers.filter((member) => member.status === "active").length,
      invited: teamMembers.filter((member) => member.status === "invited").length,
      admins: teamMembers.filter(
        (member) => member.role === "admin" || member.role === "owner",
      ).length,
    }),
    [],
  );

  const notImplemented = (action: string, member: User) =>
    toast({
      variant: "info",
      title: `${action} isn't wired up yet`,
      description: `${member.name}'s record can't change without a backend to write to.`,
    });

  const hasFilters = Boolean(debouncedSearch) || role !== "all" || status !== "all";

  return (
    <>
      <PageHeader
        title="Team"
        description={`${organization.name} · ${organization.seats.used} of ${organization.seats.total} seats in use.`}
        actions={
          <Button onClick={invite.open}>
            <UserPlus aria-hidden className="size-4" />
            Invite people
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Members", value: summary.total, hint: "Across all roles" },
          { label: "Active", value: summary.active, hint: "Signed in this quarter" },
          { label: "Pending invitations", value: summary.invited, hint: "Expire after 7 days" },
          { label: "Admins and owners", value: summary.admins, hint: "Can change policy" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-[13px] font-medium text-fg-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-fg tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-[12px] text-fg-subtle">{stat.hint}</p>
          </div>
        ))}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Seat usage</CardTitle>
            <p className="mt-0.5 text-[13px] text-fg-muted">
              Seats are billed monthly and released when a member is removed.
            </p>
          </div>
        </CardHeader>
        <div className="p-5">
          <Progress
            label="Seats in use"
            value={organization.seats.used}
            max={organization.seats.total}
            showLabel
            valueText={`${organization.seats.used} of ${organization.seats.total}`}
          />
        </div>
      </Card>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Members</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput
              label="Search members"
              placeholder="Search by name, email or team…"
              value={search}
              onChange={setSearch}
              className="sm:w-60"
            />
            <label className="sr-only" htmlFor="team-role">
              Filter by role
            </label>
            <Select
              id="team-role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole | "all")}
              className="sm:w-36"
            >
              <option value="all">All roles</option>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((value) => (
                <option key={value} value={value}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="team-status">
              Filter by status
            </label>
            <Select
              id="team-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as UserStatus | "all")}
              className="sm:w-36"
            >
              <option value="all">All statuses</option>
              {(Object.keys(STATUS_LABELS) as UserStatus[]).map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>

        {isLoading ? (
          <SkeletonRows count={6} />
        ) : isError ? (
          <ErrorState
            title="Couldn't load the member list"
            message={error ?? "Something went wrong."}
            onRetry={refetch}
          />
        ) : isEmpty ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No members match"
              description="Nothing matches those filters. Try a different role or clear the search."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setRole("all");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={UserPlus}
              title="No members yet"
              description="Invite your team and assign each person a role."
              action={
                <Button size="sm" onClick={invite.open}>
                  Invite people
                </Button>
              }
            />
          )
        ) : (
          <TableWrapper>
            <Table>
              <caption className="sr-only">
                Workspace members with their role, team, status and last activity
              </caption>
              <thead>
                <tr>
                  <Th>Member</Th>
                  <Th>Role</Th>
                  <Th>Team</Th>
                  <Th>Status</Th>
                  <Th>Last active</Th>
                  <Th className="w-12">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {data?.map((member) => (
                  <Tr key={member.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={member.name}
                          initials={member.initials}
                          size="sm"
                          online={member.status === "active"}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-fg">
                            {member.name}
                          </p>
                          <p className="truncate text-[12px] text-fg-muted">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={ROLE_TONE[member.role]}>
                        {member.role === "owner" || member.role === "admin" ? (
                          <ShieldCheck aria-hidden className="size-3" />
                        ) : null}
                        {ROLE_LABELS[member.role]}
                      </Badge>
                    </Td>
                    <Td>
                      <p className="text-[13px] text-fg">{member.department}</p>
                      <p className="text-[12px] text-fg-subtle">{member.jobTitle}</p>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONE[member.status]} dot>
                        {STATUS_LABELS[member.status]}
                      </Badge>
                    </Td>
                    <Td className="text-[13px] whitespace-nowrap text-fg-muted">
                      {formatRelativeTime(member.lastActiveAt)}
                    </Td>
                    <Td>
                      <DropdownMenu
                        label={`Actions for ${member.name}`}
                        className="w-48"
                        trigger={() => (
                          <span className="inline-flex size-8 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg">
                            <MoreHorizontal aria-hidden className="size-4" />
                          </span>
                        )}
                      >
                        {({ close }) => (
                          <>
                            <DropdownItem
                              onSelect={() => {
                                notImplemented("Changing a role", member);
                                close();
                              }}
                            >
                              <ShieldCheck aria-hidden className="size-4" />
                              Change role
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem
                              destructive
                              onSelect={() => {
                                notImplemented("Removing a member", member);
                                close();
                              }}
                            >
                              <UserMinus aria-hidden className="size-4" />
                              Remove from workspace
                            </DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>What each role can do</CardTitle>
        </CardHeader>
        <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(ROLE_LABELS) as UserRole[]).map((value) => (
            <div key={value} className="bg-surface p-5">
              <dt className="text-sm font-semibold text-fg">{ROLE_LABELS[value]}</dt>
              <dd className="mt-1.5 text-[13px] leading-relaxed text-fg-muted">
                {ROLE_DESCRIPTIONS[value]}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <InviteModal open={invite.isOpen} onClose={invite.close} />
    </>
  );
}
