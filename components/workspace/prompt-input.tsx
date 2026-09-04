"use client";

import { ArrowUp, Library, Paperclip, Square, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";
import { ModelSelector } from "./model-selector";

export interface PendingAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
}

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (attachments: PendingAttachment[]) => void;
  modelId: string;
  onModelChange: (modelId: string) => void;
  /** True while a reply is being generated; swaps send for stop. */
  busy?: boolean;
  onStop?: () => void;
  onOpenPromptLibrary?: () => void;
  placeholder?: string;
  className?: string;
}

const MAX_ATTACHMENTS = 5;

export function PromptInput({
  value,
  onChange,
  onSubmit,
  modelId,
  onModelChange,
  busy = false,
  onStop,
  onOpenPromptLibrary,
  placeholder = "Ask anything, or paste a document to work from…",
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [dragging, setDragging] = useState(false);

  // Grow with the content up to a cap, then scroll.
  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  }, [value]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .slice(0, MAX_ATTACHMENTS - attachments.length)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      }));
    setAttachments((current) => [...current, ...next]);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const submit = () => {
    if (busy || !value.trim()) return;
    onSubmit(attachments);
    setAttachments([]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !busy;

  return (
    <div className={cn("px-4 pb-4 sm:px-6", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-2xl border bg-surface shadow-sm transition-colors",
          dragging ? "border-primary bg-primary-soft/30" : "border-border",
        )}
      >
        {attachments.length > 0 ? (
          <ul className="flex flex-wrap gap-2 border-b border-border p-3">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 py-1.5 pr-1.5 pl-2.5"
              >
                <Paperclip aria-hidden className="size-3.5 text-fg-subtle" />
                <span className="max-w-40 truncate text-[13px] text-fg">
                  {attachment.name}
                </span>
                <span className="text-[12px] text-fg-subtle tabular-nums">
                  {formatBytes(attachment.size)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    )
                  }
                  className="rounded p-0.5 text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg"
                >
                  <X aria-hidden className="size-3.5" />
                  <span className="sr-only">Remove {attachment.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <label htmlFor="prompt-input" className="sr-only">
          Message
        </label>
        <textarea
          id="prompt-input"
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder={dragging ? "Drop files to attach them" : placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="scrollbar-thin block max-h-50 w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm leading-6 text-fg placeholder:text-fg-subtle focus-visible:outline-none"
        />

        <div className="flex items-center gap-1.5 px-2.5 pb-2.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={onFileChange}
            aria-label="Attach files"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={attachments.length >= MAX_ATTACHMENTS}
            className="rounded-lg p-2 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40"
            title={
              attachments.length >= MAX_ATTACHMENTS
                ? `Up to ${MAX_ATTACHMENTS} files`
                : "Attach files"
            }
          >
            <Paperclip aria-hidden className="size-4.5" />
            <span className="sr-only">Attach files</span>
          </button>

          {onOpenPromptLibrary ? (
            <button
              type="button"
              onClick={onOpenPromptLibrary}
              className="rounded-lg p-2 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <Library aria-hidden className="size-4.5" />
              <span className="sr-only">Insert a saved prompt</span>
            </button>
          ) : null}

          <ModelSelector value={modelId} onChange={onModelChange} disabled={busy} />

          <span className="ml-auto flex items-center gap-2">
            <span className="hidden text-[12px] text-fg-subtle sm:inline">
              <kbd className="font-sans">Enter</kbd> to send ·{" "}
              <kbd className="font-sans">Shift + Enter</kbd> for a new line
            </span>
            {busy && onStop ? (
              <Button variant="secondary" size="icon" onClick={onStop}>
                <Square aria-hidden className="size-3.5 fill-current" />
                <span className="sr-only">Stop generating</span>
              </Button>
            ) : (
              <Button size="icon" onClick={submit} disabled={!canSend}>
                <ArrowUp aria-hidden className="size-4.5" />
                <span className="sr-only">Send message</span>
              </Button>
            )}
          </span>
        </div>
      </div>

      <p className="mt-2 text-center text-[12px] text-fg-subtle">
        Responses are generated. Check anything you’d act on. Attachments stay in
        your browser in this demo.
      </p>
    </div>
  );
}
