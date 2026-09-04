import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="8" fill="url(#aether-gradient)" />
      <path
        d="M16 8.5 22.5 23h-3.4l-1.3-3.1h-3.6L12.9 23H9.5L16 8.5Zm0 5.9-1.1 2.7h2.2L16 14.4Z"
        fill="white"
      />
      <path
        d="M16 8.5 22.5 23h-3.4l-1.3-3.1h-3.6"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="0.75"
      />
      <defs>
        <linearGradient
          id="aether-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b6dff" />
          <stop offset="1" stopColor="#4f2ee0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoProps {
  href?: string;
  className?: string;
  /** Hides the wordmark, e.g. in the collapsed sidebar. */
  markOnly?: boolean;
}

export function Logo({ href = "/", className, markOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 rounded-lg", className)}
    >
      <LogoMark />
      {markOnly ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <span className="text-[15px] font-semibold tracking-tight text-fg">
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
