import { Avatar } from "@/components/ui/avatar";
import { Section, SectionHeading } from "./section";

const QUOTES = [
  {
    quote:
      "The prompt library is the bit I underestimated. Twelve people had written their own contract-review prompt, all slightly wrong. Now there's one, and it's reviewed.",
    name: "Elena Moreau",
    initials: "EM",
    role: "Compliance Analyst, Northwind Industries",
  },
  {
    quote:
      "We cut model spend 31% in two months without telling anyone to use it less. We just moved the routine work off the expensive model.",
    name: "Priya Raghunathan",
    initials: "PR",
    role: "Head of Data Science, Northwind Industries",
  },
  {
    quote:
      "Our security review took four weeks with the last vendor. This one took three days, because the answers were in the product rather than in a PDF.",
    name: "Aisha Rahman",
    initials: "AR",
    role: "Security Engineering Lead, Northwind Industries",
  },
];

export function Testimonials() {
  return (
    <Section id="customers">
      <SectionHeading
        eyebrow="Customers"
        title="What changes in the first quarter"
        description="Composite accounts from the AetherAI design partner programme."
      />

      <ul className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {QUOTES.map((item) => (
          <li
            key={item.name}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 sm:p-7"
          >
            <blockquote className="flex-1 text-[15px] leading-relaxed text-pretty text-fg">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <Avatar name={item.name} initials={item.initials} size="md" />
              <span>
                <span className="block text-sm font-medium text-fg">{item.name}</span>
                <span className="block text-[13px] text-fg-muted">{item.role}</span>
              </span>
            </figcaption>
          </li>
        ))}
      </ul>
    </Section>
  );
}
