"use client";

import { ChevronsLeft, PanelLeft, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Progress } from "@/components/ui/progress";
import { APP_NAV, isActivePath } from "@/lib/navigation";
import { organization } from "@/lib/mock/users";
import { cn, formatCompact } from "@/lib/utils";

interface SidebarProps {
  /** Mobile drawer state. Ignored at `lg` and above, where the rail is fixed. */
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  // Navigating on mobile should always dismiss the drawer.
  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const quotaPercent = Math.round(
    (organization.tokensUsed / organization.tokenQuota) * 100,
  );

  return (
    <>
      {/* Mobile scrim */}
      <div
        aria-hidden
        onClick={onMobileClose}
        className={cn(
          "fixed inset-0 z-40 bg-overlay transition-opacity duration-200 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-[transform,width] duration-200 ease-out lg:translate-x-0",
          collapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-2" : "justify-between px-4",
          )}
        >
          {collapsed ? (
            <Link href="/dashboard" aria-label="AetherAI dashboard">
              <LogoMark />
            </Link>
          ) : (
            <Logo href="/dashboard" />
          )}

          <button
            type="button"
            onClick={onMobileClose}
            className="-mr-1 rounded-lg p-1.5 text-fg-subtle hover:bg-surface-2 hover:text-fg lg:hidden"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {APP_NAV.map((section) => (
            <div key={section.id} className="mb-5 last:mb-0">
              {collapsed ? (
                <div aria-hidden className="mx-2 mb-2 h-px bg-border first:hidden" />
              ) : (
                <p className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">
                  {section.label}
                </p>
              )}

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150",
                          collapsed ? "justify-center px-2 py-2.5" : "px-2.5 py-2",
                          active
                            ? "bg-primary-soft text-primary-soft-fg"
                            : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                        )}
                      >
                        <item.icon
                          aria-hidden
                          className={cn(
                            "size-4.5 shrink-0",
                            active ? "text-primary" : "text-fg-subtle group-hover:text-fg-muted",
                          )}
                        />
                        {!collapsed ? (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge ? (
                              <span className="rounded-full bg-surface-3 px-1.5 text-[11px] font-semibold text-fg-muted tabular-nums">
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-3">
          {collapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden w-full items-center justify-center rounded-lg py-2 text-fg-subtle hover:bg-surface-2 hover:text-fg lg:flex"
            >
              <PanelLeft aria-hidden className="size-4.5" />
              <span className="sr-only">Expand navigation</span>
            </button>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles aria-hidden className="size-3.5 text-primary" />
                  <p className="text-[13px] font-medium text-fg">Monthly tokens</p>
                </div>
                <Progress
                  label="Monthly token allowance used"
                  value={organization.tokensUsed}
                  max={organization.tokenQuota}
                  size="sm"
                  tone={quotaPercent > 90 ? "warning" : "primary"}
                  valueText={`${formatCompact(organization.tokensUsed)} of ${formatCompact(
                    organization.tokenQuota,
                  )} used`}
                />
                <p className="mt-2 text-[12px] text-fg-muted tabular-nums">
                  {formatCompact(organization.tokensUsed)} of{" "}
                  {formatCompact(organization.tokenQuota)} · {quotaPercent}%
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleCollapsed}
                className="mt-2 hidden w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg lg:flex"
              >
                <ChevronsLeft aria-hidden className="size-4" />
                Collapse
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
