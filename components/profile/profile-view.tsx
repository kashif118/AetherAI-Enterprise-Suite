"use client";

import {
  Building2,
  Clock,
  Laptop,
  Mail,
  MapPin,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { currentUser, organization } from "@/lib/mock/users";
import { projects } from "@/lib/mock/projects";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { ROLE_LABELS } from "@/services/team.service";

type TabValue = "overview" | "details" | "preferences" | "sessions";

const TABS = [
  { value: "overview" as const, label: "Overview" },
  { value: "details" as const, label: "Personal details" },
  { value: "preferences" as const, label: "Preferences" },
  { value: "sessions" as const, label: "Sessions" },
];

const SESSIONS = [
  {
    id: "ses_1",
    device: "MacBook Pro · Chrome",
    location: "London, United Kingdom",
    lastActive: "2026-09-04T14:12:00.000Z",
    current: true,
    icon: Laptop,
  },
  {
    id: "ses_2",
    device: "iPhone 16 · Safari",
    location: "London, United Kingdom",
    lastActive: "2026-09-03T21:40:00.000Z",
    current: false,
    icon: Smartphone,
  },
  {
    id: "ses_3",
    device: "ThinkPad X1 · Firefox",
    location: "Berlin, Germany",
    lastActive: "2026-08-28T09:15:00.000Z",
    current: false,
    icon: Laptop,
  },
];

export function ProfileView() {
  const { toast } = useToast();
  const [tab, setTab] = useState<TabValue>("overview");

  const [name, setName] = useState(currentUser.name);
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle);
  const [location, setLocation] = useState(currentUser.location);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [bio, setBio] = useState(currentUser.bio ?? "");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const [compactMode, setCompactMode] = useState(false);
  const [sendOnEnter, setSendOnEnter] = useState(true);
  const [showTokenCounts, setShowTokenCounts] = useState(true);

  const myProjects = projects.filter((project) =>
    project.members.some((member) => member.id === currentUser.id),
  );

  const notPersisted = () =>
    toast({
      variant: "info",
      title: "Profile wasn't saved",
      description: "Persisting your profile needs a backend to write to.",
    });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Your name can't be empty." });
      return;
    }
    setErrors({});
    notPersisted();
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your details, preferences and active sessions."
      />

      <Card className="mb-4">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            size="xl"
            online
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-fg">{name}</h2>
              <Badge tone="primary">{ROLE_LABELS[currentUser.role]}</Badge>
            </div>
            <p className="mt-1 text-sm text-fg-muted">{jobTitle}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-fg-muted">
              <li className="flex items-center gap-1.5">
                <Mail aria-hidden className="size-3.5 text-fg-subtle" />
                {currentUser.email}
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 aria-hidden className="size-3.5 text-fg-subtle" />
                {currentUser.department} · {organization.name}
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin aria-hidden className="size-3.5 text-fg-subtle" />
                {location}
              </li>
              <li className="flex items-center gap-1.5">
                <Clock aria-hidden className="size-3.5 text-fg-subtle" />
                {timezone}
              </li>
            </ul>
          </div>
          <Button variant="secondary" onClick={() => setTab("details")}>
            <UserRound aria-hidden className="size-4" />
            Edit profile
          </Button>
        </div>
      </Card>

      <Tabs
        label="Profile sections"
        value={tab}
        onChange={setTab}
        items={TABS}
        className="mb-6"
      />

      <TabPanel value="overview" active={tab === "overview"}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {bio ? (
                <p className="text-sm leading-relaxed text-fg-muted">{bio}</p>
              ) : (
                <p className="text-sm text-fg-subtle">
                  No bio yet. Add one so colleagues know what you work on.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-subtle">Joined</dt>
                  <dd className="text-fg">{formatDate(currentUser.joinedAt)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-subtle">Last active</dt>
                  <dd className="text-fg">
                    {formatRelativeTime(currentUser.lastActiveAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-subtle">Role</dt>
                  <dd className="text-fg">{ROLE_LABELS[currentUser.role]}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-subtle">Projects</dt>
                  <dd className="text-fg tabular-nums">{myProjects.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Projects you’re on</CardTitle>
            </CardHeader>
            <ul className="divide-y divide-border">
              {myProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">
                      {project.name}
                    </p>
                    <p className="truncate text-[13px] text-fg-muted">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-[12px] text-fg-subtle">
                    Updated {formatRelativeTime(project.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="details" active={tab === "details"}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <form id="profile-form" onSubmit={onSubmit} noValidate>
            <CardContent className="space-y-4">
              <Field label="Full name" error={errors.name} required>
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    value={name}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    onChange={(event) => setName(event.target.value)}
                  />
                )}
              </Field>

              <Field
                label="Email"
                hint="Managed by your identity provider and can't be changed here."
              >
                {({ id, describedBy }) => (
                  <Input
                    id={id}
                    value={currentUser.email}
                    aria-describedby={describedBy}
                    disabled
                    readOnly
                  />
                )}
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Job title">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={jobTitle}
                      onChange={(event) => setJobTitle(event.target.value)}
                    />
                  )}
                </Field>
                <Field label="Location">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                    />
                  )}
                </Field>
              </div>

              <Field label="Timezone" hint="Used for scheduled digests and reports.">
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    value={timezone}
                    aria-describedby={describedBy}
                    onChange={(event) => setTimezone(event.target.value)}
                  >
                    {[
                      "Europe/London",
                      "Europe/Berlin",
                      "Europe/Paris",
                      "America/New_York",
                      "America/Toronto",
                      "Asia/Singapore",
                      "Asia/Tokyo",
                      "Asia/Karachi",
                      "Asia/Kolkata",
                    ].map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              <Field label="Bio" hint="A sentence or two. Shown on your profile.">
                {({ id, describedBy }) => (
                  <Textarea
                    id={id}
                    value={bio}
                    aria-describedby={describedBy}
                    onChange={(event) => setBio(event.target.value)}
                  />
                )}
              </Field>
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">
                Visible to everyone in the workspace.
              </p>
              <Button type="submit">Save profile</Button>
            </CardFooter>
          </form>
        </Card>
      </TabPanel>

      <TabPanel value="preferences" active={tab === "preferences"}>
        <Card className="max-w-2xl">
          <CardHeader>
            <div>
              <CardTitle>Workspace preferences</CardTitle>
              <p className="mt-0.5 text-[13px] text-fg-muted">
                Affect how the workspace behaves for you only.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Switch
              label="Compact message spacing"
              description="Tightens the message list so more of a long conversation fits on screen."
              checked={compactMode}
              onChange={setCompactMode}
            />
            <Switch
              label="Enter sends the message"
              description="When off, Enter adds a new line and Cmd+Enter sends."
              checked={sendOnEnter}
              onChange={setSendOnEnter}
            />
            <Switch
              label="Show token counts"
              description="Displays the token cost of each message under the response."
              checked={showTokenCounts}
              onChange={setShowTokenCounts}
            />
          </CardContent>
          <CardFooter>
            <p className="text-[13px] text-fg-muted">Stored per browser.</p>
            <Button onClick={notPersisted}>Save preferences</Button>
          </CardFooter>
        </Card>
      </TabPanel>

      <TabPanel value="sessions" active={tab === "sessions"}>
        <Card className="max-w-3xl">
          <CardHeader>
            <div>
              <CardTitle>Active sessions</CardTitle>
              <p className="mt-0.5 text-[13px] text-fg-muted">
                Signing out a session revokes its token immediately.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast({
                  variant: "info",
                  title: "Sessions aren't real in this build",
                  description:
                    "Revoking a session needs an auth backend to invalidate the token.",
                })
              }
            >
              Sign out everywhere
            </Button>
          </CardHeader>
          <ul className="divide-y divide-border">
            {SESSIONS.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-fg-muted">
                    <session.icon aria-hidden className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-fg">
                      {session.device}
                      {session.current ? (
                        <Badge tone="success" dot>
                          This device
                        </Badge>
                      ) : null}
                    </p>
                    <p className="truncate text-[13px] text-fg-muted">
                      {session.location} · {formatRelativeTime(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast({
                        variant: "info",
                        title: "Nothing was revoked",
                        description: `${session.device} stays signed in — this build has no session store.`,
                      })
                    }
                  >
                    Sign out
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      </TabPanel>
    </>
  );
}
