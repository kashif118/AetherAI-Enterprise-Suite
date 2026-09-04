"use client";

import { Search, X } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { controlBase, controlBorder } from "./input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label,
  className,
}: SearchInputProps) {
  const id = useId();

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle"
      />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          controlBase,
          controlBorder,
          "h-9.5 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X aria-hidden className="size-4" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : null}
    </div>
  );
}
