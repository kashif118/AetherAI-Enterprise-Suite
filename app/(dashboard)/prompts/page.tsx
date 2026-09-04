import type { Metadata } from "next";
import { PromptLibrary } from "@/components/prompts/prompt-library";

export const metadata: Metadata = {
  title: "Prompt library",
  description:
    "Reusable, governed prompt templates published across your AetherAI workspace.",
};

export default function PromptsPage() {
  return <PromptLibrary />;
}
