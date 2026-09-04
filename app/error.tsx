"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Route-level error boundary. Anything a page throws during render lands here
 * rather than blanking the app.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error reporter once one is connected.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl border border-danger/25 bg-danger-soft text-danger-fg">
        <TriangleAlert aria-hidden className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-fg">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
        This page failed to render. Trying again usually clears it — if it
        doesn’t, the details below help support narrow it down.
      </p>
      {error.digest ? (
        <p className="mt-3 rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[12px] text-fg-subtle">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RefreshCw aria-hidden className="size-4" />
          Try again
        </Button>
        <ButtonLink href="/dashboard" variant="secondary">
          Go to the dashboard
        </ButtonLink>
      </div>
    </main>
  );
}
