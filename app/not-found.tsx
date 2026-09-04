import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <Logo />
      <p className="mt-10 text-[13px] font-semibold tracking-wider text-primary uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        We couldn’t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
        The link may be out of date, or the page may have moved. Everything else
        in the workspace is still where you left it.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/dashboard">Go to the dashboard</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to the home page
        </ButtonLink>
      </div>
    </main>
  );
}
