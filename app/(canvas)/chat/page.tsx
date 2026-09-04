import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/workspace";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Quick, focused AI conversations without the workspace context rail.",
};

export default function ChatPage() {
  return <Workspace variant="chat" />;
}
