"use client";

import {
  Bell,
  Building2,
  CreditCard,
  Cpu,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { models } from "@/lib/mock/models";
import { organization } from "@/lib/mock/users";
import { formatCompact, formatCurrency } from "@/lib/utils";

type TabValue = "workspace" | "appearance" | "models" | "security" | "notifications" | "billing";

const TABS = [
  { value: "workspace" as const, label: "Workspace", icon: <Building2 aria-hidden className="size-4" /> },
  { value: "appearance" as const, label: "Appearance", icon: <Palette aria-hidden className="size-4" /> },
  { value: "models" as const, label: "Models", icon: <Cpu aria-hidden className="size-4" /> },
  { value: "security" as const, label: "Security", icon: <ShieldCheck aria-hidden className="size-4" /> },
  { value: "notifications" as const, label: "Notifications", icon: <Bell aria-hidden className="size-4" /> },
  { value: "billing" as const, label: "Billing", icon: <CreditCard aria-hidden className="size-4" /> },
];

export function SettingsView() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<TabValue>("workspace");

  const [workspaceName, setWorkspaceName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [purpose, setPurpose] = useState(
    "Internal AI platform for engineering, data and legal teams at Northwind.",
  );
  const [region, setRegion] = useState("eu");
  const [retention, setRetention] = useState("90");

  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(
    Object.fromEntries(models.map((model) => [model.id, true])),
  );
  const [defaultModel, setDefaultModel] = useState("aether-flux");

  const [requireSso, setRequireSso] = useState(true);
  const [requireMfa, setRequireMfa] = useState(true);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [auditStreaming, setAuditStreaming] = useState(false);

  const [notifications, setNotifications] = useState({
    weeklyDigest: true,
    budgetAlerts: true,
    memberJoined: false,
    promptPublished: true,
  });

  const notPersisted = () =>
    toast({
      variant: "info",
      title: "Settings weren't saved",
      description:
        "The forms validate and update local state. Persisting them needs a backend.",
    });

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace configuration, model access, security policy and billing."
      >
        <Tabs label="Settings sections" value={tab} onChange={setTab} items={TABS} />
      </PageHeader>

      <TabPanel value="workspace" active={tab === "workspace"}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Workspace details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Workspace name" required>
                {({ id }) => (
                  <Input
                    id={id}
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                  />
                )}
              </Field>
              <Field
                label="Workspace URL"
                hint="Used for SSO callbacks and shared links."
              >
                {({ id, describedBy }) => (
                  <Input
                    id={id}
                    value={slug}
                    aria-describedby={describedBy}
                    onChange={(event) => setSlug(event.target.value)}
                    leading={<span className="text-[13px]">app/</span>}
                    className="pl-11"
                  />
                )}
              </Field>
              <Field
                label="What this workspace is for"
                hint="Shown to new members during onboarding."
              >
                {({ id, describedBy }) => (
                  <Textarea
                    id={id}
                    value={purpose}
                    aria-describedby={describedBy}
                    onChange={(event) => setPurpose(event.target.value)}
                  />
                )}
              </Field>
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">
                Changes apply to everyone in the workspace.
              </p>
              <Button onClick={notPersisted}>Save changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="Processing region"
                hint="Where prompts and attachments are processed. Changing this does not migrate existing data."
              >
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    value={region}
                    aria-describedby={describedBy}
                    onChange={(event) => setRegion(event.target.value)}
                  >
                    <option value="eu">European Union (Frankfurt)</option>
                    <option value="uk">United Kingdom (London)</option>
                    <option value="us">United States (Virginia)</option>
                  </Select>
                )}
              </Field>

              <Field
                label="Retention"
                hint="How long prompts, responses and attachments are kept."
              >
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    value={retention}
                    aria-describedby={describedBy}
                    onChange={(event) => setRetention(event.target.value)}
                  >
                    <option value="0">Don’t retain (zero-day)</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="400">400 days</option>
                  </Select>
                )}
              </Field>

              <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                <p className="text-[13px] font-medium text-fg">
                  Training on your data is off, permanently
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">
                  This isn’t a setting. Workspace content is never used to train
                  models, on any plan.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">Applies within an hour.</p>
              <Button onClick={notPersisted}>Save changes</Button>
            </CardFooter>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="appearance" active={tab === "appearance"}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-medium text-fg">Colour theme</p>
              <p className="mt-1 mb-3 text-[13px] text-fg-muted">
                Applies to this browser only. System follows your device setting.
              </p>
              <SegmentedControl
                label="Colour theme"
                value={theme}
                onChange={(value) => setTheme(value as Theme)}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(["light", "dark", "system"] as const).map((option) => (
                <div
                  key={option}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  <div
                    className={
                      option === "dark"
                        ? "bg-[#0a0b10] p-3"
                        : option === "light"
                          ? "bg-[#f6f7f9] p-3"
                          : "bg-linear-to-br from-[#f6f7f9] to-[#0a0b10] p-3"
                    }
                  >
                    <div className="h-2 w-10 rounded-full bg-[#6d4aff]" />
                    <div className="mt-2 h-1.5 w-full rounded-full bg-current opacity-20" />
                    <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-current opacity-20" />
                  </div>
                  <p className="border-t border-border px-3 py-2 text-[13px] capitalize">
                    {option}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="models" active={tab === "models"}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Model access</CardTitle>
              <p className="mt-0.5 text-[13px] text-fg-muted">
                Disabling a model hides it from every composer in the workspace.
              </p>
            </div>
          </CardHeader>
          <ul className="divide-y divide-border">
            {models.map((model) => (
              <li
                key={model.id}
                className="flex flex-wrap items-start justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-fg">{model.name}</p>
                    {model.recommended ? <Badge tone="primary">Recommended</Badge> : null}
                    {model.provider === "self-hosted" ? (
                      <Badge tone="info">Self-hosted</Badge>
                    ) : null}
                    {defaultModel === model.id ? (
                      <Badge tone="success">Default</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">
                    {model.description}
                  </p>
                  <p className="mt-1.5 text-[12px] text-fg-subtle tabular-nums">
                    {formatCompact(model.contextWindow)} context ·{" "}
                    {model.inputCostPerMTok === 0
                      ? "no metered cost"
                      : `${formatCurrency(model.inputCostPerMTok)} in / ${formatCurrency(
                          model.outputCostPerMTok,
                        )} out per M tokens`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {defaultModel !== model.id && enabledModels[model.id] ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultModel(model.id)}
                    >
                      Make default
                    </Button>
                  ) : null}
                  <Switch
                    hideLabel
                    label={`Enable ${model.name}`}
                    checked={enabledModels[model.id]}
                    disabled={defaultModel === model.id}
                    onChange={(checked) =>
                      setEnabledModels((current) => ({
                        ...current,
                        [model.id]: checked,
                      }))
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
          <CardFooter>
            <p className="text-[13px] text-fg-muted">
              The default model can’t be disabled.
            </p>
            <Button onClick={notPersisted}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabPanel>

      <TabPanel value="security" active={tab === "security"}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Switch
                label="Require SSO"
                description="Members must sign in through your identity provider. Password sign-in is disabled."
                checked={requireSso}
                onChange={setRequireSso}
              />
              <Switch
                label="Require multi-factor authentication"
                description="Enforced for every member, including those signing in through SSO."
                checked={requireMfa}
                onChange={setRequireMfa}
              />
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">
                Changes force a re-authentication.
              </p>
              <Button onClick={notPersisted}>Save changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Switch
                label="Allow file attachments"
                description="Members can attach documents to conversations. Attachments follow the workspace retention window."
                checked={allowAttachments}
                onChange={setAllowAttachments}
              />
              <Switch
                label="Stream the audit log to your SIEM"
                description="Delivers every request event over a webhook within 60 seconds."
                checked={auditStreaming}
                onChange={setAuditStreaming}
              />
              {auditStreaming ? (
                <Field
                  label="Webhook endpoint"
                  hint="Must accept POST with a signed payload."
                >
                  {({ id, describedBy }) => (
                    <Input
                      id={id}
                      placeholder="https://siem.northwind.example/hooks/aether"
                      aria-describedby={describedBy}
                    />
                  )}
                </Field>
              ) : null}
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">Applies immediately.</p>
              <Button onClick={notPersisted}>Save changes</Button>
            </CardFooter>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="notifications" active={tab === "notifications"}>
        <Card className="max-w-2xl">
          <CardHeader>
            <div>
              <CardTitle>Email notifications</CardTitle>
              <p className="mt-0.5 text-[13px] text-fg-muted">
                What lands in your inbox. In-product notifications are unaffected.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Switch
              label="Weekly usage digest"
              description="A Monday summary of spend, adoption and anything that changed sharply."
              checked={notifications.weeklyDigest}
              onChange={(checked) =>
                setNotifications((current) => ({ ...current, weeklyDigest: checked }))
              }
            />
            <Switch
              label="Budget alerts"
              description="When a project or team passes 80% of its monthly budget."
              checked={notifications.budgetAlerts}
              onChange={(checked) =>
                setNotifications((current) => ({ ...current, budgetAlerts: checked }))
              }
            />
            <Switch
              label="New members"
              description="When someone accepts an invitation to the workspace."
              checked={notifications.memberJoined}
              onChange={(checked) =>
                setNotifications((current) => ({ ...current, memberJoined: checked }))
              }
            />
            <Switch
              label="Prompt publications"
              description="When a prompt is published to the organisation library."
              checked={notifications.promptPublished}
              onChange={(checked) =>
                setNotifications((current) => ({ ...current, promptPublished: checked }))
              }
            />
          </CardContent>
          <CardFooter>
            <p className="text-[13px] text-fg-muted">Applies to your account only.</p>
            <Button onClick={notPersisted}>Save preferences</Button>
          </CardFooter>
        </Card>
      </TabPanel>

      <TabPanel value="billing" active={tab === "billing"}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Plan and usage</CardTitle>
                <p className="mt-0.5 text-[13px] text-fg-muted">
                  Billing period ends 30 September 2026
                </p>
              </div>
              <Badge tone="primary">Enterprise</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress
                label="Monthly token allowance"
                value={organization.tokensUsed}
                max={organization.tokenQuota}
                showLabel
                valueText={`${formatCompact(organization.tokensUsed)} of ${formatCompact(
                  organization.tokenQuota,
                )}`}
              />
              <Progress
                label="Seats"
                value={organization.seats.used}
                max={organization.seats.total}
                showLabel
                valueText={`${organization.seats.used} of ${organization.seats.total}`}
              />

              <dl className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
                <div>
                  <dt className="text-[13px] text-fg-subtle">Seat charge</dt>
                  <dd className="mt-1 text-lg font-semibold text-fg">
                    {formatCurrency(184 * 59, 0)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-fg-subtle">Model usage</dt>
                  <dd className="mt-1 text-lg font-semibold text-fg">
                    {formatCurrency(58_950, 0)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-fg-subtle">Estimated total</dt>
                  <dd className="mt-1 text-lg font-semibold text-fg">
                    {formatCurrency(184 * 59 + 58_950, 0)}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">{`Invoices go to finance@${organization.slug}.example`}</p>
              <Button variant="secondary" onClick={notPersisted}>
                Manage billing
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="Monthly spend cap"
                hint="Requests are rejected once the cap is reached, rather than billed."
              >
                {({ id, describedBy }) => (
                  <Input
                    id={id}
                    type="number"
                    defaultValue={80000}
                    aria-describedby={describedBy}
                    leading={<span className="text-[13px]">$</span>}
                  />
                )}
              </Field>
              <Field label="Alert threshold" hint="Percentage of the cap.">
                {({ id, describedBy }) => (
                  <Select id={id} defaultValue="80" aria-describedby={describedBy}>
                    <option value="60">60%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                  </Select>
                )}
              </Field>
            </CardContent>
            <CardFooter>
              <p className="text-[13px] text-fg-muted">Owners are always alerted.</p>
              <Button onClick={notPersisted}>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </TabPanel>
    </>
  );
}
