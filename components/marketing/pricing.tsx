import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./section";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    cadence: "per user / month",
    description: "For a single team getting past the pilot.",
    features: [
      "Up to 25 seats",
      "All hosted Aether models",
      "Prompt library and projects",
      "30-day usage history",
      "Email support",
    ],
    cta: "Start free trial",
    href: "/register",
    featured: false,
  },
  {
    name: "Growth",
    price: "$59",
    cadence: "per user / month",
    description: "For several teams sharing one workspace.",
    features: [
      "Up to 250 seats",
      "SSO (SAML and OIDC)",
      "Per-project budgets and rate limits",
      "12-month usage history and exports",
      "Priority support with a 4-hour SLA",
    ],
    cta: "Start free trial",
    href: "/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual agreement",
    description: "For regulated organisations with a security review.",
    features: [
      "Unlimited seats and SCIM provisioning",
      "Self-hosted Atlas models in your VPC",
      "Regional processing and custom retention",
      "Audit log streaming to your SIEM",
      "Named architect and 99.9% uptime SLA",
    ],
    cta: "Talk to sales",
    href: "/register",
    featured: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="bg-surface">
      <SectionHeading
        eyebrow="Pricing"
        title="Per seat, with the model spend on top"
        description="No minimum commitment below Enterprise. Model usage is billed at list price with no markup — you can check it against the analytics page."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-bg p-6 sm:p-7",
              plan.featured
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border",
            )}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[12px] font-medium text-primary-fg">
                Most popular
              </span>
            ) : null}

            <h3 className="text-[15px] font-semibold text-fg">{plan.name}</h3>
            <p className="mt-1.5 text-sm text-fg-muted">{plan.description}</p>

            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight text-fg">
                {plan.price}
              </span>
              <span className="text-[13px] text-fg-subtle">{plan.cadence}</span>
            </p>

            <ButtonLink
              href={plan.href}
              variant={plan.featured ? "primary" : "secondary"}
              className="mt-6 w-full"
            >
              {plan.cta}
            </ButtonLink>

            <ul className="mt-7 space-y-3 border-t border-border pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-fg-muted">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success-fg" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
