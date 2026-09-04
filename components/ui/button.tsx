import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg shadow-sm hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-surface-2 text-fg border border-border hover:bg-surface-3 hover:border-border-strong",
  outline:
    "border border-border-strong text-fg hover:bg-surface-2 hover:border-fg-subtle",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  danger: "bg-danger text-white shadow-sm hover:brightness-110 active:brightness-95",
  link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-9.5 gap-2 rounded-lg px-4 text-sm",
  lg: "h-11 gap-2 rounded-xl px-5 text-[15px]",
  icon: "size-9.5 rounded-lg",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter] duration-150 disabled:pointer-events-none disabled:opacity-50";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        variant === "link" && "h-auto p-0",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

/** Same visual language as `Button`, rendered as a real anchor for navigation. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        variant === "link" && "h-auto p-0",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
