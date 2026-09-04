import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Workspace, model access, security policy and billing settings.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
