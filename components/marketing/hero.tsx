import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AppPreview } from "./app-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[13px] text-fg-muted">
            <span className="inline-flex size-1.5 rounded-full bg-success" aria-hidden />
            Aether Nova 2 is now generally available
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="text-gradient">The enterprise AI workspace</span>
            <span className="block text-fg">your security team will sign off.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted">
            AetherAI puts every model, prompt and project behind one governed
            front door — so teams move fast, and you can still answer who spent
            what, on which data, and why.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              Explore the product
            </ButtonLink>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-[13px] text-fg-subtle">
            <ShieldCheck aria-hidden className="size-4" />
            SOC 2 Type II · No training on your data · EU and US data residency
          </p>
        </div>

        <div className="mt-14 sm:mt-20">
          <AppPreview />
        </div>
      </div>
    </section>
  );
}
