"use client";

import { useCallback, type ReactNode } from "react";
import { CommandPalette } from "@/components/common/command-palette";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useHotkey } from "@/hooks/use-hotkey";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SIDEBAR_STORAGE_KEY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

/**
 * The authenticated application frame: fixed sidebar, sticky header and a
 * scrolling main region.
 *
 * `fullBleed` removes the page padding and max width for views that manage
 * their own scrolling — the AI Workspace and Chat, which are full-height
 * three-column layouts.
 */
export function AppShell({
  children,
  fullBleed = false,
}: {
  children: ReactNode;
  fullBleed?: boolean;
}) {
  const mobileNav = useDisclosure(false);
  const search = useDisclosure(false);
  const [collapsed, setCollapsed] = useLocalStorage(SIDEBAR_STORAGE_KEY, false);

  const toggleCollapsed = useCallback(
    () => setCollapsed((value) => !value),
    [setCollapsed],
  );

  useHotkey("k", search.open, { meta: true });

  return (
    <div className={cn("bg-bg", fullBleed ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      <Sidebar
        mobileOpen={mobileNav.isOpen}
        onMobileClose={mobileNav.close}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-200",
          // Full-bleed views pin the frame to the viewport so the panes inside
          // them scroll instead of the page.
          fullBleed ? "h-dvh overflow-hidden" : "min-h-dvh",
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64",
        )}
      >
        <Header onOpenSidebar={mobileNav.open} onOpenSearch={search.open} />

        <main
          id="main"
          className={cn(
            "flex-1",
            fullBleed
              ? "flex min-h-0 flex-col overflow-hidden"
              : "mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8",
          )}
        >
          {children}
        </main>
      </div>

      <CommandPalette open={search.isOpen} onClose={search.close} />
    </div>
  );
}
