"use client";

import { Library, Plus, SearchX, Star } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useAsync } from "@/hooks/use-async";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import {
  listPrompts,
  PROMPT_CATEGORIES,
  type PromptQuery,
} from "@/services/prompts.service";
import type { Prompt, PromptCategory } from "@/types";
import { PromptCard } from "./prompt-card";
import { PromptDetailModal } from "./prompt-detail-modal";

export function PromptLibrary() {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PromptCategory | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<PromptQuery["sortBy"]>("popular");
  const [selected, setSelected] = useState<Prompt | null>(null);

  const debouncedSearch = useDebouncedValue(search, 250);

  const load = useCallback(
    (signal: AbortSignal) =>
      listPrompts(
        { search: debouncedSearch, category, favoritesOnly, sortBy },
        { signal },
      ),
    [debouncedSearch, category, favoritesOnly, sortBy],
  );

  const { data, isLoading, isError, isEmpty, error, refetch } = useAsync(load, [
    debouncedSearch,
    category,
    favoritesOnly,
    sortBy,
  ]);

  const hasFilters = Boolean(debouncedSearch) || category !== "all" || favoritesOnly;

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setFavoritesOnly(false);
  };

  return (
    <>
      <PageHeader
        title="Prompt library"
        description="Reusable, reviewed prompt templates published to your workspace. Variables are filled in when the prompt is used."
        actions={
          <Button
            onClick={() =>
              toast({
                variant: "info",
                title: "Prompt editor isn't wired up yet",
                description:
                  "Creating a prompt needs a backend to store it. The library is read-only in this build.",
              })
            }
          >
            <Plus aria-hidden className="size-4" />
            New prompt
          </Button>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            label="Search prompts"
            placeholder="Search by title, description or tag…"
            value={search}
            onChange={setSearch}
            className="sm:max-w-xs"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="prompt-category">
              Category
            </label>
            <Select
              id="prompt-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as PromptCategory | "all")
              }
              className="w-44"
            >
              {PROMPT_CATEGORIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <label className="sr-only" htmlFor="prompt-sort">
              Sort by
            </label>
            <Select
              id="prompt-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as PromptQuery["sortBy"])
              }
              className="w-40"
            >
              <option value="popular">Most used</option>
              <option value="recent">Recently updated</option>
              <option value="title">Title A–Z</option>
            </Select>

            <button
              type="button"
              aria-pressed={favoritesOnly}
              onClick={() => setFavoritesOnly((value) => !value)}
              className={cn(
                "inline-flex h-9.5 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
                favoritesOnly
                  ? "border-transparent bg-primary-soft text-primary-soft-fg"
                  : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              <Star
                aria-hidden
                className={cn("size-4", favoritesOnly && "fill-current")}
              />
              Favourites
            </button>
          </div>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
              <Skeleton className="mt-4 h-20 w-full" />
              <Skeleton className="mt-4 h-3 w-32" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-border bg-surface">
          <ErrorState
            title="Couldn't load the prompt library"
            message={error ?? "Something went wrong."}
            onRetry={refetch}
          />
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border border-border bg-surface">
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No prompts match those filters"
              description="Nothing in the library matches what you've selected. Widen the search or clear the filters."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Library}
              title="The library is empty"
              description="Publish your first prompt and it becomes available to everyone you share it with."
            />
          )}
        </div>
      ) : (
        <>
          <p className="mb-3 text-[13px] text-fg-muted" aria-live="polite">
            {data?.length} prompt{data?.length === 1 ? "" : "s"}
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.map((prompt) => (
              <li key={prompt.id}>
                <PromptCard prompt={prompt} onOpen={setSelected} />
              </li>
            ))}
          </ul>
        </>
      )}

      <PromptDetailModal prompt={selected} onClose={() => setSelected(null)} />
    </>
  );
}
