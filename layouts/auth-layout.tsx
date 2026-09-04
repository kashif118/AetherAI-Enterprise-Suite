import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Link shown at the foot of the card, e.g. "Already have an account?". */
  footer: ReactNode;
}

/**
 * Two-column authentication frame: form on the left, proof on the right.
 * The right column is hidden below `lg` so the form owns small screens.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
            <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>
            <div className="mt-7">{children}</div>
            <div className="mt-6 text-sm text-fg-muted">{footer}</div>
          </div>
        </div>

        <p className="text-center text-[13px] text-fg-subtle">
          <Link href="/" className="hover:text-fg-muted">
            ← Back to aetherai.com
          </Link>
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-border bg-surface lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative max-w-md">
          <p className="text-[13px] font-semibold tracking-wider text-primary uppercase">
            Trusted by platform teams
          </p>
          <blockquote className="mt-5 text-xl leading-relaxed font-medium text-balance text-fg">
            “We moved eleven teams onto AetherAI in a quarter. The part that
            mattered wasn’t the models — it was finally being able to answer
            what everyone was spending, and on what.”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-fg">
              DK
            </span>
            <span>
              <span className="block text-sm font-medium text-fg">Daniel Kovač</span>
              <span className="block text-[13px] text-fg-muted">
                VP Engineering, Northwind Industries
              </span>
            </span>
          </figcaption>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              { value: "184", label: "seats in use" },
              { value: "99.98%", label: "platform uptime" },
              { value: "31%", label: "lower spend" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold text-fg">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-fg-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
