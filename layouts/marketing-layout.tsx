import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { APP_NAME } from "@/lib/constants";
import { FOOTER_NAV } from "@/lib/navigation";
import { MarketingNav } from "./marketing-nav";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingNav />
      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <div>
              <div className="flex items-center gap-2.5">
                <LogoMark />
                <span className="text-[15px] font-semibold tracking-tight text-fg">
                  {APP_NAME}
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-fg-muted">
                The governed AI workspace for enterprise teams. One place for
                models, prompts, projects and usage.
              </p>
            </div>

            {FOOTER_NAV.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[13px] font-semibold text-fg">{column.title}</h2>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-fg-subtle">
              © {new Date().getFullYear()} {APP_NAME}. A demonstration product —
              this interface runs entirely on mock data.
            </p>
            <p className="text-[13px] text-fg-subtle">
              SOC 2 Type II · ISO 27001 · GDPR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
