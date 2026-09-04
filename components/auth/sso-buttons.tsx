"use client";

import { Building2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

/**
 * Enterprise sign-in options. These are front-end only — no identity provider
 * is wired up, and the buttons say so rather than pretending to redirect.
 */
export function SsoButtons({ disabled }: { disabled?: boolean }) {
  const { toast } = useToast();

  const notConnected = (provider: string) =>
    toast({
      variant: "info",
      title: `${provider} isn't connected`,
      description:
        "This build is a front-end demo. Identity providers are configured once a backend is connected.",
    });

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => notConnected("SAML SSO")}
      >
        <Building2 aria-hidden className="size-4" />
        SAML SSO
      </Button>
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => notConnected("Passkey sign-in")}
      >
        <KeyRound aria-hidden className="size-4" />
        Passkey
      </Button>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span className="text-[13px] text-fg-subtle">{label}</span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}
