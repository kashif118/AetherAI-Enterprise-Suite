import { LogoMark } from "@/components/brand/logo";
import { formatCompact, formatCurrency } from "@/lib/utils";

const NAV = ["Dashboard", "Analytics", "AI Workspace", "Prompt Library", "Projects", "Team"];

const STATS = [
  { label: "Requests", value: formatCompact(1_284_000), delta: "+18.4%" },
  { label: "Tokens", value: formatCompact(2_336_880_000), delta: "+22.1%" },
  { label: "Spend", value: formatCurrency(12_069, 0), delta: "+9.7%" },
  { label: "Active users", value: "167", delta: "+6.2%" },
];

/** Static, decorative rendering of the product for the landing page. */
export function AppPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-6 -bottom-10 rounded-[2rem] bg-linear-to-b from-primary/10 to-transparent blur-2xl"
      />

      <figure className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 dark:shadow-black/50">
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </span>
          <span className="mx-auto rounded-md bg-surface px-3 py-1 text-[11px] text-fg-subtle">
            app.aetherai.com/dashboard
          </span>
        </div>

        <div className="flex" aria-hidden>
          <div className="hidden w-44 shrink-0 border-r border-border p-3 sm:block">
            <div className="mb-4 flex items-center gap-2">
              <LogoMark className="size-6" />
              <span className="text-[13px] font-semibold text-fg">AetherAI</span>
            </div>
            <ul className="space-y-1">
              {NAV.map((item, index) => (
                <li
                  key={item}
                  className={`rounded-md px-2.5 py-1.5 text-[12px] ${
                    index === 0
                      ? "bg-primary-soft font-medium text-primary-soft-fg"
                      : "text-fg-muted"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-fg">Good afternoon, Amara</p>
                <p className="text-[11px] text-fg-muted">Northwind Industries · Last 30 days</p>
              </div>
              <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-fg">
                New chat
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border p-2.5">
                  <p className="text-[10px] text-fg-subtle">{stat.label}</p>
                  <p className="mt-1 text-[15px] font-semibold text-fg">{stat.value}</p>
                  <p className="text-[10px] text-success-fg">{stat.delta}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="rounded-lg border border-border p-3">
                <p className="text-[11px] font-medium text-fg">Requests by model</p>
                <svg viewBox="0 0 320 90" className="mt-2 w-full" role="presentation">
                  <defs>
                    <linearGradient id="preview-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {[22, 44, 66].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="320"
                      y1={y}
                      y2={y}
                      stroke="var(--chart-grid)"
                      strokeWidth="1"
                    />
                  ))}
                  <path
                    d="M0 74 L32 66 L64 70 L96 52 L128 58 L160 40 L192 46 L224 28 L256 34 L288 20 L320 24 L320 90 L0 90 Z"
                    fill="url(#preview-fill)"
                  />
                  <path
                    d="M0 74 L32 66 L64 70 L96 52 L128 58 L160 40 L192 46 L224 28 L256 34 L288 20 L320 24"
                    fill="none"
                    stroke="var(--chart-1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-[11px] font-medium text-fg">Recent projects</p>
                <ul className="mt-2 space-y-2">
                  {["Atlas Support Copilot", "Contract Review", "Design System"].map(
                    (name, index) => (
                      <li key={name} className="space-y-1">
                        <p className="truncate text-[11px] text-fg-muted">{name}</p>
                        <span className="block h-1 rounded-full bg-surface-3">
                          <span
                            className="block h-1 rounded-full bg-primary"
                            style={{ width: `${[78, 54, 66][index]}%` }}
                          />
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <figcaption className="sr-only">
          A preview of the AetherAI dashboard showing usage statistics, a request
          volume chart and recent projects.
        </figcaption>
      </figure>
    </div>
  );
}
