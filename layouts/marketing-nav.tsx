"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDisclosure } from "@/hooks/use-disclosure";
import { MARKETING_NAV } from "@/lib/navigation";

export function MarketingNav() {
  const menu = useDisclosure(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Start free trial
          </ButtonLink>
          <button
            type="button"
            onClick={menu.toggle}
            aria-expanded={menu.isOpen}
            aria-controls="marketing-mobile-nav"
            className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
          >
            {menu.isOpen ? (
              <X aria-hidden className="size-5" />
            ) : (
              <Menu aria-hidden className="size-5" />
            )}
            <span className="sr-only">
              {menu.isOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </div>

      {menu.isOpen ? (
        <nav
          id="marketing-mobile-nav"
          aria-label="Main"
          className="animate-fade-in border-t border-border bg-surface px-4 py-3 md:hidden"
        >
          <ul className="space-y-0.5">
            {MARKETING_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={menu.close}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={menu.close}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg sm:hidden"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
