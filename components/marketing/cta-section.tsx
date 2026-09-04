import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="cta" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
            Put your AI work behind one front door
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-pretty text-fg-muted">
            Fourteen days, no card, full product. Bring one team and a real
            workload — that’s the only way to tell whether it fits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" size="lg" className="w-full sm:w-auto">
              Start free trial
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/dashboard"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Take the product tour
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
