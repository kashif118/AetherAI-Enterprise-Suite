import {
  BarChart3,
  Bot,
  FolderKanban,
  Library,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "./section";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: "One workspace, every model",
    description:
      "Switch between hosted and self-hosted models mid-conversation. Attach files, compare answers, and keep the thread.",
  },
  {
    icon: Library,
    title: "Prompts as shared assets",
    description:
      "Publish templates with typed variables, review them like code, and see which ones teams actually reach for.",
  },
  {
    icon: FolderKanban,
    title: "Projects with real boundaries",
    description:
      "Scope members, models and budgets per project — so a pilot can't quietly become a line item nobody owns.",
  },
  {
    icon: BarChart3,
    title: "Usage you can defend",
    description:
      "Spend, latency and adoption broken down by team, model and project. Exportable, and reconciled to the invoice.",
  },
  {
    icon: ShieldCheck,
    title: "Controls before incidents",
    description:
      "SSO and SCIM, per-model data policies, retention windows, and an audit log that captures the prompt, not just the click.",
  },
  {
    icon: Workflow,
    title: "Built to be connected",
    description:
      "A typed API surface and webhooks, so the workspace fits the systems you already run rather than replacing them.",
  },
];

export function FeatureGrid() {
  return (
    <Section id="product">
      <SectionHeading
        eyebrow="Product"
        title="Everything a team needs to use AI seriously"
        description="Not a chat box with a logo on it. The workspace, the governance and the numbers, in one product."
      />

      <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="bg-surface p-6 sm:p-7">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg">
              <feature.icon aria-hidden className="size-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-fg">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
