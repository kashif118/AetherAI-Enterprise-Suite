import type { ReactNode } from "react";
import { AppShell } from "@/layouts/app-shell";

/**
 * Full-height views (AI Workspace, AI Chat) that own their own scrolling
 * rather than scrolling the page.
 */
export default function CanvasGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell fullBleed>{children}</AppShell>;
}
