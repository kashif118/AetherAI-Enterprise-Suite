"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AuthDivider, SsoButtons } from "@/components/auth/sso-buttons";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toErrorMessage } from "@/services/api-client";
import { register } from "@/services/auth.service";

interface FieldErrors {
  name?: string;
  company?: string;
  email?: string;
  password?: string;
  terms?: string;
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Strong"] as const;

function passwordStrength(password: string) {
  if (password.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^\w\s]/.test(password)) score += 1;
  if (password.length >= 14) score = Math.min(score + 1, 3);
  return score;
}

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Enter your full name.";
    if (!company.trim()) next.company = "Enter your company name.";
    if (!email.trim()) next.email = "Enter your work email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "That doesn't look like a valid email address.";
    }
    if (password.length < 8) {
      next.password = "Use at least 8 characters.";
    }
    if (!acceptedTerms) {
      next.terms = "You need to accept the terms to create an account.";
    }
    return next;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name, email, company, password, acceptedTerms });
      toast({
        variant: "success",
        title: "Workspace created",
        description: `${company} is ready. Your trial runs for 14 days.`,
      });
      router.push("/dashboard");
    } catch (error) {
      setFormError(toErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SsoButtons disabled={submitting} />
      <AuthDivider label="or sign up with email" />

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError ? (
          <div
            role="alert"
            className="flex gap-2.5 rounded-lg border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger-fg"
          >
            <TriangleAlert aria-hidden className="mt-px size-4 shrink-0" />
            <p>{formError}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} required>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                autoComplete="name"
                placeholder="Muhammad Kashif"
                value={name}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setName(event.target.value)}
              />
            )}
          </Field>

          <Field label="Company" error={errors.company} required>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                autoComplete="organization"
                placeholder="Northwind Industries"
                value={company}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setCompany(event.target.value)}
              />
            )}
          </Field>
        </div>

        <Field
          label="Work email"
          error={errors.email}
          hint="Personal addresses are rejected — try one ending in @gmail.com to see it."
          required
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              invalid={invalid}
              aria-describedby={describedBy}
              onChange={(event) => setEmail(event.target.value)}
            />
          )}
        </Field>

        <Field label="Password" error={errors.password} required>
          {({ id, describedBy, invalid }) => (
            <div className="space-y-2">
              <Input
                id={id}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setPassword(event.target.value)}
              />
              {password ? (
                <div className="flex items-center gap-2">
                  <span aria-hidden className="flex flex-1 gap-1">
                    {[0, 1, 2].map((index) => (
                      <span
                        key={index}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          index < strength
                            ? strength === 1
                              ? "bg-warning"
                              : strength === 2
                                ? "bg-info"
                                : "bg-success"
                            : "bg-surface-3",
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-[12px] text-fg-muted">
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </Field>

        <div>
          <Checkbox
            label={
              <>
                I agree to the{" "}
                <Link href="/" className="font-medium text-primary hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/" className="font-medium text-primary hover:underline">
                  privacy policy
                </Link>
                .
              </>
            }
            checked={acceptedTerms}
            aria-invalid={Boolean(errors.terms)}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
          />
          {errors.terms ? (
            <p role="alert" className="mt-1.5 text-[13px] text-danger-fg">
              {errors.terms}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Creating workspace…" : "Create workspace"}
        </Button>

        <p className="text-center text-[13px] text-fg-subtle">
          No card required. We’ll email you before the trial ends.
        </p>
      </form>
    </div>
  );
}
