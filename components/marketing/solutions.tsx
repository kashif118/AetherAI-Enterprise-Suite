import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "./section";

const SOLUTIONS = [
  {
    audience: "For engineering",
    title: "Ship with review, not vibes",
    points: [
      "Repository-scale code review against your own conventions",
      "Incident postmortems drafted from the on-call timeline",
      "Migration plans that name the six files nobody wants to touch",
    ],
    href: "/workspace",
    cta: "Open the workspace",
  },
  {
    audience: "For operations & legal",
    title: "The boring parts, done consistently",
    points: [
      "Contract first-pass review against your standard positions",
      "Vendor questionnaires scoped to the data class in play",
      "Every output traceable to the prompt version that produced it",
    ],
    href: "/prompts",
    cta: "Browse the prompt library",
  },
  {
    audience: "For platform owners",
    title: "Answers when finance asks",
    points: [
      "Spend by team, model and project, reconciled monthly",
      "Adoption by department, so pilots don't stall unnoticed",
      "Budgets and rate limits enforced before the overage, not after",
    ],
    href: "/analytics",
    cta: "See the analytics",
  },
];

export function Solutions() {
  return (
    <Section id="solutions" className="bg-surface">
      <SectionHeading
        eyebrow="Solutions"
        title="Built for the three people who have to agree"
        description="The team who builds with it, the team who signs it off, and the person who pays for it."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {SOLUTIONS.map((solution) => (
          <div
            key={solution.title}
            className="flex flex-col rounded-2xl border border-border bg-bg p-6 sm:p-7"
          >
            <p className="text-[13px] font-semibold tracking-wider text-primary uppercase">
              {solution.audience}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-balance text-fg">
              {solution.title}
            </h3>
            <ul className="mt-5 flex-1 space-y-3">
              {solution.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-fg-muted">
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-success-fg"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href={solution.href}
              variant="secondary"
              size="sm"
              className="mt-6 self-start"
            >
              {solution.cta}
            </ButtonLink>
          </div>
        ))}
      </div>
    </Section>
  );
}
