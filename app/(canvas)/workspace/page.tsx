import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/workspace";

export const metadata: Metadata = {
  title: "AI Workspace",
  description:
    "Multi-model AI workspace with conversations, file attachments and model selection.",
};

export default function WorkspacePage() {
  return <Workspace variant="workspace" />;
}
