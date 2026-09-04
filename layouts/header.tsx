"use client";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import {
  DropdownItem,
  DropdownLabel,
  DropdownLink,
  DropdownMenu,
  DropdownSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { activityEvents } from "@/lib/mock/activity";
import { currentUser, organization } from "@/lib/mock/users";
import { FLAT_NAV, isActivePath } from "@/lib/navigation";
import { cn, formatRelativeTime } from "@/lib/utils";

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ onOpenSidebar, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const current = FLAT_NAV.find((item) => isActivePath(pathname, item.href));
  const unread = 3;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur-md sm:px-5">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
        <span className="sr-only">Open navigation</span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fg">
          {current?.label ?? "AetherAI"}
        </p>
        <p className="hidden truncate text-[12px] text-fg-muted sm:block">
          {organization.name}
          {current ? ` · ${current.description}` : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg-muted md:flex xl:w-72"
      >
        <Search aria-hidden className="size-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border bg-surface px-1.5 font-sans text-[11px] text-fg-subtle">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
      >
        <Search aria-hidden className="size-4.5" />
        <span className="sr-only">Search</span>
      </button>

      <DropdownMenu
        label={`Notifications, ${unread} unread`}
        className="w-80"
        trigger={() => (
          <span className="relative inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
            <Bell aria-hidden className="size-4.5" />
            {unread > 0 ? (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-surface" />
            ) : null}
          </span>
        )}
      >
        {({ close }) => (
          <>
            <DropdownLabel>Notifications</DropdownLabel>
            <ul className="max-h-80 overflow-y-auto">
              {activityEvents.slice(0, 5).map((event, index) => (
                <li key={event.id}>
                  <DropdownLink
                    href={event.href ?? "/dashboard"}
                    onSelect={close}
                    className={cn("items-start", index < unread && "bg-primary-soft/40")}
                  >
                    <span className="mt-0.5">
                      <Avatar
                        name={event.actor.name}
                        initials={event.actor.initials}
                        size="xs"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] text-fg">
                        <span className="font-medium">{event.actor.name}</span>{" "}
                        {event.action}{" "}
                        <span className="font-medium">{event.target}</span>
                      </span>
                      <span className="mt-0.5 block text-[12px] text-fg-subtle">
                        {formatRelativeTime(event.createdAt)}
                      </span>
                    </span>
                  </DropdownLink>
                </li>
              ))}
            </ul>
            <DropdownSeparator />
            <DropdownLink href="/dashboard" onSelect={close} className="justify-center">
              View all activity
            </DropdownLink>
          </>
        )}
      </DropdownMenu>

      <ThemeToggle />

      <DropdownMenu
        label="Account menu"
        className="w-60"
        trigger={({ isOpen }) => (
          <span className="flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 transition-colors hover:bg-surface-2">
            <Avatar
              name={currentUser.name}
              initials={currentUser.initials}
              size="sm"
              online
            />
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 text-fg-subtle transition-transform duration-150",
                isOpen && "rotate-180",
              )}
            />
          </span>
        )}
      >
        {({ close }) => (
          <>
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-medium text-fg">{currentUser.name}</p>
              <p className="truncate text-[13px] text-fg-muted">{currentUser.email}</p>
            </div>
            <DropdownSeparator />
            <DropdownLink href="/profile" onSelect={close}>
              <UserRound aria-hidden className="size-4" />
              Profile
            </DropdownLink>
            <DropdownLink href="/settings" onSelect={close}>
              <Settings aria-hidden className="size-4" />
              Settings
            </DropdownLink>
            <DropdownSeparator />
            <DropdownItem onSelect={close} destructive>
              <LogOut aria-hidden className="size-4" />
              Sign out
            </DropdownItem>
          </>
        )}
      </DropdownMenu>

      <ButtonLink href="/workspace" size="sm" className="ml-1 hidden sm:inline-flex">
        New chat
      </ButtonLink>
    </header>
  );
}
