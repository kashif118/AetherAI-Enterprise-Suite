"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { DropdownItem, DropdownMenu } from "./dropdown-menu";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu
      label="Change colour theme"
      className="min-w-40"
      trigger={() => (
        <span
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg",
            className,
          )}
        >
          <Icon aria-hidden className="size-4.5" />
        </span>
      )}
    >
      {({ close }) =>
        OPTIONS.map((option) => (
          <DropdownItem
            key={option.value}
            onSelect={() => {
              setTheme(option.value);
              close();
            }}
            className={cn(theme === option.value && "text-fg")}
          >
            <option.icon aria-hidden className="size-4" />
            <span className="flex-1">{option.label}</span>
            {theme === option.value ? (
              <Check aria-hidden className="size-4 text-primary" />
            ) : null}
          </DropdownItem>
        ))
      }
    </DropdownMenu>
  );
}
