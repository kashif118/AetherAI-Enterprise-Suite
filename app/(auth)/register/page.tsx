import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/layouts/auth-layout";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Start a 14-day AetherAI trial for your team.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Start your free trial"
      subtitle="Fourteen days, no card, the full product. Bring one team and a real workload."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
