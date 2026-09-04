import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/layouts/auth-layout";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AetherAI workspace.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to AetherAI"
      subtitle="Use your work account to get back into the workspace."
      footer={
        <>
          New to AetherAI?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
