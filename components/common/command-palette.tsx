"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { prompts } from "@/lib/mock/prompts";
import { projects } from "@/lib/mock/projects";
import { FLAT_NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  group: string;
  href: string;
  hint?: string;
}

const COMMANDS: Command[] = [
  ...FLAT_NAV.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    group: "Navigate",
    href: item.href,
    hint: item.description,
  })),
  ...projects.slice(0, 6).map((project) => ({
    id: `project-${project.id}`,
    label: project.name,
    group: "Projects",
    href: "/projects",
    hint: project.description,
  })),
  ...prompts.slice(0, 6).map((prompt) => ({
    id: `prompt-${prompt.id}`,
    label: prompt.title,
    group: "Prompts",
    href: "/prompts",
    hint: prompt.description,
  })),
];

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Search AetherAI"
      description="Jump to a page, project or prompt."
      size="md"
    >
      {/* Mounted only while open, so its state starts fresh every time
          rather than being reset from an effect. */}
      <PaletteBody onClose={onClose} />
    </Modal>
  );
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return COMMANDS.slice(0, 8);
    return COMMANDS.filter(
      (command) =>
        command.label.toLowerCase().includes(term) ||
        command.hint?.toLowerCase().includes(term),
    ).slice(0, 10);
  }, [query]);

  /** Results with the group heading each row should render above it, if any. */
  const rows = useMemo(
    () =>
      results.map((command, index) => ({
        command,
        heading:
          index === 0 || results[index - 1].group !== command.group
            ? command.group
            : null,
      })),
    [results],
  );

  const run = (command: Command) => {
    onClose();
    router.push(command.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + results.length) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      run(results[activeIndex]);
    }
  };

  return (
    <div onKeyDown={onKeyDown}>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle"
        />
        <input
          type="text"
          value={query}
          data-autofocus
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          placeholder="Search pages, projects and prompts…"
          aria-label="Search"
          aria-controls="command-results"
          className="h-10 w-full rounded-lg border border-border bg-surface-2 pr-3 pl-9 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-2 focus:ring-primary/25 focus-visible:outline-none"
        />
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-fg-muted">
          No matches for “{query}”. Try a page or project name.
        </p>
      ) : (
        <ul id="command-results" className="mt-3 space-y-0.5">
          {rows.map(({ command, heading }, index) => (
            <li key={command.id}>
              {heading ? (
                <p className="px-2 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">
                  {heading}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => run(command)}
                onPointerEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                  index === activeIndex ? "bg-surface-2" : "hover:bg-surface-2",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {command.label}
                  </span>
                  {command.hint ? (
                    <span className="block truncate text-[13px] text-fg-muted">
                      {command.hint}
                    </span>
                  ) : null}
                </span>
                {index === activeIndex ? (
                  <CornerDownLeft aria-hidden className="size-3.5 text-fg-subtle" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
