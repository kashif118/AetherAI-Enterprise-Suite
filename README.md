# AetherAI Enterprise Suite — frontend

A production-quality **frontend** for AetherAI, a fictional enterprise AI
workspace. Twelve pages, a reusable component library, hand-built charts and a
mock service layer designed so a real API can be dropped in without touching the
UI.

There is deliberately **no backend and no database**. Every screen runs on the
mock dataset in `lib/mock/`, served through the async service layer in
`services/`. Nothing in the app pretends to call a real provider.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.9, strict |
| UI | React 19 |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| Icons | lucide-react |
| Charts | hand-built SVG (no charting dependency) |

Runtime dependencies are `next`, `react`, `react-dom`, `clsx`,
`tailwind-merge` and `lucide-react`. That is the whole list.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |
| `npm run check` | typecheck → lint → build |

## Pages

| Route | What it is |
|---|---|
| `/` | Marketing landing page — hero, features, solutions, security, pricing, testimonials |
| `/login` | Sign in. Any password works; type `wrong` to see the error state |
| `/register` | Sign up with live password-strength feedback; a `@gmail.com` address triggers the server-side rejection state |
| `/dashboard` | Overview cards, usage chart, recent projects, recent conversations, activity, quick actions |
| `/workspace` | Full AI workspace — conversation sidebar, messages, composer, model selector, file attachments, context rail |
| `/chat` | The same workspace without the context rail |
| `/prompts` | Prompt library with search, category, sort and favourites filters |
| `/projects` | Project grid with status tabs, search, sort and a create-project dialog |
| `/team` | Members table, seat usage, invitations and role reference |
| `/analytics` | Range filter, six metrics, stacked usage chart with a table view, spend, latency and adoption |
| `/settings` | Workspace, appearance, model access, security, notifications and billing |
| `/profile` | Profile, personal details, preferences and active sessions |

## Architecture

```
app/                    Routes only — each page is a thin shell around a view component
  (auth)/               Login and register, sharing the split auth layout
  (dashboard)/          Padded, page-scrolling routes wrapped in <AppShell>
  (canvas)/             Full-height routes (workspace, chat) wrapped in <AppShell fullBleed>
components/
  ui/                   The design system: Button, Card, Field, Modal, Tabs, Table, …
  charts/               SVG chart primitives and the shared scale/path helpers
  dashboard/            Dashboard sections
  workspace/            Conversation sidebar, message list, composer, markdown renderer
  projects/ prompts/ team/ settings/ profile/ analytics/   Per-page views
  marketing/            Landing page sections
  providers/            Theme and toast context
layouts/                AppShell, Sidebar, Header, auth and marketing frames
hooks/                  useAsync, useLocalStorage, useMediaQuery, useMeasure, …
lib/                    Formatters, design constants, navigation config, mock data
services/               The API seam — every remote call in the app goes through here
types/                  Domain models
public/                 Static assets
```

### The API seam

`services/api-client.ts` exposes one function, `request()`, which today resolves
mock data after a simulated round trip and can reject with `ApiError`. Every
domain service (`projects.service.ts`, `conversations.service.ts`, …) is built on
it and returns real promises with real error paths.

Connecting a backend means replacing the body of `request()` with `fetch()`.
Signatures, types and every loading / empty / error state in the UI stay exactly
as they are.

```ts
// services/api-client.ts — the only place that needs to change
export async function request<T>(payload, { latency, signal } = {}): Promise<T> {
  await delay(latency);
  return typeof payload === "function" ? payload() : payload;
}
```

### Async state

`hooks/use-async.ts` is the single pattern every data-driven view uses. It
returns `{ data, status, isLoading, isEmpty, isError, error, refetch }` and
aborts in-flight requests when its dependencies change, so a slow response can
never overwrite a newer one. Loading is *derived* from whether the settled
result matches the current dependencies rather than set inside an effect.

### Design tokens

All colour lives in `app/globals.css` as CSS custom properties, declared once
for light and once for dark, then exposed to Tailwind through `@theme inline`.
Components reference semantic names (`bg-surface`, `text-fg-muted`,
`border-border`) and never a raw hex value, so the whole product re-themes from
one file.

Dark mode is class-based. An inline script in the root layout applies the stored
preference before first paint, so switching themes never flashes.

### Charts

The four chart forms (stacked area, horizontal bars, columns, sparkline) are
drawn as SVG in `components/charts/`. Series colours are assigned in fixed slot
order from a palette validated for colour-vision deficiency against both the
light and dark chart surfaces. Every multi-series chart ships a legend, the
usage chart ships a table view, and no chart ever uses two y-axes.

### Deliberate demo behaviours

- The composer accepts `/error` as a message to exercise the failed-response state.
- `cnv_05` contains a message with `status: "error"` so the error bubble is visible without interacting.
- Conversations without seeded messages render the workspace empty state.
- Actions that would need persistence (creating a project, sending invitations, saving settings) validate fully and then say plainly that nothing was saved.

## Accessibility

- One focus treatment across the product, defined once in `globals.css`.
- Labels, hints and errors are wired to their controls by `components/ui/field.tsx`.
- Tabs implement the WAI-ARIA pattern with arrow-key roving focus; the modal traps focus, restores it on close and closes on Escape.
- Status is never carried by colour alone — badges, trends and chart series all carry text.
- `prefers-reduced-motion` disables animation globally.

## Notes

- Timestamps in the mock dataset are anchored to a fixed `MOCK_NOW` constant in `lib/utils.ts` so server and client renders agree. Swap it for `Date.now()` when real data arrives.
- `.env*` files are git-ignored. `.env.example` documents the variables a backend would need.
