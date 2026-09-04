import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { LogoCloud } from "@/components/marketing/logo-cloud";
import { Pricing } from "@/components/marketing/pricing";
import { SecuritySection } from "@/components/marketing/security-section";
import { Solutions } from "@/components/marketing/solutions";
import { Testimonials } from "@/components/marketing/testimonials";
import { MarketingLayout } from "@/layouts/marketing-layout";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
};

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <LogoCloud />
      <FeatureGrid />
      <Solutions />
      <SecuritySection />
      <Testimonials />
      <Pricing />
      <CtaSection />
    </MarketingLayout>
  );
}
