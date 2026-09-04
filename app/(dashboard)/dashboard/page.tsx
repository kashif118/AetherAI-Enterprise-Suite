import { Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { UsagePanel } from "@/components/dashboard/usage-panel";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { currentUser, organization } from "@/lib/mock/users";
import { MOCK_NOW } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Usage, projects and activity across your AetherAI workspace.",
};

function greeting() {
  const hour = MOCK_NOW.getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description={`Here's what's happening across ${organization.name} in the last 30 days.`}
        actions={
          <>
            <ButtonLink href="/prompts" variant="secondary">
              <Sparkles aria-hidden className="size-4" />
              Browse prompts
            </ButtonLink>
            <ButtonLink href="/workspace">
              <Plus aria-hidden className="size-4" />
              New conversation
            </ButtonLink>
          </>
        }
      />

      <div className="space-y-4">
        <OverviewCards />

        <UsagePanel />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <RecentProjects />
          <RecentConversations />
          <div className="space-y-4">
            <QuickActions />
            <ActivityFeed limit={6} />
          </div>
        </div>
      </div>
    </>
  );
}
