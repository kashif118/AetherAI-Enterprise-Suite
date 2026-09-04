"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-surface-2">
      <figcaption className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-wide text-fg-subtle uppercase">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg"
        >
          {copied ? (
            <Check aria-hidden className="size-3.5 text-success-fg" />
          ) : (
            <Copy aria-hidden className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="scrollbar-thin overflow-x-auto px-3 py-2.5">
        <code className="font-mono text-[12.5px] leading-relaxed text-fg">{code}</code>
      </pre>
    </figure>
  );
}
