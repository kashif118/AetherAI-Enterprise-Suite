import type { AIModel } from "@/types";

/**
 * Mock model catalogue. These are fictional in-product model names — the
 * workspace never calls a real provider. Replace with `GET /v1/models`.
 */
export const models: AIModel[] = [
  {
    id: "aether-nova-2",
    name: "Aether Nova 2",
    shortName: "Nova 2",
    provider: "aether",
    description:
      "Flagship reasoning model. Best for complex analysis, long documents and multi-step tool use.",
    contextWindow: 400_000,
    speed: "deep",
    inputCostPerMTok: 5,
    outputCostPerMTok: 25,
    capabilities: ["reasoning", "tools", "vision", "long-context"],
    recommended: true,
  },
  {
    id: "aether-flux",
    name: "Aether Flux",
    shortName: "Flux",
    provider: "aether",
    description:
      "Balanced general-purpose model. The default for everyday drafting, summarising and Q&A.",
    contextWindow: 200_000,
    speed: "balanced",
    inputCostPerMTok: 1.2,
    outputCostPerMTok: 6,
    capabilities: ["tools", "code", "vision"],
  },
  {
    id: "aether-swift",
    name: "Aether Swift",
    shortName: "Swift",
    provider: "aether",
    description:
      "Low-latency model for classification, routing and high-volume batch work.",
    contextWindow: 128_000,
    speed: "fastest",
    inputCostPerMTok: 0.25,
    outputCostPerMTok: 1.1,
    capabilities: ["tools", "code"],
  },
  {
    id: "aether-codex",
    name: "Aether Codex",
    shortName: "Codex",
    provider: "aether",
    description:
      "Tuned for code generation, refactoring and repository-scale review.",
    contextWindow: 320_000,
    speed: "balanced",
    inputCostPerMTok: 2,
    outputCostPerMTok: 9,
    capabilities: ["code", "tools", "long-context"],
  },
  {
    id: "northwind-atlas-1",
    name: "Northwind Atlas 1",
    shortName: "Atlas 1",
    provider: "self-hosted",
    description:
      "Your privately hosted model, running inside the Northwind VPC. No data leaves the tenancy.",
    contextWindow: 96_000,
    speed: "balanced",
    inputCostPerMTok: 0,
    outputCostPerMTok: 0,
    capabilities: ["code", "tools"],
  },
];

export const defaultModelId = "aether-flux";

export function findModel(id: string): AIModel | undefined {
  return models.find((model) => model.id === id);
}

export function modelName(id: string) {
  return findModel(id)?.name ?? "Unknown model";
}
