import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Adoption, spend and model performance across your AetherAI workspace.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
