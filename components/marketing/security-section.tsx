import { FileLock2, Globe2, KeyRound, ScrollText } from "lucide-react";
import { Section, SectionHeading } from "./section";

const CONTROLS = [
  {
    icon: KeyRound,
    title: "SSO, SCIM and scoped roles",
    description:
      "SAML and OIDC with automated provisioning. Four roles, and permissions that stop at the project boundary.",
  },
  {
    icon: FileLock2,
    title: "Your data stays yours",
    description:
      "No training on customer content, ever. Configurable retention from 0 to 400 days, enforced per workspace.",
  },
  {
    icon: Globe2,
    title: "Regional processing",
    description:
      "Pin a workspace to EU or US processing, or run Atlas models inside your own VPC with no egress at all.",
  },
  {
    icon: ScrollText,
    title: "Audit that means something",
    description:
      "Every request logged with actor, model, prompt version and attachments — streamable to your own SIEM.",
  },
];

const CERTIFICATIONS = [
  "SOC 2 Type II",
  "ISO 27001",
  "ISO 42001",
  "GDPR",
  "HIPAA ready",
  "EU AI Act aligned",
];

export function SecuritySection() {
  return (
    <Section id="security">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Security"
            title="The questions your security review will ask"
            description="Answered in the product, not in a follow-up call. Everything below is configurable per workspace and visible in the audit log."
          />

          <ul className="mt-8 flex flex-wrap gap-2">
            {CERTIFICATIONS.map((certification) => (
              <li
                key={certification}
                className="rounded-full border border-border bg-surface px-3 py-1 text-[13px] text-fg-muted"
              >
                {certification}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONTROLS.map((control) => (
            <li
              key={control.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <control.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-3.5 text-sm font-semibold text-fg">{control.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {control.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
