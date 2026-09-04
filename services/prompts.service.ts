import { prompts } from "@/lib/mock/prompts";
import type { Prompt, PromptCategory } from "@/types";
import { request, type RequestOptions } from "./api-client";

export interface PromptQuery {
  search?: string;
  category?: PromptCategory | "all";
  favoritesOnly?: boolean;
  sortBy?: "recent" | "popular" | "title";
}

export function listPrompts(
  query: PromptQuery = {},
  options?: RequestOptions,
): Promise<Prompt[]> {
  return request(() => {
    const term = query.search?.trim().toLowerCase();

    const filtered = prompts.filter((prompt) => {
      if (query.category && query.category !== "all" && prompt.category !== query.category) {
        return false;
      }
      if (query.favoritesOnly && !prompt.favorite) return false;
      if (!term) return true;
      return (
        prompt.title.toLowerCase().includes(term) ||
        prompt.description.toLowerCase().includes(term) ||
        prompt.tags.some((tag) => tag.includes(term))
      );
    });

    return [...filtered].sort((a, b) => {
      if (query.sortBy === "popular") return b.usageCount - a.usageCount;
      if (query.sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, options);
}

export function getPrompt(id: string, options?: RequestOptions) {
  return request(() => prompts.find((prompt) => prompt.id === id) ?? null, options);
}

export const PROMPT_CATEGORIES: { value: PromptCategory | "all"; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "engineering", label: "Engineering" },
  { value: "operations", label: "Operations" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "research", label: "Research" },
  { value: "legal", label: "Legal" },
];
