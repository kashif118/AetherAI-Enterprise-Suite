"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatDate, formatNumber, titleCase } from "@/lib/utils";
import type { Prompt } from "@/types";

export function PromptDetailModal({
  prompt,
  onClose,
}: {
  prompt: Prompt | null;
  onClose: () => void;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Modal
      open={Boolean(prompt)}
      onClose={onClose}
      title={prompt?.title ?? ""}
      description={prompt?.description}
      size="lg"
      footer={
        prompt ? (
          <>
            <Button variant="secondary" onClick={() => copy(prompt.body)}>
              {copied ? (
                <Check aria-hidden className="size-4 text-success-fg" />
              ) : (
                <Copy aria-hidden className="size-4" />
              )}
              {copied ? "Copied" : "Copy prompt"}
            </Button>
            <ButtonLink href="/workspace">
              Use in workspace
              <ArrowUpRight aria-hidden className="size-4" />
            </ButtonLink>
          </>
        ) : null
      }
    >
      {prompt ? (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="primary">{titleCase(prompt.category)}</Badge>
            {prompt.tags.map((tag) => (
              <Badge key={tag} tone="neutral">
                {tag}
              </Badge>
            ))}
          </div>

          <section>
            <h3 className="mb-2 text-[13px] font-semibold text-fg">Prompt</h3>
            <pre className="scrollbar-thin max-h-72 overflow-auto rounded-lg border border-border bg-surface-2 p-3.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-fg">
              {prompt.body}
            </pre>
          </section>

          {prompt.variables.length > 0 ? (
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-fg">Variables</h3>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {prompt.variables.map((variable) => (
                  <li
                    key={variable.key}
                    className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2.5"
                  >
                    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-fg">
                      {`{{${variable.key}}}`}
                    </code>
                    <span className="text-[13px] font-medium text-fg">
                      {variable.label}
                    </span>
                    <span className="w-full text-[12px] text-fg-muted sm:w-auto">
                      e.g. {variable.placeholder}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-[13px] sm:grid-cols-4">
            <div>
              <dt className="text-fg-subtle">Author</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-fg">
                <Avatar
                  name={prompt.author.name}
                  initials={prompt.author.initials}
                  size="xs"
                />
                <span className="truncate">{prompt.author.name}</span>
              </dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Uses</dt>
              <dd className="mt-1 text-fg tabular-nums">
                {formatNumber(prompt.usageCount)}
              </dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Visibility</dt>
              <dd className="mt-1 text-fg">{titleCase(prompt.visibility)}</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Updated</dt>
              <dd className="mt-1 text-fg">{formatDate(prompt.updatedAt)}</dd>
            </div>
          </dl>

          <p className="text-[12px] text-fg-subtle">
            Published prompts are versioned. See the{" "}
            <Link href="/analytics" className="text-primary hover:underline">
              analytics page
            </Link>{" "}
            for which teams use this one.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
