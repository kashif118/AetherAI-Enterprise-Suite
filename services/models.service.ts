import { MOCK_LATENCY } from "@/lib/constants";
import { defaultModelId, findModel, models } from "@/lib/mock/models";
import type { AIModel } from "@/types";
import { request, type RequestOptions } from "./api-client";

export function listModels(options?: RequestOptions): Promise<AIModel[]> {
  return request(models, { latency: MOCK_LATENCY.fast, ...options });
}

export { defaultModelId, findModel };

export const SPEED_LABELS: Record<AIModel["speed"], string> = {
  fastest: "Fastest",
  balanced: "Balanced",
  deep: "Deep reasoning",
};

export const CAPABILITY_LABELS: Record<AIModel["capabilities"][number], string> = {
  vision: "Vision",
  tools: "Tools",
  code: "Code",
  reasoning: "Reasoning",
  "long-context": "Long context",
};
