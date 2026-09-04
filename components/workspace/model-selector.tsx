"use client";

import { Check, ChevronDown, Cpu, Gauge, Server, Sparkles } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { models } from "@/lib/mock/models";
import { CAPABILITY_LABELS, SPEED_LABELS } from "@/services/models.service";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";
import type { AIModel } from "@/types";

const SPEED_ICON = {
  fastest: Gauge,
  balanced: Cpu,
  deep: Sparkles,
} as const;

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ModelSelector({
  value,
  onChange,
  disabled,
  className,
}: ModelSelectorProps) {
  const selected: AIModel = models.find((model) => model.id === value) ?? models[0];
  const SelectedIcon = SPEED_ICON[selected.speed];

  return (
    <DropdownMenu
      label={`Model: ${selected.name}. Change model`}
      align="start"
      className="w-[min(22rem,calc(100vw-2rem))]"
      trigger={({ isOpen }) => (
        <span
          className={cn(
            "inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-[13px] font-medium text-fg transition-colors hover:border-border-strong",
            disabled && "pointer-events-none opacity-50",
            className,
          )}
        >
          <SelectedIcon aria-hidden className="size-3.5 text-primary" />
          {selected.shortName}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 text-fg-subtle transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </span>
      )}
    >
      {({ close }) => (
        <ul className="max-h-[min(26rem,60vh)] overflow-y-auto">
          {models.map((model) => {
            const Icon = SPEED_ICON[model.speed];
            const isSelected = model.id === value;
            return (
              <li key={model.id}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onChange(model.id);
                    close();
                  }}
                  className={cn(
                    "w-full rounded-lg p-2.5 text-left transition-colors hover:bg-surface-2",
                    isSelected && "bg-surface-2",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon aria-hidden className="size-4 shrink-0 text-primary" />
                    <span className="flex-1 text-sm font-medium text-fg">
                      {model.name}
                    </span>
                    {model.recommended ? (
                      <Badge tone="primary">Recommended</Badge>
                    ) : null}
                    {model.provider === "self-hosted" ? (
                      <Badge tone="info">
                        <Server aria-hidden className="size-3" />
                        In VPC
                      </Badge>
                    ) : null}
                    {isSelected ? (
                      <Check aria-hidden className="size-4 shrink-0 text-primary" />
                    ) : null}
                  </span>

                  <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">
                    {model.description}
                  </span>

                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-subtle">
                    <span>{SPEED_LABELS[model.speed]}</span>
                    <span className="tabular-nums">
                      {formatCompact(model.contextWindow)} context
                    </span>
                    <span className="tabular-nums">
                      {model.inputCostPerMTok === 0
                        ? "No metered cost"
                        : `${formatCurrency(model.inputCostPerMTok)} / M in`}
                    </span>
                    <span className="flex gap-1">
                      {model.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className="rounded bg-surface-3 px-1.5 py-px"
                        >
                          {CAPABILITY_LABELS[capability]}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </DropdownMenu>
  );
}
