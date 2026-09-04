import type { Metadata } from "next";
import { TeamView } from "@/components/team/team-view";

export const metadata: Metadata = {
  title: "Team",
  description: "Members, roles, seats and invitations for your AetherAI workspace.",
};

export default function TeamPage() {
  return <TeamView />;
}
