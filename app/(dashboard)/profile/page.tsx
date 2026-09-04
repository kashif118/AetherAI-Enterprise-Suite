import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your AetherAI profile, preferences and active sessions.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
