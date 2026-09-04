"use client";

import { Code2, FileSearch, LineChart, PenLine, type LucideIcon } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

interface Starter {
  icon: LucideIcon;
  title: string;
  prompt: string;
}

const STARTERS: Starter[] = [
  {
    icon: Code2,
    title: "Review a change",
    prompt:
      "Review this diff for correctness first, then clarity. Skip anything the linter already covers, and tell me if it's fine rather than inventing feedback.\n\n",
  },
  {
    icon: FileSearch,
    title: "Interrogate a document",
    prompt:
      "Read the attached document and tell me the three things I'd regret not knowing. Quote the exact lines they come from.\n\n",
  },
  {
    icon: LineChart,
    title: "Explain a number",
    prompt:
      "Here are last quarter's figures. Explain what moved, what it was caused by, and which part of the change is noise.\n\n",
  },
  {
    icon: PenLine,
    title: "Draft, then cut it",
    prompt:
      "Draft a short update for this, then rewrite it at half the length. Show me both so I can compare.\n\n",
  },
];

/**
 * Shown when a conversation has no messages. Starters are concrete tasks
 * rather than feature advertising — they set the tone for what the tool is for.
 */
export function ConversationStarters({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
          <LogoMark className="size-7" />
        </span>

        <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">
          What are we working on?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Attach a file, pick a model, or start from one of these. Everything you
          send here stays inside your workspace.
        </p>

        <ul className="mt-8 grid gap-2.5 text-left sm:grid-cols-2">
          {STARTERS.map((starter) => (
            <li key={starter.title}>
              <button
                type="button"
                onClick={() => onSelect(starter.prompt)}
                className="flex h-full w-full items-start gap-3 rounded-xl border border-border bg-surface p-3.5 text-left transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-fg">
                  <starter.icon aria-hidden className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-fg">
                    {starter.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[12px] leading-relaxed text-fg-muted">
                    {starter.prompt.trim()}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
