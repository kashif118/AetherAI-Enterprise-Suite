"use client";

import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/states";
import { prompts } from "@/lib/mock/prompts";
import { titleCase } from "@/lib/utils";

/** Inserts a saved prompt's body into the composer. */
export function PromptPickerModal({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (body: string) => void;
}) {
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return prompts;
    return prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(term) ||
        prompt.description.toLowerCase().includes(term) ||
        prompt.tags.some((tag) => tag.includes(term)),
    );
  }, [search]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Insert a saved prompt"
      description="Templates published to your workspace. Variables are left as placeholders for you to fill in."
      size="lg"
    >
      <SearchInput
        label="Search prompts"
        placeholder="Search by title, description or tag…"
        value={search}
        onChange={setSearch}
      />

      {results.length === 0 ? (
        <EmptyState
          compact
          icon={SearchX}
          title="No prompts match"
          description={`Nothing in the library matches “${search}”.`}
        />
      ) : (
        <ul className="mt-3 space-y-1.5">
          {results.map((prompt) => (
            <li key={prompt.id}>
              <button
                type="button"
                onClick={() => {
                  onInsert(prompt.body);
                  onClose();
                }}
                className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-fg">{prompt.title}</span>
                  <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-[12px] text-fg-muted">
                    {titleCase(prompt.category)}
                  </span>
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">
                  {prompt.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
