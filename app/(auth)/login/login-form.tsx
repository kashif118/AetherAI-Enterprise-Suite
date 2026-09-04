"use client";

import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthDivider, SsoButtons } from "@/components/auth/sso-buttons";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth.service";
import { toErrorMessage } from "@/services/api-client";

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = "Enter your work email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "That doesn't look like a valid email address.";
  }
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("kashifamish2001@gmail.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const session = await login({ email, password, remember });
      toast({
        variant: "success",
        title: `Welcome back, ${session.user.name.split(" ")[0]}`,
        description: "Signed in to Northwind Industries.",
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
      <AuthDivider label="or continue with email" />

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

        <Field label="Work email" error={errors.email} required>
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

        <Field
          label="Password"
          error={errors.password}
          hint="Any password signs you in. Type “wrong” to see the error state."
          required
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              invalid={invalid}
              aria-describedby={describedBy}
              onChange={(event) => setPassword(event.target.value)}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-md p-1 text-fg-subtle transition-colors hover:text-fg"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden className="size-4" />
                  ) : (
                    <Eye aria-hidden className="size-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              }
            />
          )}
        </Field>

        <div className="flex items-center justify-between gap-4">
          <Checkbox
            label="Keep me signed in"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <Link
            href="/login"
            className="text-[13px] font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
