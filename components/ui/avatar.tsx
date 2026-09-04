import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-9.5 text-[13px]",
  lg: "size-12 text-sm",
  xl: "size-20 text-xl",
};

/** Stable per-person tint so avatars are distinguishable in a dense list. */
const TINTS = [
  "bg-[#e5ecfb] text-[#1c5cab] dark:bg-[#152238] dark:text-[#7cb2f0]",
  "bg-[#fdece4] text-[#a63f16] dark:bg-[#2c1a12] dark:text-[#f0a181]",
  "bg-[#e2f4ec] text-[#0d6c4c] dark:bg-[#0f2620] dark:text-[#5fcfa8]",
  "bg-[#efe9ff] text-[#4a2ecc] dark:bg-[#1e1a35] dark:text-[#b8a6ff]",
  "bg-[#fdf0d9] text-[#8a5a00] dark:bg-[#2a2010] dark:text-[#e5b45c]",
];

function tintFor(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return TINTS[hash % TINTS.length];
}

interface AvatarProps {
  name: string;
  initials?: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
  /** Small dot in the corner for presence. */
  online?: boolean;
}

export function Avatar({
  name,
  initials,
  src,
  size = "md",
  className,
  online,
}: AvatarProps) {
  const label = initials ?? name.slice(0, 2).toUpperCase();

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full font-semibold ring-1 ring-black/5 select-none dark:ring-white/10",
          SIZES[size],
          !src && tintFor(name),
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden>{label}</span>
        )}
      </span>
      {online ? (
        <span
          className="absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-surface"
          title={`${name} is online`}
        />
      ) : null}
      <span className="sr-only">{name}</span>
    </span>
  );
}

interface AvatarGroupProps {
  people: { id: string; name: string; initials: string; avatarUrl?: string }[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  people,
  max = 4,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {shown.map((person) => (
        <Avatar
          key={person.id}
          name={person.name}
          initials={person.initials}
          src={person.avatarUrl}
          size={size}
          className="ring-2 ring-surface [&>span]:ring-0"
        />
      ))}
      {overflow > 0 ? (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-surface-3 font-semibold text-fg-muted ring-2 ring-surface",
            SIZES[size],
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
